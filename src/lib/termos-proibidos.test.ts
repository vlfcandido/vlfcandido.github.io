import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from './termos-proibidos'

describe('encontrarTermosProibidos', () => {
  it('texto limpo', () => expect(encontrarTermosProibidos('5 mil atendimentos de 2021 a 2025')).toEqual([]))
  it('ignora caixa e acento', () => expect(encontrarTermosProibidos('MIRANTE e Pensão')).toEqual(['mirante', 'pensao']))
  it('acha e-mail', () => expect(encontrarTermosProibidos('fale em a.b@x.com.br')).toEqual(['e-mail']))
  it('acha telefone', () => expect(encontrarTermosProibidos('ligue (45) 99999-1234')).toEqual(['telefone']))
  it('não confunde URL com data', () =>
    expect(encontrarTermosProibidos('https://site.com/noticias/12/06/2026/wiv-5-milhoes/')).toEqual([]))
  it('sem repetição', () => expect(encontrarTermosProibidos('mirante mirante')).toEqual(['mirante']))
  it('Sicoob agora pode', () => expect(encontrarTermosProibidos('engenheiro de IA sênior no Sicoob')).toEqual([]))
})
