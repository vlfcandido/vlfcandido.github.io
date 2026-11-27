import { describe, expect, it } from 'vitest'
import { PECAS } from '../conteudo'
import { ORDEM_DA_VITRINE, pecasDaVitrine } from './vitrine'

describe('vitrine da home', () => {
  it('mostra todas as peças, uma vez cada', () => {
    const pecas = pecasDaVitrine()
    expect(pecas).toHaveLength(PECAS.length)
    expect(new Set(pecas.map((p) => p.slug)).size).toBe(PECAS.length)
    expect([...ORDEM_DA_VITRINE].sort()).toEqual(PECAS.map((p) => p.slug).sort())
  })

  // 26/11/2026 (dono): as mais bonitas na frente, a mesma ordem na vitrine, em /trabalhos/ e em #/projetos.
  it('segue a ordem nova, igual à de PECAS, com Pelo Solto e Céu Interior nas duas vagas grandes', () => {
    const ordem = [
      'pet-shop-whatsapp-ia-exemplo',
      'plataforma-astrologia-exemplo',
      'atletica-associados-exemplo',
      'consultorio-exemplo',
      'liga-varzea',
      'consignacao-veiculos-exemplo',
      'loja-woocommerce-exemplo',
      'catalogo-whatsapp-exemplo',
      'escritorio-arquitetura-exemplo',
      'site-contabilidade-exemplo',
    ]
    expect(PECAS.map((p) => p.slug)).toEqual(ordem)
    expect(pecasDaVitrine().map((p) => p.slug)).toEqual(ordem)
    expect(pecasDaVitrine().slice(0, 2).map((p) => p.nome)).toEqual(['Pelo Solto', 'Céu Interior'])
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
