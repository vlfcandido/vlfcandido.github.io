// Parada por tela no celular (fix final, 14/10/2026): depois de um toque, a home assenta no começo de uma tela,
// nunca entre duas. Só funções: nada roda ao importar.

/** Folga, em px, para considerar que a página já está numa parada. */
export const FOLGA_PARADA = 4

/**
 * Escolhe onde a página assenta depois de um toque.
 *
 * O limite evita o salto longo de uma seção que ocupa mais de uma tela (18/10/2026). A seção "IA e agentes" tem
 * cerca de 1,4 mil px no celular; sem limite, um arrasto dentro dela caía direto na vitrine e passava por cima do
 * exemplo, das frentes e das provas. Quando a próxima parada está longe, a página fica onde o dedo deixou e a pessoa
 * continua rolando naturalmente.
 *
 * @param y posição em que a rolagem parou.
 * @param sentido deslocamento do toque (positivo = desceu a página; negativo = subiu; zero = sem sentido).
 * @param paradas posições possíveis (o topo, o começo de cada tela e o fim da página), em qualquer ordem.
 * @param limite distância máxima, em px, que o encaixe pode puxar (padrão: sem limite).
 * @returns a posição de destino, ou `null` quando a página já está numa parada, quando a parada está longe demais ou
 *   quando não há paradas.
 */
export function paradaDoToque(
  y: number,
  sentido: number,
  paradas: readonly number[],
  limite = Number.POSITIVE_INFINITY,
): number | null {
  const lista = [...new Set(paradas)].sort((a, b) => a - b)
  if (!lista.length || lista.some((p) => Math.abs(p - y) <= FOLGA_PARADA)) return null
  const cabe = (alvo: number | undefined) => (alvo !== undefined && Math.abs(alvo - y) <= limite ? alvo : null)
  const acima = lista.filter((p) => p < y).at(-1)
  const abaixo = lista.find((p) => p > y)
  if (sentido > 0) return abaixo === undefined ? cabe(acima) : cabe(abaixo)
  if (sentido < 0) return acima === undefined ? cabe(abaixo) : cabe(acima)
  // Sem sentido (toque parado com a página ainda andando): a mais próxima, se ela estiver dentro do limite.
  if (acima === undefined) return cabe(abaixo)
  if (abaixo === undefined) return cabe(acima)
  return y - acima <= abaixo - y ? cabe(acima) : cabe(abaixo)
}
