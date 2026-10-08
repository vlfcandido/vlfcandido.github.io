import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { passos, recebe } from '../conteudo'

/** Barrinha que faz as vezes de texto nas miniaturas. */
function Barra({ l, forte }: { l: string; forte?: boolean }) {
  return <span className={`block h-[7px] rounded-full ${forte ? 'bg-grafite/60' : 'bg-linha'}`} style={{ width: l }} />
}

/** Visto pequeno, no verde da identidade. */
function Visto() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" className="shrink-0 text-mata">
      <path d="M3 8.5l3 3l7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Miniatura do que a pessoa recebe em cada passo: a proposta, o link de teste, a ficha de entrega
 * e a semana de correção. É ilustração (o texto de verdade está ao lado), fora do leitor de tela.
 */
function Miniatura({ i }: { i: number }) {
  const papel = 'recebe rounded-xl border border-linha bg-folha p-4 text-[0.82rem] leading-tight'
  if (i === 0)
    return (
      <div aria-hidden="true" className={papel}>
        <p className="font-semibold">Proposta</p>
        <p className="mt-3 text-grafite">O que entra</p>
        <div className="mt-1.5 space-y-1.5">
          <Barra l="85%" /> <Barra l="70%" /> <Barra l="55%" />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-linha pt-3">
          <span className="text-grafite">Prazo e valor</span>
          <span className="rotate-[-4deg] rounded border-2 border-pitanga px-1.5 py-0.5 font-bold text-pitanga-texto">fechado</span>
        </div>
      </div>
    )
  if (i === 1)
    return (
      <div aria-hidden="true" className={papel}>
        <div className="flex items-center gap-1.5 rounded-md border border-linha bg-nevoa px-2 py-1.5">
          <span className="size-1.5 rounded-full bg-linha" />
          <span className="size-1.5 rounded-full bg-linha" />
          <span className="ml-1 truncate text-grafite">link para testar</span>
        </div>
        <div className="mt-3 space-y-1.5">
          <Barra l="60%" forte /> <Barra l="90%" /> <Barra l="75%" />
        </div>
        <div className="mt-3 rounded-lg rounded-bl-sm bg-cobalto px-2.5 py-2 text-nevoa">
          <span className="font-semibold">Notícia das 12h:</span> o cadastro está pronto, o painel sai à noite.
        </div>
      </div>
    )
  if (i === 2)
    return (
      <div aria-hidden="true" className={papel}>
        <p className="font-semibold">Ficha de entrega</p>
        <ul className="mt-3 space-y-2">
          {['O que foi feito', 'Como usar', 'Testes'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Visto />
              <span className="w-24 shrink-0">{t}</span>
              <Barra l="100%" />
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-linha pt-2.5 font-semibold text-mata">Todos os testes passaram</p>
      </div>
    )
  return (
    <div aria-hidden="true" className={papel}>
      <p className="font-semibold">Semana de correção</p>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }, (_, d) => (
          <span
            key={d}
            className={`grid aspect-square place-items-center rounded border text-[0.75rem] ${
              d === 3 ? 'border-pitanga bg-pitanga/15 font-bold text-pitanga-texto' : 'border-linha text-grafite'
            }`}
          >
            {d + 1}
          </span>
        ))}
      </div>
      <p className="mt-3 text-grafite">Dia 4: falhou, corrigido no mesmo dia, sem custo.</p>
    </div>
  )
}

/**
 * Como funciona: os quatro passos numa linha do tempo. No computador, clicar num passo (ou usar as
 * setas) mostra embaixo o que a pessoa recebe naquele momento; no celular, a rolagem avança o passo
 * ativo e cada passo já traz a sua miniatura.
 */
