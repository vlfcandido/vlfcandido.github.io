// Bloco 4: os 3 trabalhos em destaque, com a dor do cliente e o detalhe marcado. No celular, carrossel com
// encaixe e indicador que anda com o dedo; o grifo desenha quando o cartão assenta. No PC, 3 colunas.
// A galeria completa fica em #/projetos (decisão dele, 14/10/2026), e o botão não leva número.
import { useEffect, useRef, useState, type RefObject } from 'react'
import { caminhoPublico } from '../lib/assets'
import { HASH_PROJETOS } from '../lib/rota'
import { conteudoHome, type Destaque } from './conteudo'
import { Marcacao } from './Marcacao'

/** Largura em que o carrossel vira grade de 3 colunas (igual ao CSS). */
const PC = '(min-width: 1024px)'

/** Link de um destaque: hash fica como está; caminho de `public/` ganha a base do site. */
function hrefDe(href: string): string {
  return href.startsWith('#') ? href : caminhoPublico(import.meta.env.BASE_URL, href)
}

/**
 * Acompanha o carrossel: move o indicador de progresso com o dedo (só transform, sem re-render) e diz quais
 * cartões já assentaram inteiros no trilho. No PC (sem carrossel) devolve `null`: a marcação segue a tela.
 */
function useCarrossel(trilho: RefObject<HTMLUListElement | null>, barra: RefObject<HTMLSpanElement | null>) {
  const [assentados, setAssentados] = useState<Set<number> | null>(null)
  useEffect(() => {
    const ul = trilho.current
    if (!ul) return
    const mq = window.matchMedia(PC)
    let obs: IntersectionObserver | null = null
    let quadro = 0
    const mover = () => {
      quadro = 0
      const span = barra.current
      if (!span) return
      const fatia = Math.min(ul.clientWidth / ul.scrollWidth, 1)
      const max = ul.scrollWidth - ul.clientWidth
      const pos = max > 0 ? ul.scrollLeft / max : 0
      span.style.width = `${fatia * 100}%`
      span.style.transform = `translateX(${(pos * (1 - fatia) * 100) / fatia}%)`
    }
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(mover)
    }
    const montar = () => {
      obs?.disconnect()
      if (mq.matches || !('IntersectionObserver' in window)) {
        setAssentados(null)
        return
      }
      setAssentados(new Set())
      obs = new IntersectionObserver(
        (entradas) => {
          const novos = entradas.filter((e) => e.isIntersecting).map((e) => Number((e.target as HTMLElement).dataset.indice))
          if (novos.length) setAssentados((s) => new Set([...(s ?? []), ...novos]))
        },
        { root: ul, threshold: 0.9 },
      )
      for (const li of ul.children) obs.observe(li)
      mover()
    }
    montar()
    ul.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    mq.addEventListener('change', montar)
    return () => {
      obs?.disconnect()
      cancelAnimationFrame(quadro)
      ul.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
      mq.removeEventListener('change', montar)
    }
  }, [trilho, barra])
  return assentados
}

/** Cartão de um destaque: a dor do cliente e o detalhe que ninguém viu, marcado. */
function CartaoDestaque({ d, indice, assentado }: { d: Destaque; indice: number; assentado?: boolean }) {
  return (
    <li data-indice={indice}>
      <a href={hrefDe(d.href)} className="cartao toque">
        <div className="imagem-reservada aspect-[16/10] overflow-hidden border-b border-linha">
          <img
            src={caminhoPublico(import.meta.env.BASE_URL, d.imagem)}
            width={1000}
            height={625}
            alt={d.alt}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover object-top"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <h3 className="text-xl font-semibold">{d.nome}</h3>
          <p className="mt-2 text-sm text-grafite">{d.dor}</p>
          <p className="mt-4 leading-relaxed">
            <Marcacao tipo="grifo" ativo={assentado}>
              {d.detalhe}
            </Marcacao>
          </p>
        </div>
      </a>
    </li>
  )
}

/** Quarto bloco da home: os 3 trabalhos em destaque e o caminho para todos os projetos. */
export function Trabalhos() {
  const { destaques, trabalhos } = conteudoHome()
  const trilho = useRef<HTMLUListElement>(null)
  const barra = useRef<HTMLSpanElement>(null)
  const assentados = useCarrossel(trilho, barra)
  return (
    <section id="trabalhos" className="secao tela">
      <h2 className="titulo-bloco alvo-secao"><span className="titulo-texto">{trabalhos.titulo}</span></h2>
      <ul ref={trilho} className="carrossel mt-6 lg:mt-8">
        {destaques.map((d, i) => (
          <CartaoDestaque key={d.slug} d={d} indice={i} assentado={assentados ? assentados.has(i) : undefined} />
        ))}
      </ul>
      <div className="progresso" aria-hidden="true">
        <span ref={barra} />
      </div>
      <div className="mt-6 lg:mt-8">
        <a href={HASH_PROJETOS} className="link-secundario toque">
          {trabalhos.verTodos}
          <span className="seta" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
