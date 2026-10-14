// Filtro da galeria da home: puro, para o teste cobrir os casos de hash velho e tipo sem projeto.
import { tiposProjeto, type ItemProjeto, type TipoProjeto } from '../../projetos'

/**
 * Aplica o filtro de tipo. Tipo desconhecido ou sem nenhum projeto volta para "todos".
 *
 * @param itens projetos da galeria.
 * @param tipo tipo pedido (de um chip ou do hash), ou null.
 * @returns o tipo efetivamente aplicado e os itens que aparecem.
 */
export function filtrarGaleria(itens: ItemProjeto[], tipo: string | null): { tipo: TipoProjeto | null; itens: ItemProjeto[] } {
  if (!tipo || !(tipo in tiposProjeto)) return { tipo: null, itens }
  const t = tipo as TipoProjeto
  const filtrados = itens.filter((p) => p.tipos.includes(t))
  return filtrados.length ? { tipo: t, itens: filtrados } : { tipo: null, itens }
}

/**
 * Quantos projetos há em cada tipo (para esconder chip vazio e mostrar o número no chip).
 *
 * @param itens projetos da galeria.
 * @returns contagem por tipo.
 */
export function contarPorTipo(itens: ItemProjeto[]): Record<TipoProjeto, number> {
  const c = Object.fromEntries(Object.keys(tiposProjeto).map((t) => [t, 0])) as Record<TipoProjeto, number>
  for (const p of itens) for (const t of p.tipos) c[t] += 1
  return c
}
