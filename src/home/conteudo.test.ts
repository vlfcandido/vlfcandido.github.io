// src/home/conteudo.test.ts
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { empresasDiretas } from '../clientes'
import { encontrarTermosProibidos } from '../lib/termos-proibidos'
import { listarProjetos } from '../projetos'
import { PECAS, SLUGS_EMPRESAS, conteudoHome, numerosDeProva } from './conteudo'

const c = conteudoHome()
const tudo = JSON.stringify(c)

describe('conteúdo da home', () => {
  it('tem exatamente 3 destaques, cada um com dor e detalhe', () => {
    expect(c.destaques).toHaveLength(3)
    for (const d of c.destaques) {
      expect(d.dor.length).toBeGreaterThan(10)
      expect(d.detalhe.length).toBeGreaterThan(10)
    }
  })
  it('não tem preço', () => expect(tudo).not.toMatch(/R\$\s?\d/))
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(tudo)).toEqual([]))
  it('garantia é de 30 dias de correção', () => expect(c.garantia).toMatch(/30 dias de correção/))
  it('tem 5 passos', () => expect(c.passos).toHaveLength(5))
  it('números de prova vêm da fonte, sem inflar', () => {
    const n = numerosDeProva()
    expect(n.anos).toBe(13)
    expect(n.projetos).toBe(listarProjetos().length + PECAS.length)
    expect(n.empresas).toBe(SLUGS_EMPRESAS.length)
  })
  it('toda empresa existe em clientes.ts e tem o arquivo de logo', () => {
    for (const slug of SLUGS_EMPRESAS) {
      const e = empresasDiretas.find((x) => x.slug === slug)
      expect(e, slug).toBeDefined()
      expect(e?.logo && existsSync(`public/${e.logo}`), slug).toBeTruthy()
    }
  })
  it('as imagens dos destaques existem em public/', () => {
    for (const d of c.destaques) expect(existsSync(`public/${d.imagem}`), d.imagem).toBe(true)
  })
  it('nenhum destaque cita nome do material original das peças', () =>
    expect(tudo.toLowerCase()).not.toMatch(/terceira|fdt|nome-privado/))
})
