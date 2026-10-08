// Roteiro fixo sem IA, no navegador: o fallback quando o orçamento estoura, a API cai ou não há Worker.
// Faz as mesmas perguntas e monta o mesmo escopo (estudo de 08/10/2026, "Fallback quando o orçamento estoura").

import { finalizarEscopo, montarEscopo, PERGUNTAS_ESCOPO, type EscopoPronto } from './escopo'
import type { Porta, TipoResposta } from './protocolo'
import { TEXTOS } from './textos'

/** Resposta do roteiro fixo. */
export interface RespostaRoteiro {
  tipo: TipoResposta
  texto: string
  escopo?: EscopoPronto
}

/**
 * Responde uma mensagem pelo roteiro fixo.
 *
 * @param porta porta da conversa.
 * @param anteriores respostas que o visitante já deu nesta porta (sem a nova).
 * @param texto resposta nova.
 * @returns a próxima pergunta, o escopo pronto ou a recusa (o que ele não pega).
 */
export function responderRoteiro(porta: Porta, anteriores: string[], texto: string): RespostaRoteiro {
  if (porta === 'trabalho') return { tipo: 'resposta', texto: TEXTOS.roteiroTrabalho }
  const respostas = [...anteriores, texto]
  if (respostas.length < PERGUNTAS_ESCOPO.length) {
    // A recusa sai cedo, na primeira resposta que já mostra que é um tipo de projeto que ele não pega.
    const parcial = montarEscopo(respostas)
    if (parcial.tipo === 'recusa') return { tipo: 'recusa', texto: parcial.texto }
    return { tipo: 'pergunta', texto: PERGUNTAS_ESCOPO[respostas.length].texto }
  }
  const r = montarEscopo(respostas)
  if (r.tipo === 'recusa') return { tipo: 'recusa', texto: r.texto }
  return { tipo: 'escopo', texto: 'Aqui está o rascunho do escopo, para conversar; não é uma proposta.', escopo: finalizarEscopo(r.escopo) }
}
