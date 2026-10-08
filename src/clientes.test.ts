import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { empresasDiretas, gruposClientes, segmentos, selecaoLogos, type Cliente } from './clientes'
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
})
