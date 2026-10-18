// Bloco 1: a prova na frente. No celular, título, subtítulo e WhatsApp aparecem primeiro; o plantão do atendente vem
// logo abaixo e os números fecham a tela. No PC, a coluna da esquerda leva texto e números, e o plantão ocupa a
// direita. A captura estática do painel saiu do hero em 18/10/2026: ela continua na vitrine e na seção de IA.
import { useEffect, useRef, type RefObject } from 'react'
import { WHATSAPP } from '../lib/whatsapp'
import { FRASES_MARCADAS, conteudoHome, numerosDeProva } from './conteudo'
import { partirNasFrases } from './lib/marcar'
import { Marcacao } from './Marcacao'
import { Plantao } from './Plantao'

/**
 * Faz os números contarem de 0 até o valor (~600 ms) quando a linha assenta inteira na tela.
 * O texto que o React escreveu (o número final) só é trocado dentro da animação: até a linha assentar, e se ela
 * nunca assentar, o número final fica como está. Sem JS, ou com reduced-motion, nada é tocado.
 */
function useContagemAoAssentar(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const linha = ref.current
    if (!linha || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const alvos = [...linha.querySelectorAll<HTMLElement>('[data-valor]')]
    const finais = alvos.map((el) => Number(el.dataset.valor))
    const escrever = (k: number) => alvos.forEach((el, i) => (el.textContent = String(Math.round(finais[i] * k))))
    let id = 0
    let contando = false
    const contar = () => {
      contando = true
      const inicio = performance.now()
      escrever(0)
      const passo = (t: number) => {
        const f = Math.min((t - inicio) / 600, 1)
        escrever(1 - (1 - f) ** 3)
        if (f < 1) id = requestAnimationFrame(passo)
        else contando = false
      }
      id = requestAnimationFrame(passo)
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        obs.disconnect()
        contar()
      }
    }, { threshold: 1 })
    obs.observe(linha)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(id)
      // Interrompida no meio (troca de página, StrictMode): devolve o número final que o React escreveu.
      if (contando) escrever(1)
    }
  }, [ref])
}

/** Primeiro bloco da home: prova, promessa, WhatsApp, números e o plantão do atendente. */
export function Promessa() {
  const { promessa } = conteudoHome()
  const n = numerosDeProva()
  const titulo = partirNasFrases(promessa.titulo, FRASES_MARCADAS.promessa)
  const numeros = useRef<HTMLDivElement>(null)
  useContagemAoAssentar(numeros)
  const { rotulos } = promessa
  const itens = [
    { valor: n.anos, rotulo: rotulos.anos },
    { valor: n.empresas, rotulo: rotulos.empresas },
    { valor: n.projetos, rotulo: rotulos.projetos },
  ]
  return (
    <section id="inicio" className="secao promessa">
      <div className="promessa-texto">
        <h1 className="text-[2.5rem] leading-[1.08] font-semibold sm:text-6xl lg:text-[3.5rem] xl:text-6xl">
          {titulo ? (
            titulo.map((p, i) => (p.marcado ? <Marcacao key={i} tipo="grifo">{p.texto}</Marcacao> : p.texto))
          ) : (
            promessa.titulo
          )}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-grafite sm:text-xl">{promessa.subtitulo}</p>
        <a className="cta toque mt-8" href={WHATSAPP} target="_blank" rel="noopener">
          {promessa.cta}
          <span className="seta" aria-hidden="true">→</span>
        </a>
      </div>
      <Plantao />
      <div ref={numeros} className="promessa-numeros grid max-w-xl grid-cols-3 gap-4 sm:gap-8">
        {itens.map((i) => (
          <div key={i.rotulo} className="flex flex-col gap-1 border-t border-linha pt-4">
            <span data-valor={i.valor} className="font-[family-name:var(--fonte-titulo)] text-4xl leading-none tabular-nums sm:text-5xl">
              {i.valor}
            </span>
            <span className="text-sm leading-snug text-grafite">{i.rotulo}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
