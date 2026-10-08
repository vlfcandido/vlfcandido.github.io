import { flushSync } from 'react-dom'

/** Tipos de transição: escolhem, no CSS, o desenho do movimento (`html[data-vt="..."]`). */
export type TipoTransicao = 'pagina' | 'avancar' | 'voltar' | 'tema'

/**
 * Diz se a pessoa pediu menos movimento no sistema.
 *
 * @returns `true` quando `prefers-reduced-motion: reduce` está ativo.
 */
export function poucoMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Diz se o navegador sabe fazer View Transitions.
 *
 * @returns `true` quando `document.startViewTransition` existe.
 */
export function temViewTransition(): boolean {
  return typeof document !== 'undefined' && typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === 'function'
}

/**
 * Troca o estado dentro de uma View Transition, quando o navegador tem e a pessoa aceita
 * movimento; senão, troca direto.
 *
 * @param mudar função que altera o estado do React.
 * @param tipo desenho do movimento (vira `data-vt` no `<html>` enquanto a transição roda).
 */
export function comTransicao(mudar: () => void, tipo?: TipoTransicao): void {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<unknown> } }
  if (!doc.startViewTransition || poucoMovimento()) {
    mudar()
    return
  }
  const raiz = document.documentElement
  if (tipo) raiz.dataset.vt = tipo
  const limpar = () => {
    if (raiz.dataset.vt === tipo) delete raiz.dataset.vt
  }
  const t = doc.startViewTransition(() => flushSync(mudar))
  t.finished.then(limpar, limpar)
}
