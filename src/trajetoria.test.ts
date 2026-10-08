import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from './lib/termos-proibidos'
import { empregos, freelance } from './trajetoria'

describe('trajetória', () => {
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(JSON.stringify({ empregos, freelance }))).toEqual([]))
  it('um só emprego atual, e é o primeiro', () => {
    expect(empregos.filter((e) => e.atual)).toHaveLength(1)
    expect(empregos[0].atual).toBe(true)
  })
  it('o atual aparece como Sicoob', () => expect(empregos[0].empresa).toBe('Sicoob'))
  // Decisão dele, 08/10/2026: o cargo real na Contabilizei volta ao site, sem o Concierge.
  it('Contabilizei com o cargo real, Arquiteto Sênior de IA, e sem Concierge', () => {
    const c = empregos.find((e) => e.slug === 'contabilizei')
    expect(c?.cargo).toBe('Arquiteto Sênior de IA')
    expect(JSON.stringify(c)).not.toMatch(/concierge/i)
  })
  it('a Wiv não está entre os empregos', () => expect(empregos.some((e) => /wiv/i.test(e.empresa))).toBe(false))
  it('toda logo citada existe em public/', () =>
    [...empregos.map((e) => e.logo), freelance.logo]
      .filter(Boolean)
      .forEach((l) => expect(existsSync(new URL(`../public/${l}`, import.meta.url))).toBe(true)))
  it('slugs únicos', () => expect(new Set(empregos.map((e) => e.slug)).size).toBe(empregos.length))
  it('sem o "80+ chatbots" (relato sem fonte, nunca no site; banco de provas)', () =>
    expect(JSON.stringify({ empregos, freelance })).not.toMatch(/80\s*(\+|chatbots)/))
})
