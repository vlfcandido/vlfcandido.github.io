// Marcação de caneta sobre o "detalhe": desenha quando entra na tela (IntersectionObserver no useEffect,
// nunca no import). Com prefers-reduced-motion, já aparece desenhada (o CSS cuida).
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { caminhoCirculo } from './lib/marcacao'

/**
 * Envolve um trecho de texto e o marca à mão: `circulo` circula, `grifo` passa marca-texto por baixo.
 *
 * @param props.tipo estilo da marcação.
 * @param props.semente fixa o traço do círculo (use o índice do item).
 * @param props.children o texto marcado.
 */
export function Marcacao({ tipo = 'grifo', semente = 1, children }: { tipo?: 'circulo' | 'grifo'; semente?: number; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visivel, setVisivel] = useState(false)
  const [caixa, setCaixa] = useState({ l: 200, a: 40 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    setCaixa({ l: el.offsetWidth, a: el.offsetHeight })
    if (!('IntersectionObserver' in window)) return setVisivel(true)
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setVisivel(true), obs.disconnect()), { threshold: 0.6 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <span ref={ref} className={`marcacao marcacao-${tipo}${visivel ? ' desenhada' : ''}`}>
      {children}
      {tipo === 'circulo' && (
        <svg aria-hidden="true" className="marcacao-traco" viewBox={`${-caixa.l * 0.08} ${-caixa.a * 0.08} ${caixa.l * 1.16} ${caixa.a * 1.16}`} preserveAspectRatio="none">
          <path d={caminhoCirculo(caixa.l, caixa.a, semente)} pathLength={1} />
        </svg>
      )}
    </span>
  )
}
