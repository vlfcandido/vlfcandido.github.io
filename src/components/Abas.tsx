import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'

/** Uma aba: identificador, o texto do botão e, opcionalmente, um ícone antes dele. */
export interface Aba {
  id: string
  rotulo: ReactNode
  /** Nome acessível, quando o rótulo visível é curto demais para explicar a aba. */
  nome?: string
  icone?: ReactNode
  /** Estilo próprio do botão (ex.: a posição de uma boia na carta). */
  estilo?: CSSProperties
}

interface Props {
  /** Prefixo dos ids: a aba vira `${base}-aba-${id}` e o painel `${base}-painel-${id}`. */
  base: string
  abas: Aba[]
  ativa: string
  aoTrocar: (id: string) => void
  rotulo: string
  /** Classes da lista de abas (layout: linha rolável, coluna, grade). */
  className?: string
  /** Classes de cada botão; recebe se a aba está ativa. */
  classeAba: (ativa: boolean) => string
}

/** Id do painel de uma aba, para o `role="tabpanel"` que o chamador renderiza. */
export function idPainel(base: string, id: string): string {
  return `${base}-painel-${id}`
}

/** Id do botão de uma aba, para o `aria-labelledby` do painel. */
export function idAba(base: string, id: string): string {
  return `${base}-aba-${id}`
}

/**
 * Lista de abas acessível (padrão WAI-ARIA de abas com ativação automática): só a aba ativa entra
 * no Tab; setas, Home e End andam entre as abas, levando o foco e trocando o painel. O painel
 * fica com o chamador, que usa `idPainel` e `idAba` para ligar os dois.
 */
export function Abas({ base, abas, ativa, aoTrocar, rotulo, className = '', classeAba }: Props) {
  const botoes = useRef<(HTMLButtonElement | null)[]>([])

  function teclas(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const passo: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    let novo: number
    if (e.key in passo) novo = (i + passo[e.key] + abas.length) % abas.length
    else if (e.key === 'Home') novo = 0
    else if (e.key === 'End') novo = abas.length - 1
    else return
    e.preventDefault()
    aoTrocar(abas[novo].id)
    const alvo = botoes.current[novo]
    alvo?.focus()
    alvo?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  return (
    <div role="tablist" aria-label={rotulo} className={className}>
      {abas.map((a, i) => {
        const marcada = a.id === ativa
        return (
          <button
            key={a.id}
            ref={(el) => {
              botoes.current[i] = el
            }}
            type="button"
            role="tab"
            id={idAba(base, a.id)}
            aria-selected={marcada}
            aria-controls={idPainel(base, a.id)}
            aria-label={a.nome}
            tabIndex={marcada ? 0 : -1}
            onClick={() => aoTrocar(a.id)}
            onKeyDown={(e) => teclas(e, i)}
            style={a.estilo}
            className={classeAba(marcada)}
          >
            {a.icone}
            {a.rotulo}
          </button>
        )
      })}
    </div>
  )
}
