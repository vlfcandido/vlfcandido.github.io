import type { ReactNode } from 'react'

interface SecaoProps {
  id: string
  numero: string
  titulo: string
  children: ReactNode
}

/** Bloco de seção com âncora, numeração em mono à esquerda e conteúdo à direita. */
export function Secao({ id, numero, titulo, children }: SecaoProps) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-20 border-t border-linha py-12 sm:py-16">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="font-mono text-xs text-suave">{numero}</p>
          <h2 id={`${id}-titulo`} className="mt-1 text-xl font-semibold tracking-tight">
            {titulo}
          </h2>
        </div>
        <div className="min-w-0 md:col-span-9">{children}</div>
      </div>
    </section>
  )
}
