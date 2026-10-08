// O "modelo" do assistente atrás de uma interface: o Claude de verdade (este arquivo) ou o simulado
// (simulado.ts), que responde de forma determinística sem chave. O núcleo não sabe qual está usando.

import Anthropic from '@anthropic-ai/sdk'
import type { Escopo } from '../../src/chatbot/escopo'
import type { Porta } from '../../src/chatbot/protocolo'
import { MODELO, type Uso } from './config'
import { envelopar, ESQUEMA_RESPOSTA, sistemaFixo, sistemaPorta } from './prompt'

/** Fala do histórico já conferida pelo núcleo (as do assistente com assinatura válida). */
export interface FalaConferida {
  papel: 'visitante' | 'assistente'
  texto: string
}

/** O que o núcleo pede ao modelo. */
export interface PedidoModelo {
  porta: Porta
  historico: FalaConferida[]
  /** Mensagem nova, já filtrada. */
  texto: string
}

/** Resposta do modelo no formato do esquema, antes da validação e dos filtros. */
export interface RespostaBruta {
  tipo: 'pergunta' | 'escopo' | 'resposta' | 'aderencia' | 'recusa'
  texto: string
  escopo: Escopo | null
  aderencia: { com_prova: Array<{ requisito: string; prova: string }>; sem_prova: string[]; perguntar: string[] } | null
}

/** Saída do modelo: a resposta (com o uso, para o custo) ou o motivo da falha. */
export type SaidaModelo =
  | { ok: true; resposta: unknown; uso: Uso | null }
  | { ok: false; motivo: 'recusa_seguranca' | 'incompleta' | 'erro'; uso: Uso | null }

/** Contrato de qualquer modelo do assistente. */
export interface Modelo {
  /** `ia` cobra e consome orçamento; `simulado` não. */
  readonly tipo: 'ia' | 'simulado'
  responder(pedido: PedidoModelo): Promise<SaidaModelo>
}

/**
 * Monta as mensagens da API: visitante como `user` (envelopado como dado), assistente como `assistant`,
 * juntando falas seguidas do mesmo papel (acontece quando uma fala sem assinatura é descartada).
 *
 * @param pedido histórico e mensagem nova.
 * @returns a lista de mensagens, sempre começando e terminando no visitante.
 */
export function montarMensagens(pedido: PedidoModelo): Anthropic.MessageParam[] {
  const falas = [...pedido.historico, { papel: 'visitante' as const, texto: pedido.texto }]
  while (falas.length && falas[0].papel !== 'visitante') falas.shift()
  const mensagens: Anthropic.MessageParam[] = []
  for (const f of falas) {
    const role = f.papel === 'visitante' ? 'user' : 'assistant'
    const conteudo = f.papel === 'visitante' ? envelopar(f.texto) : f.texto
    const ultima = mensagens.at(-1)
    if (ultima && ultima.role === role) ultima.content = `${ultima.content as string}\n\n${conteudo}`
    else mensagens.push({ role, content: conteudo })
  }
  return mensagens
}

/** Claude Haiku 5.5 pela API da Anthropic. */
export class ModeloClaude implements Modelo {
  readonly tipo = 'ia' as const
  private readonly cliente: Anthropic
  private readonly fixo = sistemaFixo()

  /**
   * @param chaveApi chave dedicada do assistente (segredo do Worker; nunca a da esteira do 99).
   */
  constructor(chaveApi: string) {
    // Timeout curto e 1 nova tentativa: quem espera é uma pessoa no celular.
    this.cliente = new Anthropic({ apiKey: chaveApi, maxRetries: 1, timeout: 25_000 })
  }

  /**
   * Pede uma resposta ao Claude, com esforço baixo e saída estruturada.
   *
   * @param pedido porta, histórico e mensagem.
   * @returns o JSON da resposta e o uso, ou o motivo da falha (recusa de segurança, corte por tamanho, erro).
   */
  async responder(pedido: PedidoModelo): Promise<SaidaModelo> {
    try {
      const resposta = await this.cliente.messages.create({
        model: MODELO.id,
        max_tokens: MODELO.maxTokens,
        system: [
          { type: 'text', text: this.fixo, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: sistemaPorta(pedido.porta) },
        ],
        messages: montarMensagens(pedido),
        output_config: {
          effort: MODELO.esforco,
          format: { type: 'json_schema', schema: ESQUEMA_RESPOSTA as unknown as Record<string, unknown> },
        },
      })
      // Haiku 5.5 pode recusar por segurança e não tem fallback do lado do servidor: o widget cai no roteiro fixo.
      // Resposta recusada ou cortada também é cobrada: o uso volta junto para entrar no orçamento.
      if (resposta.stop_reason === 'refusal') return { ok: false, motivo: 'recusa_seguranca', uso: resposta.usage }
      if (resposta.stop_reason === 'max_tokens') return { ok: false, motivo: 'incompleta', uso: resposta.usage }
      const texto = resposta.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('')
      try {
        return { ok: true, resposta: JSON.parse(texto), uso: resposta.usage }
      } catch {
        return { ok: false, motivo: 'incompleta', uso: resposta.usage }
      }
    } catch {
      // Qualquer erro da API (limite, servidor, rede) vira "indisponível"; o detalhe não vai para o visitante.
      return { ok: false, motivo: 'erro', uso: null }
    }
  }
}
