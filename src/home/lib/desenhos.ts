// Ilustrações do mural "O que você precisa" (26/11/2026): os oito desenhos das capas do perfil no 99Freelas,
// trazidos de freelas-99/docs/entregaveis/perfil-99/ilustradas/ilustradas.html (objeto DESENHOS e os auxiliares
// janela, celular e barra). São SVG de verdade, montados como texto e postos dentro de um <svg viewBox="0 0 960 660">.
// A paleta é a do site (identidade.css, tema claro): papel, tinta e sol, com coral, mar e mata só dentro do desenho.
// O miolo de cada tela é tinta impressa e não muda com o tema; o que encosta no fundo do cartão (contorno do
// aparelho, sombra dura e traços soltos) segue as variáveis --d-contorno e --d-sombra, que o cartão define conforme
// o próprio fundo. Só funções puras: nada roda ao importar.

/** Cores fixas do miolo dos desenhos (os tokens do tema claro do site). */
const C = {
  papel: '#f7f4ee', alto: '#fffdf9', tinta: '#17150f', suave: '#4a463e', linha: '#ddd5c6',
  sol: '#f6b90a', coral: '#d9542a', mar: '#1f3a6b', mata: '#2e6a4e', raso: '#efe9dc', areia: '#e8dfcc',
} as const

/** Contorno do que encosta no fundo do cartão: tinta em fundo claro, papel em fundo escuro (definido no CSS). */
const CONTORNO = 'var(--d-contorno)'
/** Sombra dura dos aparelhos, sempre escura (definida no CSS do cartão). */
const SOMBRA = 'var(--d-sombra)'

/** Identificadores dos desenhos, os mesmos das demandas do mural. */
export const IDS_DOS_DESENHOS = ['ia', 'integracao', 'agendamento', 'catalogo', 'sistema', 'loja', 'carteirinha', 'site'] as const
/** Um desenho do mural. */
export type IdDesenho = (typeof IDS_DOS_DESENHOS)[number]

/**
 * Barra arredondada, o "texto" dos desenhos.
 *
 * @param x canto esquerdo.
 * @param y topo.
 * @param w largura.
 * @param h altura (o raio é metade dela).
 * @param cor preenchimento.
 * @param op opacidade.
 * @returns o `<rect>` como texto.
 */
function barra(x: number, y: number, w: number, h = 14, cor: string = C.tinta, op = 1): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${cor}" opacity="${op}"/>`
}

/**
 * Janela de navegador com sombra dura; o conteúdo entra já abaixo da barra de endereço.
 *
 * @param x posição horizontal da janela.
 * @param y posição vertical da janela.
 * @param w largura.
 * @param h altura.
 * @param conteudo SVG do miolo, com a origem logo abaixo da barra de endereço.
 * @returns o grupo da janela como texto.
 */
function janela(x: number, y: number, w: number, h: number, conteudo: string): string {
  return `<g transform="translate(${x} ${y})">
    <rect x="16" y="16" width="${w}" height="${h}" rx="26" fill="${SOMBRA}"/>
    <rect width="${w}" height="${h}" rx="26" fill="${C.alto}" class="t"/>
    <path d="M0 62 H${w}" class="t n"/>
    <circle cx="38" cy="31" r="9" fill="${C.coral}" class="f"/><circle cx="68" cy="31" r="9" fill="${C.sol}" class="f"/><circle cx="98" cy="31" r="9" fill="${C.mata}" class="f"/>
    <rect x="140" y="17" width="${Math.min(360, w - 220)}" height="28" rx="14" fill="${C.raso}" class="f"/>
    <g transform="translate(0 62)">${conteudo}</g></g>`
}

/**
 * Celular com sombra dura; o conteúdo entra dentro da tela.
 *
 * @param x posição horizontal do aparelho.
 * @param y posição vertical do aparelho.
 * @param w largura.
 * @param h altura.
 * @param conteudo SVG do miolo, com a origem no canto da tela.
 * @returns o grupo do celular como texto.
 */
