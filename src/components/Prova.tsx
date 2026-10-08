import { useState } from 'react'
import { empresasDiretas, gruposClientes, type Cliente } from '../clientes'
import { cases, destaques, type Destaque } from '../conteudo'
import { HASH_PROJETOS } from '../lib/rota'
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
      className="cartao-caso relative flex w-[84%] shrink-0 snap-start flex-col rounded-xl border border-transparent bg-folha p-6 sm:w-[60%] sm:p-7 md:w-auto"
    >
      <div className="flex h-12 items-center">{empresa && <Logo cliente={empresa} className="max-h-10 max-w-[150px]" />}</div>
      <h4 className="mt-5 text-[1.2rem] leading-[1.3] font-semibold">{d.titulo}</h4>
      <p className="mt-3 text-[1.15rem] leading-[1.4] font-semibold">
        <span className="grifo">{d.resultado}</span>
      </p>
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={idCorpo}
        onClick={() => setAberto((v) => !v)}
        className="mt-5 inline-flex items-center gap-2 self-start rounded-full py-1 font-medium text-cobalto"
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
      <p className="mt-auto pt-5">
        <LinkExterno
          href={d.fonte.url}
          className="sublinha text-[0.98rem] text-grafite hover:text-tinta"
        >
          {d.fonte.texto}
        </LinkExterno>
      </p>
    </li>
  )
}

/** Logos de clientes (seleção com "ver todas") e três resultados curtos com fonte pública. */
export function Prova() {
  return (
    <section id="resultados" aria-labelledby="prova-titulo" className="scroll-mt-24 border-t border-linha py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <h2 id="prova-titulo" className="max-w-[22ch] text-[2rem] leading-[1.1] font-bold tracking-[0.004em] sm:text-[2.6rem]">
          Empresas atendidas nos projetos que liderei
        </h2>
        <p className="prosa max-w-[40ch] text-[1.08rem] text-grafite">
          Na{' '}
          <LinkExterno href={gruposClientes[0].fonte.url} className="sublinha hover:text-tinta">
            Vertigo
          </LinkExterno>{' '}
          e na{' '}
          <LinkExterno href={gruposClientes[1].fonte.url} className="sublinha hover:text-tinta">
            Wiv
          </LinkExterno>
          , com chatbots e análise de conversas.
        </p>
      </div>

      <LogosClientes />

      <h3 className="mt-20 text-[1.6rem] font-bold tracking-[0.004em] sm:text-[1.9rem]">Alguns resultados</h3>
      <p className="mt-1 text-[0.95rem] text-grafite md:hidden">Arraste para o lado para ver os três.</p>
      <ul className="relative -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-3 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
        {destaques.map((d) => (
          <CartaoCaso key={d.slug} d={d} />
        ))}
      </ul>
      <p className="mt-10">
        <a
          href={HASH_PROJETOS}
          className="text-grafite underline decoration-linha decoration-2 underline-offset-4 hover:text-tinta hover:decoration-cobalto"
        >
          Ver projetos em detalhe
        </a>
      </p>
    </section>
  )
}
