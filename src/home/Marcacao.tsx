// Marcação de caneta sobre o "detalhe": desenha quando entra na tela (IntersectionObserver no useEffect,
// nunca no import). Com prefers-reduced-motion, já aparece desenhada (o CSS cuida).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { caminhoCirculo } from './lib/marcacao'

/**
 * Envolve um trecho de texto e o marca à mão: `circulo` circula, `grifo` passa marca-texto por baixo.
 *
 * @param props.tipo estilo da marcação.
 * @param props.semente fixa o traço do círculo (use o índice do item).
 * @param props.ativo quando informado, a marcação só desenha com ele `true` (ex.: o cartão assentou no centro
 *   do carrossel); continua esperando também entrar na tela.
 * @param props.children o texto marcado.
 */
export function Marcacao({
  tipo = 'grifo',
  semente = 1,
  ativo,
  children,
}: {
  tipo?: 'circulo' | 'grifo'
  semente?: number
  ativo?: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visivel, setVisivel] = useState(false)
  const [caixa, setCaixa] = useState({ l: 200, a: 40 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Mede a caixa agora, de novo quando ela muda de tamanho (quebra de linha, rotação) e quando as
    // fontes terminam de carregar (Fraunces troca a largura do texto): o círculo abraça o texto real.
    let montado = true
    const medir = () => montado && setCaixa({ l: el.offsetWidth, a: el.offsetHeight })
    medir()
    const redim = 'ResizeObserver' in window ? new ResizeObserver(medir) : null
    redim?.observe(el)
    document.fonts?.ready.then(medir)
    const fim = () => {
      montado = false
      redim?.disconnect()
    }
    if (!('IntersectionObserver' in window)) {
      setVisivel(true)
      return fim
    }
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setVisivel(true), obs.disconnect()), { threshold: 0.6 })
    obs.observe(el)
    return () => {
      obs.disconnect()
      fim()
    }
  }, [])
  return (
    <span ref={ref} className={`marcacao marcacao-${tipo}${visivel && (ativo ?? true) ? ' desenhada' : ''}`}>
      {children}
      {tipo === 'circulo' && (
        <svg aria-hidden="true" className="marcacao-traco" viewBox={`${-caixa.l * 0.08} ${-caixa.a * 0.08} ${caixa.l * 1.16} ${caixa.a * 1.16}`} preserveAspectRatio="none">
          <path d={caminhoCirculo(caixa.l, caixa.a, semente)} pathLength={1} />
        </svg>
      )}
    </span>
  )
}