function celular(x: number, y: number, w: number, h: number, conteudo: string): string {
  return `<g transform="translate(${x} ${y})">
    <rect x="14" y="14" width="${w}" height="${h}" rx="46" fill="${SOMBRA}"/>
    <rect width="${w}" height="${h}" rx="46" fill="${C.tinta}" stroke="${CONTORNO}" stroke-width="5"/>
    <rect x="14" y="14" width="${w - 28}" height="${h - 28}" rx="34" fill="${C.alto}"/>
    <rect x="${w / 2 - 36}" y="24" width="72" height="14" rx="7" fill="${C.tinta}"/>
    <g transform="translate(14 14)">${conteudo}</g></g>`
}

/** Site institucional: menu, chamada, fachada da empresa e três serviços. */
function site(): string {
  const fachada = `<g transform="translate(560 44)">
    <circle cx="262" cy="34" r="34" fill="${C.sol}" class="f"/>
    <rect x="24" y="86" width="232" height="206" fill="${C.areia}" class="t"/>
    <path d="M8 86 H272 L250 34 H30 Z" fill="${C.coral}" class="t"/>
    <path d="M74 34 L62 86 M118 34 L112 86 M162 34 L168 86 M206 34 L218 86" class="f n"/>
    <rect x="52" y="124" width="62" height="62" rx="6" fill="${C.alto}" class="f"/><path d="M83 124 V186 M52 155 H114" class="f n"/>
    <rect x="166" y="124" width="62" height="62" rx="6" fill="${C.alto}" class="f"/><path d="M197 124 V186 M166 155 H228" class="f n"/>
    <rect x="108" y="212" width="64" height="80" rx="6" fill="${C.mar}" class="f"/><circle cx="158" cy="254" r="5" fill="${C.sol}"/>
    <path d="M-6 292 H300" class="t n"/>
    <rect x="286" y="232" width="12" height="60" fill="${C.tinta}"/><circle cx="292" cy="212" r="38" fill="${C.mata}" class="f"/>
  </g>`
  const servico = (x: number, cor: string) => `<g transform="translate(${x} 388)">
    <rect width="262" height="170" rx="18" fill="${C.papel}" class="f"/>
    <circle cx="50" cy="52" r="26" fill="${cor}" class="f"/>${barra(28, 100, 168, 16)}${barra(28, 130, 118, 12, C.suave, 0.55)}</g>`
  return janela(0, 0, 940, 700, `
    <circle cx="52" cy="46" r="18" fill="${C.coral}" class="f"/>${barra(82, 38, 110, 16)}
    ${barra(420, 40, 70, 12, C.suave, 0.6)}${barra(510, 40, 70, 12, C.suave, 0.6)}${barra(600, 40, 70, 12, C.suave, 0.6)}
    <rect x="716" y="24" width="170" height="46" rx="23" fill="${C.tinta}"/>
    ${barra(48, 128, 420, 38)}${barra(48, 182, 320, 38)}
    ${barra(48, 250, 400, 14, C.suave, 0.55)}${barra(48, 278, 330, 14, C.suave, 0.55)}
    <rect x="48" y="316" width="200" height="56" rx="28" fill="${C.sol}" class="f"/>
    <rect x="264" y="316" width="150" height="56" rx="28" fill="${C.alto}" class="f"/>
    ${fachada}${servico(48, C.sol)}${servico(338, C.mata)}${servico(628, C.mar)}`)
}

