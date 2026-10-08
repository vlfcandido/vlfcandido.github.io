import type { ReactNode } from 'react'

interface Props {
  /** Id do bloco que abre, para o `aria-controls`. */
  id: string
  aberto: boolean
  aoAlternar: () => void
  /** Texto do botão fechado, sem o "Descer" (ex.: "a carreira toda, de 2013 até hoje"). */
  oQue: string
  children: ReactNode
  className?: string
}

/**
 * "Ver mais" na língua da carta: o botão desce um nível e uma isóbata se desenha até o conteúdo;
 * "Subir" fecha. O conteúdo fechado fica fora do Tab e do leitor de tela (`inert`). Com movimento
 * reduzido, abre e fecha sem animação.
 */
export function Descer({ id, aberto, aoAlternar, oQue, children, className = '' }: Props) {
  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={id}
        onClick={aoAlternar}
        className="descer-botao inline-flex items-center gap-2 rounded-full py-1 font-medium text-cobalto"
      >
        <svg viewBox="0 0 16 20" width="14" height="18" aria-hidden="true" className="descer-prumo">
          <path d="M8 1v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 2.5" />
          <path d="M4.5 13h7l-3.5 5.5z" fill="var(--pitanga)" />
        </svg>
        <span className="sublinha">{aberto ? 'Subir' : `Descer: ${oQue}`}</span>
      </button>
      <div id={id} className="expansivel" data-aberto={aberto} inert={!aberto}>
        <div>
          <svg viewBox="0 0 600 14" preserveAspectRatio="none" aria-hidden="true" className="isobata-descer mt-3 h-3.5 w-full" fill="none">
            <path
              d="M0 8C80 2 150 12 240 7C330 2 400 13 480 8C530 5 570 6 600 7"
              pathLength={1}
              stroke="var(--linha)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {children}
        </div>
      </div>
    </div>
  )
}
