import { useState } from 'react'
import { empresasDiretas, gruposClientes, selecaoLogos, type Cliente } from '../clientes'
import { destaques } from '../conteudo'
import { HASH_PROJETOS } from '../lib/rota'
import { LinkExterno } from './LinkExterno'
import { Logo } from './Logo'

const TODOS: Cliente[] = gruposClientes.flatMap((g) => g.clientes)
const POR_SLUG = new Map<string, Cliente>([...TODOS, ...empresasDiretas].map((c) => [c.slug, c]))
const SELECAO = selecaoLogos.map((s) => POR_SLUG.get(s)).filter((c): c is Cliente => Boolean(c))
const TOTAL = TODOS.length
const NA_SELECAO = new Set(selecaoLogos)
const RESTO = TODOS.filter((c) => !NA_SELECAO.has(c.slug))

/** Grade de logos em tinta única; no celular, `curtaNoCelular` limita quantas aparecem antes de expandir. */
function GradeLogos({ lista, curtaNoCelular = 0 }: { lista: Cliente[]; curtaNoCelular?: number }) {
  return (
    <ul className="grid grid-cols-3 items-center gap-x-8 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
      {lista.map((c, i) => (
        <li
          key={c.slug}
          className={`h-12 items-center ${curtaNoCelular && i >= curtaNoCelular ? 'hidden sm:flex' : 'flex'}`}
          title={c.nome}
        >
          <Logo cliente={c} className="max-h-9 max-w-[86%]" />
        </li>
      ))}
    </ul>
  )
}

/** Logos de clientes (seleção com "ver todas") e três resultados curtos com fonte pública. */
export function Prova() {
  const [aberto, setAberto] = useState(false)
  return (
    <section id="resultados" aria-labelledby="prova-titulo" className="scroll-mt-24 border-t border-linha py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <h2 id="prova-titulo" className="max-w-[20ch] text-[2rem] leading-[1.05] font-bold tracking-tight sm:text-[2.6rem]">
          Empresas atendidas nos projetos que liderei
        </h2>
        <p className="prosa max-w-[40ch] text-[1.08rem] text-grafite">
          Na{' '}
          <LinkExterno href={gruposClientes[0].fonte.url} className="underline decoration-linha underline-offset-2 hover:text-tinta">
            Vertigo
          </LinkExterno>{' '}
          e na{' '}
          <LinkExterno href={gruposClientes[1].fonte.url} className="underline decoration-linha underline-offset-2 hover:text-tinta">
            Wiv
          </LinkExterno>
          , com chatbots e análise de conversas.
        </p>
      </div>

      <div className="mt-12">
        <GradeLogos lista={SELECAO} curtaNoCelular={aberto ? 0 : 12} />
        <div id="mais-logos" className="expansivel" data-aberto={aberto} inert={!aberto}>
          <div>
            <div className="pt-8">
              <GradeLogos lista={RESTO} />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="mais-logos"
          className="botao-acao mt-10 inline-flex items-center gap-2 rounded-full border border-linha px-5 py-2.5 font-medium hover:border-cobalto hover:text-cobalto"
        >
          {aberto ? 'Mostrar menos' : `Ver todas as ${TOTAL} empresas`}
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            aria-hidden="true"
            className={`transition-transform motion-reduce:transition-none ${aberto ? 'rotate-180' : ''}`}
          >
            <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <h3 className="mt-20 text-[1.6rem] font-bold tracking-tight sm:text-[1.9rem]">Alguns resultados</h3>
      <p className="mt-1 text-[0.95rem] text-grafite md:hidden">Arraste para o lado para ver os três.</p>
      <ul className="relative -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-3 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
        {destaques.map((d) => {
          const empresa = POR_SLUG.get(d.empresa)
          return (
            <li key={d.slug} className="relative flex w-[84%] shrink-0 snap-start flex-col rounded-xl bg-folha p-6 sm:w-[60%] sm:p-7 md:w-auto">
              <div className="flex h-12 items-center">{empresa && <Logo cliente={empresa} className="max-h-10 max-w-[150px]" />}</div>
              <h4 className="mt-5 text-[1.2rem] font-semibold">{d.titulo}</h4>
              <p className="prosa mt-2 text-[1.05rem] text-grafite">{d.texto}</p>
              <p className="mt-4 text-[1.1rem] leading-snug font-semibold">
                <span className="grifo">{d.resultado}</span>
              </p>
              <p className="mt-auto pt-5">
                <LinkExterno
                  href={d.fonte.url}
                  className="font-medium text-cobalto underline decoration-linha decoration-2 underline-offset-4 hover:decoration-cobalto"
                >
                  {d.fonte.texto}
                </LinkExterno>
              </p>
            </li>
          )
        })}
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
