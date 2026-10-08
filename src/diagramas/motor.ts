// Motor das ilustrações-diagrama da identidade Maré.
// Cada desenho é descrito como dado (etapas, nós, laterais e retornos) e este módulo calcula duas
// composições: "larga" (computador, etapas lado a lado) e "estreita" (celular, etapas empilhadas),
// para que o texto nunca fique minúsculo. A saída é uma string SVG pura, sem dependência de React,
// para servir ao site (cores em variáveis CSS, seguem o tema) e aos READMEs (cores fixas, claro e
// escuro). Nada roda no import: tudo é função.

/** Forma do nó: caixa (componente), pílula (pessoa ou sistema de fora) ou cilindro (fila, banco, cache). */
export type Forma = 'caixa' | 'pilula' | 'cilindro'

/** Um componente do sistema. */
export interface No {
  titulo: string
  sub?: string
  forma?: Forma
  /** Peça central do desenho (o agente, o cérebro): fundo de água rasa e borda de mar. */
  destaque?: boolean
}

/** Nó pendurado numa etapa, fora do fluxo principal (reconciliação, humano, painel). */
export interface Lateral {
  no: No
  /** Frase curta que explica a ligação. */
  rotulo: string
  /** `true` quando a conversa é de mão dupla. */
  duplo?: boolean
}

/** Um passo do fluxo, numerado como uma sondagem de carta náutica. */
export interface Etapa {
  /** O que acontece neste passo, em poucas palavras. */
  legenda: string
  nos: No[]
  /** Rótulo da moldura quando a etapa tem mais de um nó (ex.: "em paralelo"). */
  grupo?: string
  lateral?: Lateral
}

/** Seta que volta no fluxo (ciclo de revisão, confirmação, ordem enviada). */
export interface Retorno {
  /** Índice da etapa de onde sai. */
  de: number
  /** Índice da etapa onde chega. */
  para: number
  rotulo: string
}

/** Um desenho completo. */
export interface Desenho {
  id: string
  /** Título curto, também usado no `<title>` do SVG. */
  titulo: string
  /** Descrição do fluxo inteiro em prosa, para leitor de tela (`<desc>`). */
  descricao: string
  etapas: Etapa[]
  retorno?: Retorno
  /** Etapas por linha na composição larga (padrão: até 4). */
  porLinha?: number
  /** Tecnologias, como etiquetas discretas no rodapé. */
  etiquetas?: string[]
}

/** Cores usadas pelo desenho. No site são `var(--token)`; no README, hex fixo. */
export interface Paleta {
  papelAlto: string
  raso: string
  linha: string
  fundo: string
  fundoSuave: string
  mar: string
  coral: string
  coralTexto: string
}

/** Composição: larga para tela grande, estreita para celular. */
export type Modo = 'largo' | 'estreito'

/** Paleta que segue o tema do site (variáveis de `mare.css`). */
export function paletaDoTema(): Paleta {
  return {
    papelAlto: 'var(--papel-alto)',
    raso: 'var(--raso)',
    linha: 'var(--linha)',
    fundo: 'var(--fundo)',
    fundoSuave: 'var(--fundo-suave)',
    mar: 'var(--mar)',
    coral: 'var(--coral)',
    coralTexto: 'var(--coral-texto)',
  }
}

const SANS = "'Hanken Grotesk', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
const SERIF = "'Brygada 1918', Georgia, 'Times New Roman', serif"

/** Medidas de tipo e espaço, em unidades do viewBox. */
const TIPO = {
  titulo: 17,
  sub: 14.5,
  legenda: 15,
  numero: 21,
  grupo: 14,
  rotulo: 14,
  etiqueta: 13.5,
  lhTitulo: 21,
  lhSub: 19,
  lhLegenda: 19,
  lhRotulo: 18,
}

/** Largura média de um caractere, por tamanho e família (estimativa conservadora). */
const largCar = (tam: number, serif = false) => tam * (serif ? 0.5 : 0.53)