export function ComoFunciona() {
  const [ativo, setAtivo] = useState(0)
  const itens = useRef<(HTMLLIElement | null)[]>([])
  const botoes = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const celular = window.matchMedia('(max-width: 1023px)')
    let obs: IntersectionObserver | null = null
    function ligar() {
      obs?.disconnect()
      obs = null
      if (!celular.matches) return
      // Faixa no meio da tela: o passo que passa por ela vira o ativo.
      obs = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (e.isIntersecting) setAtivo(Number((e.target as HTMLElement).dataset.indice))
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      )
      itens.current.forEach((el) => el && obs?.observe(el))
    }
    ligar()
    celular.addEventListener('change', ligar)
    return () => {
      celular.removeEventListener('change', ligar)
      obs?.disconnect()
    }
  }, [])

  /** Setas andam entre os passos, levando o foco junto. */
  function teclas(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const novo = (i + delta + passos.length) % passos.length
    setAtivo(novo)
    botoes.current[novo]?.focus()
  }

  const ultimo = ativo === passos.length - 1
  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="scroll-mt-24 border-t border-linha py-20 sm:py-28">
      <h2 id="como-titulo" className="text-[2rem] leading-[1.12] font-bold tracking-[0.004em] sm:text-[2.6rem]">
        Como funciona
      </h2>
      <p className="prosa mt-3 max-w-[52ch] text-[1.08rem] text-grafite">Do primeiro contato à semana depois da entrega.</p>
      <ol className="mt-12 grid gap-y-10 lg:grid-cols-4 lg:gap-x-10">
        {passos.map((p, i) => {
          const estado = i === ativo ? 'ativo' : i < ativo ? 'feito' : 'depois'
          return (
            <li
              key={p.titulo}
              ref={(el) => {
                itens.current[i] = el
              }}
              data-indice={i}
              data-estado={estado}
              aria-current={i === ativo ? 'step' : undefined}
              className="passo relative"
            >
              <button
                type="button"
                ref={(el) => {
                  botoes.current[i] = el
                }}
                aria-controls="como-recebe"
                onClick={() => setAtivo(i)}
                onKeyDown={(e) => teclas(e, i)}
                className="grid w-full grid-cols-[2.6rem_1fr] gap-4 rounded-lg text-left lg:block"
              >
                <span className="passo-numero grid size-[2.6rem] place-items-center rounded-full text-[1.1rem] font-bold">{i + 1}</span>
                <span className="block lg:mt-6">
                  <span className="passo-titulo block text-[1.2rem] leading-[1.3] font-semibold">{p.titulo}</span>
                  <span className="prosa mt-2 block max-w-[34ch] text-[1.05rem] text-grafite">{p.descricao}</span>
                </span>
              </button>
              {/* Celular: o que a pessoa recebe fica junto do passo. */}
              <div className="mt-5 ml-[3.6rem] max-w-[22rem] lg:hidden">
                <p className="mb-3 text-[0.95rem] font-semibold text-grafite">Você recebe</p>
                <p className="sr-only">{recebe[i]}</p>
                <Miniatura i={i} />
              </div>
            </li>
          )
        })}
      </ol>

      {/* Computador: o que a pessoa recebe no passo ativo, num painel embaixo da linha. */}
      <div id="como-recebe" aria-live="polite" className="mt-14 hidden grid-cols-[1fr_20rem] items-center gap-12 rounded-2xl border border-linha bg-folha/50 p-10 lg:grid">
        <div key={ativo} className="troca">
          <p className="text-[1rem] font-semibold text-pitanga-texto">
            Passo {ativo + 1} de {passos.length}: o que você recebe
          </p>
          <p className="mt-3 max-w-[34ch] text-[1.6rem] leading-[1.3] font-semibold">{recebe[ativo]}</p>
          <button type="button" onClick={() => setAtivo(ultimo ? 0 : ativo + 1)} className="sublinha mt-6 font-medium text-cobalto">
            {ultimo ? 'Voltar ao primeiro passo' : 'Próximo passo'}
          </button>
        </div>
        <div key={`m${ativo}`} className="troca">
          <Miniatura i={ativo} />
        </div>
      </div>
    </section>
  )
}
