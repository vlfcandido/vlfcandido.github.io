import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  empresasDiretas,
  faixaProvas,
  fimDaGrade,
  gruposClientes,
  logosAbertura,
  textoMaisEmpresas,
  ordenarGrade,
  rotuloCurtoRamo,
  segmentos,
  selecaoLogos,
  soParticipei,
  type Cliente,
} from './clientes'
import { ramosDemo } from './conteudo'
import { encontrarTermosProibidos } from './lib/termos-proibidos'

// O Sicoob pode aparecer (decisão dele, 07/10/2026); o resto da guarda vale.
const proibidos = (texto: string) => encontrarTermosProibidos(texto).filter((t) => t !== 'sicoob')
const todos: Cliente[] = [...empresasDiretas, ...gruposClientes.flatMap((g) => g.clientes)]
const publico = resolve(__dirname, '../public')

describe('clientes', () => {
  it('não têm termo proibido', () =>
    expect(proibidos(JSON.stringify({ empresasDiretas, gruposClientes }))).toEqual([]))
  it('slugs em kebab-case e únicos', () => {
    const slugs = todos.map((c) => c.slug)
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/))
    expect(new Set(slugs).size).toBe(slugs.length)
  })
  it('todo segmento é conhecido', () => todos.forEach((c) => expect(segmentos[c.segmento]).toBeTruthy()))
  it('toda logo referenciada existe em public/logos', () =>
    todos.filter((c) => c.logo).forEach((c) => {
      expect(c.logo).toMatch(/^logos\/[a-z0-9-]+\.(svg|png|webp)$/)
      expect(existsSync(resolve(publico, c.logo!))).toBe(true)
    }))
  it('nenhum SVG de logo tem script ou handler', () =>
    todos.filter((c) => c.logo?.endsWith('.svg')).forEach((c) => {
      const svg = readFileSync(resolve(publico, c.logo!), 'utf8')
      expect(svg).not.toMatch(/<script|\son[a-z]+=|javascript:/i)
    }))
  it('toda URL é https', () => {
    const urls = [
      ...empresasDiretas.flatMap((e) => (e.historia ? [e.historia.url] : [])),
      ...gruposClientes.map((g) => g.fonte.url),
    ]
    urls.forEach((u) => expect(u).toMatch(/^https:\/\//))
  })
  it('grupos dizem que os projetos foram meus', () =>
    gruposClientes.forEach((g) => expect(g.legenda).toMatch(/^Projetos que liderei na /)))
  it('seleção da principal: 12 a 18 logos que existem, sem repetir', () => {
    const slugs = new Set(todos.filter((c) => c.logo).map((c) => c.slug))
    expect(selecaoLogos.length).toBeGreaterThanOrEqual(12)
    expect(selecaoLogos.length).toBeLessThanOrEqual(18)
    expect(new Set(selecaoLogos).size).toBe(selecaoLogos.length)
    selecaoLogos.forEach((s) => expect(slugs.has(s), s).toBe(true))
  })
  it('clientes de cada ramo da demonstração existem', () => {
    const slugs = new Set(todos.map((c) => c.slug))
    ramosDemo.forEach((r) => r.clientes.forEach((s) => expect(slugs.has(s), s).toBe(true)))
  })

  // Reorganização de 08/10/2026 (site-reorg/04-juiz.md) e decisões dele no mesmo dia.
  describe('vitrine de logos (M1, M2, M3, M4)', () => {
    const segmentoDe = (slug: string) => todos.find((c) => c.slug === slug)?.segmento
    it('abre com Amazon e a ordem é a do juiz, sem a Prefeitura do Rio e sem a Comgás', () => {
      expect(selecaoLogos[0]).toBe('amazon')
      expect(selecaoLogos).not.toContain('prefeitura-rio')
      expect(selecaoLogos).not.toContain('comgas')
      expect(selecaoLogos).toContain('bradesco-dental')
    })
    it('as 6 primeiras têm 6 ramos diferentes e nenhum banco', () => {
      const seis = selecaoLogos.slice(0, 6).map(segmentoDe)
      expect(new Set(seis).size).toBe(6)
      expect(seis).not.toContain('financeiro')
    })
    it('nunca dois do segmento financeiro seguidos', () => {
      for (let i = 1; i < selecaoLogos.length; i++) {
        const par = [segmentoDe(selecaoLogos[i - 1]), segmentoDe(selecaoLogos[i])]
        expect(par, `${selecaoLogos[i - 1]} + ${selecaoLogos[i]}`).not.toEqual(['financeiro', 'financeiro'])
      }
    })
    it('a legenda da demo de clínica está na faixa', () =>
      ['unimed', 'odontoprev', 'bradesco-dental'].forEach((s) => expect(selecaoLogos).toContain(s)))
    it('abertura = 6 primeiras; faixa de Provas começa na 7ª e termina com as da abertura', () => {
      expect(logosAbertura).toEqual(selecaoLogos.slice(0, 6))
      expect(faixaProvas).toHaveLength(selecaoLogos.length)
      expect(new Set(faixaProvas)).toEqual(new Set(selecaoLogos))
      expect(faixaProvas.slice(0, 6).filter((s) => logosAbertura.includes(s))).toEqual([])
      expect(faixaProvas.slice(-6)).toEqual(logosAbertura)
    })
    it('grade "Todas": siglas setoriais no fim, sem perder empresa', () => {
      const lista = gruposClientes.flatMap((g) => g.clientes)
      const ordenada = ordenarGrade(lista)
      expect(ordenada).toHaveLength(lista.length)
      expect(new Set(ordenada.map((c) => c.slug))).toEqual(new Set(lista.map((c) => c.slug)))
      expect(ordenada.slice(-fimDaGrade.length).map((c) => c.slug)).toEqual(fimDaGrade)
      expect(ordenada.slice(0, 10).map((c) => c.slug).filter((s) => /^(mp|tj)/.test(s))).toEqual([])
      fimDaGrade.forEach((s) => expect(lista.some((c) => c.slug === s), s).toBe(true))
    })
    it('a linha da abertura é calculada a partir do total ("e mais 66 empresas" para 72)', () => {
      expect(textoMaisEmpresas(72)).toBe('e mais 66 empresas')
      const total = gruposClientes.flatMap((g) => g.clientes).length
      expect(textoMaisEmpresas(total)).toBe(`e mais ${total - 6} empresas`)
    })
    it('chips de ramo na ordem dos ramos que mais pedem no 99', () =>
      expect(Object.keys(rotuloCurtoRamo)).toEqual(['saude', 'varejo', 'servicos', 'industria', 'financeiro', 'energia', 'publico']))
    it('Minu fica como participação, não como projeto liderado', () => {
      expect(soParticipei.has('minu')).toBe(true)
      soParticipei.forEach((s) => expect(todos.some((c) => c.slug === s), s).toBe(true))
    })
  })
})
