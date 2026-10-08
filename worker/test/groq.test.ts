// Testes do adaptador do Groq: formato da chamada, uso e custo, e todas as falhas caindo no roteiro fixo.
// Nenhum teste sai para a rede: o `fetch` é simulado.

import { describe, expect, it } from 'vitest'
import { custoBrl, lerConfig, reservaPorTurnoBrl, MODELO_GROQ } from '../src/config'
import { ModeloGroq, URL_GROQ, usoDoGroq } from '../src/modelo'
import { ConversaTeste, criarAppTeste } from './apoio'

const BOM = { tipo: 'resposta', texto: 'Olá, posso ajudar.', escopo: null, aderencia: null }

/** Resposta de sucesso do Groq com o conteúdo dado. */
function groq(conteudo: unknown, extra: Record<string, unknown> = {}): Response {
  return Response.json({
    choices: [{ finish_reason: 'stop', message: { content: typeof conteudo === 'string' ? conteudo : JSON.stringify(conteudo) } }],
    usage: { prompt_tokens: 1000, completion_tokens: 200, prompt_tokens_details: { cached_tokens: 400 } },
    ...extra,
  })
}

/** `fetch` simulado que devolve as respostas na ordem e guarda as chamadas. */
function falso(...respostas: Array<Response | Error>) {
  const chamadas: Array<{ url: string; corpo: any; auth: string | null }> = []
  const buscar = (async (url: string, init: RequestInit) => {
    chamadas.push({ url, corpo: JSON.parse(String(init.body)), auth: new Headers(init.headers).get('authorization') })
    const r = respostas[chamadas.length - 1] ?? respostas.at(-1)!
    if (r instanceof Error) throw r
    return r
  }) as unknown as typeof fetch
  return { buscar, chamadas }
}

const PEDIDO = { porta: 'trabalho' as const, historico: [], texto: 'Quem é o Vinicius?' }

describe('ModeloGroq', () => {
  it('chama o endpoint certo com modelo, JSON Schema, chave e a mensagem envelopada', async () => {
    const { buscar, chamadas } = falso(groq(BOM))
    const saida = await new ModeloGroq('chave-teste', buscar).responder(PEDIDO)
    expect(saida.ok && saida.resposta).toEqual(BOM)
    const c = chamadas[0]
    expect(c.url).toBe(URL_GROQ)
    expect(c.auth).toBe('Bearer chave-teste')
    expect(c.corpo.model).toBe('openai/gpt-oss-120b')
    expect(c.corpo.max_completion_tokens).toBe(MODELO_GROQ.maxTokens)
    expect(c.corpo.response_format.type).toBe('json_schema')
    expect(c.corpo.messages[0].role).toBe('system')
    expect(c.corpo.messages.at(-1)).toEqual({ role: 'user', content: expect.stringContaining('<mensagem_do_visitante>') })
  })

  it('converte o uso separando os tokens em cache', async () => {
    const { buscar } = falso(groq(BOM))
    const saida = await new ModeloGroq('k', buscar).responder(PEDIDO)
    expect(saida.uso).toEqual({ input_tokens: 600, output_tokens: 200, cache_read_input_tokens: 400 })
    expect(usoDoGroq(undefined)).toBeNull()
  })

  it('HTTP 400 no JSON Schema: tenta uma vez em json_object com o esquema no prompt', async () => {
    const { buscar, chamadas } = falso(new Response('{}', { status: 400 }), groq(BOM))
    const saida = await new ModeloGroq('k', buscar).responder(PEDIDO)
    expect(saida.ok).toBe(true)
    expect(chamadas).toHaveLength(2)
    expect(chamadas[1].corpo.response_format).toEqual({ type: 'json_object' })
    expect(chamadas[1].corpo.messages[0].content).toContain('objeto JSON')
  })

  it.each([
    ['HTTP 429', () => new Response('{}', { status: 429 }), 'erro'],
    ['HTTP 500', () => new Response('{}', { status: 500 }), 'erro'],
    ['rede caiu', () => new Error('rede'), 'erro'],
    ['JSON quebrado', () => groq('{"tipo": "resp'), 'incompleta'],
    ['sem conteúdo', () => Response.json({ choices: [] }), 'incompleta'],
    ['cortado por tamanho', () => groq(BOM, { choices: [{ finish_reason: 'length', message: { content: '{' } }] }), 'incompleta'],
  ])('falha (%s) vira motivo %s', async (_nome, criar, motivo) => {
    const { buscar } = falso(criar())
    const saida = await new ModeloGroq('k', buscar).responder(PEDIDO)
    expect(saida.ok).toBe(false)
    if (!saida.ok) expect(saida.motivo).toBe(motivo)
  })
})

describe('provedor na configuração e no custo', () => {
  it('padrão é groq e lê a chave do provedor escolhido', () => {
    expect(lerConfig({ GROQ_API_KEY: 'g', ANTHROPIC_API_KEY: 'a' }).chaveApi).toBe('g')
    expect(lerConfig({ PROVEDOR: 'anthropic', GROQ_API_KEY: 'g', ANTHROPIC_API_KEY: 'a' }).chaveApi).toBe('a')
    expect(lerConfig({ PROVEDOR: 'qualquer' }).provedor).toBe('groq')
  })

  it('custo com os preços do Groq, em reais', () => {
    // 10 mil de entrada a US$ 0,15 + 500 de saída a US$ 0,60 por milhão = US$ 0,0018 => R$ 0,0099 a 5,50
    expect(custoBrl({ input_tokens: 10_000, output_tokens: 500 }, 5.5, 'groq')).toBeCloseTo(0.0099, 6)
    expect(custoBrl({ input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 10_000 }, 5.5, 'groq')).toBeCloseTo(0.004125, 6)
  })

  it('o teto de R$ 50/mês segue valendo: a reserva do pior turno limita as conversas', () => {
    const reserva = reservaPorTurnoBrl(5.5, 'groq')
    expect(reserva).toBeGreaterThan(0.01)
    expect(reserva).toBeLessThan(0.05)
  })
})

describe('núcleo com o Groq (fetch simulado)', () => {
  const ENV = { MODO: 'real', PROVEDOR: 'groq', CHAVE_ASSINATURA: 'segredo-de-teste', TETO_DIA_BRL: '3' }

  it('responde pela IA e soma o gasto com o preço do Groq', async () => {
    const { buscar } = falso(groq(BOM))
    const { fetch, controle } = criarAppTeste({ modelo: new ModeloGroq('k', buscar), env: ENV, turnstile: async () => true })
    const c = new ConversaTeste(fetch, 'trabalho')
    expect((await c.abrir()).ok).toBe(true)
    const r = await c.enviar('Que stack ele usa?')
    expect(r.ok && r.resposta.texto).toMatch(/Olá/)
    const { gastoDiaBrl } = await controle.gastos()
    // 600 de entrada + 400 em cache + 200 de saída
    expect(gastoDiaBrl).toBeCloseTo(((600 * 0.15 + 400 * 0.075 + 200 * 0.6) / 1_000_000) * 5.5, 8)
  })

  it('falha do Groq cai no roteiro fixo (sem erro para o visitante)', async () => {
    const { buscar } = falso(new Response('{}', { status: 500 }))
    const { fetch } = criarAppTeste({ modelo: new ModeloGroq('k', buscar), env: ENV, turnstile: async () => true })
    const c = new ConversaTeste(fetch, 'trabalho')
    await c.abrir()
    const r = await c.enviar('Que stack ele usa?')
    expect(r.ok).toBe(false)
  })
})