/** Escapa texto para dentro do SVG. */
function esc(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Quebra um texto em linhas que caibam na largura, respeitando `\n` manual.
 *
 * @param texto o texto.
 * @param largura largura disponível em unidades do viewBox.
 * @param tam corpo da fonte.
 * @param serif se a fonte é a serifada.
 * @returns as linhas.
 */
export function quebrar(texto: string, largura: number, tam: number, serif = false): string[] {
  const max = Math.max(6, Math.floor(largura / largCar(tam, serif)))
  const linhas: string[] = []
  for (const paragrafo of texto.split('\n')) {
    let atual = ''
    for (const palavra of paragrafo.split(/\s+/).filter(Boolean)) {
      const tentativa = atual ? `${atual} ${palavra}` : palavra
      if (tentativa.length > max && atual) {
        linhas.push(atual)
        atual = palavra
      } else atual = tentativa
    }
    if (atual) linhas.push(atual)
  }
  return linhas
}

const PAD = 13
const CIL = 7 // altura da tampa do cilindro

/** Altura de um nó numa largura dada. */
function alturaNo(no: No, l: number): number {
  const lt = quebrar(no.titulo, l - 2 * PAD - (no.destaque ? 10 : 0), TIPO.titulo).length
  const ls = no.sub ? quebrar(no.sub, l - 2 * PAD, TIPO.sub).length : 0
  const extra = no.forma === 'cilindro' ? CIL * 2 : 0
  return PAD + lt * TIPO.lhTitulo + (ls ? 4 + ls * TIPO.lhSub : 0) + PAD - 2 + extra
}

/** Linhas de texto (`<text>` com `<tspan>`), alinhadas à esquerda. */
function textoLinhas(linhas: string[], x: number, y: number, lh: number, attrs: string): string {
  // O espaço no fim de cada linha (menos a última) mantém as palavras separadas ao copiar o texto.
  const spans = linhas
    .map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lh}">${esc(l)}${i < linhas.length - 1 ? ' ' : ''}</tspan>`)
    .join('')
  return `<text x="${x}" y="${y}" ${attrs}>${spans}</text>`
}

/** Desenha um nó e devolve o SVG. */
function svgNo(no: No, x: number, y: number, l: number, h: number, p: Paleta): string {
  const borda = no.destaque ? p.mar : p.linha
  const fundo = no.destaque ? p.raso : p.papelAlto
  const lb = no.destaque ? 2 : 1.4
  const partes: string[] = []
  const topo = no.forma === 'cilindro' ? CIL * 2 : 0
  if (no.forma === 'cilindro') {
    const rx = l / 2
    const corpo = `M${x} ${y + CIL}a${rx} ${CIL} 0 0 1 ${l} 0v${h - 2 * CIL}a${rx} ${CIL} 0 0 1 ${-l} 0Z`
    partes.push(`<path d="${corpo}" transform="translate(4 4)" fill="${p.linha}"/>`)
    partes.push(`<path d="${corpo}" fill="${fundo}" stroke="${borda}" stroke-width="${lb}"/>`)
    partes.push(`<path d="M${x} ${y + CIL}a${rx} ${CIL} 0 0 0 ${l} 0" fill="none" stroke="${borda}" stroke-width="${lb}"/>`)
  } else {
    const r = no.forma === 'pilula' ? Math.min(h / 2, 26) : 12
    partes.push(`<rect x="${x + 4}" y="${y + 4}" width="${l}" height="${h}" rx="${r}" fill="${p.linha}"/>`)
    partes.push(`<rect x="${x}" y="${y}" width="${l}" height="${h}" rx="${r}" fill="${fundo}" stroke="${borda}" stroke-width="${lb}"/>`)
  }
  const padX = no.forma === 'pilula' ? PAD + 6 : PAD
  const lt = quebrar(no.titulo, l - 2 * padX - (no.destaque ? 10 : 0), TIPO.titulo)
  let yy = y + topo + PAD + TIPO.titulo - 3
  partes.push(textoLinhas(lt, x + padX, yy, TIPO.lhTitulo, `font-family="${SANS}" font-size="${TIPO.titulo}" font-weight="650" fill="${p.fundo}"`))
  if (no.sub) {
    yy += lt.length * TIPO.lhTitulo + 3
    const ls = quebrar(no.sub, l - 2 * padX, TIPO.sub)
    partes.push(textoLinhas(ls, x + padX, yy, TIPO.lhSub, `font-family="${SANS}" font-size="${TIPO.sub}" fill="${p.fundoSuave}"`))
  }
  if (no.destaque) partes.push(`<circle cx="${x + l - 14}" cy="${y + topo + 15}" r="4.5" fill="${p.coral}"/>`)
  return partes.join('')
}

