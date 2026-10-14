import { describe, expect, it } from 'vitest'
import { FRASES_MARCADAS, conteudoHome } from '../conteudo'
import { partirNaFrase } from './marcar'

describe('trechos marcados à mão', () => {
  const c = conteudoHome()
  it('parte em antes, marcado e depois', () =>
    expect(partirNaFrase('Veja antes de fechar.', 'antes de fechar')).toEqual({ antes: 'Veja ', marcado: 'antes de fechar', depois: '.' }))
  it('trecho ausente devolve null (nunca marca o lugar errado)', () => expect(partirNaFrase('abc', 'xyz')).toBeNull())
  it('frase vazia devolve null', () => expect(partirNaFrase('abc', '')).toBeNull())
  it('cada frase marcada existe no texto do seu bloco', () => {
    expect(partirNaFrase(c.promessa.titulo, FRASES_MARCADAS.promessa)).not.toBeNull()
    expect(partirNaFrase(c.prototipo.titulo, FRASES_MARCADAS.prototipo)).not.toBeNull()
    expect(partirNaFrase(c.garantia, FRASES_MARCADAS.garantia)).not.toBeNull()
  })
  it('o círculo só vai em frase curta, de uma linha (até 24 caracteres)', () =>
    expect(FRASES_MARCADAS.prototipo.length).toBeLessThanOrEqual(24))
})
