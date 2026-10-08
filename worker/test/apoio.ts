// Apoio dos testes e do eval: monta o app inteiro (HTTP + núcleo + controle em memória) e conversa com ele
// como o widget conversaria, incluindo a assinatura do histórico.

import type { Fala, Porta, RespostaConversa, RespostaMensagem } from '../../src/chatbot/protocolo'
import { textoDaFala } from '../../src/chatbot/protocolo'
import { lerConfig, type Ambiente } from '../src/config'
import { ArmazemMemoria, Controle, LIMITES_PADRAO, type LimitesControle } from '../src/controle'
import { criarApp } from '../src/http'
import type { Modelo } from '../src/modelo'
import { ModeloSimulado } from '../src/simulado'
import type { VerificadorTurnstile } from '../src/turnstile'

export const ORIGEM = 'https://vlfcandido.github.io'

/** Opções do app de teste. */
export interface OpcoesApp {
  modelo?: Modelo | null
  env?: Ambiente
  limites?: Partial<LimitesControle>
  turnstile?: VerificadorTurnstile | null
}

/**
 * Cria o app com controle em memória.
 *
 * @param opcoes modelo (padrão: simulado), ambiente, limites e Turnstile.
 * @returns o `fetch` do app e o controle, para conferir contadores.
 */
export function criarAppTeste(opcoes: OpcoesApp = {}) {
  const env: Ambiente = { MODO: 'simulado', ...opcoes.env }
  const config = lerConfig(env)
  const controle = new Controle(new ArmazemMemoria(), { ...LIMITES_PADRAO, tetoDiaBrl: config.tetoDiaBrl, tetoMesBrl: config.tetoMesBrl, ...opcoes.limites })
  const modelo = opcoes.modelo === undefined ? new ModeloSimulado() : opcoes.modelo
  const fetch = criarApp({ config, controle, modelo, turnstile: opcoes.turnstile ?? null })
  return { fetch, controle, config }
}

/** Faz um pedido ao app como o navegador faria. */
export async function pedir(
  fetch: (r: Request) => Promise<Response>,
  caminho: string,
  corpo?: unknown,
  ip = '203.0.113.7',
  origem: string | null = ORIGEM,
): Promise<{ status: number; dados: any; cabecalhos: Headers }> {
  const headers: Record<string, string> = { 'CF-Connecting-IP': ip, 'Content-Type': 'application/json' }
  if (origem) headers.Origin = origem
  const r = await fetch(
    new Request(`https://assistente.exemplo.workers.dev${caminho}`, {
      method: corpo === undefined ? 'GET' : 'POST',
      headers,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    }),
  )
  return { status: r.status, dados: await r.json().catch(() => null), cabecalhos: r.headers }
}

/** Uma conversa do lado do widget: guarda o histórico assinado e manda as mensagens em sequência. */
export class ConversaTeste {
  historico: Fala[] = []
  conversa = ''

  constructor(
    private readonly fetch: (r: Request) => Promise<Response>,
    readonly porta: Porta,
    private readonly ip = '203.0.113.7',
  ) {}

  /** Abre a conversa (com token de Turnstile de teste). */
  async abrir(): Promise<RespostaConversa> {
    const { dados } = await pedir(this.fetch, '/conversa', { turnstile: 'token-de-teste' }, this.ip)
    if (dados.ok) this.conversa = dados.conversa
    return dados
  }

  /** Manda uma mensagem e, se der certo, guarda as duas falas no histórico. */
  async enviar(texto: string): Promise<RespostaMensagem> {
    const { dados } = await pedir(this.fetch, '/mensagem', { conversa: this.conversa, porta: this.porta, historico: this.historico, texto }, this.ip)
    const r = dados as RespostaMensagem
    if (r.ok) {
      this.historico.push({ papel: 'visitante', texto })
      this.historico.push({ papel: 'assistente', texto: textoDaFala(r.resposta), assinatura: r.resposta.assinatura })
    }
    return r
  }
}
