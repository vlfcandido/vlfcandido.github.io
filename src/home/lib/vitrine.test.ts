import { describe, expect, it } from 'vitest'
import { PECAS } from '../conteudo'
import { ORDEM_DA_VITRINE, pecasDaVitrine } from './vitrine'

describe('vitrine da home', () => {
  it('mostra as oito peças, uma vez cada', () => {
    const pecas = pecasDaVitrine()
    expect(pecas).toHaveLength(PECAS.length)
    expect(new Set(pecas.map((p) => p.slug)).size).toBe(PECAS.length)
    expect([...ORDEM_DA_VITRINE].sort()).toEqual(PECAS.map((p) => p.slug).sort())
  })

  it('cada peça tem nome, dor em uma linha e imagem real', () => {
    for (const p of pecasDaVitrine()) {
      expect(p.nome.length).toBeGreaterThan(2)
      expect(p.resumo.length).toBeGreaterThan(20)
      expect(p.resumo).not.toMatch(/[\n:—–]/)
      expect(p.imagem).toMatch(/^trabalhos\/img\/.+\.jpg$/)
    }
  })
})
