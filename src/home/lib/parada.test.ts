import { describe, expect, it } from 'vitest'
import { paradaDoToque } from './parada'

// Fix final (14/10/2026): a 1ª parada do toque caía em y=359, entre a prova e o protótipo.
describe('parada por tela no celular', () => {
  const paradas = [0, 724, 1448, 2172, 2428, 2932, 3222]
  it('arrasto de 300 px para baixo a partir do topo assenta no protótipo', () => expect(paradaDoToque(359, 359, paradas)).toBe(724))
  it('subindo, assenta no começo da tela de cima', () => expect(paradaDoToque(1100, -200, paradas)).toBe(724))
  it('já numa parada, não mexe', () => expect(paradaDoToque(1447, 300, paradas)).toBeNull())
  it('sem sentido, vai para a mais próxima', () => {
    expect(paradaDoToque(800, 0, paradas)).toBe(724)
    expect(paradaDoToque(1400, 0, paradas)).toBe(1448)
  })
  it('no fim, desce até o fim da página e não passa dele', () => expect(paradaDoToque(3100, 100, paradas)).toBe(3222))
  it('sem paradas, nada', () => expect(paradaDoToque(10, 10, [])).toBeNull())
  // 18/10/2026: a seção de IA tem mais de uma tela; sem limite, o encaixe a pulava inteira.
  describe('com limite de uma tela', () => {
    const longe = [0, 724, 2400, 3900]
    it('não pula uma seção maior que o limite', () => expect(paradaDoToque(800, 300, longe, 760)).toBeNull())
    it('ainda assenta quando a próxima parada cabe no limite', () => expect(paradaDoToque(359, 359, [0, 724, 3000], 760)).toBe(724))
    it('subindo, também respeita o limite', () => expect(paradaDoToque(2200, -200, longe, 760)).toBeNull())
    it('parada mais próxima longe demais, sem sentido, não mexe', () => expect(paradaDoToque(1500, 0, longe, 300)).toBeNull())
  })
})