/** Loja virtual: vitrine com três produtos e o celular com o pedido pago. */
function loja(): string {
  const produto = (x: number, desenho: string) => `<g transform="translate(${x} 104)">
    <rect width="218" height="300" rx="18" fill="${C.alto}" class="f"/>
    <rect x="14" y="14" width="190" height="168" rx="12" fill="${C.raso}"/>
    <g transform="translate(109 98)">${desenho}</g>
    ${barra(18, 202, 130, 14)}${barra(18, 228, 84, 18, C.coral)}
    <rect x="18" y="254" width="182" height="32" rx="16" fill="${C.sol}" class="f"/></g>`
  const camiseta = `<path d="M-34 -52 L-70 -28 L-52 4 L-36 -8 V58 H36 V-8 L52 4 L70 -28 L34 -52 Q0 -30 -34 -52 Z" fill="${C.mar}" class="f"/>`
  const bolsa = `<path d="M-30 -22 Q-30 -62 0 -62 Q30 -62 30 -22" class="t n"/><rect x="-56" y="-22" width="112" height="82" rx="14" fill="${C.coral}" class="f"/><rect x="-16" y="4" width="32" height="18" rx="6" fill="${C.sol}" class="f"/>`
  const caneca = `<path d="M34 -24 Q78 -24 78 10 Q78 42 34 42" class="t n"/><rect x="-46" y="-48" width="84" height="104" rx="12" fill="${C.mata}" class="f"/><path d="M-22 -72 q-12 -14 0 -26 M6 -72 q-12 -14 0 -26" class="f n"/>`
  const vitrine = janela(0, 0, 780, 700, `
    <circle cx="46" cy="46" r="18" fill="${C.sol}" class="f"/>${barra(76, 38, 96, 16)}
    <rect x="250" y="26" width="300" height="40" rx="20" fill="${C.raso}" class="f"/>
    <g transform="translate(676 46)"><path d="M-30 -18 H-18 L-8 20 H26 L34 -6 H-14" class="t n"/><circle cx="-2" cy="32" r="5" fill="${C.tinta}"/><circle cx="22" cy="32" r="5" fill="${C.tinta}"/>
      <circle cx="32" cy="-22" r="17" fill="${C.coral}" class="f"/></g>
    ${produto(30, camiseta)}${produto(268, bolsa)}${produto(506, caneca)}
    ${barra(30, 440, 300, 22)}${barra(30, 478, 220, 14, C.suave, 0.5)}`)
  const pago = celular(640, 34, 300, 560, `
    ${barra(30, 54, 120, 16)}${barra(30, 84, 80, 12, C.suave, 0.55)}
    <rect x="24" y="118" width="224" height="64" rx="14" fill="${C.raso}"/><rect x="36" y="130" width="40" height="40" rx="8" fill="${C.mar}"/>${barra(90, 136, 96, 12)}${barra(90, 158, 60, 10, C.suave, 0.55)}
    <rect x="24" y="194" width="224" height="64" rx="14" fill="${C.raso}"/><rect x="36" y="206" width="40" height="40" rx="8" fill="${C.coral}"/>${barra(90, 212, 80, 12)}${barra(90, 234, 60, 10, C.suave, 0.55)}
    <path d="M24 284 H248" stroke="${C.linha}" stroke-width="4"/>${barra(24, 304, 70, 14)}${barra(170, 300, 78, 22, C.tinta)}
    <circle cx="136" cy="408" r="54" fill="${C.mata}" class="f"/><path d="M110 408 L128 428 L164 388" stroke="${C.alto}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${barra(76, 482, 120, 14)}`)
  return vitrine + pago
}

