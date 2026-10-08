import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { etapasEntrega } from './entrega'
import { pacotesManutencao, pacotesProjeto, precoInicial } from './pacotes'
import { encontrarTermosProibidos } from './lib/termos-proibidos'

const ler = (c: string) => readFileSync(resolve(__dirname, c), 'utf8')

describe('pacotes "a partir de" (08/10/2026)', () => {
  it('preços batem com o estimador e o estudo (07-pacotes.md)', () => {
    expect(pacotesProjeto.map((p) => [p.id, p.valor])).toEqual([
      ['ajuste', 150], ['site', 210], ['integracao', 250], ['agente', 290], ['whatsapp', 360], ['sistema', 440],
    ])
    expect(pacotesManutencao.map((p) => p.valor)).toEqual([150, 260, 520])
  })
  it('nenhum preço abaixo do piso de R$ 150', () => [...pacotesProjeto, ...pacotesManutencao].forEach((p) => expect(p.valor).toBeGreaterThanOrEqual(150)))
  it('todo preço exibido leva "a partir de"', () => {
    [...pacotesProjeto, ...pacotesManutencao].forEach((p) => expect(precoInicial(p.valor)).toMatch(/^a partir de R\$ /))
    expect(precoInicial(150, 'mês')).toBe('a partir de R$ 150 por mês')
  })
  it('todo "R$" nos textos e componentes das seções vem depois de "a partir de"', () => {
    const textos = [JSON.stringify({ pacotesProjeto, pacotesManutencao, etapasEntrega }), ler('components/Pacotes.tsx'), ler('components/ComoEntrega.tsx')]
    textos.forEach((t) => [...t.matchAll(/R\$/g)].forEach((m) => expect(t.slice(Math.max(0, m.index! - 12), m.index!), t.slice(m.index! - 12, m.index! + 8)).toMatch(/a partir de $/)))
  })
  it('a Meta: por mensagem de modelo entregue, com link oficial e sem valor inventado', () => {
    const w = pacotesProjeto.find((p) => p.id === 'whatsapp')!
    expect(w.terceiros?.texto).toMatch(/por mensagem de modelo entregue/)
    expect(w.terceiros?.fonte.url).toBe('https://developers.facebook.com/docs/whatsapp/pricing/')
    expect(w.terceiros?.texto).not.toMatch(/\d/)
  })
  it('sem contato direto e sem termo proibido', () => {
    const t = JSON.stringify({ pacotesProjeto, pacotesManutencao, etapasEntrega })
    expect(encontrarTermosProibidos(t)).toEqual([])
    expect(t).not.toMatch(/whatsapp\.com|wa\.me|mailto|tel:/i)
    expect(ler('components/Pacotes.tsx')).toMatch(/99Freelas/)
  })
})

describe('como é uma entrega', () => {
  it('oito etapas na ordem do método', () =>
    expect(etapasEntrega.map((e) => e.id)).toEqual(['escopo', 'primeira-versao', 'noticia', 'demo', 'validacao', 'entrega', 'garantia', 'manutencao']))
  it('prazos do método: 24 a 48 h, notícia a cada 12 h, 7 dias de correção sem custo', () => {
    const t = JSON.stringify(etapasEntrega)
    expect(t).toMatch(/24 a 48 horas/)
    expect(t).toMatch(/a cada 12 horas/)
    expect(t).toMatch(/7 dias de correção sem custo/)
    expect(t).not.toMatch(/6 em 6|a cada 6/)
  })
  it('toda peça é de exemplo, com dado fictício', () => etapasEntrega.forEach((e) => expect(e.peca.titulo, e.id).toMatch(/exemplo/)))
  it('o componente rotula a peça como dados fictícios', () => expect(ler('components/ComoEntrega.tsx')).toMatch(/SeloFicticio/))
})
