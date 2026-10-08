import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from '../lib/termos-proibidos'
import { diagramasDosCasos } from '../visuais'
import { listarDesenhos, listarPadroes } from './desenhos'
import { desenharSvg, paletaDoTema, quebrar } from './motor'

const desenhos = Object.values(listarDesenhos())
const proibidos = (t: string) => encontrarTermosProibidos(t).filter((x) => x !== 'sicoob')

describe('ilustrações-diagrama', () => {
  it('não têm termo proibido', () => expect(proibidos(JSON.stringify(desenhos))).toEqual([]))
  it('Sicoob só com o que a matéria diz: nada de modelo, banco vetorial ou plataforma', () => {
    const t = JSON.stringify(listarDesenhos().sicoob).toLowerCase()
    for (const x of ['mirante', 'sisbr', 'gemini', 'vertex', 'vetorial', 'pinecone', 'rag', 'modelo', 'llm']) expect(t, x).not.toContain(x)
  })
  it('trading nunca fala em lucro', () => expect(JSON.stringify(listarDesenhos()['nexus-quant']).toLowerCase()).not.toMatch(/lucro|rendimento|ganho/))
  it('todo SVG tem <title> e <desc> e é responsivo', () =>
    desenhos.forEach((d) =>
      (['largo', 'estreito'] as const).forEach((m) => {
        const svg = desenharSvg(d, m, paletaDoTema())
        expect(svg).toContain('<title id=')
        expect(svg).toContain('<desc id=')
        expect(svg).toMatch(/viewBox="0 0 \d+ \d+"/)
        expect(svg).toContain('width="100%"')
      })))
  it('texto nunca abaixo de 13 unidades no SVG', () =>
    desenhos.forEach((d) => {
      const tamanhos = [...desenharSvg(d, 'estreito', paletaDoTema()).matchAll(/font-size="([\d.]+)"/g)].map((m) => Number(m[1]))
      expect(Math.min(...tamanhos), d.id).toBeGreaterThanOrEqual(13)
    }))
  it('no celular nenhuma palavra estoura a caixa', () =>
    desenhos.forEach((d) =>
      d.etapas.forEach((e) =>
        [...e.nos, ...(e.lateral ? [e.lateral.no] : [])].forEach((n) =>
          quebrar(n.titulo, 240, 17).forEach((l) => expect(l.length, `${d.id}: ${l}`).toBeLessThanOrEqual(27))))))
  it('todo desenho ligado a um caso existe', () =>
    Object.values(diagramasDosCasos).forEach((id) => expect(listarDesenhos()[id], id).toBeTruthy()))
  it('quatro padrões de agente, cada um com desenho', () => {
    expect(listarPadroes()).toHaveLength(4)
    listarPadroes().forEach((p) => expect(listarDesenhos()[p.id]).toBeTruthy())
  })
  it('ids únicos por prefixo, para vários SVGs na mesma página', () => {
    const a = desenharSvg(desenhos[0], 'largo', paletaDoTema(), { prefixo: 'a' })
    const b = desenharSvg(desenhos[0], 'largo', paletaDoTema(), { prefixo: 'b' })
    expect(a.match(/id="([^"]+)-pm"/)?.[1]).not.toBe(b.match(/id="([^"]+)-pm"/)?.[1])
  })
  it('texto copiado do desenho não gruda palavras nem traz número solto', () => {
    const d = listarDesenhos()['como-eu-integro']
    for (const m of ['largo', 'estreito'] as const) {
      const svg = desenharSvg(d, m, paletaDoTema())
      const texto = [...svg.matchAll(/<tspan[^>]*>([^<]*)<\/tspan>/g)].map((x) => x[1]).join('')
      expect(texto).not.toMatch(/aqualquer|opróximo|nãoresolve/)
      expect(svg).not.toMatch(/>18</)
    }
  })
})
