import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { listarCasos } from '../../../casos'
import { encontrarTermosProibidos } from '../../../lib/termos-proibidos'
import { listarProjetos } from '../../../projetos'
import { DiarioDeObra } from './DiarioDeObra'

const slug = 'limey-atacado'
const item = listarProjetos().find((i) => i.slug === slug)!
const caso = listarCasos().find((c) => c.slug === slug)!
const html = renderToStaticMarkup(<DiarioDeObra item={item} caso={caso} />)

describe('peça diário de obra', () => {
  it('mostra as cinco camadas, na ordem em que foram fechadas', () => {
    const etapas = [...html.matchAll(/data-etapa="([^"]+)"/g)].map((m) => m[1])
    expect(etapas).toEqual(['Segurança', 'Estoque', 'Catálogo', 'Protótipo e tema', 'Vitrine e checkout'])
  })

  it('cada camada tem antes, depois e prova', () => {
    expect((html.match(/<dt[^>]*>Antes<\/dt>/g) ?? []).length).toBe(5)
    expect((html.match(/<dt[^>]*>Depois<\/dt>/g) ?? []).length).toBe(5)
    expect((html.match(/Prova: /g) ?? []).length).toBe(5)
  })

  it('traz os números que estão no dossiê', () => {
    for (const n of ['1.033', '17 → 14', '47,9%', '31%', '4 px', '19 px', '77 categorias', '72 pedidos']) {
      expect(html, n).toContain(n)
    }
  })

  it('conta o tema, a vitrine e o checkout sem dado inventado', () => {
    for (const t of ['sem page builder', 'Cloudflare Workers', 'Tamanho', 'Cor', 'Grupo', 'levas de 16']) {
      expect(html, t).toContain(t)
    }
    for (const t of ['Correios', 'Jadlog', 'Azul', 'JeT', 'TDS', 'excursão']) expect(html, t).toContain(t)
  })

  it('não tem dado pessoal, contato, credencial nem valor de contrato', () => {
    expect(encontrarTermosProibidos(html)).toEqual([])
    expect(html).not.toMatch(/@|R\$|\b\d{2}\s?9?\d{4}[- ]\d{4}\b/)
    expect(html.toLowerCase()).not.toContain('alyson')
  })

  it('não é clicável', () => {
    expect(html).not.toContain('<button')
    expect(html).not.toContain('<a ')
  })

  it('não usa travessão no meio da frase', () => expect(html).not.toMatch(/[—–]/))
})