/** Caixa calculada de um elemento. */
interface Caixa {
  x: number
  y: number
  l: number
  h: number
}

/** Uma etapa já posicionada. */
interface EtapaPos {
  cab: Caixa // cabeçalho (número + legenda)
  el: Caixa // nó ou moldura do grupo
  lat?: { caixa: Caixa; ligacao: Caixa }
  svg: string
}

const GRUPO_PAD = 10
const GRUPO_TOPO = 26
const GAP_LATERAL = 46

/** Altura do elemento principal (nó único ou grupo) numa largura. */
function alturaElemento(e: Etapa, l: number): number {
  if (e.nos.length === 1) return alturaNo(e.nos[0], l)
  const li = l - 2 * GRUPO_PAD
  return GRUPO_TOPO + e.nos.reduce((s, n) => s + alturaNo(n, li), 0) + (e.nos.length - 1) * 10 + GRUPO_PAD + 4
}

/** Desenha o elemento principal da etapa (nó ou grupo com moldura). */
function svgElemento(e: Etapa, c: Caixa, p: Paleta): string {
  if (e.nos.length === 1) return svgNo(e.nos[0], c.x, c.y, c.l, c.h, p)
  const partes = [
    `<rect x="${c.x}" y="${c.y}" width="${c.l}" height="${c.h}" rx="16" fill="${p.raso}" stroke="${p.linha}" stroke-width="1.2" stroke-dasharray="2 5" stroke-linecap="round"/>`,
  ]
  if (e.grupo)
    partes.push(
      `<text x="${c.x + GRUPO_PAD + 2}" y="${c.y + 18}" font-family="${SERIF}" font-style="italic" font-size="${TIPO.grupo}" fill="${p.fundoSuave}">${esc(e.grupo)}</text>`,
    )
  let y = c.y + GRUPO_TOPO
  const li = c.l - 2 * GRUPO_PAD
  for (const n of e.nos) {
    const h = alturaNo(n, li)
    partes.push(svgNo(n, c.x + GRUPO_PAD, y, li - 4, h, p))
    y += h + 10
  }
  return partes.join('')
}

/** Cabeçalho da etapa: número em itálico (sondagem) e a legenda. */
function cabecalho(i: number, legenda: string, x: number, y: number, l: number, p: Paleta): { svg: string; h: number } {
  const recuo = 26
  const ls = quebrar(legenda, l - recuo, TIPO.legenda, true)
  const svg =
    `<text x="${x}" y="${y + 17}" font-family="${SERIF}" font-style="italic" font-size="${TIPO.numero}" font-weight="600" fill="${p.coralTexto}">${i + 1}</text>` +
    textoLinhas(ls, x + recuo, y + 16, TIPO.lhLegenda, `font-family="${SERIF}" font-style="italic" font-size="${TIPO.legenda}" fill="${p.fundoSuave}"`)
  return { svg, h: 8 + ls.length * TIPO.lhLegenda }
}

/** Seta (caminho) com ponta; `coral` para retorno, `duplo` para mão dupla. */
function seta(d: string, ids: { mar: string; coral: string }, p: Paleta, opc: { coral?: boolean; duplo?: boolean } = {}): string {
  const cor = opc.coral ? p.coral : p.mar
  const m = opc.coral ? ids.coral : ids.mar
  const tracejado = opc.coral ? ' stroke-dasharray="6 6"' : ''
  return `<path d="${d}" fill="none" stroke="${cor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${tracejado} marker-end="url(#${m})"${opc.duplo ? ` marker-start="url(#${m})"` : ''}/>`
}

