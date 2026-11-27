// src/home/conteudo.test.ts
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { ONDE_TRABALHEI, empresasDiretas } from '../clientes'
import { encontrarTermosProibidos } from '../lib/termos-proibidos'
import { listarProjetos } from '../projetos'
import { links } from '../conteudo'
import { montarCurriculoHtml } from '../curriculo'
import { ANOS_DE_SOFTWARE } from '../trajetoria'
import { CURRICULO_PDF, DEMANDAS, DEPOIMENTOS, FOTO_BASE, FOTO_LARGURAS, FOTO_PRONTA, FRASES_MARCADAS, MARCAS_TOPO, PECAS, PERFIL_99, PROVA_99, SLUGS_EMPRESAS, conteudoHome, destinoDaDemanda, numerosDeProva, periodoDe, rotuloDaDemanda } from './conteudo'
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
    // 26/11/2026: 14 anos (dono, 26/10/2026: "nunca 13"), lidos da fonte única. Antes: toBe(13).
    expect(n.anos).toBe(14)
    expect(n.anos).toBe(ANOS_DE_SOFTWARE)
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
    // 26/11/2026: entram a credencial (no lugar do subtítulo), a prova do 99Freelas, o mural e o bloco de
    // depoimentos. As frases dos clientes ficam de fora: são cópia do perfil público e não se reescreve.
    const visivel = [c.promessa.titulo, c.promessa.credencial, ...c.promessa.prova.flatMap((x) => [x.valor, x.rotulo]),
      c.mural.titulo, c.mural.lede.toque, c.mural.lede.clique,
      ...DEMANDAS.flatMap((d) => [...d.titulo, d.frase, d.destino]),
      c.depoimentos.titulo, c.depoimentos.nota, c.depoimentos.link, c.depoimentos.origem,
      ...DEPOIMENTOS.flatMap((d) => [d.projeto, d.quando]), c.animacao.titulo, c.animacao.legenda, c.prototipo.titulo, c.prototipo.texto,
      ...c.destaques.flatMap((d) => [d.dor, d.detalhe]), ...c.passos.flatMap((x) => [x.titulo, x.texto]), c.garantia,
      c.garantiaPlataforma, ...c.quemSou.texto, c.chamada.titulo, c.experimente.lede,
      c.ia.rotulo, c.ia.titulo, c.ia.lede, c.ia.exemplo.rotulo, c.ia.exemplo.titulo, c.ia.exemplo.texto,
      ...c.ia.frentes.flatMap((f) => [f.titulo, f.texto]), ...c.ia.provas.flatMap((p) => [p.nome, p.texto]),
      c.trabalhos.titulo, c.trabalhos.lede, ...c.trabalhos.categorias.map((x) => x.rotulo),
      // 23/10/2026 (correção 1, review): o bloco de lojas virtuais entra na regra de escrita como qualquer outro.
      // 23/10/2026 (home "muito gigante"): a linha de serviços saiu com a mesa de diagnóstico; entram o funil, os
      // números, a origem e o alto ticket.
      c.lojas.titulo, c.lojas.texto, c.lojas.funilRotulo, ...c.lojas.funil, c.lojas.numeros, c.lojas.origem,
      c.lojas.altoTicket, c.lojas.cta, ...doAgente]
    // O horário (02:14) é o único dois-pontos permitido: some antes da checagem.
    for (const t of visivel) expect(t.replace(/\b\d{2}:\d{2}\b/g, ''), t).not.toMatch(/[:—–]/)
  })
  // 22/10/2026 (merge com o main de 18 e 19/10, decisão dele): o topo segue com as 3 marcas e o site do café; a
  // seção de IA e agentes, logo abaixo, guarda o cargo no Sicoob, os 80 chatbots e o Claude. Antes, este teste
  // pedia tudo isso no subtítulo do topo ("IA aplicada e agentes que não inventam resposta.").
  // 26/11/2026 (home por demanda): as marcas saíram do título e estão na linha de credencial, logo abaixo dele.
  it('a abertura nomeia as três marcas, sem superlativo', () => {
    for (const m of ['Sicoob', 'Serasa Experian', 'Contabilizei']) expect(c.promessa.credencial).toContain(m)
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
    // 26/11/2026: a categoria é o título da capa do mural. Antes: 'Atendimento com IA'.
    expect(PECAS[0].categoria).toBe('IA no WhatsApp')
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
  // 26/11/2026: saiu o caso "o print de 'Este site' mostra a mesma contagem de projetos da home". A abertura não
  // mostra mais a contagem (a faixa virou a prova do 99Freelas) e o print foi recapturado da home nova.
  // 15/10/2026 (decisão dele): onde o site fala do trabalho na Serasa, aparece que foi pela NTT DATA.
  it('a Serasa Experian aparece com "pela NTT DATA" no papel e no `via`', () => {
    const e = empresasDiretas.find((x) => x.slug === 'serasa-experian')
    expect(e?.via).toBe('NTT DATA')
    expect(e?.papel).toMatch(/pela NTT DATA/)
  })
})

