import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from '../lib/termos-proibidos'
import {
  estimarTamanho,
  finalizarEscopo,
  foraDoQuePega,
  montarEscopo,
  PERGUNTAS_ESCOPO,
  PRAZOS,
  sugerirOferta,
} from './escopo'

describe('questionário fixo do escopo', () => {
  it('tem de 4 a 6 perguntas e começa pelo diagnóstico do que acontece hoje', () => {
    expect(PERGUNTAS_ESCOPO.length).toBeGreaterThanOrEqual(4)
    expect(PERGUNTAS_ESCOPO.length).toBeLessThanOrEqual(6)
    expect(PERGUNTAS_ESCOPO[0].id).toBe('hoje')
  })

  it('sugere a oferta pelo que o visitante descreve', () => {
    expect(sugerirOferta('copio cada pedido do whatsapp para a planilha')).toBe('whatsapp')
    expect(sugerirOferta('copio cada pedido para a planilha no fim do dia')).toBe('repetido')
    expect(sugerirOferta('quero ligar o Bling no meu CRM')).toBe('integracao')
    expect(sugerirOferta('o sistema caiu e ninguém entende o código')).toBe('resgate')
    expect(sugerirOferta('um painel com as vendas do dia')).toBe('site')
    expect(sugerirOferta('algo bem diferente')).toBe('sob-medida')
  })

  it('tamanho cresce com sistemas e complexidade', () => {
    expect(estimarTamanho('uma planilha')).toBe('P')
    expect(estimarTamanho('whatsapp, planilha e CRM')).toBe('M')
    expect(estimarTamanho('whatsapp, planilha, CRM, ERP, login de usuários, pagamento por pix e IA')).toBe('G')
  })

  it('recusa o que ele não pega, com razão genérica (invariante 6)', () => {
    expect(foraDoQuePega('app para cooperativa de crédito')).toMatch(/banco, cooperativa/)
    expect(foraDoQuePega('quero um app tipo uber para android e ios')).toMatch(/App de celular/)
    expect(foraDoQuePega('criar uma loja virtual do zero')).toMatch(/Loja virtual/)
    expect(foraDoQuePega('preciso de um logotipo')).toMatch(/Design/)
    expect(foraDoQuePega('integrar o banco de dados com a planilha')).toBeNull()
    expect(montarEscopo(['sistema para cooperativa', '', '', '', '']).tipo).toBe('recusa')
  })

  it('escopo pronto: rascunho, sem preço, sem data, com prazo de referência e nota do preço', () => {
    const r = montarEscopo([
      'Copio cada pedido do WhatsApp para a planilha no fim do dia',
      'WhatsApp e planilha do Google',
      'O pedido entra sozinho na planilha',
      'Duas pessoas da equipe',
      'O número de WhatsApp atual',
    ])
    expect(r.tipo).toBe('escopo')
    if (r.tipo !== 'escopo') return
    const pronto = finalizarEscopo(r.escopo)
    expect(pronto.textoCopiavel).toMatch(/^ESCOPO DO PROJETO \(rascunho para conversar, não é proposta\)/)
    expect(pronto.textoCopiavel).toContain('O preço fechado e o prazo final vêm do Vinicius')
    expect(pronto.textoCopiavel).not.toMatch(/R\$|reais/)
    expect(pronto.textoCopiavel).not.toMatch(/\b\d{1,2}\/\d{1,2}\b/)
    expect(pronto.prazo).toBe(PRAZOS[pronto.tamanho])
    expect(pronto.fora.length).toBeGreaterThan(1)
    expect(encontrarTermosProibidos(pronto.textoCopiavel)).toEqual([])
  })

  it('nenhum prazo de referência promete data', () =>
    Object.values(PRAZOS).forEach((p) => expect(p).not.toMatch(/\b\d{1,2}\/\d{1,2}|até o dia|entrego/)))
})