/** Etiquetas de tecnologia em linha, com quebra. Devolve o SVG e a altura usada. */
function etiquetas(tags: string[], x: number, y: number, largura: number, p: Paleta): { svg: string; h: number } {
  const partes: string[] = []
  let cx = x
  let cy = y
  const alt = 26
  for (const t of tags) {
    const l = t.length * largCar(TIPO.etiqueta) + 22
    if (cx + l > x + largura && cx > x) {
      cx = x
      cy += alt + 8
    }
    partes.push(
      `<rect x="${cx}" y="${cy}" width="${l}" height="${alt}" rx="${alt / 2}" fill="none" stroke="${p.linha}" stroke-width="1.2"/>` +
        `<text x="${cx + 11}" y="${cy + 17.5}" font-family="${SANS}" font-size="${TIPO.etiqueta}" font-weight="600" fill="${p.fundoSuave}">${esc(t)}</text>`,
    )
    cx += l + 8
  }
  return { svg: partes.join(''), h: cy - y + alt }
}

/** Isóbatas: três curvas de profundidade num canto. Decorativo e discreto. */
function isobatas(cx: number, cy: number, escala: number, p: Paleta): string {
  const curvas = [1, 0.68, 0.38].map((k) => {
    const r = 120 * k * escala
    return `<path d="M${cx - r} ${cy}C${cx - r} ${cy - r * 0.7} ${cx - r * 0.35} ${cy - r * 0.95} ${cx + r * 0.1} ${cy - r * 0.9}C${cx + r * 0.6} ${cy - r * 0.85} ${cx + r} ${cy - r * 0.45} ${cx + r} ${cy}" fill="none" stroke="${p.linha}" stroke-width="1.2" opacity="0.8"/>`
  })
  return (
    // Antes havia aqui uma sondagem de profundidade ("18") em texto: ao copiar ou ler o desenho
    // aparecia um número solto no meio das etapas. Ficaram só as curvas.
    `<g aria-hidden="true">${curvas.join('')}</g>`
  )
}

/** Resultado de uma composição. */
export interface Composicao {
  largura: number
  altura: number
  svg: string
}

