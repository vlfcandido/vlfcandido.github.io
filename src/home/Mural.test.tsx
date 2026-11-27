// Guarda do mural e do menu (26/11/2026): o mural rende as oito capas ilustradas como links de verdade, os depoimentos
// saem com o link do perfil, e o menu de /trabalhos/ (HTML estático) é o mesmo do cabeçalho do site.
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SECOES } from '../components/Cabecalho'
import { PaginaInicio } from '../paginas/Inicio'
import { Depoimentos } from './Depoimentos'
import { Mural } from './Mural'
import { IDS_DOS_DESENHOS, desenhoDaDemanda } from './lib/desenhos'
import { DEMANDAS, DEPOIMENTOS, NOME_PECAS, PERFIL_99 } from './conteudo'

/** Tira as tags e junta os espaços, para comparar o texto que a pessoa lê. */
const texto = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

/** Rótulo e destino de cada link de um trecho de HTML. */
const linksDe = (html: string) => [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs)].map((m) => ({ href: m[1], rotulo: texto(m[2]) }))

describe('Mural "O que você precisa"', () => {
  const html = renderToStaticMarkup(createElement(Mural))
  const capas = linksDe(html)
  it('rende oito capas, cada uma um link com o título, a frase e o destino no nome', () => {
    expect(capas).toHaveLength(8)
    DEMANDAS.forEach((d, i) => {
      for (const parte of [...d.titulo, d.frase, d.destino]) expect(capas[i].rotulo, d.id).toContain(parte)
    })
    // As duas linhas do título viram uma leitura só, com espaço entre elas.
    expect(capas[1].rotulo).toMatch(/^Integração por API a API erra, a correção fica/)
  })
  it('leva cada capa à peça de /trabalhos/ que prova a demanda', () => {
    expect(capas.map((c) => c.href)).toEqual([
      '/trabalhos/pet-shop-whatsapp-ia-exemplo/', '/trabalhos/liga-varzea/', '/trabalhos/consultorio-exemplo/',
      '/trabalhos/catalogo-whatsapp-exemplo/', '/trabalhos/escritorio-arquitetura-exemplo/',
      '/trabalhos/loja-woocommerce-exemplo/', '/trabalhos/atletica-associados-exemplo/', '/trabalhos/site-contabilidade-exemplo/',
    ])
  })
  it('o grifo de marca-texto fica na segunda linha do título', () => {
    DEMANDAS.forEach((d) => expect(html, d.id).toContain(`<mark class="capa-grifo">${d.titulo[1]}</mark>`))
  })
  it('o desenho é SVG de verdade, sem imagem, e fica fora da leitura', () => {
    expect(html).not.toContain('<img')
    expect(html.match(/<svg class="capa-desenho" viewBox="0 0 960 660" aria-hidden="true"/g)).toHaveLength(8)
  })
})

describe('desenhos do mural', () => {
  it('há um desenho para cada demanda', () => expect([...IDS_DOS_DESENHOS]).toEqual(DEMANDAS.map((d) => d.id)))
  it('cada desenho é um miolo de SVG fechado, sem arquivo de fora nem script', () => {
    for (const id of IDS_DOS_DESENHOS) {
      const svg = desenhoDaDemanda(id)
      expect(svg.length, id).toBeGreaterThan(1500)
      expect(svg, id).not.toMatch(/<script|href=|url\(|<image|undefined|NaN/)
      expect((svg.match(/<g\b/g) ?? []).length, id).toBe((svg.match(/<\/g>/g) ?? []).length)
    }
  })
  it('usa só a paleta do site, e o que encosta no fundo segue o tema', () => {
    const paleta = ['#f7f4ee', '#fffdf9', '#17150f', '#4a463e', '#ddd5c6', '#f6b90a', '#d9542a', '#1f3a6b', '#2e6a4e', '#efe9dc', '#e8dfcc']
    for (const id of IDS_DOS_DESENHOS) {
      const svg = desenhoDaDemanda(id)
      for (const cor of svg.match(/#[0-9a-f]{3,8}\b/gi) ?? []) expect(paleta, `${id} ${cor}`).toContain(cor.toLowerCase())
      expect(svg, id).toContain('var(--d-sombra)')
    }
    // Os aparelhos e os avisos soltos sobre o fundo levam o contorno do tema.
    for (const id of ['ia', 'carteirinha', 'catalogo', 'integracao'] as const) expect(desenhoDaDemanda(id), id).toContain('var(--d-contorno)')
  })
  it('o desenho não muda de uma chamada para outra (o QR da carteirinha é fixo)', () =>
    expect(desenhoDaDemanda('carteirinha')).toBe(desenhoDaDemanda('carteirinha')))
})

describe('Depoimentos', () => {
  const html = renderToStaticMarkup(createElement(Depoimentos))
  it('mostra cada frase como o cliente escreveu, com o tipo do projeto e o mês', () => {
    for (const d of DEPOIMENTOS) {
      expect(texto(html)).toContain(d.frase)
      expect(texto(html)).toContain(`${d.projeto} 99Freelas, ${d.quando}`)
    }
  })
  it('leva ao perfil público do 99Freelas', () => expect(linksDe(html).map((l) => l.href)).toEqual([PERFIL_99]))
})

describe('menu de /trabalhos/', () => {
  const rotulos = (html: string) => linksDe(html.slice(html.indexOf('<nav'), html.indexOf('</nav>'))).map((l) => l.rotulo)
  const pagina = readFileSync('public/trabalhos/index.html', 'utf8')
  it('tem os mesmos itens do cabeçalho do site, na mesma ordem', () => {
    // O cabeçalho do site monta o menu assim: as peças, "Projetos" e as âncoras de SECOES (Cabecalho.tsx).
    const doSite = [NOME_PECAS, 'Projetos', ...SECOES.map((x) => x.rotulo)]
    expect(doSite).toEqual(['Experimente ao vivo', 'Projetos', 'Criativo', 'Quem sou'])
    expect(rotulos(pagina)).toEqual(doSite)
  })
  it('cada item leva a um lugar que existe na home', () => {
    const nav = pagina.slice(pagina.indexOf('<nav'), pagina.indexOf('</nav>'))
    expect(linksDe(nav).map((l) => l.href)).toEqual(['./', '../#/projetos', ...SECOES.map((x) => `../#${x.id}`)])
    const home = renderToStaticMarkup(createElement(PaginaInicio))
    for (const { id } of SECOES) expect(home.includes(`id="${id}"`), id).toBe(true)
  })
})
