// Universo de projetos que a página de projetos lista: as peças navegáveis no topo e a galeria de projetos.ts.
// O total é o mesmo número que a home mostra na prova (decisão dele, 14/10/2026).
import { listarProjetos, type ItemProjeto } from '../../projetos'
import { PECAS } from '../conteudo'

/** Uma peça navegável de /trabalhos/. */
export type Peca = (typeof PECAS)[number]

/**
 * Tudo o que a página de projetos lista.
 *
 * @returns as peças (topo), os projetos e o total das duas listas.
 */
export function universoDeProjetos(): { pecas: readonly Peca[]; projetos: ItemProjeto[]; total: number } {
  const projetos = listarProjetos()
  return { pecas: PECAS, projetos, total: PECAS.length + projetos.length }
}
