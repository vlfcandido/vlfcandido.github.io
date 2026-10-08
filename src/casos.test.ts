import { describe, expect, it } from 'vitest'
import { listarCasos, type IdPeca } from './casos'
import { PECAS } from './components/case/pecas'
import { encontrarTermosProibidos } from './lib/termos-proibidos'
import { listarProjetos } from './projetos'

const casos = listarCasos()
const itens = listarProjetos()
const caso = (s: string) => casos.find((c) => c.slug === s)!

// Redesenho das telas de projeto (08/10/2026): moldura comum, peça principal própria em cada projeto.
describe('página de case', () => {
  it('todo projeto da galeria tem case, e todo case é de um projeto da galeria', () => {
    expect(casos.map((c) => c.slug).sort()).toEqual(itens.map((i) => i.slug).sort())
  })

  it('duas telas nunca usam a mesma peça principal', () => {
    const pecas = casos.map((c) => c.peca)
    const repetidas = pecas.filter((p, i) => pecas.indexOf(p) !== i)
    expect(repetidas).toEqual([])
  })

  it('cada peça tem um componente próprio, e nenhum componente serve a duas peças', () => {
    const ids = Object.keys(PECAS) as IdPeca[]
    casos.forEach((c) => expect(PECAS[c.peca], c.slug).toBeTypeOf('function'))
    expect(new Set(Object.values(PECAS)).size).toBe(ids.length)
    expect(ids.length).toBe(casos.length)
  })

  it('régua com no máximo 3 números, todos com origem', () =>
    casos.forEach((c) => {
      expect(c.regua.length, c.slug).toBeLessThanOrEqual(3)
      c.regua.forEach((n) => expect(n.origem.trim(), `${c.slug} ${n.valor}`).not.toBe(''))
    }))

  it('números dos projetos próprios são os do banco de provas', () => {
    expect(caso('aprovaos').regua.map((n) => n.valor)).toEqual(['1.603', '53'])
    expect(caso('nexus-quant').regua.map((n) => n.valor)).toEqual(['1.060'])
    expect(caso('varredura-voos').regua.map((n) => n.valor)).toEqual(['109'])
    expect(caso('app-score').regua.map((n) => n.valor)).toEqual(['41'])
    expect(caso('engenharia-de-agentes').regua.map((n) => n.valor)).toEqual(['24'])
  })

  it('peça com dado de exemplo leva rótulo', () => {
    const ilustrativas: IdPeca[] = [
      'terminal-cota', 'balcao-extrato', 'envelope-injecao', 'diff-com-nota', 'modal-aprovacao', 'ficha-lead',
      'conversa-whatsapp', 'arvore-conversa', 'funil-qualificacao', 'relogio-lead', 'barras-status',
    ]
    casos.filter((c) => ilustrativas.includes(c.peca)).forEach((c) => expect(c.ficticio?.trim(), c.slug).toBeTruthy())
  })

  it('projeto próprio que não está no ar diz o que falta', () =>
    itens
      .filter((i) => i.origem === 'proprio' && i.status !== 'producao' && i.slug !== 'nexus-quant')
      .forEach((i) => expect(caso(i.slug).falta?.length, i.slug).toBeGreaterThan(0)))

  it('status honesto na faixa: simulação, MVP, prova de conceito, estudo', () => {
    expect(caso('nexus-quant').status.texto).toMatch(/simulação/)
    expect(caso('aprovaos').status.texto).toMatch(/sem usuário pagante/)
    expect(caso('app-score').status.texto).toMatch(/Prova de conceito/)
    expect(caso('benchmark-litellm').status.texto).toMatch(/não publicado/)
  })

  it('participação (Ecovita, Minu) diz "sem liderar"', () =>
    ['ecovita', 'minu'].forEach((s) => expect(caso(s).papel.meu, s).toContain('sem liderar')))

  it('nenhum termo proibido, nada de Concierge, de trading nem de lucro', () => {
    const tudo = JSON.stringify(casos)
    expect(encontrarTermosProibidos(tudo).filter((t) => t !== 'sicoob')).toEqual([])
    expect(tudo).not.toMatch(/concierge|trading|mirante|sisbr/i)
    expect(tudo.toLowerCase().replaceAll('sem lucro', '')).not.toMatch(/lucro|rendimento|ganho/)
  })

  it('Contabilizei sem número de volume', () => {
    const t = JSON.stringify(caso('contabilizei'))
    expect(t).not.toMatch(/\d[\d.]*\s*(contatos|leads|conversas|por dia|\/dia)/i)
    expect(caso('contabilizei').regua).toEqual([])
  })
})
