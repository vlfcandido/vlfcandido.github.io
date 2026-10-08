import { useMemo, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { empresasDiretas } from '../clientes'
import { filtrarProjetos, listarProjetos, tiposProjeto, type ItemProjeto, type TipoProjeto } from '../projetos'
import { Logo } from './Logo'
import { Print } from './Print'

type Filtro = TipoProjeto | 'todos'

/** `true` quando a pessoa pediu menos movimento no sistema. */
function poucoMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Troca o estado dentro de uma View Transition, quando o navegador tem e a pessoa aceita movimento. */
function comTransicao(mudar: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (!doc.startViewTransition || poucoMovimento()) {
    mudar()
    return
  }
  doc.startViewTransition(() => flushSync(mudar))
}

interface CartaoProps {
  item: ItemProjeto
  aoAbrir: (slug: string) => void
}

/**
 * Card da galeria. O botão está no título (leitor de tela ouve o nome) e se estende pelo card
 * inteiro com um pseudo-elemento, então o clique vale em qualquer ponto.
 */
function Cartao({ item, aoAbrir }: CartaoProps) {
  const empresa = item.empresa ? empresasDiretas.find((e) => e.slug === item.empresa) : undefined
  return (
    <article className="cartao-projeto group relative flex h-full flex-col">
      <div className="relative">
        {item.print ? (
          <Print print={item.print} />
        ) : (
          <div className="moldura-logo flex aspect-[16/7] items-center justify-center rounded-md border border-linha bg-folha px-8 shadow-[6px_6px_0_var(--linha)]">
            {empresa && <Logo cliente={empresa} className="max-h-11 max-w-[170px]" />}
          </div>
        )}
      </div>
      <h3 className="mt-5 text-[1.3rem] leading-[1.25] font-semibold tracking-[0.004em]">
        <button
          type="button"
          id={`card-${item.slug}`}
          onClick={() => aoAbrir(item.slug)}
          aria-haspopup="dialog"
          className="text-left group-hover:text-cobalto after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:outline-none"
        >
          {item.nome}
        </button>
      </h3>
      <p className="prosa mt-1.5 text-[1.06rem] leading-[1.55] text-grafite">{item.resultado}</p>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-4" aria-label="Tecnologias">
        {item.etiquetas.map((t) => (
          <li key={t} className="rounded-full bg-tinta/[0.06] px-2.5 py-1 text-[0.82rem] leading-none font-medium text-grafite">
            {t}
          </li>
        ))}
      </ul>
    </article>
  )
}

/** Grade de cards; cada card tem nome de transição para a grade se reorganizar animada no filtro. */
function Grade({ itens, aoAbrir }: { itens: ItemProjeto[]; aoAbrir: (slug: string) => void }) {
  return (
    <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {itens.map((p) => (
        <li key={p.slug} style={{ viewTransitionName: `projeto-${p.slug}` } as CSSProperties}>
          <Cartao item={p} aoAbrir={aoAbrir} />
        </li>
      ))}
    </ul>
  )
}

/**
 * Galeria da página de projetos: chips de filtro por tipo, os projetos próprios e a faixa
 * "Em empresas", no mesmo padrão de card. O clique abre o painel (quem chama cuida do hash).
 */
export function GaleriaProjetos({ aoAbrir }: { aoAbrir: (slug: string) => void }) {
  const todos = useMemo(listarProjetos, [])
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const lista = filtrarProjetos(todos, filtro)
  const proprios = lista.filter((p) => p.origem === 'proprio')
  const deEmpresa = lista.filter((p) => p.origem === 'empresa')
  const chips: { valor: Filtro; rotulo: string; total: number }[] = [
    { valor: 'todos', rotulo: 'Todos', total: todos.length },
    ...(Object.keys(tiposProjeto) as TipoProjeto[]).map((t) => ({
      valor: t,
      rotulo: tiposProjeto[t],
      total: filtrarProjetos(todos, t).length,
    })),
  ]

  return (
    <>
      <div
        role="group"
        aria-label="Filtrar por tipo de projeto"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-1 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {chips.map((c) => {
          const marcado = filtro === c.valor
          return (
            <button
              key={c.valor}
              type="button"
              aria-pressed={marcado}
              onClick={() => c.valor !== filtro && comTransicao(() => setFiltro(c.valor))}
              className={`chip inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.95rem] font-medium whitespace-nowrap ${
                marcado ? 'border-cobalto bg-cobalto text-nevoa' : 'border-linha bg-folha text-tinta hover:border-cobalto hover:text-cobalto'
              }`}
            >
              {marcado && <span aria-hidden="true" className="ponto ponto-anel" />}
              <span>
                {c.rotulo} <span className={marcado ? 'opacity-80' : 'text-grafite'}>{c.total}</span>
              </span>
            </button>
          )
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {lista.length} projetos
      </p>

      <section aria-labelledby="proprios-titulo" className="mt-12">
        <h2 id="proprios-titulo" className="sr-only">
          Projetos próprios
        </h2>
        <Grade itens={proprios} aoAbrir={aoAbrir} />
      </section>

      {deEmpresa.length > 0 && (
        <section aria-labelledby="empresas-titulo" className="mt-24 border-t border-linha pt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
            <h2 id="empresas-titulo" className="text-[1.9rem] leading-[1.15] font-bold tracking-[0.004em] sm:text-[2.3rem]">
              Em empresas
            </h2>
            <p className="prosa max-w-[44ch] text-[1.08rem] text-grafite">Projetos que fiz ou liderei como contratado, com a fonte pública.</p>
          </div>
          <div className="mt-10">
            <Grade itens={deEmpresa} aoAbrir={aoAbrir} />
          </div>
        </section>
      )}
    </>
  )
}
