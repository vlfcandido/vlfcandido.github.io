import { describe, expect, it } from 'vitest'
import { FRASES_MARCADAS, conteudoHome } from '../conteudo'
import { partirNaFrase, partirNasFrases } from './marcar'

describe('trechos marcados à mão', () => {
  const c = conteudoHome()
  it('parte em antes, marcado e depois', () =>
    expect(partirNaFrase('Veja antes de fechar.', 'antes de fechar')).toEqual({ antes: 'Veja ', marcado: 'antes de fechar', depois: '.' }))
  it('trecho ausente devolve null (nunca marca o lugar errado)', () => expect(partirNaFrase('abc', 'xyz')).toBeNull())
  it('frase vazia devolve null', () => expect(partirNaFrase('abc', '')).toBeNull())
  it('cada frase marcada existe no texto do seu bloco', () => {
    expect(partirNasFrases(c.promessa.titulo, FRASES_MARCADAS.promessa)).not.toBeNull()
    expect(partirNaFrase(c.prototipo.titulo, FRASES_MARCADAS.prototipo)).not.toBeNull()
    expect(partirNaFrase(c.garantia, FRASES_MARCADAS.garantia)).not.toBeNull()
  })
  it('parte em vários trechos, na ordem', () =>
    expect(partirNasFrases('Hoje no A, antes no B.', ['A', 'B'])).toEqual([
      { texto: 'Hoje no ', marcado: false }, { texto: 'A', marcado: true }, { texto: ', antes no ', marcado: false },
      { texto: 'B', marcado: true }, { texto: '.', marcado: false },
    ]))
  it('vários trechos com um ausente devolve null', () => expect(partirNasFrases('Hoje no A.', ['A', 'B'])).toBeNull())
  // Fix final (14/10/2026): o grifo da prova fica nas duas empresas, e só nelas.
  // 21/10/2026 (pedido dele): a Contabilizei entra como terceira marca. Antes: só Sicoob e Serasa Experian.
  it('o grifo da prova marca Sicoob, Serasa Experian e Contabilizei', () =>
    expect(partirNasFrases(c.promessa.titulo, FRASES_MARCADAS.promessa)?.filter((p) => p.marcado).map((p) => p.texto)).toEqual([
      'Sicoob', 'Serasa Experian', 'Contabilizei',
    ]))
  it('o círculo só vai em frase curta, de uma linha (até 24 caracteres)', () =>
    expect(FRASES_MARCADAS.prototipo.length).toBeLessThanOrEqual(24))
})
