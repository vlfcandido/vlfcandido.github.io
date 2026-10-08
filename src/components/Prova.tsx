import { useRef, useState, type RefObject } from 'react'
import { empresasDiretas, gruposClientes, type Cliente } from '../clientes'
import { cases, destaques, type Destaque } from '../conteudo'
import { HASH_PROJETOS } from '../lib/rota'
import { Abas, idAba, idPainel } from './Abas'
import { Interfaces } from './Interfaces'
import { LinkExterno } from './LinkExterno'
import { Logo } from './Logo'
import { LogosClientes } from './LogosClientes'

const POR_SLUG = new Map<string, Cliente>(
  [...gruposClientes.flatMap((g) => g.clientes), ...empresasDiretas].map((c) => [c.slug, c]),
)

/**
 * Case curto que abre ao clicar: o resultado fica sempre à vista; "Como foi" mostra o problema
 * de antes e o que eu fiz, sem sair do carrossel.
 */
function CartaoCaso({ d }: { d: Destaque }) {
  const [aberto, setAberto] = useState(false)
  const empresa = POR_SLUG.get(d.empresa)
  const antes = cases.find((c) => c.slug === d.slug)?.contexto
  const idCorpo = `caso-corpo-${d.slug}`
  return (
    <li
      data-aberto={aberto}
      className="cartao-caso relative flex w-[86%] shrink-0 snap-start flex-col rounded-xl border border-transparent bg-folha p-5 sm:w-[60%] sm:p-6 md:w-auto"
    >
      <div className="flex h-10 items-center">{empresa && <Logo cliente={empresa} className="max-h-9 max-w-[140px]" />}</div>
      <h4 className="mt-3 text-[1.1rem] leading-[1.3] font-semibold">{d.titulo}</h4>
      <p className="mt-2 text-[1.1rem] leading-[1.4] font-semibold">
        <span className="grifo">{d.resultado}</span>
      </p>
      <div className="mt-auto flex items-center justify-between gap-4 pt-3">
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={idCorpo}
          onClick={() => setAberto((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full py-1 font-medium text-cobalto"
        >
          {aberto ? 'Fechar' : 'Como foi'}
          <svg
            viewBox="0 0 16 16"
            width="13"
            height="13"
            aria-hidden="true"
            className={`transition-transform duration-300 motion-reduce:transition-none ${aberto ? 'rotate-45' : ''}`}
          >
            <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        {d.fonte && (
          <LinkExterno
            href={d.fonte.url}
            className="sublinha text-[0.98rem] text-grafite hover:text-tinta"
          >
            {d.fonte.texto}
          </LinkExterno>
        )}
      </div>
      <div id={idCorpo} className="expansivel" data-aberto={aberto} inert={!aberto}>
        <div>
          {antes && (
            <p className="prosa pt-3 text-[1.05rem] text-grafite">
              <span className="font-titulo font-semibold text-tinta">Antes: </span>
              {antes}
            </p>
          )}
          <p className="prosa mt-3 text-[1.05rem]">{d.texto}</p>
        </div>
      </div>
    </li>
  )
}

/**
 * Pontos que mostram qual case está à vista no carrossel do celular; tocar num ponto rola até ele.
 * Ficam fora do leitor de tela (a lista já diz quantos são).
 */
function Indicador({ lista, atual }: { lista: RefObject<HTMLUListElement | null>; atual: number }) {
  return (
    <div aria-hidden="true" className="mt-3 flex justify-center gap-2 md:hidden">
      {destaques.map((d, i) => (
        <button
          key={d.slug}
          type="button"
          tabIndex={-1}
          onClick={() => {
            const el = lista.current?.children[i] as HTMLElement | undefined
            el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
          }}
          className={`h-2 rounded-full transition-all motion-reduce:transition-none ${i === atual ? 'w-6 bg-cobalto' : 'w-2 bg-linha'}`}
        />
      ))}
    </div>
  )
}

/**
 * Provas: as logos de clientes (faixa com "Descer") e, em duas abas, os três resultados curtos (com
 * fonte pública quando há) (carrossel com indicador no celular, três colunas no computador) e as interfaces
 * que eu construo, com as peças vivas. Assim a prova inteira cabe em pouco mais de uma tela.
 */
export function Prova() {
  const lista = useRef<HTMLUListElement>(null)
  const [atual, setAtual] = useState(0)
  const [aba, setAba] = useState('resultados')

  /** Acompanha qual cartão está mais à esquerda na rolagem lateral. */
  function aoRolar() {
    const el = lista.current
    if (!el || !el.children.length) return
    const largura = (el.children[0] as HTMLElement).offsetWidth + 16
    setAtual(Math.min(destaques.length - 1, Math.round(el.scrollLeft / largura)))
  }

  const resultados = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="sr-only">Alguns resultados</h3>
        <a
          href={HASH_PROJETOS}
          className="text-[0.98rem] text-grafite underline decoration-linha decoration-2 underline-offset-4 hover:text-tinta hover:decoration-cobalto"
        >
          Ver projetos em detalhe
        </a>
      </div>
      <ul
        ref={lista}
        onScroll={aoRolar}
        aria-label="Resultados"
        className="rolagem-lateral relative -mx-4 mt-4 flex snap-x snap-proximity gap-4 overflow-x-auto scroll-px-4 px-4 pb-1 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
      >
        {destaques.map((d) => (
          <CartaoCaso key={d.slug} d={d} />
        ))}
      </ul>
      <Indicador lista={lista} atual={atual} />
    </>
  )

  return (
    <section id="resultados" aria-labelledby="prova-titulo" className="secao scroll-mt-24 border-t border-linha">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2">
        <h2 id="prova-titulo" className="titulo-secao max-w-[24ch]">
          Empresas atendidas nos projetos que liderei
        </h2>
        {/* Trocado em 08/10/2026 (M9). Antes, o fim da frase falava de chatbot e de análise das conversas. */}
        <p className="prosa max-w-[40ch] text-[1.02rem] text-grafite">
          Na{' '}
          <LinkExterno href={gruposClientes[0].fonte.url} className="sublinha hover:text-tinta">
            Vertigo
          </LinkExterno>{' '}
          e na{' '}
          <LinkExterno href={gruposClientes[1].fonte.url} className="sublinha hover:text-tinta">
            Wiv
          </LinkExterno>
          , de órgãos públicos a grandes marcas.
        </p>
      </div>

      <LogosClientes />

        <div className="mt-6 lg:mt-10">
          <Abas
            base="prova"
            rotulo="Provas"
            ativa={aba}
            aoTrocar={setAba}
            abas={[
              { id: 'resultados', rotulo: 'Resultados' },
              { id: 'interfaces', rotulo: 'Interfaces', nome: 'Interfaces que eu construo' },
            ]}
            className="flex rounded-full border border-linha bg-folha p-1 sm:inline-flex"
            classeAba={(marcada) =>
              `chip flex-1 rounded-full px-3 py-2 text-[0.92rem] font-medium sm:flex-none sm:px-5 sm:text-[0.98rem] ${marcada ? 'bg-cobalto text-nevoa' : 'text-tinta'}`
            }
          />
          <div role="tabpanel" id={idPainel('prova', 'resultados')} aria-labelledby={idAba('prova', 'resultados')} hidden={aba !== 'resultados'} className="mt-5">
            {resultados}
          </div>
          <div role="tabpanel" id={idPainel('prova', 'interfaces')} aria-labelledby={idAba('prova', 'interfaces')} hidden={aba !== 'interfaces'} className="mt-5">
            <Interfaces embutida />
          </div>
        </div>
    </section>
  )
}