/** IA no WhatsApp: a conversa no celular, o relógio de 24 h e a passagem para uma pessoa. */
function ia(): string {
  const balao = (x: number, y: number, w: number, h: number, cor: string, linhas: string) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${cor}" class="f"/>${linhas}`
  const conversa = celular(300, 0, 430, 760, `
    <rect width="402" height="112" rx="34" fill="${C.mata}"/><rect y="60" width="402" height="52" fill="${C.mata}"/>
    <circle cx="62" cy="68" r="28" fill="${C.sol}" class="f"/><path d="M62 52 l5 11 11 5 -11 5 -5 11 -5 -11 -11 -5 11 -5 z" fill="${C.tinta}"/>
    ${barra(104, 50, 130, 16, C.alto)}${barra(104, 78, 80, 11, C.alto, 0.7)}
    ${balao(24, 140, 232, 78, C.raso, barra(44, 162, 170, 13) + barra(44, 186, 110, 13))}
    ${balao(128, 240, 250, 104, C.sol, barra(148, 262, 196, 13) + barra(148, 286, 210, 13) + barra(148, 310, 124, 13))}
    ${balao(24, 366, 190, 56, C.raso, barra(44, 388, 130, 13))}
    ${balao(128, 444, 250, 80, C.sol, barra(148, 466, 180, 13) + barra(148, 490, 204, 13))}
    ${balao(24, 546, 118, 56, C.raso, `<circle cx="58" cy="574" r="8" fill="${C.suave}"/><circle cx="84" cy="574" r="8" fill="${C.suave}" opacity=".65"/><circle cx="110" cy="574" r="8" fill="${C.suave}" opacity=".35"/>`)}`)
  const relogio = `<g transform="translate(176 250)">
    <circle cx="10" cy="10" r="112" fill="${SOMBRA}"/><circle r="112" fill="${C.sol}" stroke="${CONTORNO}" stroke-width="5"/>
    <text y="26" text-anchor="middle" style="font-family:var(--fonte-titulo)" font-weight="600" font-size="92" fill="${C.tinta}">24h</text></g>`
  const pessoa = `<g transform="translate(660 360)">
    <rect x="10" y="10" width="200" height="150" rx="24" fill="${SOMBRA}"/><rect width="200" height="150" rx="24" fill="${C.alto}" stroke="${CONTORNO}" stroke-width="5"/>
    <circle cx="62" cy="58" r="24" fill="${C.coral}" class="f"/><path d="M22 128 q40 -58 80 0" fill="${C.coral}" class="f"/>
    ${barra(110, 48, 66, 13)}${barra(110, 74, 46, 11, C.suave, 0.55)}</g>`
  return conversa + relogio + pessoa
}

/** Sistema sob medida: menu lateral, três números, gráfico e a tabela do dia. */
function sistema(): string {
  const numero = (x: number, cor: string, tinta: string = C.tinta) => `<g transform="translate(${x} 96)">
    <rect width="210" height="112" rx="16" fill="${cor}" class="f"/>${barra(20, 24, 96, 12, tinta, 0.6)}${barra(20, 58, 132, 28, tinta)}</g>`
  const colunas = [70, 118, 92, 150, 126, 184]
    .map((h, i) => `<rect x="${44 + i * 62}" y="${214 - h}" width="40" height="${h}" rx="8" fill="${i === 5 ? C.sol : C.tinta}" class="f"/>`)
    .join('')
  const linha = (y: number, cor: string, w: number) =>
    `${barra(28, y, 110, 13)}${barra(168, y, w, 13, C.suave, 0.5)}<rect x="270" y="${y - 8}" width="78" height="28" rx="14" fill="${cor}" class="f"/>`
  return janela(0, 0, 940, 700, `
    <rect x="2.5" y="2" width="170" height="640" fill="${C.tinta}"/>
    <circle cx="52" cy="48" r="18" fill="${C.sol}"/>${barra(80, 40, 64, 14, C.alto)}
    <rect x="18" y="104" width="138" height="42" rx="12" fill="${C.sol}"/>${barra(34, 118, 84, 13, C.tinta)}
    ${barra(34, 176, 96, 13, C.alto, 0.7)}${barra(34, 216, 72, 13, C.alto, 0.7)}${barra(34, 256, 104, 13, C.alto, 0.7)}${barra(34, 296, 80, 13, C.alto, 0.7)}
    <g transform="translate(200 0)">
      ${barra(0, 36, 240, 26)}<rect x="560" y="28" width="150" height="44" rx="22" fill="${C.sol}" class="f"/>
      ${numero(0, C.raso)}${numero(234, C.raso)}${numero(468, C.mata, C.alto)}
      <g transform="translate(0 232)"><rect width="424" height="260" rx="18" fill="${C.alto}" class="f"/>
        <path d="M28 214 H398" class="f n"/>${colunas}</g>
      <g transform="translate(448 232)"><rect width="262" height="260" rx="18" fill="${C.alto}" class="f"/>
        <g transform="translate(-10 0)">${barra(28, 28, 120, 16)}</g>
        <g transform="scale(.72) translate(0 78)">${linha(24, C.mata, 80)}${linha(84, C.sol, 60)}${linha(144, C.coral, 74)}${linha(204, C.mata, 52)}</g></g>
    </g>`)
}

