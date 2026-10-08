// Contrato entre o widget do site e o Worker do assistente (pasta worker/). Os dois lados importam daqui,
// para um campo renomeado quebrar o build dos dois, e não a conversa em produção.
// Só tipos, constantes e funções puras: nada executa ao importar.

import type { EscopoPronto } from './escopo'

/** As duas portas do assistente (estudo de 08/10/2026, seção 6). */
export type Porta = 'escopo' | 'trabalho'

/** Limites de uso que o widget mostra e o Worker aplica (estudo, seção 3, "Teto de custo", camada 3). */
export const LIMITES = {
  /** Caracteres por mensagem do visitante. */
  entradaMax: 1200,
  /** Turnos (mensagens do visitante) por conversa. */
  turnosPorConversa: 8,
  /** Mensagens por IP por dia. */
  mensagensPorIpDia: 20,
  /** Turnos do histórico que vão para a IA (cada turno = visitante + assistente). */
  turnosNoHistorico: 6,
} as const

/** Uma fala já trocada, como o navegador guarda e devolve ao Worker. O Worker não guarda conversa. */
export interface Fala {
  papel: 'visitante' | 'assistente'
  texto: string
  /**
   * Assinatura do Worker nas falas do assistente. Sem ela (ou com ela errada), a fala é descartada:
   * impede que alguém forje uma "resposta do assistente" no histórico para injetar instrução.
   */
  assinatura?: string
}

/** Uma linha da tabela de aderência a uma vaga (atalho "cole a vaga" da porta Trabalho). */
export interface LinhaAderencia {
  requisito: string
  /** Onde está a prova pública (case, matéria, repositório). */
  prova: string
}

/** Aderência a uma vaga em três colunas: com prova, sem prova e o que perguntar na entrevista. */
export interface Aderencia {
  comProva: LinhaAderencia[]
  semProva: string[]
  perguntar: string[]
}

/** Tipo de resposta do assistente. */
export type TipoResposta = 'pergunta' | 'escopo' | 'resposta' | 'aderencia' | 'recusa'

/** Resposta do assistente pronta para a tela. */
export interface RespostaAssistente {
  tipo: TipoResposta
  texto: string
  escopo?: EscopoPronto
  aderencia?: Aderencia
  assinatura: string
}

/** Pedido de mensagem: a porta, o histórico guardado no navegador e o texto novo. */
export interface PedidoMensagem {
  conversa: string
  porta: Porta
  historico: Fala[]
  texto: string
}

/** Por que o Worker não respondeu com IA; `fallback` diz ao widget para abrir o questionário fixo. */
export type MotivoRecusa =
  | 'orcamento'
  | 'limite_ip'
  | 'limite_conversa'
  | 'conversa_invalida'
  | 'turnstile'
  | 'origem'
  | 'entrada_invalida'
  | 'indisponivel'

/** Resposta do Worker a uma mensagem. */
export type RespostaMensagem =
  | { ok: true; modo: ModoAssistente; resposta: RespostaAssistente; restantes: number }
  | { ok: false; motivo: MotivoRecusa; mensagem: string; fallback: boolean }

/** Resposta do Worker ao abrir conversa (depois do Turnstile). */
export type RespostaConversa =
  | { ok: true; conversa: string }
  | { ok: false; motivo: MotivoRecusa; mensagem: string; fallback: boolean }

/** `ia`: Claude de verdade · `simulado`: respostas determinísticas, sem chave · `roteiro`: só o questionário. */
export type ModoAssistente = 'ia' | 'simulado' | 'roteiro'

/** Estado público do Worker, lido quando o visitante abre o assistente. */
export interface EstadoAssistente {
  modo: ModoAssistente
  /** Chave pública do Turnstile; `null` quando o Worker roda sem Turnstile (só no modo simulado). */
  turnstile: string | null
}

/**
 * Texto de uma fala do assistente como ele volta no histórico: a resposta e, quando houver, o escopo ou a
 * aderência em texto, para a IA lembrar o que já entregou. É este texto exato que o Worker assina.
 *
 * @param resposta resposta do assistente (sem a assinatura).
 * @returns o texto da fala.
 */
export function textoDaFala(resposta: Pick<RespostaAssistente, 'texto' | 'escopo' | 'aderencia'>): string {
  const partes = [resposta.texto]
  if (resposta.escopo) partes.push(resposta.escopo.textoCopiavel)
  if (resposta.aderencia) {
    const a = resposta.aderencia
    partes.push(
      [
        'Com prova:',
        ...a.comProva.map((l) => `- ${l.requisito}: ${l.prova}`),
        'Sem prova no site:',
        ...a.semProva.map((l) => `- ${l}`),
        'Perguntar na entrevista:',
        ...a.perguntar.map((l) => `- ${l}`),
      ].join('\n'),
    )
  }
  return partes.join('\n\n')
}
