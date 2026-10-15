// Parada por tela no celular (fix final, 14/10/2026): depois de um toque, a home assenta no começo de uma tela,
// nunca entre duas. Só funções: nada roda ao importar.

/** Folga, em px, para considerar que a página já está numa parada. */
export const FOLGA_PARADA = 4

/**
 * Escolhe onde a página assenta depois de um toque.
 *
 * @param y posição em que a rolagem parou.
 * @param sentido deslocamento do toque (positivo = desceu a página; negativo = subiu; zero = sem sentido).
 * @param paradas posições possíveis (o topo, o começo de cada tela e o fim da página), em qualquer ordem.
 * @returns a posição de destino, ou `null` quando a página já está numa parada (ou não há paradas).
 */
export function paradaDoToque(y: number, sentido: number, paradas: readonly number[]): number | null {
  const lista = [...new Set(paradas)].sort((a, b) => a - b)
  if (!lista.length || lista.some((p) => Math.abs(p - y) <= FOLGA_PARADA)) return null
  const acima = lista.filter((p) => p < y).at(-1)
  const abaixo = lista.find((p) => p > y)
  if (sentido > 0) return abaixo ?? acima ?? null
  if (sentido < 0) return acima ?? abaixo ?? null
  // Sem sentido (toque parado com a página ainda andando): a mais próxima.
  if (acima === undefined) return abaixo ?? null
  if (abaixo === undefined) return acima
  return y - acima <= abaixo - y ? acima : abaixo
}