/** Agendamento: o mês, os horários livres e o celular com a consulta paga. */
function agendamento(): string {
  const dias = Array.from({ length: 28 }, (_, i) => {
    const x = 44 + (i % 7) * 55
    const y = 150 + Math.floor(i / 7) * 58
    if (i === 16) return `<circle cx="${x}" cy="${y}" r="24" fill="${C.sol}" class="f"/><circle cx="${x}" cy="${y}" r="7" fill="${C.tinta}"/>`
    const fora = [2, 3, 9, 13, 20, 21, 26].includes(i)
    return `<circle cx="${x}" cy="${y}" r="20" fill="${fora ? C.raso : C.alto}" stroke="${fora ? C.linha : C.tinta}" stroke-width="4"/>`
  }).join('')
  const horario = (y: number, ativo: boolean) =>
    `<rect x="436" y="${y}" width="168" height="52" rx="26" fill="${ativo ? C.tinta : C.alto}" class="f"/>${barra(470, y + 19, 100, 14, ativo ? C.alto : C.tinta)}`
  const mes = janela(0, 0, 690, 700, `
    ${barra(40, 36, 190, 26)}
    <path d="M322 36 l-14 14 14 14 M372 36 l14 14 -14 14" class="t n"/>
    <path d="M24 100 H404" stroke="${C.linha}" stroke-width="4"/>
    ${dias}
    ${barra(436, 40, 130, 16)}${horario(96, false)}${horario(164, true)}${horario(232, false)}${horario(300, false)}
    <rect x="40" y="398" width="564" height="68" rx="34" fill="${C.mata}" class="f"/>${barra(230, 423, 184, 18, C.alto)}`)
  const pago = celular(650, 34, 300, 560, `
    <circle cx="64" cy="92" r="32" fill="${C.coral}" class="f"/>${barra(110, 74, 124, 16)}${barra(110, 102, 84, 12, C.suave, 0.55)}
    <rect x="24" y="150" width="224" height="92" rx="16" fill="${C.raso}"/>
    <rect x="40" y="168" width="92" height="56" rx="12" fill="${C.sol}" class="f"/>${barra(148, 178, 80, 13)}${barra(148, 204, 56, 11, C.suave, 0.55)}
    <g transform="translate(24 264)"><rect width="224" height="132" rx="16" fill="${C.mar}" class="f"/>
      <rect x="20" y="24" width="46" height="34" rx="8" fill="${C.sol}" class="f"/>${barra(20, 84, 150, 12, C.alto, 0.85)}${barra(20, 106, 80, 10, C.alto, 0.6)}</g>
    <circle cx="136" cy="462" r="42" fill="${C.mata}" class="f"/><path d="M116 462 L130 478 L158 446" stroke="${C.alto}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`)
  return mes + pago
}

