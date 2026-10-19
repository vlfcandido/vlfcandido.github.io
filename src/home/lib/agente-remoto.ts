// Cliente do agente de IA real do hero (19/10/2026): fala com a rota /demo/<slug> do Worker publicado.
// O Worker prende o prompt à ficha do ramo, então a resposta nunca inventa preço ou horário fora da base.
// Funções puras: nada roda ao importar. O fallback por palavra-chave fica com o chamador.

import type { RamoId } from './agente'

/** Endereço público do Worker (Cloudflare, conta do dono). */
export const URL_DO_AGENTE = 'https://assistente-portfolio.vlfcandido.workers.dev'

/** Tempo máximo de espera antes de cair na resposta por palavra-chave. */
export const TEMPO_LIMITE_MS = 6000

/** Slug de cada ramo do hero na demo do Worker. */
export const SLUG_DO_RAMO: Record<RamoId, string> = {
  pet: 'pelo-solto',
  clinica: 'clinica-aurora',
  loja: 'vestuar',
  servicos: 'casa-reparo',
}

/** Resposta pronta para a tela. */
export interface RespostaDoAgente {
  texto: string
  /** A resposta manda o pedido para uma pessoa. */
  equipe: boolean
  /** `ia` veio do modelo; `simulado` é a atendente determinística do Worker (teto ou falha da IA). */
  origem: 'ia' | 'simulado'
}

/** Primeira parte do corpo da resposta do Worker, só com o que o hero usa. */
interface CorpoDoWorker {
  ok?: unknown
  modo?: unknown
  /** Sinal calculado no Worker (transbordo, recusa ou texto que manda para uma pessoa). */
  equipe?: unknown
  resposta?: { texto?: unknown }
}

/**
 * Decide se o hero deve tentar o Worker real.
 *
 * @param host hostname da página.
 * @param busca query string (com ou sem `?`).
 * @returns `true` no site publicado ou quando a URL pede `agente-real`. No teste local, a chamada só passa se
 * a origem estiver em `ORIGENS` no Worker (ou se um proxy trocar a Origin).
 */
export function deveUsarRemoto(host: string, busca: string): boolean {
  if (host === 'vlfcandido.github.io' || host.endsWith('.vlfcandido.github.io')) return true
  return new URLSearchParams(busca.replace(/^\?/, '')).has('agente-real')
}

/**
 * Pergunta ao agente real do ramo escolhido.
 *
 * Qualquer erro (rede, tempo esgotado, status fora de 200, corpo inválido ou texto vazio) devolve `null`,
 * e o chamador responde por palavra-chave.
 *
 * @param url endereço base do Worker.
 * @param ramo ramo em exibição no hero.
 * @param pergunta texto digitado pelo visitante.
 * @param opcoes `fetch` injetável e tempo limite em milissegundos.
 * @returns a resposta e a origem, ou `null` quando não deu para usar a IA.
 */
export async function perguntarAoAgente(
  url: string,
  ramo: RamoId,
  pergunta: string,
  opcoes: { buscar?: typeof fetch; tempoLimiteMs?: number } = {},
): Promise<RespostaDoAgente | null> {
  const buscar = opcoes.buscar ?? fetch
  try {
    const r = await buscar(`${url.replace(/\/+$/, '')}/demo/${SLUG_DO_RAMO[ramo]}/mensagem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: pergunta }),
      signal: AbortSignal.timeout(opcoes.tempoLimiteMs ?? TEMPO_LIMITE_MS),
    })
    if (!r.ok) return null
    const dados = (await r.json()) as CorpoDoWorker | null
    if (!dados || dados.ok !== true || typeof dados.resposta?.texto !== 'string') return null
    const texto = dados.resposta.texto.trim()
    if (!texto) return null
    return {
      texto,
      // O Worker sabe se a resposta veio de transbordo; a regex cobre Worker antigo e "recepção".
      equipe: dados.equipe === true || /\b(equipe|recep[cç][aã]o|atendente|pessoa|humano)\b/i.test(texto),
      origem: dados.modo === 'ia' ? 'ia' : 'simulado',
    }
  } catch {
    return null
  }
}
