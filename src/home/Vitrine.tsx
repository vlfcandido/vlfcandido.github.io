// Vitrine das oito peças navegáveis (18/10/2026). Ocupa o lugar do antigo bloco de protótipo, que mostrava uma peça
// só: o argumento "veja antes de fechar" agora vem sustentado por oito telas de verdade. No celular é um trilho com
// encaixe e o próximo cartão aparecendo pela metade; no PC, quatro colunas em duas fileiras. O marca-texto risca a dor
// do cartão em que a pessoa para (celular) ou aponta (mouse e teclado), que é a assinatura do site.
import { useEffect, useRef, useState, type RefObject } from 'react'
import { SeloFicticio } from '../components/Print'
import { caminhoPublico } from '../lib/assets'
import { conteudoHome } from './conteudo'
import { pecasDaVitrine } from './lib/vitrine'

/** Largura em que o trilho vira grade de quatro colunas (igual ao CSS). */
const PC = '(min-width: 1024px)'

/**
 * Acompanha o trilho no celular: move a barra de progresso com o dedo e diz qual cartão está assentado, para o
 * marca-texto riscar a dor dele. No PC não há trilho: devolve `null` e o marca-texto fica só no hover e no foco.
 *
 * @param trilho a lista que rola na horizontal.
 * @param barra o trecho colorido da barra de progresso.
 * @returns o índice do cartão assentado, ou `null` no PC.
 */
function useTrilho(
  trilho: RefObject<HTMLUListElement | null>,
  barra: RefObject<HTMLSpanElement | null>,
): number | null {
  const [assentado, setAssentado] = useState<number | null>(null)
  useEffect(() => {
    const ul = trilho.current
    if (!ul) return
    const mq = window.matchMedia(PC)
    let quadro = 0
    const medir = () => {
      quadro = 0
      const span = barra.current
      if (!span) return
      const fatia = Math.min(ul.clientWidth / ul.scrollWidth, 1)
      const max = ul.scrollWidth - ul.clientWidth
      const pos = max > 0 ? ul.scrollLeft / max : 0
      span.style.width = `${fatia * 100}%`
      span.style.transform = `translateX(${fatia > 0 ? (pos * (1 - fatia) * 100) / fatia : 0}%)`
      if (mq.matches) {
        setAssentado(null)
        return
      }
      const item = ul.firstElementChild as HTMLElement | null
      if (!item) return
      const passo = item.offsetWidth + (parseFloat(getComputedStyle(ul).columnGap) || 0)
      const indice = Math.max(0, Math.min(ul.children.length - 1, Math.round(ul.scrollLeft / passo)))
      setAssentado((atual) => (atual === indice ? atual : indice))
    }
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir)
    }
    medir()
    ul.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    mq.addEventListener('change', medir)
    return () => {
      cancelAnimationFrame(quadro)
      ul.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
      mq.removeEventListener('change', medir)
    }
  }, [trilho, barra])
  return assentado
}

/**
 * Vitrine das peças navegáveis: miniatura real, nome, a dor em uma linha e o botão que abre a peça para testar.
 * A pessoa abre no mesmo lugar; as peças de /trabalhos/ têm o próprio cabeçalho com volta.
 */
export function Vitrine() {
  const { experimente } = conteudoHome()
  const base = import.meta.env.BASE_URL
  const pecas = pecasDaVitrine()
  const trilho = useRef<HTMLUListElement>(null)
  const barra = useRef<HTMLSpanElement>(null)
  const assentado = useTrilho(trilho, barra)
  return (
    <section id="experimente" aria-labelledby="experimente-titulo" className="secao vitrine">
      <div className="vitrine-topo">
        <h2 id="experimente-titulo" className="titulo-bloco alvo-secao">
          <span className="titulo-texto">{experimente.titulo}</span>
        </h2>
        <div>
          <p className="vitrine-lede">{experimente.lede}</p>
          {/* 18/10/2026 (revisor, rodada 1): o alvo explícito precisa caber na primeira dobra; o botão do topo leva
              à página em que cada uma das oito tem o seu "Abrir e testar". */}
          <a className="cta toque vitrine-cta" href={caminhoPublico(base, 'trabalhos/')}>
            {experimente.verTodas}
            <span className="seta" aria-hidden="true">→</span>
          </a>
          <p className="vitrine-dica so-toque">Arraste para o lado para ver as oito.</p>
        </div>
      </div>
      <ul ref={trilho} className="vitrine-trilho" aria-label={experimente.titulo}>
        {pecas.map((p, i) => (
          <li
            key={p.slug}
            className={`peca${assentado === i ? ' peca-assentada' : ''}`}
            style={{ animationDelay: `${Math.min(i, 5) * 60}ms` }}
          >
            <a href={caminhoPublico(base, p.href)} className="peca-link toque">
              <span className="peca-janela moldura-navegador">
                <span className="barra-janela" aria-hidden="true"><i /><i /><i /></span>
                <span className="peca-tela">
                  <img
                    src={caminhoPublico(base, p.imagem)}
                    width={1000}
                    height={625}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <SeloFicticio />
                </span>
              </span>
              <div className="peca-ficha">
                <h3 className="peca-nome">{p.nome}</h3>
                <p className="peca-dor"><span className="peca-marca">{p.resumo}</span></p>
                <span className="peca-cta">
                  {experimente.cta}
                  <span className="seta" aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <div className="progresso" aria-hidden="true">
        <span ref={barra} />
      </div>
    </section>
  )
}