/** Catálogo digital: os produtos no celular e o pedido montado, pronto na conversa. */
function catalogo(): string {
  const item = (x: number, y: number, cor: string, forma: string) => `<g transform="translate(${x} ${y})">
    <rect width="170" height="186" rx="18" fill="${C.alto}" class="f"/><rect x="12" y="12" width="146" height="104" rx="12" fill="${C.raso}"/>
    <g transform="translate(85 64)" fill="${cor}">${forma}</g>${barra(16, 132, 96, 12)}${barra(16, 156, 60, 14, C.coral)}
    <circle cx="140" cy="154" r="17" fill="${C.sol}" class="f"/><path d="M132 154 H148 M140 146 V162" class="f n"/></g>`
  const vitrine = celular(0, 0, 430, 760, `
    ${barra(28, 56, 150, 20)}<circle cx="356" cy="64" r="22" fill="${C.sol}" class="f"/>
    ${item(22, 108, C.mar, '<circle r="36" class="f"/>')}${item(210, 108, C.coral, '<rect x="-34" y="-34" width="68" height="68" rx="14" class="f"/>')}
    ${item(22, 312, C.mata, '<path d="M0 -40 L38 34 H-38 Z" class="f"/>')}${item(210, 312, C.sol, '<rect x="-42" y="-26" width="84" height="52" rx="26" class="f"/>')}
    <rect x="22" y="520" width="358" height="62" rx="31" fill="${C.tinta}"/>${barra(132, 543, 140, 16, C.sol)}`)
  // A seta pontilhada fica solta sobre o fundo do cartão: usa o contorno do tema.
  const seta = `<path d="M450 96 C520 40 610 60 640 150" stroke="${CONTORNO}" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round" fill="none"/>
    <path d="M612 128 L642 158 L662 120" class="t n c"/>`
  const pedido = `<g transform="translate(500 176)">
    <path d="M18 18 H398 a26 26 0 0 1 26 26 V300 a26 26 0 0 1 -26 26 H80 L18 372 Z" fill="${SOMBRA}" transform="translate(-4 -4)"/>
    <path d="M0 0 H380 a26 26 0 0 1 26 26 V282 a26 26 0 0 1 -26 26 H62 L0 354 Z" fill="${C.alto}" class="t"/>
    <circle cx="50" cy="56" r="16" fill="${C.mar}" class="f"/>${barra(84, 49, 190, 14)}
    <rect x="34" y="96" width="32" height="32" rx="8" fill="${C.coral}" class="f"/>${barra(84, 105, 150, 14)}
    <path d="M34 196 l32 0 l-16 -30 z" fill="${C.mata}" class="f" transform="translate(0 -18)"/>${barra(84, 157, 170, 14)}
    <path d="M30 214 H376" stroke="${C.linha}" stroke-width="4"/>
    ${barra(34, 244, 90, 18)}${barra(250, 240, 126, 26, C.tinta)}
    <path d="M300 286 l10 10 22 -24 M318 296 l-2 0" stroke="${C.mata}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M322 296 l22 -24" stroke="${C.mata}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`
  return vitrine + seta + pedido
}

