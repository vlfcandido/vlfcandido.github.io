// src/home/conteudo.test.ts
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { ONDE_TRABALHEI, empresasDiretas } from '../clientes'
import { encontrarTermosProibidos } from '../lib/termos-proibidos'
import { PROJETOS_NO_PRINT_ESTE_SITE, listarProjetos } from '../projetos'
import { CURRICULO_PDF, FOTO_BASE, FOTO_LARGURAS, FOTO_PRONTA, FRASES_MARCADAS, MARCAS_TOPO, PECAS, SLUGS_EMPRESAS, conteudoHome, numerosDeProva, periodoDe } from './conteudo'
import { AGENTE, RAMOS } from './lib/agente'

const c = conteudoHome()
const tudo = JSON.stringify(c)
const tudoVisivel = tudo + JSON.stringify(AGENTE) + JSON.stringify(RAMOS)

describe('conteúdo da home', () => {
  it('tem exatamente 3 destaques, cada um com dor e detalhe', () => {
    expect(c.destaques).toHaveLength(3)
    for (const d of c.destaques) {
      expect(d.dor.length).toBeGreaterThan(10)
      expect(d.detalhe.length).toBeGreaterThan(10)
    }
  })
  // 19/10/2026 (brief do celular): o bloco de oferta saiu do hero. A home inteira fica sem preço, para não
  // ancorar a conversa antes do escopo. Os valores que aparecem na conversa de demonstração são os do serviço,
  // cobertos por agente.test.ts; os da oferta (590/149 e 990/199) não existem em lugar nenhum.
  it('a oferta não tem preço na home nem no hero', () => {
    expect(tudo).not.toMatch(/R\$\s?\d/)
    expect(JSON.stringify(AGENTE)).not.toMatch(/R\$\s?\d/)
    expect(JSON.stringify(AGENTE)).not.toMatch(/590|990|149|199/)
  })
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(tudoVisivel)).toEqual([]))
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
  // 18/10/2026: o hero deixou de ter captura. A tela do Pelo Solto aparece uma vez na seção de IA (detalhe) e uma
  // vez na vitrine (capa), em arquivos diferentes. O teste guarda as duas pontas.
  it('nenhuma tela se repete na home (IA, protótipo morto e destaques)', () => {
    const telas = [c.ia.exemplo.imagem, c.prototipo.imagem, ...c.destaques.map((d) => d.imagem)]
    expect(new Set(telas).size).toBe(telas.length)
    for (const t of telas) expect(existsSync(`public/${t}`), t).toBe(true)
  })
  it('o hero não guarda mais a captura do painel', () => expect(c).not.toHaveProperty('vitrine'))
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
    const doAgente = [
      AGENTE.rotulo, AGENTE.titulo, AGENTE.texto, AGENTE.painelTitulo,
      AGENTE.chamadaRamo, AGENTE.contadorSingular, AGENTE.contadorPlural,
      AGENTE.demonstracao, AGENTE.cta, AGENTE.peca, AGENTE.aoVivo,
      ...RAMOS.flatMap((r) => [
        r.rotulo, r.negocio, r.descricao, r.foraDoHorario, r.mensagemWhatsapp,
        ...r.eventos.flatMap((e) => (e.tipo === 'acao' ? [e.rotulo, e.detalhe, e.hora] : [e.texto, e.hora])),
      ]),
    ]
    const visivel = [c.promessa.titulo, c.promessa.subtitulo, c.animacao.titulo, c.animacao.legenda, c.prototipo.titulo, c.prototipo.texto,
      ...c.destaques.flatMap((d) => [d.dor, d.detalhe]), ...c.passos.flatMap((x) => [x.titulo, x.texto]), c.garantia,
      c.garantiaPlataforma, ...c.quemSou.texto, c.chamada.titulo, c.experimente.lede,
      c.ia.rotulo, c.ia.titulo, c.ia.lede, c.ia.exemplo.rotulo, c.ia.exemplo.titulo, c.ia.exemplo.texto,
      ...c.ia.frentes.flatMap((f) => [f.titulo, f.texto]), ...c.ia.provas.flatMap((p) => [p.nome, p.texto]),
      c.trabalhos.titulo, c.trabalhos.lede, ...c.trabalhos.categorias.map((x) => x.rotulo), ...doAgente]
    // O horário (02:14) é o único dois-pontos permitido: some antes da checagem.
    for (const t of visivel) expect(t.replace(/\b\d{2}:\d{2}\b/g, ''), t).not.toMatch(/[:—–]/)
  })
  // 22/10/2026 (merge com o main de 18 e 19/10, decisão dele): o topo segue com as 3 marcas e o site do café; a
  // seção de IA e agentes, logo abaixo, guarda o cargo no Sicoob, os 80 chatbots e o Claude. Antes, este teste
  // pedia tudo isso no subtítulo do topo ("IA aplicada e agentes que não inventam resposta.").
  it('a abertura nomeia as três marcas, sem superlativo', () => {
    for (const m of ['Sicoob', 'Serasa Experian', 'Contabilizei']) expect(c.promessa.titulo).toContain(m)
    expect(JSON.stringify(c.promessa)).not.toMatch(/maior|melhor do país/i)
  })
  it('a seção de IA e agentes tem o Pelo Solto como exemplo principal e quatro provas reais', () => {
    expect(c.ia.exemplo.href).toContain('pet-shop-whatsapp-ia-exemplo')
    expect(c.ia.exemplo.cta).toBe('Ver o exemplo funcionando')
    expect(c.ia.frentes).toHaveLength(4)
    expect(c.ia.provas).toHaveLength(4)
    expect(c.ia.provas.map((p) => p.nome)).toContain('Sicoob')
  })
  it('o Pelo Solto é a primeira peça da vitrine e da página de trabalhos', () => {
    expect(PECAS[0].slug).toBe('pet-shop-whatsapp-ia-exemplo')
    expect(PECAS[0].categoria).toBe('Atendimento com IA')
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

// 21/10/2026 (pedido dele): no lugar do print grande, uma animação só (sem abas): o site se monta e atende no WhatsApp.
describe('animação do topo', () => {
  const a = c.animacao
  it('é uma cena só, sem abas', () => expect('cenas' in a).toBe(false))
  it('monta um site fictício completo (menu, título, 2 botões e 3 cartões)', () => {
    expect(a.site.menu.length).toBeGreaterThanOrEqual(2)
    expect(a.site.titulo.length).toBeGreaterThan(10)
    expect(a.site.botoes).toHaveLength(2)
    expect(a.site.cartoes).toHaveLength(3)
  })
  it('a conversa alterna cliente e loja, e quem responde é o agente', () => {
    expect(a.site.conversa.map((m) => m.de)).toEqual(['cliente', 'loja', 'cliente', 'loja'])
    expect(a.site.agente).toMatch(/agente/i)
  })
  it('toda peça do site tem o que mostrar ao ser inspecionada', () => {
    for (const area of ['menu', 'aberto', 'titulo', 'texto', 'botoes', 'prova', 'celular', 'c1', 'c2', 'c3'] as const) {
      expect(a.inspecao[area].codigo, area).toMatch(/^<.+\/>$/)
      expect(a.inspecao[area].teste.length, area).toBeGreaterThan(10)
    }
  })
  it('o contador de pedidos sobe um', () => expect(a.site.pedidos.depois).toBe(a.site.pedidos.antes + 1))
  it('a legenda é frase de gente (sem dois-pontos nem travessão)', () => expect(a.legenda).not.toMatch(/[:—–]/))
})
