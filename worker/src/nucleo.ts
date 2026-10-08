// Núcleo de uma mensagem: valida o pedido, filtra a entrada, autoriza o turno (limites e orçamento), confere o
// histórico assinado, chama o modelo, valida o formato, aplica os invariantes na saída e assina a resposta.
// Não depende do runtime da Cloudflare: o mesmo núcleo roda nos testes, no eval e no Worker.

import { finalizarEscopo, type Escopo, type EscopoPronto, type IdOferta } from '../../src/chatbot/escopo'
import {
  LIMITES,
  textoDaFala,
  type Aderencia,
  type Porta,
  type RespostaAssistente,
  type RespostaMensagem,
  type TipoResposta,
} from '../../src/chatbot/protocolo'
import { assinar, conferir } from './assinatura'
import { custoBrl, reservaPorTurnoBrl, type Config } from './config'
import type { Autorizacao, Metricas } from './controle'
import { filtrarEntrada, filtrarSaida, RESPOSTA_SEGURA } from './filtros'
import type { FalaConferida, Modelo } from './modelo'

/** O que o núcleo usa do controle (o Durable Object em produção, o controle em memória nos testes). */
export interface ControleNucleo {
  autorizarTurno(conversa: string, ip: string, reservaBrl: number): Promise<Autorizacao>
  registrarGasto(brl: number): Promise<void>
  somarMetrica(campo: keyof Metricas, valor?: number): Promise<void>
}

/** Dependências do núcleo. `modelo` nulo = IA indisponível (modo real sem chave). */
export interface DependenciasNucleo {
  config: Config
  controle: ControleNucleo
  modelo: Modelo | null
}

/** Mensagens ao visitante quando o widget deve trocar para o roteiro fixo. */
export const MENSAGENS_FALLBACK = {
  orcamento: 'O assistente com IA está pausado hoje. O roteiro abaixo gera o mesmo resumo, sem IA.',
  indisponivel: 'O assistente com IA não respondeu agora. O roteiro abaixo gera o mesmo resumo, sem IA.',
  limite_conversa: `Esta conversa chegou ao limite de ${LIMITES.turnosPorConversa} mensagens. O roteiro abaixo monta o escopo sem IA.`,
  limite_ip: 'O limite de mensagens de hoje foi atingido. O roteiro abaixo monta o escopo sem IA.',
  conversa_invalida: 'A conversa expirou. Abra uma nova para continuar.',
  entrada_invalida: 'Não entendi o pedido. Recarregue a página e tente de novo.',
} as const

const PORTAS: readonly Porta[] = ['escopo', 'trabalho']
const TIPOS: readonly TipoResposta[] = ['pergunta', 'escopo', 'resposta', 'aderencia', 'recusa']
const OFERTAS: readonly IdOferta[] = ['integracao', 'repetido', 'resgate', 'sob-medida', 'site', 'whatsapp']

/** Pedido já validado. */
interface PedidoValido {
  conversa: string
  porta: Porta
  historico: Array<{ papel: 'visitante' | 'assistente'; texto: string; assinatura?: string }>
  texto: string
}

/** Valida o corpo do pedido sem confiar em nada do navegador. */
export function validarPedido(corpo: unknown): PedidoValido | null {
  if (!corpo || typeof corpo !== 'object') return null
  const c = corpo as Record<string, unknown>
  if (typeof c.conversa !== 'string' || !/^[\w-]{8,64}$/.test(c.conversa)) return null
  if (!PORTAS.includes(c.porta as Porta)) return null
  if (typeof c.texto !== 'string') return null
  if (!Array.isArray(c.historico) || c.historico.length > LIMITES.turnosPorConversa * 2 + 2) return null
  const historico: PedidoValido['historico'] = []
  for (const f of c.historico) {
    if (!f || typeof f !== 'object') return null
    const { papel, texto, assinatura } = f as Record<string, unknown>
    if (papel !== 'visitante' && papel !== 'assistente') return null
    if (typeof texto !== 'string' || texto.length > 6000) return null
    if (assinatura !== undefined && (typeof assinatura !== 'string' || assinatura.length > 128)) return null
    historico.push({ papel, texto, assinatura: assinatura as string | undefined })
  }
  return { conversa: c.conversa, porta: c.porta as Porta, historico, texto: c.texto }
}

