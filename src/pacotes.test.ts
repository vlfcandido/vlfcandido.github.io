import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { etapasEntrega } from './entrega'
import { HORA_EXTRA, pacotes, terceiros, valorHora } from './pacotes'
import { encontrarTermosProibidos } from './lib/termos-proibidos'

const ler = (c: string) => readFileSync(resolve(__dirname, c), 'utf8')

describe('pacotes de sustentação e evolução (08/10/2026)', () => {
  it('três bancos de horas com a tabela decidida', () =>
    expect(pacotes.map((p) => [p.id, p.horas, p.valor])).toEqual([['sustentacao', 4, 260], ['evolucao', 8, 480], ['evolucao-mais', 16, 880]]))
  it('preço por hora coerente: inteiro e cai quanto maior o banco (65, 60, 55); hora extra 70', () => {
    expect(pacotes.map(valorHora)).toEqual([65, 60, 55])
    expect(HORA_EXTRA).toBe(70)
    expect(HORA_EXTRA).toBeGreaterThan(valorHora(pacotes[0]))
  })
  it('nenhum preço de projeto no site (sem "a partir de R$" nem valores antigos)', () => {
    const t = [ler('pacotes.ts'), ler('components/Pacotes.tsx'), ler('components/ComoEntrega.tsx'), JSON.stringify(etapasEntrega)].join('\n')
    expect(t).not.toMatch(/a partir de R\$/)
    expect(t).not.toMatch(/R\$\s?(150|210|250|290|360|440)\b/)
    expect(JSON.stringify(etapasEntrega)).not.toMatch(/R\$/)
  })
  it('a Meta: só nota com link oficial, sem valor', () => {
    expect(terceiros.fonte.url).toBe('https://developers.facebook.com/docs/whatsapp/pricing/')
    expect(terceiros.texto).not.toMatch(/\d|R\$/)
  })
  it('sem contato direto e sem termo proibido', () => {
    const t = JSON.stringify({ pacotes, terceiros, etapasEntrega })
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
