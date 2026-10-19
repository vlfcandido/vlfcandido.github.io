import { describe, expect, it } from 'vitest'
import {
  SLUG_DO_RAMO,
  TEMPO_LIMITE_MS,
  URL_DO_AGENTE,
  deveUsarRemoto,
  perguntarAoAgente,
} from './agente-remoto'

/** Resposta JSON do Worker, como o fetch a entrega. */
function resposta(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), { status, headers: { 'Content-Type': 'application/json' } })
}

describe('cliente do agente remoto', () => {
  it('cada ramo do hero tem o seu slug no Worker', () => {
    expect(SLUG_DO_RAMO).toEqual({
      pet: 'pelo-solto',
      clinica: 'clinica-aurora',
      loja: 'vestuar',
      servicos: 'casa-reparo',
    })
    expect(URL_DO_AGENTE).toMatch(/^https:\/\/[a-z0-9.-]+\.workers\.dev$/)
    expect(TEMPO_LIMITE_MS).toBe(6000)
  })

  it('manda a pergunta para o ramo certo e devolve o texto da IA', async () => {
    const pedidos: Array<{ url: string; init: RequestInit }> = []
    const buscar = (async (url: string | URL | Request, init?: RequestInit) => {
      pedidos.push({ url: String(url), init: init ?? {} })
      return resposta({ ok: true, modo: 'ia', resposta: { texto: 'A visita custa R$ 120.' } })
    }) as typeof fetch

    const r = await perguntarAoAgente(URL_DO_AGENTE, 'servicos', 'Quanto custa a visita?', { buscar })

    expect(r).toEqual({ texto: 'A visita custa R$ 120.', equipe: false, origem: 'ia' })
    expect(pedidos).toHaveLength(1)
    expect(pedidos[0].url).toBe(`${URL_DO_AGENTE}/demo/casa-reparo/mensagem`)
    expect(pedidos[0].init.method).toBe('POST')
    expect(pedidos[0].init.body).toBe(JSON.stringify({ texto: 'Quanto custa a visita?' }))
    expect(pedidos[0].init.signal).toBeInstanceOf(AbortSignal)
  })

  it('o modo simulado do Worker continua marcado como demonstração', async () => {
    const buscar = (async () => resposta({ ok: true, modo: 'simulado', resposta: { texto: 'A equipe confirma.' } })) as unknown as typeof fetch
    const r = await perguntarAoAgente(URL_DO_AGENTE, 'pet', 'Quanto custa?', { buscar })
    expect(r).toEqual({ texto: 'A equipe confirma.', equipe: true, origem: 'simulado' })
  })

  it('marca a passagem para a equipe quando a resposta pede confirmação humana', async () => {
    const buscar = (async () => resposta({ ok: true, modo: 'ia', resposta: { texto: 'Já passei para a equipe.' } })) as unknown as typeof fetch
    expect((await perguntarAoAgente(URL_DO_AGENTE, 'pet', 'Ele está vomitando', { buscar }))?.equipe).toBe(true)
  })

  it('usa o sinal de equipe do Worker mesmo quando o texto fala da recepção', async () => {
    const buscar = (async () =>
      resposta({ ok: true, modo: 'ia', equipe: true, resposta: { texto: 'A recepção confirma com você.' } })) as unknown as typeof fetch
    expect((await perguntarAoAgente(URL_DO_AGENTE, 'clinica', 'Estou com dor', { buscar }))?.equipe).toBe(true)
  })

  it('devolve null em erro de rede, status ruim, corpo inválido ou texto vazio', async () => {
    const casos: Array<() => Promise<Response>> = [
      async () => {
        throw new Error('rede fora')
      },
      async () => resposta({ ok: false }, 500),
      async () => resposta({ ok: true, modo: 'ia' }),
      async () => resposta({ ok: true, modo: 'ia', resposta: { texto: '   ' } }),
      async () => resposta({ ok: false, motivo: 'limite_ip' }),
    ]
    for (const caso of casos) {
      const buscar = (async () => caso()) as unknown as typeof fetch
      expect(await perguntarAoAgente(URL_DO_AGENTE, 'pet', 'Oi', { buscar })).toBeNull()
    }
  })

  it('só usa o Worker no site publicado ou com o atalho local', () => {
    expect(deveUsarRemoto('vlfcandido.github.io', '')).toBe(true)
    expect(deveUsarRemoto('127.0.0.1:8767', '')).toBe(false)
    expect(deveUsarRemoto('localhost:5173', '?agente-real')).toBe(true)
  })
})
