import { describe, expect, it } from 'vitest'
import { caminhoPublico } from './assets'

describe('caminhoPublico', () => {
  it('base raiz', () => expect(caminhoPublico('/', 'prints/a.png')).toBe('/prints/a.png'))
  it('base com barra final', () => expect(caminhoPublico('/site/', 'prints/a.png')).toBe('/site/prints/a.png'))
  it('base sem barra final', () => expect(caminhoPublico('/site', 'prints/a.png')).toBe('/site/prints/a.png'))
  it('relativo com barra inicial', () => expect(caminhoPublico('/site/', '/prints/a.png')).toBe('/site/prints/a.png'))
  it('base relativa', () => expect(caminhoPublico('./', 'prints/a.png')).toBe('./prints/a.png'))
})
