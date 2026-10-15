// Traço de caneta da assinatura "o detalhe que ninguém viu": uma elipse imperfeita, como quem circula
// algo à mão. Função pura e determinística (a semente fixa o traço; nada aleatório no render).

/** Gerador pseudoaleatório pequeno (mulberry32), para o traço variar por semente e ser estável. */
function aleatorio(semente: number): () => number {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const r1 = (n: number) => Math.round(n * 10) / 10

/**
 * Path SVG de uma elipse feita à mão em volta de uma caixa, com uma volta e um pouco de sobra no fim.
 *
 * @param largura largura da caixa do texto, em px.
 * @param altura altura da caixa do texto, em px.
 * @param semente número que fixa o traço (use o índice do destaque).
 * @returns atributo `d` de um `<path>`, só com M e C.
 */
export function caminhoCirculo(largura: number, altura: number, semente: number): string {
  const rnd = aleatorio(semente)
  const j = (amp: number) => (rnd() - 0.5) * 2 * amp
  const cx = largura / 2, cy = altura / 2, rx = largura / 2 + largura * 0.04, ry = altura / 2 + altura * 0.04
  const k = 0.5523
  const p = (x: number, y: number) => `${r1(Math.min(Math.max(x, -largura * 0.08), largura * 1.08))} ${r1(Math.min(Math.max(y, -altura * 0.08), altura * 1.08))}`
  const jx = () => j(largura * 0.02), jy = () => j(altura * 0.05)
  return [
    `M${p(cx - rx * 0.9 + jx(), cy - ry * 0.6 + jy())}`,
    `C${p(cx - rx * 0.4, cy - ry - jy())}, ${p(cx + rx * k, cy - ry + jy())}, ${p(cx + rx + jx(), cy + jy())}`,
    `C${p(cx + rx, cy + ry * k)}, ${p(cx + rx * k, cy + ry + jy())}, ${p(cx + jx(), cy + ry)}`,
    `C${p(cx - rx * k, cy + ry)}, ${p(cx - rx + jx(), cy + ry * k)}, ${p(cx - rx, cy + jy())}`,
    `C${p(cx - rx, cy - ry * k)}, ${p(cx - rx * 0.3, cy - ry + jy())}, ${p(cx + rx * 0.2 + jx(), cy - ry * 0.95)}`,
  ].join(' ')
}
