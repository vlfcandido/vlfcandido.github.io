import { flushSync } from 'react-dom'

/**
 * Diz se a pessoa pediu menos movimento no sistema.
 *
 * @returns `true` quando `prefers-reduced-motion: reduce` está ativo.
 */
export function poucoMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Troca o estado dentro de uma View Transition, quando o navegador tem e a pessoa aceita
 * movimento; senão, troca direto.
 *
 * @param mudar função que altera o estado do React.
 */
export function comTransicao(mudar: () => void): void {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (!doc.startViewTransition || poucoMovimento()) {
    mudar()
    return
  }
  doc.startViewTransition(() => flushSync(mudar))
}
