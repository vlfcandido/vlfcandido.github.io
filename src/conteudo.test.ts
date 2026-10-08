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
  it('três cases curtos na principal, cada um com fonte https', () => {
    expect(conteudo.destaques).toHaveLength(3)
    conteudo.destaques.forEach((d) => expect(d.fonte.url).toMatch(/^https:\/\//))
  })
  it('principal sem jargão técnico', () => {
    const principal = JSON.stringify({
      linha: conteudo.perfil.linha,
      chamada: conteudo.perfil.chamada,
      oferta: conteudo.oferta,
      destaques: conteudo.destaques,
      passos: conteudo.passos,
    }).toLowerCase()
    for (const termo of ['langgraph', 'rag', 'redis', 'hexagonal', 'api ', 'llm', 'fastapi', 'vertex']) {
      expect(principal, termo).not.toContain(termo)
    }
  })
  it('sem cara de IA: nada de " · " nem "→" nos textos', () => {
    const tudo = JSON.stringify(conteudo)
    expect(tudo).not.toContain(' · ')
    expect(tudo).not.toContain('→')
  })
  it('Sicoob só aparece na chamada, no resumo e nos cases com a matéria pública', () => {
    const d = conteudo.destaques.find((x) => x.empresa === 'sicoob')
    expect(d?.fonte.url).toBe('https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/')
    const c = conteudo.cases.find((x) => x.slug === 'sicoob-investimentos')
    expect(c?.fonte.url).toBe('https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/')
    const fora = JSON.stringify({
      ...conteudo,
      perfil: { ...conteudo.perfil, chamada: '', resumo: '' },
      cases: conteudo.cases.filter((x) => x.slug !== 'sicoob-investimentos'),
      destaques: conteudo.destaques.filter((x) => x.empresa !== 'sicoob'),
    }).toLowerCase()
    expect(fora).not.toContain('sicoob')
  })
  it('projeto próprio nunca diz cliente nem lucro', () =>
    conteudo.cases.filter((c) => c.tipo === 'proprio').forEach((c) =>
      expect(JSON.stringify(c).toLowerCase()).not.toMatch(/cliente em|projeto para cliente|lucro|market making/)))
})
