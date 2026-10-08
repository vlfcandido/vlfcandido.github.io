import { caminhoPublico } from '../lib/assets'
import type { Print as TPrint } from '../visuais'

interface PrintProps {
  print: TPrint
  className?: string
  prioridade?: boolean
}

/** Moldura de um print de produto: borda fina e sombra sólida deslocada, sem desfoque. */
export function Print({ print, className = '', prioridade }: PrintProps) {
  return (
    <img
      src={caminhoPublico(import.meta.env.BASE_URL, print.arquivo)}
      alt={print.alt}
      width={1600}
      height={1000}
      loading={prioridade ? 'eager' : 'lazy'}
      decoding="async"
      className={`block aspect-[16/10] w-full rounded-md border border-linha bg-folha object-cover object-top shadow-[6px_6px_0_var(--linha)] ${className}`}
    />
  )
}