/** Composição larga: etapas lado a lado, quebrando em linhas de `porLinha`. */
function comporLargo(d: Desenho, p: Paleta, ids: { mar: string; coral: string }): Composicao {
  const W = 960
  const n = d.etapas.length
  const k = Math.min(d.porLinha ?? 4, n)
  const volta = d.retorno && d.retorno.de === n - 1 && d.retorno.para === 0
  const M = volta || n > k ? 46 : 26
  const G = 56
  const col = (W - 2 * M - (k - 1) * G) / k
  const partes: string[] = []
  const pos: EtapaPos[] = []
  let topo = 22
  const linhas: number[][] = []
  for (let i = 0; i < n; i += k) linhas.push(d.etapas.slice(i, i + k).map((_, j) => i + j))
  const rodapeLinha: number[] = []
  for (const lin of linhas) {
    const cabs = lin.map((i, j) => cabecalho(i, d.etapas[i].legenda, M + j * (col + G), topo, col, p))
    const hCab = Math.max(...cabs.map((c) => c.h))
    const hEl = lin.map((i) => alturaElemento(d.etapas[i], col))
    const yEl = topo + hCab + 6
    let fundoLinha = yEl + Math.max(...hEl)
    lin.forEach((i, j) => {
      const x = M + j * (col + G)
      const e = d.etapas[i]
      const el = { x, y: yEl, l: col, h: hEl[j] }
      let svg = cabs[j].svg + svgElemento(e, el, p)
      let lat: EtapaPos['lat']
      if (e.lateral) {
        const yl = el.y + el.h + GAP_LATERAL + 4
        const hl = alturaNo(e.lateral.no, col)
        const lx = x + 30
        svg += seta(`M${lx} ${el.y + el.h + 8}V${yl - 6}`, ids, p, { duplo: e.lateral.duplo })
        const lr = quebrar(e.lateral.rotulo, col - 44, TIPO.rotulo, true)
        svg += textoLinhas(lr, lx + 12, el.y + el.h + 8 + (GAP_LATERAL - lr.length * TIPO.lhRotulo) / 2 + 13, TIPO.lhRotulo, `font-family="${SERIF}" font-style="italic" font-size="${TIPO.rotulo}" fill="${p.fundoSuave}"`)
        svg += svgNo(e.lateral.no, x, yl, col, hl, p)
        lat = { caixa: { x, y: yl, l: col, h: hl }, ligacao: { x: lx, y: el.y + el.h, l: 0, h: GAP_LATERAL } }
        fundoLinha = Math.max(fundoLinha, yl + hl)
      }
      pos[i] = { cab: { x, y: topo, l: col, h: hCab }, el, lat, svg }
    })
    // Ciclo dentro desta linha: reserva o vão de baixo para a seta e o rótulo.
    if (d.retorno && !volta && lin.includes(d.retorno.de)) fundoLinha += 52
    rodapeLinha.push(fundoLinha)
    topo = fundoLinha + 58
  }
  pos.forEach((ps) => partes.push(ps.svg))

  // Setas do fluxo principal.
  const linhaDe = (i: number) => Math.floor(i / k)
  for (let i = 0; i < n - 1; i++) {
    const a = pos[i].el
    const b = pos[i + 1].el
    const ya = a.y + Math.min(a.h / 2, 40)
    const yb = b.y + Math.min(b.h / 2, 40)
    if (linhaDe(i) === linhaDe(i + 1)) {
      const x1 = a.x + a.l + 8
      const x2 = b.x - 8
      const meio = (x1 + x2) / 2
      partes.push(seta(`M${x1} ${ya}C${meio} ${ya} ${meio} ${yb} ${x2} ${yb}`, ids, p))
    } else {
      // Volta de linha, como numa página: desce pelo vão entre as linhas e entra pela esquerda.
      const yv = rodapeLinha[linhaDe(i)] + 29
      const xd = W - M + 18
      const xe = M - 18
      partes.push(
        seta(`M${a.x + a.l + 8} ${ya}H${xd - 10}Q${xd} ${ya} ${xd} ${ya + 10}V${yv - 10}Q${xd} ${yv} ${xd - 10} ${yv}H${xe + 10}Q${xe} ${yv} ${xe} ${yv + 10}V${yb - 10}Q${xe} ${yb} ${xe + 10} ${yb}H${b.x - 8}`, ids, p),
      )
    }
  }

  let altura = rodapeLinha[rodapeLinha.length - 1]
  if (d.retorno) {
    const r = d.retorno
    const a = pos[r.de].el
    const b = pos[r.para].el
    if (volta) {
      const yv = altura + 30
      const xd = W - M / 2 + 4
      const xe = M / 2 - 4
      const ya = a.y + Math.min(a.h / 2, 40)
      const yb = b.y + Math.min(b.h / 2, 40) + 14
      partes.push(
        seta(`M${a.x + a.l + 8} ${ya}H${xd - 10}Q${xd} ${ya} ${xd} ${ya + 10}V${yv - 10}Q${xd} ${yv} ${xd - 10} ${yv}H${xe + 10}Q${xe} ${yv} ${xe} ${yv - 10}V${yb + 10}Q${xe} ${yb} ${xe + 10} ${yb}H${b.x - 8}`, ids, p, { coral: true }),
      )
      partes.push(`<text x="${W / 2}" y="${yv + 24}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${TIPO.rotulo + 0.5}" fill="${p.coralTexto}">${esc(r.rotulo)}</text>`)
      altura = yv + 34
    } else {
      // Ciclo dentro da mesma linha: passa por baixo das etapas.
      const fundoEl = Math.max(...d.etapas.map((_, i) => i).filter((i) => linhaDe(i) === linhaDe(r.de)).map((i) => pos[i].el.y + pos[i].el.h))
      const yv = fundoEl + 30
      const xa = a.x + a.l / 2
      const xb = b.x + b.l / 2
      partes.push(seta(`M${xa} ${a.y + a.h + 8}V${yv - 10}Q${xa} ${yv} ${xa - 10} ${yv}H${xb + 10}Q${xb} ${yv} ${xb} ${yv - 10}V${b.y + b.h + 8}`, ids, p, { coral: true }))
      partes.push(`<text x="${(xa + xb) / 2}" y="${yv + 22}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${TIPO.rotulo + 0.5}" fill="${p.coralTexto}">${esc(r.rotulo)}</text>`)
      altura = Math.max(altura, yv + 30)
    }
  }
  if (d.etiquetas?.length) {
    const t = etiquetas(d.etiquetas, M, altura + 26, W - 2 * M - 160, p)
    partes.push(t.svg)
    altura += 26 + t.h
  }
  altura += 22
  partes.unshift(isobatas(W - 70, altura + 10, 1, p))
  return { largura: W, altura, svg: partes.join('') }
}

