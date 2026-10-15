import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos, hashTermo } from './termos-proibidos'

// Lista de teste própria, com termos neutros: o teste não pode expor a lista privada do site.
const TESTE = new Set([hashTermo('banana'), hashTermo('caju verde')])

describe('encontrarTermosProibidos', () => {
  it('texto limpo', () => expect(encontrarTermosProibidos('5 mil atendimentos de 2021 a 2025', TESTE)).toEqual([]))
  it('ignora caixa e acento', () =>
    expect(encontrarTermosProibidos('BANÂNA e mais', TESTE)).toEqual([`termo privado ${hashTermo('banana')}`]))
  it('acha termo de duas palavras', () =>
    expect(encontrarTermosProibidos('um Caju Verde aqui', TESTE)).toEqual([`termo privado ${hashTermo('caju verde')}`]))
  it('não acha pedaço de palavra', () => expect(encontrarTermosProibidos('bananada', TESTE)).toEqual([]))
  it('acha e-mail', () => expect(encontrarTermosProibidos('fale em a.b@x.com.br', TESTE)).toEqual(['e-mail']))
  it('acha telefone', () => expect(encontrarTermosProibidos('ligue (45) 99999-1234', TESTE)).toEqual(['telefone']))
  it('não confunde URL com data', () =>
    expect(encontrarTermosProibidos('https://site.com/noticias/12/06/2026/wiv-5-milhoes/', TESTE)).toEqual([]))
  it('sem repetição', () => expect(encontrarTermosProibidos('banana banana', TESTE)).toHaveLength(1))
  it('a lista privada do site tem 8 termos e Sicoob não está nela', () =>
    expect(encontrarTermosProibidos('engenheiro de IA sênior no Sicoob')).toEqual([]))
})
