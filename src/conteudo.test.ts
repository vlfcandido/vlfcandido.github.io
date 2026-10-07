import { describe, expect, it } from 'vitest'
import * as conteudo from './conteudo'
import { encontrarTermosProibidos } from './lib/termos-proibidos'

/** Coleta toda string do conteúdo que parece URL. */
function urls(): string[] {
  const todas: string[] = []
  JSON.stringify(conteudo, (_chave, valor) => {
    if (typeof valor === 'string' && valor.startsWith('http')) todas.push(valor)
    return valor
  })
  return todas
}

describe('conteúdo publicado', () => {
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(JSON.stringify(conteudo))).toEqual([]))
  it('toda URL é https', () => {
    expect(urls().length).toBeGreaterThan(0)
    urls().forEach((u) => expect(u).toMatch(/^https:\/\//))
  })
  it('slugs válidos e únicos', () => {
    const slugs = conteudo.cases.map((c) => c.slug)
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/))
    expect(new Set(slugs).size).toBe(slugs.length)
  })
  it('todo case tem alt descritivo', () => conteudo.cases.forEach((c) => expect(c.alt.length).toBeGreaterThan(15)))
  it('cases públicos citam fonte com link', () =>
    conteudo.cases.filter((c) => c.tipo === 'publico').forEach((c) => expect(c.fonte.url).toBeTruthy()))
  it('quatro passos de trabalho', () => expect(conteudo.passos).toHaveLength(4))
  it('Sicoob só aparece na chamada, no resumo e no case com a matéria pública', () => {
    const c = conteudo.cases.find((x) => x.slug === 'sicoob-investimentos')
    expect(c?.fonte.url).toBe('https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/')
    const fora = JSON.stringify({
      ...conteudo,
      perfil: { ...conteudo.perfil, chamada: '', resumo: '' },
      cases: conteudo.cases.filter((x) => x.slug !== 'sicoob-investimentos'),
    }).toLowerCase()
    expect(fora).not.toContain('sicoob')
  })
  it('projeto próprio nunca diz cliente nem lucro', () =>
    conteudo.cases.filter((c) => c.tipo === 'proprio').forEach((c) =>
      expect(JSON.stringify(c).toLowerCase()).not.toMatch(/cliente em|projeto para cliente|lucro|market making/)))
})
