// Cliente do widget para o Worker do assistente. Toda falha de rede vira "use o roteiro fixo": o visitante
// nunca fica sem saída (estudo de 08/10/2026, "Bot fora do ar na hora da visita importante").
// Só funções: nada executa ao importar.

import type { EstadoAssistente, PedidoMensagem, RespostaConversa, RespostaMensagem } from './protocolo'

/** Tempo máximo de espera por resposta do Worker. */
const ESPERA_MS = 30_000

/** Faz um pedido JSON com tempo máximo; devolve `null` em qualquer falha. */
async function pedirJson<T>(url: string, corpo?: unknown, buscar: typeof fetch = fetch): Promise<T | null> {
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), ESPERA_MS)
  try {
    const r = await buscar(url, {
      method: corpo === undefined ? 'GET' : 'POST',
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: controle.signal,
    })
    if (!r.ok) return null
    return (await r.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(relogio)
  }
}

/**
 * Lê o estado do Worker (modo e chave pública do Turnstile).
 *
 * @param base URL do Worker, sem barra no fim.
 * @param buscar `fetch` (injetável nos testes).
 * @returns o estado; sem resposta, o modo `roteiro`.
 */
export async function lerEstado(base: string, buscar?: typeof fetch): Promise<EstadoAssistente> {
  const estado = await pedirJson<EstadoAssistente>(`${base}/estado`, undefined, buscar)
  if (!estado || !['ia', 'simulado', 'roteiro'].includes(estado.modo)) return { modo: 'roteiro', turnstile: null }
  return estado
}

/**
 * Abre uma conversa no Worker.
 *
 * @param base URL do Worker.
 * @param turnstile token do Turnstile (vazio quando o Worker roda sem ele).
 * @param buscar `fetch` (injetável).
 * @returns o id da conversa, ou a recusa com `fallback`.
 */
export async function abrirConversa(base: string, turnstile: string, buscar?: typeof fetch): Promise<RespostaConversa> {
  return (
    (await pedirJson<RespostaConversa>(`${base}/conversa`, { turnstile }, buscar)) ?? {
      ok: false,
      motivo: 'indisponivel',
      mensagem: 'O assistente com IA não respondeu agora. O roteiro abaixo gera o mesmo resumo, sem IA.',
      fallback: true,
    }
  )
}

/**
 * Manda uma mensagem ao Worker.
 *
 * @param base URL do Worker.
 * @param pedido conversa, porta, histórico assinado e texto.
 * @param buscar `fetch` (injetável).
 * @returns a resposta, ou a recusa com `fallback`.
 */
export async function enviarMensagem(base: string, pedido: PedidoMensagem, buscar?: typeof fetch): Promise<RespostaMensagem> {
  return (
    (await pedirJson<RespostaMensagem>(`${base}/mensagem`, pedido, buscar)) ?? {
      ok: false,
      motivo: 'indisponivel',
      mensagem: 'O assistente com IA não respondeu agora. O roteiro abaixo gera o mesmo resumo, sem IA.',
      fallback: true,
    }
  )
}

/** Variáveis de ambiente do Vite que ligam o assistente. */
export interface AmbienteAssistente {
  DEV: boolean
  VITE_ASSISTENTE?: string
  VITE_ASSISTENTE_URL?: string
}

/**
 * Diz se o assistente aparece. Em produção, fica escondido até o Worker estar no ar e alguém publicar com
 * `VITE_ASSISTENTE=ligado`; em desenvolvimento, aparece sempre.
 *
 * @param env `import.meta.env`.
 * @returns `true` quando o botão do assistente deve aparecer.
 */
export function assistenteVisivel(env: AmbienteAssistente): boolean {
  return env.DEV || env.VITE_ASSISTENTE === 'ligado'
}

/**
 * URL do Worker, sem barra no fim; vazia quando não há Worker (o widget usa só o roteiro fixo).
 *
 * @param env `import.meta.env`.
 * @returns a URL ou `''`.
 */
export function urlDoWorker(env: AmbienteAssistente): string {
  const url = (env.VITE_ASSISTENTE_URL ?? '').trim().replace(/\/+$/, '')
  return /^https:\/\/|^http:\/\/localhost(:\d+)?$/.test(url) ? url : ''
}
