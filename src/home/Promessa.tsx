// Bloco 1: a prova na frente. No celular, uma tela só com prova, promessa, WhatsApp e números; no PC, a
// tela de um trabalho à direita, com o círculo de caneta em volta do detalhe (acaba a metade vazia).
import { useEffect, useRef, type RefObject } from 'react'
import { caminhoPublico } from '../lib/assets'
import { WHATSAPP } from '../lib/whatsapp'
import { empresasDiretas, type EmpresaDireta } from '../clientes'
import { logoClara } from '../components/Logo'
import { EVENTO_ABRIR_EMPRESA, FRASES_MARCADAS, MARCAS_TOPO, conteudoHome, numerosDeProva } from './conteudo'
import { partirNasFrases } from './lib/marcar'
import { AnimacaoTrabalho } from './AnimacaoTrabalho'
import { Marcacao } from './Marcacao'

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

// 21/10/2026: a Vitrine (print da Liga Várzea com o círculo de caneta, só no PC) saiu para a AnimacaoTrabalho.

/**
 * Faixa com as logos das três marcas do título (21/10/2026, pedido dele). Cada logo leva à trajetória; o nome vai
 * no texto alternativo, porque a faixa é o único lugar em que a logo aparece sem o nome ao lado.
 */
function FaixaMarcas() {
  const base = import.meta.env.BASE_URL
  const { empresas } = conteudoHome()
  const marcas = MARCAS_TOPO.map((slug) => empresasDiretas.find((e) => e.slug === slug)).filter(
    (e): e is EmpresaDireta & { logo: string } => Boolean(e?.logo),
  )
  return (
    <ul className="faixa-marcas" aria-label={empresas.faixa}>
      {marcas.map((e) => (
        <li key={e.slug}>
          {/* 22/10/2026: além de rolar até a Trajetória, abre a empresa clicada lá. */}
          <a className="toque" href="#empresas" onClick={() => window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_EMPRESA, { detail: e.slug }))}>
            <img className="logo-empresa" data-slug={e.slug} data-clara={logoClara(e.slug)} src={caminhoPublico(base, e.logo)} alt={e.nome} height={28} decoding="async" />
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Primeiro bloco da home: prova, promessa, marcas, animação do trabalho, WhatsApp e números. */
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
        <FaixaMarcas />
        {/* Celular: a animação entra entre as marcas e o botão; no PC ela fica na coluna da direita. */}
        <AnimacaoTrabalho className="mt-6 lg:hidden" />
        <a className="cta toque mt-8" href={WHATSAPP} target="_blank" rel="noopener">
          {promessa.cta}
          <span className="seta" aria-hidden="true">→</span>
        </a>
        {/* 21/10/2026 (decisão dele): no celular os números saem (repetem o título e as logos) para a animação caber. */}
        <div ref={numeros} className="mt-10 hidden max-w-xl grid-cols-3 gap-4 sm:grid sm:gap-8">
          {itens.map((i) => (
            <div key={i.rotulo} className="flex flex-col gap-1 border-t border-linha pt-4">
              <span data-valor={i.valor} className="font-[family-name:var(--fonte-titulo)] text-4xl leading-none tabular-nums sm:text-5xl">
                {i.valor}
              </span>
              <span className="text-sm leading-snug text-grafite">{i.rotulo}</span>
            </div>
          ))}
        </div>
      </div>
      <AnimacaoTrabalho className="hidden lg:block" />
    </section>
  )
}