/** Corta e limpa um texto da IA. */
function corte(valor: unknown, max: number): string | null {
  if (typeof valor !== 'string') return null
  const t = valor.replace(/\s+\n/g, '\n').trim()
  return t ? t.slice(0, max) : null
}

/** Lista de textos da IA, com teto de itens e de tamanho. */
function lista(valor: unknown, maxItens = 8, maxTexto = 300): string[] | null {
  if (!Array.isArray(valor)) return null
  return valor.map((v) => corte(v, maxTexto)).filter((v): v is string => Boolean(v)).slice(0, maxItens)
}

/** Resposta validada, antes dos filtros. */
interface RespostaValida {
  tipo: TipoResposta
  texto: string
  escopo?: Escopo
  aderencia?: Aderencia
}

/**
 * Valida o JSON que o modelo devolveu contra o formato e a porta. A saída estruturada já garante o esquema;
 * isto é a segunda trava (e a única no modo simulado).
 *
 * @param bruto JSON da resposta.
 * @param porta porta da conversa.
 * @returns a resposta validada, ou `null` quando o formato não serve.
 */
export function validarResposta(bruto: unknown, porta: Porta): RespostaValida | null {
  if (!bruto || typeof bruto !== 'object') return null
  const r = bruto as Record<string, unknown>
  const tipo = r.tipo as TipoResposta
  const texto = corte(r.texto, 1200)
  if (!TIPOS.includes(tipo) || !texto) return null

  if (tipo === 'escopo') {
    if (porta !== 'escopo' || !r.escopo || typeof r.escopo !== 'object') return null
    const e = r.escopo as Record<string, unknown>
    const problema = corte(e.problema, 300)
    const entra = lista(e.entra)
    const fora = lista(e.fora)
    const perguntas = lista(e.perguntas, 6)
    const tamanho = e.tamanho
    const oferta = e.oferta as IdOferta
    if (!problema || !entra?.length || !fora || !perguntas || !OFERTAS.includes(oferta)) return null
    if (tamanho !== 'P' && tamanho !== 'M' && tamanho !== 'G') return null
    return { tipo, texto, escopo: { problema, entra, fora, perguntas, tamanho, oferta } }
  }

  if (tipo === 'aderencia') {
    if (porta !== 'trabalho' || !r.aderencia || typeof r.aderencia !== 'object') return null
    const a = r.aderencia as Record<string, unknown>
    if (!Array.isArray(a.com_prova)) return null
    const comProva = a.com_prova
      .map((l) => (l && typeof l === 'object' ? (l as Record<string, unknown>) : {}))
      .map((l) => ({ requisito: corte(l.requisito, 120), prova: corte(l.prova, 240) }))
      .filter((l): l is { requisito: string; prova: string } => Boolean(l.requisito && l.prova))
      .slice(0, 12)
    const semProva = lista(a.sem_prova, 10, 160)
    const perguntar = lista(a.perguntar, 5, 200)
    if (!semProva || !perguntar) return null
    return { tipo, texto, aderencia: { comProva, semProva, perguntar } }
  }

  // Na porta Escopo, "resposta" não é o fluxo; na porta Trabalho, "pergunta" é uma pergunta de esclarecimento.
  return { tipo, texto }
}

/** Todo texto que vai à tela, junto, para o filtro de saída. */
function textoParaFiltro(r: RespostaValida, escopo?: EscopoPronto): string {
  return textoDaFala({ texto: r.texto, escopo, aderencia: r.aderencia })
}

/**
 * Confere o histórico: descarta falas do assistente sem assinatura válida e falas do visitante que o filtro de
 * entrada recusaria, e corta nos últimos turnos.
 */
async function conferirHistorico(
  pedido: PedidoValido,
  chave: string,
): Promise<{ falas: FalaConferida[]; descartadas: number }> {
  const falas: FalaConferida[] = []
  let descartadas = 0
  for (const f of pedido.historico) {
    if (f.papel === 'assistente') {
      if (await conferir(chave, pedido.conversa, f.texto, f.assinatura)) falas.push({ papel: 'assistente', texto: f.texto })
      else descartadas++
    } else {
      const filtrada = filtrarEntrada(f.texto)
      if (filtrada.ok) falas.push({ papel: 'visitante', texto: filtrada.texto })
      else descartadas++
    }
  }
  return { falas: falas.slice(-LIMITES.turnosNoHistorico * 2), descartadas }
}

