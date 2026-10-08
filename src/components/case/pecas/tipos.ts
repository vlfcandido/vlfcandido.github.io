import type { CaseDetalhe } from '../../../casos'
import type { ItemProjeto } from '../../../projetos'

/** O que toda peça principal recebe: o projeto da galeria e o detalhe do case. */
export interface PecaProps {
  item: ItemProjeto
  caso: CaseDetalhe
}
