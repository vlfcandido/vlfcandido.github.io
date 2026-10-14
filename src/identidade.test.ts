import { describe, expect, it } from 'vitest'
import { contraste } from './lib/contraste'
import { PALETA } from './identidade'

describe('paleta da identidade "o detalhe que ninguém viu"', () => {
  for (const tema of ['claro', 'escuro'] as const) {
    const p = PALETA[tema]
    it(`${tema}: texto sobre papel é AA`, () => expect(contraste(p.fundo, p.papel)).toBeGreaterThanOrEqual(4.5))
    it(`${tema}: texto secundário sobre papel é AA`, () =>
      expect(contraste(p['fundo-suave'], p.papel)).toBeGreaterThanOrEqual(4.5))
    it(`${tema}: texto do CTA sobre marca-texto é AA`, () =>
      expect(contraste(p['on-sol'], p.sol)).toBeGreaterThanOrEqual(4.5))
    it(`${tema}: link sobre papel é AA`, () => expect(contraste(p.mar, p.papel)).toBeGreaterThanOrEqual(4.5))
  }
})
