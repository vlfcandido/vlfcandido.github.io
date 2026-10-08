import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { abrirConversa, enviarMensagem, lerEstado } from '../../chatbot/cliente'
import type { EscopoPronto } from '../../chatbot/escopo'
import { textoDaFala, type Aderencia, type Fala, type ModoAssistente, type Porta, type TipoResposta } from '../../chatbot/protocolo'
import { responderRoteiro } from '../../chatbot/roteiro'
import { TEXTOS } from '../../chatbot/textos'
import { obterToken } from '../../chatbot/turnstile'

/** Um item da conversa na tela. */
export interface ItemConversa {
  id: number
  de: 'visitante' | 'assistente' | 'aviso'
  texto: string
  tipo?: TipoResposta
  escopo?: EscopoPronto
  aderencia?: Aderencia
}

/** Estado de uma porta: o que aparece e o que volta ao Worker. */
interface EstadoPorta {
  itens: ItemConversa[]
  historico: Fala[]
  /** Respostas do visitante no roteiro fixo, em ordem. */
  respostasRoteiro: string[]
  conversa: string | null
  restantes: number | null
}

let proximoId = 1
const item = (i: Omit<ItemConversa, 'id'>): ItemConversa => ({ id: proximoId++, ...i })

/** Porta nova, com a mensagem de boas-vindas. */
function portaNova(porta: Porta): EstadoPorta {
  return {
    itens: [item({ de: 'assistente', texto: TEXTOS.boasVindas[porta], tipo: 'pergunta' })],
    historico: [],
    respostasRoteiro: [],
    conversa: null,
    restantes: null,
  }
}

/**
 * Estado e ações do assistente: lê o modo do Worker, abre a conversa (com Turnstile quando há IA), manda as
 * mensagens com o histórico assinado e troca para o roteiro fixo sempre que o Worker pede (ou some).
 *
 * @param urlWorker URL do Worker; vazia, o assistente roda só no roteiro fixo.
 * @param alvoTurnstile elemento onde o desafio do Turnstile aparece, se aparecer.
 */
export function useAssistente(urlWorker: string, alvoTurnstile: RefObject<HTMLDivElement | null>) {
  const [modo, setModo] = useState<ModoAssistente | 'carregando'>(urlWorker ? 'carregando' : 'roteiro')
  const [chaveTurnstile, setChaveTurnstile] = useState<string | null>(null)
  const [porta, setPorta] = useState<Porta>('escopo')
  const [portas, setPortas] = useState<Record<Porta, EstadoPorta>>(() => ({ escopo: portaNova('escopo'), trabalho: portaNova('trabalho') }))
  const [ocupado, setOcupado] = useState(false)
  const portasRef = useRef(portas)
  portasRef.current = portas

  useEffect(() => {
    if (!urlWorker) return
    let vivo = true
    lerEstado(urlWorker).then((e) => {
      if (!vivo) return
      setModo(e.modo)
      setChaveTurnstile(e.turnstile)
    })
    return () => {
      vivo = false
    }
  }, [urlWorker])

  const atualizar = useCallback((p: Porta, f: (e: EstadoPorta) => EstadoPorta) => {
    setPortas((todas) => ({ ...todas, [p]: f(todas[p]) }))
  }, [])

  /** Responde pelo roteiro fixo e guarda a resposta do visitante. */
  const viaRoteiro = useCallback(
    (p: Porta, texto: string) => {
      const anteriores = portasRef.current[p].respostasRoteiro
      const r = responderRoteiro(p, anteriores, texto)
      atualizar(p, (e) => ({
        ...e,
        respostasRoteiro: [...e.respostasRoteiro, texto],
        itens: [...e.itens, item({ de: 'assistente', texto: r.texto, tipo: r.tipo, escopo: r.escopo })],
      }))
    },
    [atualizar],
  )

  /** Troca para o roteiro fixo, com o aviso do porquê. */
  const cairNoRoteiro = useCallback(
    (p: Porta, aviso: string) => {
      setModo('roteiro')
      atualizar(p, (e) => ({ ...e, itens: [...e.itens, item({ de: 'aviso', texto: aviso })] }))
    },
    [atualizar],
  )

  /** Abre a conversa no Worker (com Turnstile quando a IA está ligada). */
  const garantirConversa = useCallback(
    async (p: Porta): Promise<string | null> => {
      const atual = portasRef.current[p].conversa
      if (atual) return atual
      let token = ''
      if (chaveTurnstile) {
        if (!alvoTurnstile.current) return null
        token = (await obterToken(chaveTurnstile, alvoTurnstile.current)) ?? ''
      }
      const r = await abrirConversa(urlWorker, token)
      if (!r.ok) {
        cairNoRoteiro(p, r.mensagem)
        return null
      }
      atualizar(p, (e) => ({ ...e, conversa: r.conversa }))
      return r.conversa
    },
    [alvoTurnstile, atualizar, cairNoRoteiro, chaveTurnstile, urlWorker],
  )

  /** Manda a mensagem do visitante pela IA (ou simulado) ou pelo roteiro fixo. */
  const enviar = useCallback(
    async (texto: string) => {
      const p = porta
      const limpo = texto.trim()
      if (!limpo || ocupado) return
      atualizar(p, (e) => ({ ...e, itens: [...e.itens, item({ de: 'visitante', texto: limpo })] }))
      if (modo === 'roteiro' || modo === 'carregando') {
        viaRoteiro(p, limpo)
        return
      }
      setOcupado(true)
      try {
        let conversa = await garantirConversa(p)
        if (!conversa) {
          viaRoteiro(p, limpo)
          return
        }
        const pedido = () => ({ conversa: conversa!, porta: p, historico: portasRef.current[p].historico, texto: limpo })
        let r = await enviarMensagem(urlWorker, pedido())
        // Conversa expirou ou foi trocada: abre outra uma vez e tenta de novo.
        if (!r.ok && r.motivo === 'conversa_invalida') {
          atualizar(p, (e) => ({ ...e, conversa: null, historico: [] }))
          portasRef.current = { ...portasRef.current, [p]: { ...portasRef.current[p], conversa: null, historico: [] } }
          conversa = await garantirConversa(p)
          if (!conversa) {
            viaRoteiro(p, limpo)
            return
          }
          r = await enviarMensagem(urlWorker, pedido())
        }
        if (!r.ok) {
          if (r.fallback) {
            cairNoRoteiro(p, r.mensagem)
            viaRoteiro(p, limpo)
          } else atualizar(p, (e) => ({ ...e, itens: [...e.itens, item({ de: 'aviso', texto: r.mensagem })] }))
          return
        }
        const resp = r.resposta
        atualizar(p, (e) => ({
          ...e,
          restantes: r.restantes,
          respostasRoteiro: [...e.respostasRoteiro, limpo],
          historico: [
            ...e.historico,
            { papel: 'visitante', texto: limpo },
            { papel: 'assistente', texto: textoDaFala(resp), assinatura: resp.assinatura },
          ],
          itens: [...e.itens, item({ de: 'assistente', texto: resp.texto, tipo: resp.tipo, escopo: resp.escopo, aderencia: resp.aderencia })],
        }))
      } finally {
        setOcupado(false)
      }
    },
    [atualizar, cairNoRoteiro, garantirConversa, modo, ocupado, porta, urlWorker, viaRoteiro],
  )

  /** Recomeça a porta atual do zero (e esquece a conversa no Worker). */
  const recomecar = useCallback(() => atualizar(porta, () => portaNova(porta)), [atualizar, porta])

  return { modo, porta, setPorta, estado: portas[porta], ocupado, enviar, recomecar }
}
