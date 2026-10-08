import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from '../lib/termos-proibidos'
import { assistenteVisivel, enviarMensagem, lerEstado, urlDoWorker } from './cliente'
import { PERGUNTAS_ESCOPO } from './escopo'
import { responderRoteiro } from './roteiro'
import { COMO_FUNCIONA, TEXTOS } from './textos'

describe('flag do assistente', () => {
  it('escondido em produção até VITE_ASSISTENTE=ligado; visível em desenvolvimento', () => {
    expect(assistenteVisivel({ DEV: false })).toBe(false)
    expect(assistenteVisivel({ DEV: false, VITE_ASSISTENTE: 'sim' })).toBe(false)
    expect(assistenteVisivel({ DEV: false, VITE_ASSISTENTE: 'ligado' })).toBe(true)
    expect(assistenteVisivel({ DEV: true })).toBe(true)
  })

  it('URL do Worker só https (ou localhost no desenvolvimento)', () => {
    expect(urlDoWorker({ DEV: false, VITE_ASSISTENTE_URL: 'https://assistente.x.workers.dev/' })).toBe('https://assistente.x.workers.dev')
    expect(urlDoWorker({ DEV: true, VITE_ASSISTENTE_URL: 'http://localhost:8787' })).toBe('http://localhost:8787')
    expect(urlDoWorker({ DEV: false, VITE_ASSISTENTE_URL: 'http://inseguro.com' })).toBe('')
    expect(urlDoWorker({ DEV: false })).toBe('')
  })
})

describe('cliente: falha vira roteiro fixo', () => {
  const quebrado = (async () => {
    throw new Error('rede')
  }) as unknown as typeof fetch

  it('sem Worker, o estado é "roteiro"', async () => expect((await lerEstado('https://x.dev', quebrado)).modo).toBe('roteiro'))

  it('sem resposta à mensagem, pede o fallback', async () => {
    const r = await enviarMensagem('https://x.dev', { conversa: 'c', porta: 'escopo', historico: [], texto: 'oi' }, quebrado)
    expect(r).toMatchObject({ ok: false, fallback: true })
  })
})

describe('roteiro fixo no navegador', () => {
  it('faz as 5 perguntas e entrega o escopo pronto para copiar', () => {
    const respostas = ['Copio pedidos do WhatsApp para a planilha', 'WhatsApp e planilha', 'Entrar sozinho', 'Duas pessoas', 'Nada']
    let ultima = responderRoteiro('escopo', [], respostas[0])
    expect(ultima.texto).toBe(PERGUNTAS_ESCOPO[1].texto)
    for (let i = 1; i < respostas.length; i++) ultima = responderRoteiro('escopo', respostas.slice(0, i), respostas[i])
    expect(ultima.tipo).toBe('escopo')
    expect(ultima.escopo?.textoCopiavel).toMatch(/rascunho para conversar/)
  })

  it('recusa cedo o que ele não pega', () => expect(responderRoteiro('escopo', [], 'app para cooperativa de crédito').tipo).toBe('recusa'))

  it('porta Trabalho sem IA aponta para as páginas do site', () =>
    expect(responderRoteiro('trabalho', [], 'oi').texto).toBe(TEXTOS.roteiroTrabalho))
})

describe('textos do widget', () => {
  it('sem termo proibido, e-mail ou telefone', () => expect(encontrarTermosProibidos(JSON.stringify({ TEXTOS, COMO_FUNCIONA }))).toEqual([]))
  it('não empurram contato fora do 99 e mandam colar no chat do 99', () => {
    expect(JSON.stringify(TEXTOS).toLowerCase()).not.toMatch(/linkedin|whatsapp dele|me chame/)
    expect(TEXTOS.depoisDeCopiar).toMatch(/chat do 99/)
  })
  it('o painel "como funciona" mostra teto, filtro, fallback e base fechada', () => {
    const tudo = JSON.stringify(COMO_FUNCIONA)
    for (const termo of ['teto', 'filtro', 'roteiro fixo', 'publica']) expect(tudo).toContain(termo)
  })
})
