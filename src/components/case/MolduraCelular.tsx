import type { ReactNode } from 'react'

interface Props {
  /** Barra de cima do app (nome do contato, título da tela). */
  topo: ReactNode
  children: ReactNode
  /** Nome acessível da moldura (ex.: "Conversa ilustrativa no WhatsApp"). */
  rotulo: string
  className?: string
}

/**
 * Moldura de celular desenhada em CSS (sem imagem): borda grossa, alto-falante e a barra do app.
 * É moldura, não peça: as peças que a usam põem o próprio conteúdo dentro.
 */
export function MolduraCelular({ topo, children, rotulo, className = '' }: Props) {
  return (
    <figure aria-label={rotulo} className={`moldura-celular mx-auto w-full max-w-[340px] ${className}`}>
      <div className="bezel rounded-[2.4rem] border-[10px] p-0 shadow-[8px_8px_0_var(--linha)]">
        <div className="relative overflow-hidden rounded-[1.7rem] bg-folha">
          <span aria-hidden="true" className="absolute top-2 left-1/2 h-1.5 w-16 -translate-x-1/2 rounded-full bezel-alto" />
          <div className="pt-6">{topo}</div>
          {children}
        </div>
      </div>
    </figure>
  )
}
