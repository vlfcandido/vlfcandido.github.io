// Camada HTTP do Worker: rotas, CORS, checagem de Origin, Turnstile e tamanho do corpo. Recebe as dependências
// prontas (controle, modelo, verificador), então roda igual nos testes em Node e na Cloudflare.

import type { EstadoAssistente, RespostaConversa } from '../../src/chatbot/protocolo'
import { hashIp } from './assinatura'
import { reservaPorTurnoBrl, type Config } from './config'
import { diaSaoPaulo, type Metricas } from './controle'
import type { Modelo } from './modelo'
import { MENSAGENS_FALLBACK, processarMensagem, type ControleNucleo } from './nucleo'
import type { VerificadorTurnstile } from './turnstile'

/** Controle completo que a camada HTTP usa (o Durable Object em produção). */
export interface ControleHttp extends ControleNucleo {
  abrirConversa(ip: string): Promise<{ ok: true; conversa: string } | { ok: false; motivo: 'limite_ip' }>
  cabeNoOrcamento(brl: number): Promise<boolean>
  metricas(): Promise<Metricas & { dia: string; gastoMesBrl: number }>
}

/** Dependências do app HTTP. */
export interface DependenciasHttp {
  config: Config
  controle: ControleHttp
  /** `null` quando a IA não pode rodar (modo real sem chave). */
  modelo: Modelo | null
  /** `null` quando não há Turnstile configurado (só aceito no modo simulado). */
  turnstile: VerificadorTurnstile | null
  relogio?: () => Date
}

/** Maior corpo aceito (o histórico de 8 turnos cabe com folga). */
const CORPO_MAX = 48_000

/** Cabeçalhos de CORS para uma origem permitida. */
function cors(origem: string | null, config: Config): Record<string, string> {
  if (!origem || !config.origens.includes(origem)) return {}
  return {
    'Access-Control-Allow-Origin': origem,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

/** Resposta JSON sem cache. */
function json(dados: unknown, status: number, extra: Record<string, string>): Response {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  })
}

/** Lê o corpo JSON com teto de tamanho. */
async function lerCorpo(request: Request): Promise<unknown> {
  const texto = await request.text()
  if (texto.length > CORPO_MAX) return null
  try {
    return JSON.parse(texto)
  } catch {
    return null
  }
}

/**
 * Cria o tratador de requisições do assistente.
 *
 * @param deps configuração, controle, modelo e verificador do Turnstile.
 * @returns função `fetch` do Worker.
 */
export function criarApp(deps: DependenciasHttp): (request: Request) => Promise<Response> {
  const { config, controle } = deps
  const relogio = deps.relogio ?? (() => new Date())

  return async (request) => {
    const url = new URL(request.url)
    const origem = request.headers.get('Origin')
    const cabecalhos = cors(origem, config)
    const origemOk = Boolean(origem && config.origens.includes(origem))

    if (request.method === 'OPTIONS') return new Response(null, { status: origemOk ? 204 : 403, headers: cabecalhos })

    // Métricas agregadas (sem conteúdo), só com o token do dono.
    if (request.method === 'GET' && url.pathname === '/metricas') {
      const token = request.headers.get('Authorization')
      if (!config.metricasToken || token !== `Bearer ${config.metricasToken}`) return json({ ok: false }, 401, {})
      return json(await controle.metricas(), 200, {})
    }

    // CORS e Origin: não impedem curl (por isso o Turnstile e os limites), mas fecham o uso por outros sites.
    if (!origemOk) return json({ ok: false, motivo: 'origem' }, 403, {})

    if (request.method === 'GET' && url.pathname === '/estado') {
      let modo: EstadoAssistente['modo'] = 'roteiro'
      if (config.modo === 'simulado') modo = 'simulado'
      else if (deps.modelo && deps.turnstile && (await controle.cabeNoOrcamento(reservaPorTurnoBrl(config.cambio)))) modo = 'ia'
      const estado: EstadoAssistente = { modo, turnstile: deps.turnstile ? config.turnstileSite : null }
      return json(estado, 200, cabecalhos)
    }

    if (request.method !== 'POST') return json({ ok: false }, 404, cabecalhos)

    const ipPuro = request.headers.get('CF-Connecting-IP')
    const ip = await hashIp(config.chaveAssinatura, ipPuro ?? 'sem-ip', diaSaoPaulo(relogio()))
    const corpo = await lerCorpo(request)

    if (url.pathname === '/conversa') {
      // Modo real exige Turnstile; sem ele, nada de IA (o widget usa o roteiro fixo).
      if (!deps.turnstile && config.modo === 'real') {
        const r: RespostaConversa = { ok: false, motivo: 'indisponivel', mensagem: MENSAGENS_FALLBACK.indisponivel, fallback: true }
        return json(r, 200, cabecalhos)
      }
      if (deps.turnstile) {
        const token = corpo && typeof corpo === 'object' ? (corpo as Record<string, unknown>).turnstile : null
        if (typeof token !== 'string' || !(await deps.turnstile(token, ipPuro))) {
          const r: RespostaConversa = {
            ok: false,
            motivo: 'turnstile',
            mensagem: 'Não deu para confirmar que você não é um robô. Tente de novo ou use o roteiro abaixo.',
            fallback: true,
          }
          return json(r, 200, cabecalhos)
        }
      }
      const aberta = await controle.abrirConversa(ip)
      const r: RespostaConversa = aberta.ok
        ? { ok: true, conversa: aberta.conversa }
        : { ok: false, motivo: 'limite_ip', mensagem: MENSAGENS_FALLBACK.limite_ip, fallback: true }
      return json(r, 200, cabecalhos)
    }

    if (url.pathname === '/mensagem') {
      return json(await processarMensagem(deps, corpo, ip), 200, cabecalhos)
    }

    return json({ ok: false }, 404, cabecalhos)
  }
}