/** Monta e assina a resposta final. */
async function responder(
  deps: DependenciasNucleo,
  conversa: string,
  restantes: number,
  r: Omit<RespostaAssistente, 'assinatura'>,
): Promise<RespostaMensagem> {
  const assinatura = await assinar(deps.config.chaveAssinatura, conversa, textoDaFala(r))
  return {
    ok: true,
    modo: deps.modelo?.tipo === 'ia' ? 'ia' : 'simulado',
    resposta: { ...r, assinatura },
    restantes,
  }
}

/** Recusa que manda o widget para o roteiro fixo (ou não). */
function recusa(motivo: keyof typeof MENSAGENS_FALLBACK | 'orcamento', fallback: boolean): RespostaMensagem {
  return { ok: false, motivo, mensagem: MENSAGENS_FALLBACK[motivo], fallback }
}

/**
 * Processa uma mensagem do visitante de ponta a ponta.
 *
 * @param deps configuração, controle e modelo.
 * @param corpo corpo JSON do pedido, como veio do navegador.
 * @param ip hash diário do IP.
 * @returns a resposta assinada, ou a recusa (com `fallback: true` quando o widget deve abrir o roteiro fixo).
 */
export async function processarMensagem(deps: DependenciasNucleo, corpo: unknown, ip: string): Promise<RespostaMensagem> {
  const pedido = validarPedido(corpo)
  if (!pedido) return recusa('entrada_invalida', false)
  if (!deps.modelo) return recusa('indisponivel', true)

  const entrada = filtrarEntrada(pedido.texto)
  if (!entrada.ok && (entrada.motivo === 'vazia' || entrada.motivo === 'longa')) {
    return { ok: false, motivo: 'entrada_invalida', mensagem: entrada.resposta, fallback: false }
  }

  const usaIa = deps.modelo.tipo === 'ia'
  const autorizacao = await deps.controle.autorizarTurno(pedido.conversa, ip, usaIa ? reservaPorTurnoBrl(deps.config.cambio) : 0)
  if (!autorizacao.ok) {
    if (autorizacao.motivo !== 'conversa_invalida') await deps.controle.somarMetrica('fallbacks')
    return recusa(autorizacao.motivo, autorizacao.motivo !== 'conversa_invalida')
  }

  // Injeção e uso como IA grátis: recusa curta, conta como turno, nenhuma chamada à API.
  if (!entrada.ok) {
    await deps.controle.somarMetrica('bloqueiosEntrada')
    await deps.controle.somarMetrica('recusas')
    return responder(deps, pedido.conversa, autorizacao.restantes, { tipo: 'recusa', texto: entrada.resposta })
  }

  const { falas } = await conferirHistorico(pedido, deps.config.chaveAssinatura)
  const saida = await deps.modelo.responder({ porta: pedido.porta, historico: falas, texto: entrada.texto })
  if (saida.uso) await deps.controle.registrarGasto(custoBrl(saida.uso, deps.config.cambio))
  if (!saida.ok) {
    await deps.controle.somarMetrica('fallbacks')
    return recusa('indisponivel', true)
  }

  const valida = validarResposta(saida.resposta, pedido.porta)
  if (!valida) {
    await deps.controle.somarMetrica('fallbacks')
    return recusa('indisponivel', true)
  }

  const escopo = valida.escopo ? finalizarEscopo(valida.escopo) : undefined
  const filtro = filtrarSaida(textoParaFiltro(valida, escopo))
  if (!filtro.ok) {
    await deps.controle.somarMetrica('bloqueiosSaida')
    return responder(deps, pedido.conversa, autorizacao.restantes, { tipo: 'recusa', texto: RESPOSTA_SEGURA })
  }
  if (valida.tipo === 'recusa') await deps.controle.somarMetrica('recusas')
  return responder(deps, pedido.conversa, autorizacao.restantes, {
    tipo: valida.tipo,
    texto: valida.texto,
    ...(escopo ? { escopo } : {}),
    ...(valida.aderencia ? { aderencia: valida.aderencia } : {}),
  })
}
