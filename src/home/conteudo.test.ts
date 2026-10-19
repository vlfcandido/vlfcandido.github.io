// src/home/conteudo.test.ts
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { ONDE_TRABALHEI, empresasDiretas } from '../clientes'
import { encontrarTermosProibidos } from '../lib/termos-proibidos'
import { PROJETOS_NO_PRINT_ESTE_SITE, listarProjetos } from '../projetos'
import { FOTO_BASE, FOTO_LARGURAS, FOTO_PRONTA, PECAS, SLUGS_EMPRESAS, conteudoHome, numerosDeProva } from './conteudo'
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
    const visivel = [c.promessa.titulo, c.promessa.subtitulo, c.prototipo.titulo, c.prototipo.texto,
      ...c.destaques.flatMap((d) => [d.dor, d.detalhe]), ...c.passos.flatMap((x) => [x.titulo, x.texto]), c.garantia,
      c.garantiaPlataforma, ...c.quemSou.texto, c.chamada.titulo, c.experimente.lede,
      c.ia.rotulo, c.ia.titulo, c.ia.lede, c.ia.exemplo.rotulo, c.ia.exemplo.titulo, c.ia.exemplo.texto,
      ...c.ia.frentes.flatMap((f) => [f.titulo, f.texto]), ...c.ia.provas.flatMap((p) => [p.nome, p.texto]),
      c.trabalhos.titulo, c.trabalhos.lede, ...c.trabalhos.categorias.map((x) => x.rotulo), ...doAgente]
    // O horário (02:14) é o único dois-pontos permitido: some antes da checagem.
    for (const t of visivel) expect(t.replace(/\b\d{2}:\d{2}\b/g, ''), t).not.toMatch(/[:—–]/)
  })
  // 18/10/2026 (brief do dono): a home abre pela especialidade de IA e agentes, com prova e sem superlativo.
  it('a abertura traz o cargo no Sicoob, os 80 chatbots e o Claude', () => {
    expect(c.promessa.subtitulo).toMatch(/setor de IA do Sicoob/)
    expect(c.promessa.subtitulo).toMatch(/80 chatbots/)
    expect(c.promessa.subtitulo).toMatch(/Claude/)
    expect(c.promessa.subtitulo).toMatch(/Site e sistema/)
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
