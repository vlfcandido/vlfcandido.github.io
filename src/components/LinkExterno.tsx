import type { ReactNode } from 'react'

interface LinkExternoProps {
  href: string
  className?: string
  children: ReactNode
}

/** Link que abre em nova aba com `noopener` e avisa o leitor de tela. */
export function LinkExterno({ href, className, children }: LinkExternoProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}
