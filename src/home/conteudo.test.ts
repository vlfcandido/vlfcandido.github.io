// src/home/conteudo.test.ts
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { ONDE_TRABALHEI, empresasDiretas } from '../clientes'
import { encontrarTermosProibidos } from '../lib/termos-proibidos'
import { PROJETOS_NO_PRINT_ESTE_SITE, listarProjetos } from '../projetos'
import { CURRICULO_PDF, FOTO_BASE, FOTO_LARGURAS, FOTO_PRONTA, FRASES_MARCADAS, MARCAS_TOPO, PECAS, SLUGS_EMPRESAS, conteudoHome, numerosDeProva, periodoDe } from './conteudo'

const c = conteudoHome()
const tudo = JSON.stringify(c)

describe('conteúdo da home', () => {
  it('tem exatamente 3 destaques, cada um com dor e detalhe', () => {
    expect(c.destaques).toHaveLength(3)
    for (const d of c.destaques) {
      expect(d.dor.length).toBeGreaterThan(10)
      expect(d.detalhe.length).toBeGreaterThan(10)
    }
  })
  it('não tem preço', () => expect(tudo).not.toMatch(/R\$\s?\d/))
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(tudo)).toEqual([]))
  it('garantia é de 30 dias de correção', () => expect(c.garantia).toMatch(/30 dias de correção/))
  it('tem 5 passos', () => expect(c.passos).toHaveLength(5))
  it('números de prova vêm da fonte, sem inflar', () => {
    const n = numerosDeProva()
    expect(n.anos).toBe(13)
    expect(n.projetos).toBe(listarProjetos().length + PECAS.length)
    expect(n.empresas).toBe(SLUGS_EMPRESAS.length)
  })
  it('toda empresa existe em clientes.ts e tem o arquivo de logo', () => {
    for (const slug of SLUGS_EMPRESAS) {
      const e = empresasDiretas.find((x) => x.slug === slug)
      expect(e, slug).toBeDefined()
      expect(e?.logo && existsSync(`public/${e.logo}`), slug).toBeTruthy()
    }
  })
  it('as imagens dos destaques existem em public/', () => {
    for (const d of c.destaques) expect(existsSync(`public/${d.imagem}`), d.imagem).toBe(true)
  })
  // 14/10/2026 (revisão da Task 5): no PC a mesma tela aparecia duas vezes (vitrine e 1º cartão; protótipo e 2º).
  it('nenhuma tela se repete na home (vitrine, protótipo e destaques)', () => {
    const telas = [c.vitrine.imagem, c.prototipo.imagem, ...c.destaques.map((d) => d.imagem)]
    expect(new Set(telas).size).toBe(telas.length)
    for (const t of telas) expect(existsSync(`public/${t}`), t).toBe(true)
  })
  it('a legenda da vitrine não repete o detalhe de um cartão', () => {
    const legenda = c.vitrine.legenda.replace(/\.$/, '').toLowerCase()
    for (const d of c.destaques) expect(d.detalhe.toLowerCase()).not.toContain(legenda)
  })
  // Task 10 (decisão do controlador): a retenção do pagamento só vale no 99Freelas; a garantia não a promete.
  it('a garantia não promete retenção de pagamento; a frase da plataforma nomeia o 99Freelas', () => {
    expect(c.garantia).not.toMatch(/retid|plataforma/i)
    expect(c.garantiaPlataforma).toMatch(/^No 99Freelas,/)
  })
  // Task 10: o destaque do AprovaOS dizia "ordem de serviço"; o projeto é plano de estudo (casos.ts).
  it('o destaque do AprovaOS fala do que o projeto é', () => {
    const d = c.destaques.find((x) => x.slug === 'aprovaos')
    expect(JSON.stringify(d).toLowerCase()).not.toMatch(/ordem de servi/)
    expect(JSON.stringify(d).toLowerCase()).toMatch(/estudo|concurseiro|aluno/)
  })
  it('as peças têm uma linha própria cada', () => {
    expect(new Set(PECAS.map((x) => x.resumo)).size).toBe(PECAS.length)
  })
  it('nenhum dois-pontos nem travessão no texto da home (humanizer)', () => {
    const visivel = [c.promessa.titulo, c.promessa.subtitulo, c.vitrine.legenda, c.prototipo.titulo, c.prototipo.texto,
      ...c.destaques.flatMap((d) => [d.dor, d.detalhe]), ...c.passos.flatMap((x) => [x.titulo, x.texto]), c.garantia,
      c.garantiaPlataforma, ...c.quemSou.texto, c.chamada.titulo]
    for (const t of visivel) expect(t, t).not.toMatch(/[:—–]/)
  })
  it('nenhum destaque cita nome do material original das peças', () => {
    expect(tudo.toLowerCase()).not.toMatch(/terceira|fdt/)
    expect(encontrarTermosProibidos(tudo)).toEqual([])
  })
  // 15/10/2026 (revisor de detalhes): as empresas da home e de #/projetos vêm de uma fonte só.
  it('as empresas da home são as da fonte única ONDE_TRABALHEI', () => expect([...SLUGS_EMPRESAS]).toEqual([...ONDE_TRABALHEI]))
  // 15/10/2026: cada exemplo navegável existe, aparece em /trabalhos/ com o mesmo nome e tem miniatura; e /trabalhos/
  // não tem cartão que não esteja em PECAS (a 3ª peça volta acrescentando os dois lados).
  it('as peças de PECAS e os cartões de /trabalhos/ são os mesmos, com página, miniatura e nome', () => {
    const pagina = readFileSync('public/trabalhos/index.html', 'utf8')
    const cartoes = [...pagina.matchAll(/<article class="cartao rv" id="([^"]+)"/g)].map((m) => m[1])
    expect(cartoes).toEqual(PECAS.map((p) => p.slug))
    for (const p of PECAS) {
      expect(existsSync(`public/${p.href}index.html`), p.href).toBe(true)
      expect(existsSync(`public/${p.imagem}`), p.imagem).toBe(true)
      expect(pagina, p.slug).toContain(`href="/${p.href}"`)
      expect(pagina, p.nome).toContain(`<h2>${p.nome}</h2>`)
    }
  })
  // 15/10/2026: com FOTO_PRONTA ligada, os 6 arquivos da foto têm de existir (senão o quadro fica vazio).
  it('foto ligada só com os 6 arquivos no lugar', () => {
    if (!FOTO_PRONTA) return
    for (const l of FOTO_LARGURAS) for (const ext of ['avif', 'webp', 'jpg'])
      expect(existsSync(`public/${FOTO_BASE}-${l}.${ext}`), `${l}.${ext}`).toBe(true)
  })
  // 15/10/2026 (revisor, rodada 2, B1): o print de "Este site" mostrava "20 projetos" com o site dizendo 19.
  it('o print de "Este site" mostra a mesma contagem de projetos da home', () =>
    expect(PROJETOS_NO_PRINT_ESTE_SITE).toBe(numerosDeProva().projetos))
  // 15/10/2026 (decisão dele): onde o site fala do trabalho na Serasa, aparece que foi pela NTT DATA.
  it('a Serasa Experian aparece com "pela NTT DATA" no papel e no `via`', () => {
    const e = empresasDiretas.find((x) => x.slug === 'serasa-experian')
    expect(e?.via).toBe('NTT DATA')
    expect(e?.papel).toMatch(/pela NTT DATA/)
  })
})