// 21/10/2026 (pedido dele): Sicoob, Serasa Experian e Contabilizei em destaque no topo e o currículo no site.
describe('marcas e trajetória na home', () => {
  // 26/11/2026: antes as três estavam no título; agora ficam na credencial, com a mesma marcação à mão.
  it('a credencial da abertura cita as três marcas, cada uma marcada à mão', () => {
    for (const m of ['Sicoob', 'Serasa Experian', 'Contabilizei']) {
      expect(c.promessa.credencial).toContain(m)
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

// 26/11/2026 (home por demanda): a abertura fala do que o cliente procura, a prova é a do 99Freelas, o mural leva
// cada demanda à peça que a prova e os depoimentos entram sem nome de pessoa nem de empresa.
describe('home por demanda', () => {
  it('o título abre pelo que o cliente procura e a credencial do Sicoob vem logo abaixo', () => {
    for (const palavra of ['Site', 'loja', 'sistema', 'CRM', 'IA']) expect(c.promessa.titulo).toContain(palavra)
    expect(c.promessa.titulo).not.toMatch(/\d/)
    expect(c.promessa.credencial).toMatch(/^Sou engenheiro de IA sênior no Sicoob, onde lidero o time de IA e investimentos\./)
  })
  it('a faixa de prova é a do 99Freelas e os anos de software, sem número solto', () => {
    expect(c.promessa.prova.map((x) => x.valor)).toEqual(['5,0', 'Talent', '14'])
    expect(c.promessa.prova[0].rotulo).toBe('em 11 avaliações no 99Freelas')
    expect(c.promessa.prova[1].rotulo).toBe('selo do 99Freelas, com 12 projetos concluídos')
    expect(c.promessa.prova[2].rotulo).toBe('anos de software')
    // Os dois itens do 99 levam ao perfil público; os anos não têm link.
    expect(c.promessa.prova.map((x) => x.href)).toEqual([PERFIL_99, PERFIL_99, undefined])
  })
  it('o link do perfil no 99Freelas é o mesmo do rodapé', () => {
    expect(PERFIL_99).toBe(links.find((l) => l.rotulo === '99Freelas')?.url)
    expect(PROVA_99.perfil).toBe(PERFIL_99)
  })
  it('são 14 anos de software em todo texto publicado, nunca 13', () => {
    const publicado: Record<string, string> = {
      'home (conteudo.ts)': tudo,
      'currículo gerado': montarCurriculoHtml(),
      'public/curriculo/index.html': readFileSync('public/curriculo/index.html', 'utf8'),
      'public/trabalhos/index.html': readFileSync('public/trabalhos/index.html', 'utf8'),
      'public/trabalhos/plataforma-astrologia-exemplo/index.html': readFileSync('public/trabalhos/plataforma-astrologia-exemplo/index.html', 'utf8'),
      'index.html': readFileSync('index.html', 'utf8'),
    }
    // Só o nome do arquivo na mensagem: o texto inteiro afogava o relatório do teste.
    for (const [onde, texto] of Object.entries(publicado)) expect(/\b13 anos\b/.test(texto), onde).toBe(false)
    expect(c.quemSou.texto[0]).toContain('há 14 anos')
    expect(montarCurriculoHtml()).toContain('14 anos de software')
  })
  // 26/11/2026: o mural passou de cartaz de rua para as capas ilustradas, com o título e a frase de cada capa do 99.
  it('o mural tem as oito capas do 99, na ordem, com o título e a frase de cada uma', () => {
    expect(DEMANDAS.map((d) => [rotuloDaDemanda(d), d.frase])).toEqual([
      ['IA no WhatsApp', 'responde em segundos, 24 horas'],
      ['Integração por API', 'a API erra, a correção fica'],
      ['Agendamento online', 'com pagamento na hora de marcar'],
      ['Catálogo digital', 'pedido pronto no WhatsApp'],
      ['Sistema sob medida', 'adeus, planilha'],
      ['Loja virtual', 'que mede cada venda'],
      ['Carteirinha digital', 'vencida não passa na porta'],
      ['Site institucional', 'rápido no celular, do zero ou no que você já tem'],
    ])
    expect(new Set(DEMANDAS.map((d) => d.id)).size).toBe(8)
  })
  it('os fundos alternam tinta, papel e sol na ordem das capas', () => {
    expect(DEMANDAS.map((d) => d.fundo)).toEqual(['tinta', 'papel', 'sol', 'papel', 'sol', 'papel', 'tinta', 'sol'])
  })
  it('cada capa leva a uma peça que existe, com o mesmo nome na vitrine e em /trabalhos/', () => {
    for (const d of DEMANDAS) {
      const peca = PECAS.find((p) => p.slug === d.peca)
      expect(peca, d.id).toBeDefined()
      expect(peca?.categoria, d.id).toBe(rotuloDaDemanda(d))
      expect(destinoDaDemanda(d), d.id).toBe(peca?.href)
      expect(existsSync(`public/${peca?.href}index.html`), d.id).toBe(true)
      // O leitor de tela ouve para onde a capa leva, com o nome da peça.
      expect(d.destino, d.id).toBe(`Abrir o exemplo ${peca?.nome}`)
    }
  })
  // 26/11/2026 (dono: "faltou um site institucional"): a capa deixou de apontar para a galeria de projetos.
  it('a capa "Site institucional" abre a peça do escritório de contabilidade', () => {
    const site = DEMANDAS.find((d) => d.id === 'site')
    expect(site ? destinoDaDemanda(site) : '').toBe('trabalhos/site-contabilidade-exemplo/')
  })
  it('são dez peças, e a home e /trabalhos/ dizem dez', () => {
    expect(PECAS).toHaveLength(10)
    expect(c.experimente.lede).toMatch(/^Dez projetos de exemplo/)
    expect(c.experimente.verTodas).toBe('Abrir e testar as dez')
    const pagina = readFileSync('public/trabalhos/index.html', 'utf8')
    expect(pagina).toContain('Os dez projetos são exemplos navegáveis')
    expect(pagina).not.toMatch(/\bnove (sites|projetos)\b/i)
  })
  it('a peça do site institucional traz a faixa do portfólio, o aviso de exemplo e nenhum fato sobre o autor', () => {
    const peca = readFileSync('public/trabalhos/site-contabilidade-exemplo/index.html', 'utf8')
    expect(peca).toContain('<div class="byline">Exemplo de Vinicius Candido')
    expect(peca).toContain('Doze Avos Contabilidade é uma marca fictícia. Dados de exemplo.')
    expect(peca).toContain('Escritório de exemplo. Cidade, pessoas, endereço e números são fictícios.')
    expect(peca).toContain('clarity("set","pagina","trabalho-site-contabilidade-exemplo")')
    // A demo fala só da empresa inventada: nada de Sicoob, anos de carreira ou nota do 99.
    expect(peca).not.toMatch(/Sicoob|Serasa|Contabilizei|99Freelas|anos de software/)
    for (const arquivo of ['favicon.svg', 'apple-touch-icon.png', 'og.png'])
      expect(existsSync(`public/trabalhos/site-contabilidade-exemplo/${arquivo}`), arquivo).toBe(true)
  })
  // O dono pediu uma paleta só entre o site e o mural: a letra e as cores de cartaz não voltam.
  it('a Archivo e as cores de cartaz saíram do site e de /trabalhos/', () => {
    expect(existsSync('src/assets/fontes/archivo-latin.woff2')).toBe(false)
    for (const arquivo of ['src/identidade.css', 'src/home/mural.css', 'public/trabalhos/index.html']) {
      const texto = readFileSync(arquivo, 'utf8')
      expect(/font-family:[^;]*Archivo|family=Archivo/.test(texto), arquivo).toBe(false)
      expect(/#2440ff|#ff4a2e|#1fc46b|#ffd21f/i.test(texto), arquivo).toBe(false)
    }
  })
  it('depoimentos: três ou quatro, com tipo do projeto e mês, e o bloco leva a nota do perfil', () => {
    expect(DEPOIMENTOS.length).toBeGreaterThanOrEqual(3)
    expect(DEPOIMENTOS.length).toBeLessThanOrEqual(4)
    for (const d of DEPOIMENTOS) {
      expect(d.frase.length, d.projeto).toBeGreaterThan(40)
      expect(d.projeto.length, d.projeto).toBeGreaterThan(8)
      expect(d.quando, d.projeto).toMatch(/^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\/20\d\d$/)
    }
    expect(new Set(DEPOIMENTOS.map((d) => d.projeto)).size).toBe(DEPOIMENTOS.length)
    expect(c.depoimentos.nota).toBe('5,0 em 11 avaliações')
    expect(c.depoimentos.titulo).toContain('99Freelas')
  })
})

// 26/11/2026: /trabalhos/ é HTML estático e saía do passo da home (menu antigo, rótulos próprios).
describe('/trabalhos/ conversa com a home', () => {
  const pagina = readFileSync('public/trabalhos/index.html', 'utf8')
  it('cada cartão abre pela demanda, com o rótulo da peça em PECAS', () => {
    for (const p of PECAS) {
      const cartao = pagina.slice(pagina.indexOf(`<article class="cartao rv" id="${p.slug}"`))
      const etiqueta = /<span class="demanda">([^<]+)<\/span>\s*<h2>([^<]+)<\/h2>/.exec(cartao)
      expect(etiqueta?.[1], p.slug).toBe(p.categoria)
      expect(etiqueta?.[2], p.slug).toBe(p.nome)
    }
  })
  it('os atalhos do topo levam a cartões que existem, um por peça', () => {
    const nav = pagina.slice(pagina.indexOf('<nav class="wrap atalhos"'), pagina.indexOf('</nav>', pagina.indexOf('<nav class="wrap atalhos"')))
    const atalhos = [...nav.matchAll(/<a href="#([^"]+)">([^<]+)<\/a>/g)].map((m) => [m[1], m[2]])
    expect(atalhos.slice(0, PECAS.length)).toEqual(PECAS.map((p) => [p.slug, p.categoria]))
    for (const [id] of atalhos) expect(pagina, id).toContain(`id="${id}"`)
  })
})
