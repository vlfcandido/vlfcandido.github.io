import { describe, expect, it } from 'vitest'
import { caminhoCirculo } from './marcacao'

describe('caminho da marcação de caneta', () => {
  it('é determinístico pela semente (o mesmo traço a cada render)', () =>
    expect(caminhoCirculo(200, 60, 7)).toBe(caminhoCirculo(200, 60, 7)))
  it('muda com a semente (cada destaque tem o seu traço)', () =>
    expect(caminhoCirculo(200, 60, 1)).not.toBe(caminhoCirculo(200, 60, 2)))
  it('começa com M e só usa comandos C (curva suave, sem ponta)', () =>
    expect(caminhoCirculo(200, 60, 3)).toMatch(/^M[\d. -]+( C[\d. ,-]+)+$/))
  it('não sai da caixa além de 8% (não invade o texto vizinho)', () => {
    const nums = caminhoCirculo(200, 60, 5).match(/-?\d+(\.\d+)?/g)!.map(Number)
    const xs = nums.filter((_, i) => i % 2 === 0)
    const ys = nums.filter((_, i) => i % 2 === 1)
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(-16)
    expect(Math.max(...xs)).toBeLessThanOrEqual(216)
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(-4.8)
    expect(Math.max(...ys)).toBeLessThanOrEqual(64.8)
  })
})