/** Integração: a planilha do fornecedor, a ponte e a vitrine que recebe o dado certo. */
function integracao(): string {
  const celulas = Array.from({ length: 15 }, (_, i) => {
    const x = 26 + (i % 3) * 122
    const y = 34 + Math.floor(i / 3) * 62
    if (i === 7) return `<rect x="${x}" y="${y}" width="110" height="48" rx="10" fill="${C.sol}" class="f"/><path d="M${x + 34} ${y + 24} l14 14 26 -28" class="t n"/>`
    return `<rect x="${x}" y="${y}" width="110" height="48" rx="10" fill="${i < 3 ? C.tinta : C.raso}"/>${i < 3 ? '' : barra(x + 16, y + 18, i % 2 ? 62 : 78, 12, C.suave, 0.55)}`
  }).join('')
  const origem = janela(0, 40, 420, 470, celulas)
  const ficha = (x: number, y: number, cor: string, destaque: boolean) => `<g transform="translate(${x} ${y})">
    <rect width="150" height="150" rx="16" fill="${destaque ? C.sol : C.alto}" class="f"/><rect x="14" y="14" width="122" height="70" rx="10" fill="${destaque ? C.alto : C.raso}"/>
    <circle cx="75" cy="49" r="22" fill="${cor}" class="f"/>${barra(16, 100, 88, 12)}${barra(16, 122, 56, 12, C.coral)}</g>`
  const destino = janela(540, 150, 410, 560, `
    ${barra(28, 30, 120, 18)}${ficha(28, 76, C.mar, false)}${ficha(204, 76, C.mata, true)}${ficha(28, 250, C.coral, false)}${ficha(204, 250, C.mar, false)}`)
  // A ponte pontilhada fica solta sobre o fundo do cartão: usa o contorno do tema.
  const ponte = `<path d="M436 250 C480 250 480 330 524 330" stroke="${CONTORNO}" stroke-width="7" stroke-dasharray="3 17" stroke-linecap="round" fill="none"/>
    <circle cx="486" cy="296" r="46" fill="${SOMBRA}"/><circle cx="480" cy="290" r="46" fill="${C.coral}" class="t"/>
    <path d="M460 280 H496 l-10 -10 M500 302 H464 l10 10" stroke="${C.alto}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  return origem + destino + ponte
}

/** Carteirinha digital: o celular com a carteirinha e o QR, e os dois avisos da portaria. */
function carteirinha(): string {
  // QR de enfeite (7 × 7): desenho fixo, não codifica nada. Mesma semente da capa.
  let semente = 11
  const sorteio = () => (semente = (semente * 9301 + 49297) % 233280) / 233280
  const qr = Array.from({ length: 49 }, (_, i) => {
    const x = i % 7
    const y = Math.floor(i / 7)
    const canto = (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4)
    return canto || sorteio() > 0.5 ? `<rect x="${x * 24}" y="${y * 24}" width="24.5" height="24.5" fill="${C.tinta}"/>` : ''
  }).join('')
  const aparelho = celular(300, 0, 430, 760, `
    ${barra(28, 58, 150, 18)}${barra(28, 88, 96, 12, C.suave, 0.55)}
    <g transform="translate(22 118)"><rect x="10" y="10" width="358" height="404" rx="26" fill="${C.tinta}"/>
      <rect width="358" height="404" rx="26" fill="${C.sol}" class="t"/>
      <circle cx="62" cy="58" r="32" fill="${C.coral}" class="f"/>${barra(112, 38, 170, 18)}${barra(112, 68, 110, 13, C.tinta, 0.6)}
      <rect x="78" y="108" width="202" height="202" rx="18" fill="${C.alto}" class="f"/><g transform="translate(95 125)">${qr}</g>
      <rect x="86" y="330" width="186" height="46" rx="23" fill="${C.mata}" class="f"/>
      <path d="M112 353 l10 10 18 -20" stroke="${C.alto}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${barra(152, 346, 96, 14, C.alto)}</g>`)
  const aviso = (x: number, y: number, cor: string, sinal: string) => `<g transform="translate(${x} ${y})">
    <circle cx="10" cy="10" r="74" fill="${SOMBRA}"/><circle r="74" fill="${cor}" stroke="${CONTORNO}" stroke-width="5"/>
    <path d="${sinal}" stroke="${C.alto}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`
  return aparelho + aviso(196, 300, C.mata, 'M-30 2 L-8 26 L32 -22') + aviso(806, 410, C.coral, 'M-24 -24 L24 24 M24 -24 L-24 24')
}

const DESENHOS: Record<IdDesenho, () => string> = { ia, integracao, agendamento, catalogo, sistema, loja, carteirinha, site }

/**
 * Miolo SVG de um desenho do mural, para entrar num `<svg viewBox="0 0 960 660">`.
 *
 * @param id qual desenho (o `id` da demanda).
 * @returns os elementos SVG como texto. O conteúdo é fixo, escrito neste arquivo: não leva dado de fora.
 */
export function desenhoDaDemanda(id: IdDesenho): string {
  return DESENHOS[id]()
}
