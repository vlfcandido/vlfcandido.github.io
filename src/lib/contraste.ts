// Contraste entre duas cores pela fórmula do WCAG 2.x (luminância relativa). Função pura, sem efeito ao importar.

/** Luminância relativa de uma cor `#rrggbb`. */
function luminancia(hex: string): number {
  const n = hex.replace('#', '')
  const canais = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
  const [r, g, b] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Razão de contraste entre duas cores, como no WCAG.
 *
 * @param a cor `#rrggbb`.
 * @param b cor `#rrggbb`.
 * @returns a razão, de 1 a 21.
 */
export function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
