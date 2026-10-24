import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { listarCasos } from '../../../casos'
import { listarProjetos } from '../../../projetos'
import { MesaDiagnostico } from './MesaDiagnostico'

const slug = 'loja-virtual'
const item = listarProjetos().find((i) => i.slug === slug)!
const caso = listarCasos().find((c) => c.slug === slug)!
const html = renderToStaticMarkup(<MesaDiagnostico item={item} caso={caso} />)

describe('peça mesa de diagnóstico', () => {
  it('renderiza os três passos do método', () => {
    expect(html).toContain('Acesso')
    expect(html).toContain('Varredura')
    expect(html).toContain('Laudo')
  })

  it('mostra a cadeia do catálogo em faixa, com a origem de cada achado', () => {
    expect(html.toLowerCase()).toContain('catálogo')
    expect(html.toLowerCase()).toContain('vitrine')
    expect(html).toContain('leitura pública')
  })

  it('liga cada bloco do laudo ao achado que o justifica', () => {
    expect(html).toMatch(/data-achado="[a-z-]+"/)
    expect((html.match(/data-achado=/g) ?? []).length).toBeGreaterThanOrEqual(2)
  })

  it('marca o elemento que o IntersectionObserver observa', () => {
    // Ref solto não aparece no HTML: a marca prende o ref à própria <section>, e o teste quebra se ela sumir.
    expect(html).toMatch(/<section[^>]*data-observado/)
    // No servidor não há efeito: a classe da animação só entra no cliente, e o conteúdo já sai montado.
    expect(html).not.toContain('mesa-visivel')
  })

  // 23/10/2026 (correção final 3, regra do dono): nada na peça aponta para a loja do cliente.
  it('não aponta para a loja do cliente no achado de medição', () => {
    expect(html).toContain('leitura pública, 22/10')
    expect(html.toLowerCase()).not.toMatch(/loja de moda|duas lojas|a loja\b/)
  })

  it('não usa travessão no meio da frase', () => {
    expect(html).not.toMatch(/[—–]/)
  })

  it('não diz o que a loja vende (a cópia não identifica o cliente)', () => {
    expect(html.toLowerCase()).not.toContain('instrumento')
    expect(html).toContain('produtos de alto ticket')
  })

  it('não é clicável', () => {
    expect(html).not.toContain('<button')
    expect(html).not.toContain('<a ')
  })
})
