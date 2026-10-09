import { useEffect, useRef, useState } from 'react'
import { perfil } from '../conteudo'
import { MESMO_NIVEL, NIVEIS, NIVEIS_CELULAR } from '../lib/niveis'
import { HASH_PROJETOS, type Rota } from '../lib/rota'
import { WHATSAPP } from '../lib/whatsapp'
import { BotaoTema } from './BotaoTema'
import { IconeConversa } from './IconeConversa'
import { LinkExterno } from './LinkExterno'

/**
 * Acompanha, na principal, o nível que está na faixa de cima da tela e quanto da página já foi
 * rolado (0 a 1). Fora da principal, não observa nada.
 */
function useProfundidade(ativo: boolean): { nivel: string | null; fracao: number } {
  const [nivel, setNivel] = useState<string | null>(null)
  const [fracao, setFracao] = useState(0)
  useEffect(() => {
    if (!ativo) {
      setNivel(null)
      return
    }
    let quadro = 0
    const medir = () => {
      cancelAnimationFrame(quadro)
      quadro = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setFracao(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
      })
    }
    medir()
    window.addEventListener('scroll', medir, { passive: true })
    window.addEventListener('resize', medir)

    let obs: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
      const ids = [...NIVEIS.map((n) => n.href.slice(1)), ...Object.keys(MESMO_NIVEL)]
      obs = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) if (e.isIntersecting) setNivel(MESMO_NIVEL[e.target.id] ?? `#${e.target.id}`)
        },
        { rootMargin: '-30% 0px -65% 0px' },
      )
      ids.map((id) => document.getElementById(id)).forEach((el) => el && obs?.observe(el))
    }
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', medir)
      window.removeEventListener('resize', medir)
      obs?.disconnect()
    }
  }, [ativo])
  return { nivel, fracao }
}

/**
 * Régua de profundidade fixa na margem esquerda, só em telas largas (onde a margem comporta): uma
 * linha vertical com as cotas de 0 m a 40 m; a parte já percorrida fica em mar e o nível à vista
 * ganha a boia coral e o nome. Cada cota leva ao seu nível.
 */
function ReguaLateral({ nivel, fracao }: { nivel: string | null; fracao: number }) {
  return (
    <nav aria-label="Profundidade da página" className="regua-lateral">
      <span aria-hidden="true" className="regua-trilho">
        <span className="regua-percorrido" style={{ transform: `scaleY(${fracao})` }} />
      </span>
      <ol>
        {NIVEIS.map((n) => {
          const aqui = n.href === nivel
          return (
            <li key={n.href}>
              <a href={n.href} aria-current={aqui ? 'location' : undefined} className="regua-marca">
                <span className="regua-cota">{n.cota} m</span>
                <span className="regua-nome">{n.rotulo}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Cabeçalho fixo: nome, tema e o WhatsApp sempre à vista. No computador, os níveis ficam na linha
 * do nome (e, em tela larga, também na régua lateral); no celular, viram a régua fina embaixo dela:
 * uma fileira rolável com as cotas e uma linha que se enche conforme a pessoa desce.
 */
export function Cabecalho({ rota }: { rota: Rota }) {
  const principal = rota !== 'projetos'
  const { nivel, fracao } = useProfundidade(principal)
  const fileira = useRef<HTMLOListElement>(null)
  const naProjetos = rota === 'projetos'

  // Mantém o nível marcado à vista na fileira rolável do celular.
  useEffect(() => {
    const caixa = fileira.current
    const el = caixa?.querySelector<HTMLElement>('[aria-current]')
    if (!caixa || !el) return
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    caixa.scrollTo({ left: el.offsetLeft - 16, behavior: suave ? 'smooth' : 'auto' })
  }, [nivel, rota])

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-linha/70 bg-nevoa/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:gap-5 sm:px-8 lg:py-3">
          <a href="#/" className="mr-auto inline-flex items-baseline gap-[0.15em] text-[1.05rem] font-bold tracking-[0.004em]">
            {perfil.nome}
            <span aria-hidden="true" className="ponto" />
          </a>
          <nav aria-label="Seções" className="hidden lg:block">
            <ul className="flex gap-6 text-[0.95rem] text-grafite">
              {NIVEIS.slice(1).map((n) => (
                <li key={n.href}>
                  <a className="sublinha leve hover:text-tinta aria-[current]:text-tinta" href={n.href} aria-current={n.href === nivel ? 'location' : undefined}>
                    {n.rotulo}
                  </a>
                </li>
              ))}
              <li>
                <a className="sublinha leve hover:text-tinta aria-[current]:text-tinta" href={HASH_PROJETOS} aria-current={naProjetos ? 'page' : undefined}>
                  Projetos
                </a>
              </li>
            </ul>
          </nav>
          <BotaoTema />
          {/* Desde 09/10/2026 o contato fixo do cabeçalho é o WhatsApp (antes, "Falar comigo no LinkedIn"). */}
          <LinkExterno
            href={WHATSAPP}
            className="botao-acao hidden items-center gap-2 rounded-full bg-cobalto py-2 pr-4 pl-3.5 text-[0.95rem] font-semibold whitespace-nowrap text-nevoa hover:bg-cobalto-forte sm:inline-flex"
          >
            <IconeConversa tamanho={18} />
            WhatsApp
          </LinkExterno>
        </div>
        {/* Celular: a régua fina. */}
        {/* Abaixo de sm (M17, 08/10/2026): sem a Abertura, sem cotas, rótulos curtos e "Projetos" fixo à
            direita, fora da rolagem. Entre sm e lg, a régua de antes. */}
        <nav aria-label="Profundidade da página" className="lg:hidden">
          <div className="mx-auto flex max-w-7xl items-baseline">
            <ol ref={fileira} className="rolagem-lateral flex min-w-0 flex-1 items-baseline gap-5 overflow-x-auto px-4 pb-2 max-sm:pr-3 sm:px-8">
              {NIVEIS.map((n) => (
                <li key={n.href} className={`shrink-0 ${NIVEIS_CELULAR.includes(n) ? '' : 'max-sm:hidden'}`}>
                  <a href={n.href} aria-current={n.href === nivel ? 'location' : undefined} className="regua-chip">
                    <span className="regua-cota max-sm:hidden">{n.cota} m </span>
                    <span className="sm:hidden">{n.curto}</span>
                    <span className="max-sm:hidden">{n.rotulo}</span>
                  </a>
                </li>
              ))}
              <li className="shrink-0 max-sm:hidden">
                <a href={HASH_PROJETOS} aria-current={naProjetos ? 'page' : undefined} className="regua-chip">
                  Projetos
                </a>
              </li>
            </ol>
            <div className="shrink-0 border-l border-linha/70 pr-4 pb-2 pl-3 sm:hidden">
              <a href={HASH_PROJETOS} aria-current={naProjetos ? 'page' : undefined} className="regua-chip">
                Projetos
              </a>
            </div>
          </div>
          {principal && (
            <span aria-hidden="true" className="block h-[2px] bg-linha/60">
              <span className="regua-progresso block h-full origin-left bg-cobalto" style={{ transform: `scaleX(${fracao})` }} />
            </span>
          )}
        </nav>
      </header>
      {principal && <ReguaLateral nivel={nivel} fracao={fracao} />}
    </>
  )
}
