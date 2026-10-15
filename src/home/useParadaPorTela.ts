// Parada por tela no celular (fix final, 14/10/2026). O efeito só começa dentro do useEffect: nada roda ao importar.
import { useEffect } from 'react'
import { paradaDoToque } from './lib/parada'

/** Largura do celular (a mesma do encaixe em home.css). */
const CELULAR = '(max-width: 767px)'
/** Quanto tempo sem rolar conta como "a rolagem parou" (o embalo do iOS continua depois de soltar o dedo). */
const PAROU_MS = 140

/**
 * Depois de um toque que rolou a home no celular, assenta a página no começo da tela seguinte no sentido do dedo
 * (o topo, o começo de cada seção e o fim da página são as paradas). Só reage a toque: rolagem pelo menu, pelo
 * teclado ou pela roda do mouse fica como está. Com reduced-motion, o salto é instantâneo.
 */
export function useParadaPorTela() {
  useEffect(() => {
    const mq = window.matchMedia(CELULAR)
    let yInicio = 0
    let tocando = false
    let depoisDoToque = false
    let relogio = 0
    const paradas = () => {
      const secoes = [...document.querySelectorAll<HTMLElement>('.home > .secao')].filter(
        (s) => getComputedStyle(s).scrollSnapAlign !== 'none',
      )
      const fim = document.documentElement.scrollHeight - window.innerHeight
      return [0, ...secoes.map((s) => Math.round(s.getBoundingClientRect().top + window.scrollY)), fim].filter((p) => p <= fim)
    }
    const assentar = () => {
      relogio = 0
      if (tocando || !depoisDoToque || !mq.matches) return
      depoisDoToque = false
      const alvo = paradaDoToque(window.scrollY, window.scrollY - yInicio, paradas())
      if (alvo === null) return
      const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: alvo, behavior: suave ? 'smooth' : 'auto' })
    }
    const esperar = () => {
      window.clearTimeout(relogio)
      relogio = window.setTimeout(assentar, PAROU_MS)
    }
    const aoTocar = () => {
      tocando = true
      depoisDoToque = false
      yInicio = window.scrollY
    }
    const aoSoltar = () => {
      tocando = false
      depoisDoToque = true
      esperar()
    }
    const aoRolar = () => {
      if (depoisDoToque) esperar()
    }
    window.addEventListener('touchstart', aoTocar, { passive: true })
    window.addEventListener('touchend', aoSoltar, { passive: true })
    window.addEventListener('touchcancel', aoSoltar, { passive: true })
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      window.clearTimeout(relogio)
      window.removeEventListener('touchstart', aoTocar)
      window.removeEventListener('touchend', aoSoltar)
      window.removeEventListener('touchcancel', aoSoltar)
      window.removeEventListener('scroll', aoRolar)
    }
  }, [])
}
