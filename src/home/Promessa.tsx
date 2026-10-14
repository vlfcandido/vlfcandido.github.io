// Bloco 1: a prova na frente. O título já diz quem e para quem; o CTA leva ao WhatsApp.
import { useEffect, useRef, type RefObject } from 'react'
import { WHATSAPP } from '../lib/whatsapp'
import { conteudoHome, numerosDeProva } from './conteudo'
import { Marcacao } from './Marcacao'

/** Conta de 0 até o valor em ~600 ms, só com movimento liberado; sem JS, o número final já está no HTML. */
function useContagem(ref: RefObject<HTMLElement | null>, alvo: number) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const inicio = performance.now()
    let id = 0
    const passo = (t: number) => {
      const f = Math.min((t - inicio) / 600, 1)
      el.textContent = String(Math.round(alvo * (1 - (1 - f) ** 3)))
      if (f < 1) id = requestAnimationFrame(passo)
    }
    id = requestAnimationFrame(passo)
    return () => {
      cancelAnimationFrame(id)
      el.textContent = String(alvo)
    }
  }, [ref, alvo])
}

/** Um número da prova com o rótulo. */
function Numero({ valor, rotulo }: { valor: number; rotulo: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useContagem(ref, valor)
  return (
    <div className="flex flex-col gap-1 border-t border-linha pt-4">
      <span ref={ref} className="font-[family-name:var(--fonte-titulo)] text-4xl leading-none tabular-nums sm:text-5xl">
        {valor}
      </span>
      <span className="text-sm leading-snug text-grafite">{rotulo}</span>
    </div>
  )
}

/** Primeiro bloco da home: prova, promessa e WhatsApp. */
export function Promessa() {
  const { promessa } = conteudoHome()
  const n = numerosDeProva()
  const [antes, depois] = promessa.titulo.split('Sicoob e Serasa Experian')
  return (
    <section id="inicio" className="secao flex flex-col justify-center">
      <h1 className="max-w-4xl text-[2.5rem] leading-[1.08] font-semibold sm:text-6xl lg:text-7xl">
        {antes}
        <Marcacao tipo="grifo">Sicoob e Serasa Experian</Marcacao>
        {depois}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-grafite sm:text-xl">{promessa.subtitulo}</p>
      <div>
        <a className="cta mt-8" href={WHATSAPP} target="_blank" rel="noopener">
          {promessa.cta}
          <span className="seta" aria-hidden="true">→</span>
        </a>
      </div>
      <div className="mt-12 grid max-w-2xl grid-cols-3 gap-4 sm:gap-8">
        <Numero valor={n.anos} rotulo="anos de software" />
        <Numero valor={n.empresas} rotulo="empresas de grande porte" />
        <Numero valor={n.projetos} rotulo="projetos no portfólio" />
      </div>
    </section>
  )
}