// 21/10/2026 (pedido dele): Sicoob, Serasa Experian e Contabilizei em destaque no topo e o currículo no site.
describe('marcas e trajetória na home', () => {
  it('o título da promessa cita as três marcas, cada uma marcada à mão', () => {
    for (const m of ['Sicoob', 'Serasa Experian', 'Contabilizei']) {
      expect(c.promessa.titulo).toContain(m)
      expect(FRASES_MARCADAS.promessa).toContain(m)
    }
  })
  it('a faixa do topo tem as três empresas, todas com logo em public/', () => {
    expect([...MARCAS_TOPO]).toEqual(['sicoob', 'serasa-experian', 'contabilizei'])
    for (const slug of MARCAS_TOPO) {
      const e = empresasDiretas.find((x) => x.slug === slug)
      expect(e?.logo && existsSync(`public/${e.logo}`), slug).toBeTruthy()
    }
  })
  it('todo emprego do bloco tem período vindo da trajetória (a Wiv é freelance)', () => {
    for (const slug of SLUGS_EMPRESAS.filter((s) => s !== 'wiv')) expect(periodoDe(slug), slug).toMatch(/\d{4}/)
    expect(periodoDe('wiv')).toBe('Projetos freelance')
  })
  it('o bloco leva ao currículo em PDF, que existe em public/', () => {
    expect(c.empresas.curriculo.href).toBe(CURRICULO_PDF)
    expect(existsSync(`public/${CURRICULO_PDF}`)).toBe(true)
  })
})
