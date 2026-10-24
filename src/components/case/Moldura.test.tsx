// Guarda do rótulo de origem no cabeçalho do case (23/10/2026, correção visual): a origem `cliente` caía em
// "Em empresa", o que é falso para o trabalho feito por fora de uma empresa. Renderização estática no Node.
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { casoDe } from '../../casos'
import { listarProjetos } from '../../projetos'
import { CabecalhoCase } from './Moldura'

/** HTML do cabeçalho de um case, com o item e o caso das fontes únicas. */
function htmlDoCase(slug: string): string {
  const item = listarProjetos().find((i) => i.slug === slug)
  const caso = casoDe(slug)
  if (!item || !caso) throw new Error(`case ausente: ${slug}`)
  return renderToStaticMarkup(createElement(CabecalhoCase, { item, caso }))
}

describe('cabeçalho do case', () => {
  it('loja-virtual, trabalho para cliente, diz "Para cliente"', () => {
    const html = htmlDoCase('loja-virtual')
    expect(html).toContain('Para cliente')
    expect(html).not.toContain('Em empresa')
  })

  it('caso de empresa continua dizendo "Em empresa"', () => {
    expect(htmlDoCase('sicoob')).toContain('Em empresa')
  })
})
