import { describe, expect, it } from 'vitest'
import { contraste } from './contraste'

describe('contraste', () => {
  it('preto no branco é 21', () => expect(contraste('#000000', '#ffffff')).toBeCloseTo(21, 1))
  it('a ordem não importa', () => expect(contraste('#0d5f73', '#f2f5f3')).toBeCloseTo(contraste('#f2f5f3', '#0d5f73'), 6))
  it('mesma cor é 1', () => expect(contraste('#486169', '#486169')).toBe(1))
})