/** Composição estreita: uma etapa embaixo da outra, fluxo descendo pela esquerda. */
function comporEstreito(d: Desenho, p: Paleta, ids: { mar: string; coral: string }): Composicao {
  const W = 340
  const n = d.etapas.length
  const volta = d.retorno && d.retorno.de === n - 1 && d.retorno.para === 0
  const ciclo = d.retorno && !volta
  const X = volta ? 30 : 14
  const L = W - X - (ciclo ? 26 : 10)
  const fluxoX = X + 24
  const partes: string[] = []
  const pos: EtapaPos[] = []
  let y = 18
  const rotCiclo = ciclo && d.retorno ? quebrar(d.retorno.rotulo, L - 60, TIPO.rotulo, true) : []
  let yRotulo = 0
  for (let i = 0; i < n; i++) {
    const e = d.etapas[i]
    if (ciclo && d.retorno && i === d.retorno.para + 1) {
      // Vão próprio para o rótulo do ciclo, entre a etapa de destino e a seguinte.
      yRotulo = y + 4
      y += rotCiclo.length * TIPO.lhRotulo + 6
    }
    const cab = cabecalho(i, e.legenda, fluxoX + 12, y, L - (fluxoX - X) - 12, p)
    const el = { x: X, y: y + cab.h + 6, l: L, h: alturaElemento(e, L) }
    let svg = cab.svg + svgElemento(e, el, p)
    let fim = el.y + el.h
    if (e.lateral) {
      const lx0 = X + 52
      const ll = L - 52
      const yl = fim + GAP_LATERAL + 4
      const hl = alturaNo(e.lateral.no, ll)
      const sx = lx0 + 26
      svg += seta(`M${sx} ${fim + 8}V${yl - 6}`, ids, p, { duplo: e.lateral.duplo })
      const lr = quebrar(e.lateral.rotulo, ll - 40, TIPO.rotulo, true)
      svg += textoLinhas(lr, sx + 12, fim + 8 + (GAP_LATERAL - lr.length * TIPO.lhRotulo) / 2 + 13, TIPO.lhRotulo, `font-family="${SERIF}" font-style="italic" font-size="${TIPO.rotulo}" fill="${p.fundoSuave}"`)
      svg += svgNo(e.lateral.no, lx0, yl, ll, hl, p)
      fim = yl + hl
    }
    pos[i] = { cab: { x: X, y, l: L, h: cab.h }, el, svg }
    partes.push(svg)
    y = fim + 30
  }
  for (let i = 0; i < n - 1; i++) {
    const a = pos[i].el
    const b = pos[i + 1].el
    partes.push(seta(`M${fluxoX} ${a.y + a.h + 8}V${b.y - 8}`, ids, p))
  }
  let altura = y - 30
  if (d.retorno) {
    const r = d.retorno
    const a = pos[r.de].el
    const b = pos[r.para].el
    if (volta) {
      const yv = altura + 26
      const xe = 12
      const yb = b.y + Math.min(b.h / 2, 36)
      partes.push(seta(`M${fluxoX} ${a.y + a.h + 8}V${yv - 10}Q${fluxoX} ${yv} ${fluxoX - 10} ${yv}H${xe + 8}Q${xe} ${yv} ${xe} ${yv - 8}V${yb + 8}Q${xe} ${yb} ${xe + 8} ${yb}H${X - 6}`, ids, p, { coral: true }))
      const lr = quebrar(r.rotulo, W - fluxoX - 20, TIPO.rotulo + 0.5, true)
      partes.push(textoLinhas(lr, fluxoX + 4, yv + 24, TIPO.lhRotulo, `font-family="${SERIF}" font-style="italic" font-size="${TIPO.rotulo + 0.5}" fill="${p.coralTexto}"`))
      altura = yv + 24 + (lr.length - 1) * TIPO.lhRotulo + 8
    } else {
      // Ciclo pela direita: sai da lateral direita da etapa de baixo e sobe até a de cima.
      const xd = W - 10
      const ya = a.y + Math.min(a.h / 2, 30)
      const yb = b.y + Math.min(b.h / 2, 30)
      partes.push(seta(`M${a.x + a.l + 4} ${ya}H${xd - 8}Q${xd} ${ya} ${xd} ${ya - 8}V${yb + 8}Q${xd} ${yb} ${xd - 8} ${yb}H${b.x + b.l + 6}`, ids, p, { coral: true }))
      // O rótulo vai no vão entre as duas etapas, à direita do fluxo.
      partes.push(textoLinhas(rotCiclo, xd - 14, yRotulo + 8, TIPO.lhRotulo, `text-anchor="end" font-family="${SERIF}" font-style="italic" font-size="${TIPO.rotulo}" fill="${p.coralTexto}"`))
    }
  }
  if (d.etiquetas?.length) {
    const t = etiquetas(d.etiquetas, X, altura + 22, W - X - 10, p)
    partes.push(t.svg)
    altura += 22 + t.h
  }
  altura += 18
  partes.unshift(isobatas(W - 40, altura + 30, 0.6, p))
  return { largura: W, altura, svg: partes.join('') }
}

