import { useEffect, useRef, useState } from 'react'
import { passos } from '../conteudo'

/**
 * Como funciona: os quatro passos, na ordem em que acontecem, numa trilha com o passo ativo.
 * No computador o passo ativo segue o mouse, o foco ou o clique; no celular, a rolagem.
 */
export function ComoFunciona() {
  const [ativo, setAtivo] = useState(0)
  const itens = useRef<(HTMLLIElement | null)[]>([])

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

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="scroll-mt-24 py-20 sm:py-28">
      <h2 id="como-titulo" className="text-[2rem] leading-[1.12] font-bold tracking-[0.004em] sm:text-[2.6rem]">
        Como funciona
      </h2>
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
                onClick={() => setAtivo(i)}
                onMouseEnter={() => setAtivo(i)}
                onFocus={() => setAtivo(i)}
                className="grid w-full grid-cols-[2.6rem_1fr] gap-4 rounded-lg text-left lg:block"
              >
                <span className="passo-numero grid size-[2.6rem] place-items-center rounded-full text-[1.1rem] font-bold">
                  {i + 1}
                </span>
                <span className="block lg:mt-6">
                  <span className="passo-titulo block text-[1.2rem] leading-[1.3] font-semibold">{p.titulo}</span>
                  <span className="prosa mt-2 block max-w-[34ch] text-[1.05rem] text-grafite">{p.descricao}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
