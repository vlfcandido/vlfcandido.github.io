import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { MESMO_NIVEL, NIVEIS } from './niveis'

describe('níveis da régua (M8, 08/10/2026)', () => {
  it('Provas na cota 20, antes de Como funciona na cota 30', () =>
    expect(NIVEIS.map((n) => [n.href, n.cota])).toEqual([
      ['#inicio', 0],
      ['#o-que-eu-resolvo', 10],
      ['#resultados', 20],
      ['#como-funciona', 30],
      ['#carreira', 40],
    ]))
  it('a página monta as seções na mesma ordem da régua', () => {
    const inicio = readFileSync(resolve(__dirname, '../paginas/Inicio.tsx'), 'utf8')
    const ordem = ['<Abertura', '<Resolvo', '<Prova ', '<ComoFunciona', '<Carreira', '<Contato'].map((t) => inicio.indexOf(t))
    ordem.forEach((pos) => expect(pos).toBeGreaterThan(-1))
    expect([...ordem].sort((a, b) => a - b)).toEqual(ordem)
  })
  it('Interfaces conta como Provas (é aba dentro dela) e todo alvo é um nível', () => {
    expect(MESMO_NIVEL.interfaces).toBe('#resultados')
    Object.values(MESMO_NIVEL).forEach((alvo) => expect(NIVEIS.some((n) => n.href === alvo)).toBe(true))
  })
})
