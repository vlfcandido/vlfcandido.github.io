import { describe, expect, it } from 'vitest'
import { noticias } from './noticias'
import { empresasDiretas } from './clientes'
import { encontrarTermosProibidos } from './lib/termos-proibidos'

// O Sicoob pode aparecer nas notícias e nas empresas (decisão dele, 07/10/2026); o resto da guarda vale.
const proibidos = (texto: string) => encontrarTermosProibidos(texto).filter((t) => t !== 'sicoob')

describe('notícias', () => {
  it('não têm termo proibido', () => expect(proibidos(JSON.stringify(noticias))).toEqual([]))
  it('ids únicos em kebab-case', () => {
    const ids = noticias.map((n) => n.id)
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/))
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('toda URL é https', () => noticias.forEach((n) => expect(n.url).toMatch(/^https:\/\//)))
  it('data em ISO válida', () =>
    noticias.forEach((n) => {
      expect(n.data).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(n.data))).toBe(false)
    }))
  it('empresa existe em clientes.ts', () => {
    const slugs = new Set(empresasDiretas.map((e) => e.slug))
    noticias.forEach((n) => expect(slugs.has(n.empresa)).toBe(true))
  })
  it('textos curtos', () =>
    noticias.forEach((n) => {
      expect(n.titulo.length).toBeLessThanOrEqual(90)
      expect(n.papel.length).toBeLessThanOrEqual(140)
    }))
})