/**
 * Gera o SVG completo de um desenho, com `<title>` e `<desc>` acessíveis.
 *
 * @param d o desenho.
 * @param modo composição larga (computador) ou estreita (celular).
 * @param p paleta: `paletaDoTema()` no site, hex fixo no README.
 * @param opc `prefixo` dos ids (evita colisão com vários SVGs na página) e `fundo` opcional.
 * @returns a marcação `<svg>…</svg>`.
 */
export function desenharSvg(d: Desenho, modo: Modo, p: Paleta, opc: { prefixo?: string; fundo?: string } = {}): string {
  const pre = `${opc.prefixo ?? 'dg'}-${d.id}-${modo}`
  const ids = { mar: `${pre}-pm`, coral: `${pre}-pc` }
  const c = modo === 'largo' ? comporLargo(d, p, ids) : comporEstreito(d, p, ids)
  const ponta = (id: string, cor: string) =>
    `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1.5 1.5L8.5 5L1.5 8.5" fill="none" stroke="${cor}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></marker>`
  const fundo = opc.fundo ? `<rect width="100%" height="100%" fill="${opc.fundo}"/>` : ''
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c.largura} ${Math.ceil(c.altura)}" width="100%" role="img" aria-labelledby="${pre}-t ${pre}-d" preserveAspectRatio="xMidYMid meet" style="display:block;max-width:100%;height:auto">` +
    `<title id="${pre}-t">${esc(d.titulo)}</title><desc id="${pre}-d">${esc(d.descricao)}</desc>` +
    `<defs>${ponta(ids.mar, p.mar)}${ponta(ids.coral, p.coral)}</defs>${fundo}${c.svg}</svg>`
  )
}
