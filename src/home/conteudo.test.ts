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
  // 14/10/2026 (revisão da Task 5): no PC a mesma tela aparecia duas vezes (vitrine e 1º cartão; protótipo e 2º).
  it('nenhuma tela se repete na home (vitrine, protótipo e destaques)', () => {
    const telas = [c.vitrine.imagem, c.prototipo.imagem, ...c.destaques.map((d) => d.imagem)]
    expect(new Set(telas).size).toBe(telas.length)
    for (const t of telas) expect(existsSync(`public/${t}`), t).toBe(true)
  })
  it('a legenda da vitrine não repete o detalhe de um cartão', () => {
    const legenda = c.vitrine.legenda.replace(/\.$/, '').toLowerCase()
    for (const d of c.destaques) expect(d.detalhe.toLowerCase()).not.toContain(legenda)
  })
  // Task 10 (decisão do controlador): a retenção do pagamento só vale no 99Freelas; a garantia não a promete.
  it('a garantia não promete retenção de pagamento; a frase da plataforma nomeia o 99Freelas', () => {
    expect(c.garantia).not.toMatch(/retid|plataforma/i)
    expect(c.garantiaPlataforma).toMatch(/^No 99Freelas,/)
  })
  // Task 10: o destaque do AprovaOS dizia "ordem de serviço"; o projeto é plano de estudo (casos.ts).
  it('o destaque do AprovaOS fala do que o projeto é', () => {
    const d = c.destaques.find((x) => x.slug === 'aprovaos')
    expect(JSON.stringify(d).toLowerCase()).not.toMatch(/ordem de servi/)
    expect(JSON.stringify(d).toLowerCase()).toMatch(/estudo|concurseiro|aluno/)
  })
  it('as peças têm uma linha própria cada', () => {
    expect(new Set(PECAS.map((x) => x.resumo)).size).toBe(PECAS.length)
  })
  it('nenhum dois-pontos nem travessão no texto da home (humanizer)', () => {
    const visivel = [c.promessa.titulo, c.promessa.subtitulo, c.vitrine.legenda, c.prototipo.titulo, c.prototipo.texto,
      ...c.destaques.flatMap((d) => [d.dor, d.detalhe]), ...c.passos.flatMap((x) => [x.titulo, x.texto]), c.garantia,
      c.garantiaPlataforma, ...c.quemSou.texto, c.chamada.titulo]
    for (const t of visivel) expect(t, t).not.toMatch(/[:—–]/)
  })
  it('nenhum destaque cita nome do material original das peças', () =>
    expect(tudo.toLowerCase()).not.toMatch(/terceira|fdt|nome-privado/))
})
