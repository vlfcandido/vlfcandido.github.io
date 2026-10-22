import { describe, expect, it } from 'vitest'
import { RAIO_MAGNETICO, iniciarVida, posicaoNormalizada, puxaoMagnetico, vidaPermitida } from './vida'

/** Janela falsa: só o que a vida consulta. */
function janela(reduzir: boolean, mouse = true) {
  return {
    matchMedia: (q: string) => ({ matches: (reduzir && q.includes('reduce')) || (mouse && q.includes('pointer: fine')) }),
  } as unknown as Window
}

describe('vida do site', () => {
  it('o puxão magnético é 30% da distância dentro do raio e zero fora dele', () => {
    expect(puxaoMagnetico(10, -20)).toEqual({ x: 3, y: -6 })
    expect(puxaoMagnetico(RAIO_MAGNETICO, 0)).toEqual({ x: 0, y: 0 })
  })
  it('a posição normalizada vai de -1 a 1 entre as bordas', () => {
    const caixa = { left: 100, top: 50, width: 200, height: 100 }
    expect(posicaoNormalizada(100, 50, caixa)).toEqual({ x: -1, y: -1 })
    expect(posicaoNormalizada(200, 100, caixa)).toEqual({ x: 0, y: 0 })
    expect(posicaoNormalizada(300, 150, caixa)).toEqual({ x: 1, y: 1 })
  })
  it('não roda com reduced-motion nem sem mouse', () => {
    expect(vidaPermitida(janela(false))).toBe(true)
    expect(vidaPermitida(janela(true))).toBe(false)
    expect(vidaPermitida(janela(false, false))).toBe(false)
  })
  it('sem permissão, iniciar não liga nada e devolve uma limpeza que não quebra', () => {
    const parar = iniciarVida({} as Document, janela(true))
    expect(() => parar()).not.toThrow()
  })
})
