import { useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent } from 'react'
import { flushSync } from 'react-dom'
import { empresasDiretas, gruposClientes, segmentos, selecaoLogos, type Cliente, type Segmento } from '../clientes'
import { Logo } from './Logo'

const TODOS: Cliente[] = gruposClientes.flatMap((g) => g.clientes)
const POR_SLUG = new Map<string, Cliente>([...TODOS, ...empresasDiretas].map((c) => [c.slug, c]))
const SELECAO = selecaoLogos.map((s) => POR_SLUG.get(s)).filter((c): c is Cliente => Boolean(c))
const NA_SELECAO = new Set(selecaoLogos)
const RESTO = TODOS.filter((c) => !NA_SELECAO.has(c.slug))
const TOTAL = TODOS.length

/** Empresa em que liderei o projeto de cada cliente (Vertigo ou Wiv). */
const ORIGEM = new Map<string, string>(
  gruposClientes.flatMap((g) => g.clientes.map((c) => [c.slug, g.empresa === 'vertigo' ? 'Vertigo' : 'Wiv'] as const)),
)

/** Rótulo curto de cada filtro; segmentos com menos de três empresas ficam só em "Todos". */
const ROTULO_CURTO: Partial<Record<Segmento, string>> = {
  financeiro: 'Finanças',
  industria: 'Indústria e agro',
  publico: 'Setor público',
  saude: 'Saúde',
  varejo: 'Varejo',
  energia: 'Energia',
  servicos: 'Serviços',
}

const FILTROS = (Object.keys(ROTULO_CURTO) as Segmento[])
  .map((s) => ({ segmento: s, rotulo: ROTULO_CURTO[s] ?? s, total: TODOS.filter((c) => c.segmento === s).length }))
  .filter((f) => f.total >= 3)

type Filtro = 'todos' | Segmento

/** `true` quando a pessoa pediu menos movimento no sistema. */
function poucoMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Frase da legenda de uma logo: nome, ramo e onde o projeto foi liderado. */
function legendaDe(c: Cliente): string {
  return `${segmentos[c.segmento]}. Projeto liderado na ${ORIGEM.get(c.slug) ?? 'Vertigo'}.`
}

interface GradeProps {
  lista: Cliente[]
  ativo: string | null
  definirAtivo: (slug: string | null) => void
  /** No celular, quantas aparecem antes de expandir (0 = todas). */
  curtaNoCelular?: number
  /** Dá nome de transição às logos, para a grade se reorganizar animada ao filtrar. */
  comTransicao?: boolean
}

/**
 * Grade de logos em que cada uma é um botão: hover, foco por teclado ou toque destacam a logo
 * (cor original sobre uma placa, leve elevação) e mostram a legenda com o ramo e a empresa.
 */
function Grade({ lista, ativo, definirAtivo, curtaNoCelular = 0, comTransicao = true }: GradeProps) {
  // Guarda o tipo do último ponteiro, para o clique do mouse não desfazer o destaque do hover.
  const ponteiro = useRef<string>('')

  return (
    <ul className="grade-logos grid grid-cols-3 items-center gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-8 lg:grid-cols-6">
      {lista.map((c, i) => {
        const esta = ativo === c.slug
        const estilo = comTransicao ? ({ viewTransitionName: `logo-${c.slug}` } as CSSProperties) : undefined
        return (
          <li
            key={c.slug}
            style={estilo}
            className={`h-16 items-center ${curtaNoCelular && i >= curtaNoCelular ? 'hidden sm:flex' : 'flex'}`}
          >
            <button
              type="button"
              data-ativo={esta}
              aria-describedby={`dica-${c.slug}`}
              onPointerDown={(e: PointerEvent) => (ponteiro.current = e.pointerType)}
              onPointerEnter={(e: PointerEvent) => e.pointerType === 'mouse' && definirAtivo(c.slug)}
              onPointerLeave={(e: PointerEvent) => e.pointerType === 'mouse' && esta && definirAtivo(null)}
              onKeyDown={() => (ponteiro.current = '')}
              onFocus={(e: FocusEvent<HTMLButtonElement>) => e.currentTarget.matches(':focus-visible') && definirAtivo(c.slug)}
              onBlur={() => esta && definirAtivo(null)}
              onClick={() => {
                if (ponteiro.current === 'mouse') return
                definirAtivo(esta ? null : c.slug)
              }}
              className="logo-botao flex h-full w-full items-center rounded-lg px-1 text-left"
            >
              <Logo cliente={c} className="max-h-9 max-w-[86%]" />
              <span id={`dica-${c.slug}`} role="tooltip" className="dica">
                <strong className="font-semibold">{c.nome}</strong>
                <br />
                {legendaDe(c)}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Logos dos clientes com filtro por ramo: os chips reorganizam a grade com transição
 * (View Transitions, quando o navegador tem e a pessoa não pediu menos movimento).
 */
export function LogosClientes() {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [aberto, setAberto] = useState(false)
  const [ativo, setAtivo] = useState<string | null>(null)
  const ativoCliente = ativo ? POR_SLUG.get(ativo) : undefined

  /** Troca o estado dentro de uma transição de página, quando possível. */
  function comTransicao(mudar: () => void) {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (!doc.startViewTransition || poucoMovimento()) {
      mudar()
      return
    }
    doc.startViewTransition(() => flushSync(mudar))
  }

  function escolher(f: Filtro) {
    if (f === filtro) return
    comTransicao(() => {
      setFiltro(f)
      setAtivo(null)
    })
  }

  const filtrada = filtro === 'todos' ? null : TODOS.filter((c) => c.segmento === filtro)

  return (
    <div className="mt-12">
      <div role="group" aria-label="Filtrar por ramo" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {[{ segmento: 'todos' as Filtro, rotulo: 'Todos', total: TOTAL }, ...FILTROS].map((f) => {
          const marcado = filtro === f.segmento
          return (
            <button
              key={f.segmento}
              type="button"
              aria-pressed={marcado}
              onClick={() => escolher(f.segmento)}
              className={`chip shrink-0 rounded-full border px-4 py-2 text-[0.95rem] font-medium whitespace-nowrap ${
                marcado ? 'border-cobalto bg-cobalto text-nevoa' : 'border-linha bg-folha text-tinta hover:border-cobalto hover:text-cobalto'
              }`}
            >
              {f.rotulo} <span className={marcado ? 'opacity-80' : 'text-grafite'}>{f.total}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-10">
        {filtrada ? (
          <Grade lista={filtrada} ativo={ativo} definirAtivo={setAtivo} />
        ) : (
          <>
            <Grade lista={SELECAO} ativo={ativo} definirAtivo={setAtivo} curtaNoCelular={aberto ? 0 : 12} />
            <div id="mais-logos" className="expansivel" data-aberto={aberto} inert={!aberto}>
              <div>
                <div className="pt-6">
                  <Grade lista={RESTO} ativo={ativo} definirAtivo={setAtivo} comTransicao={aberto} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <p aria-live="polite" className="prosa mt-6 min-h-[3.4em] text-[1rem] text-grafite sm:hidden">
        {ativoCliente ? (
          <>
            <strong className="font-semibold text-tinta">{ativoCliente.nome}</strong>: {legendaDe(ativoCliente)}
          </>
        ) : (
          'Toque numa logo para ver o ramo e onde liderei o projeto.'
        )}
      </p>

      {!filtrada && (
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="mais-logos"
          className="botao-acao mt-6 inline-flex items-center gap-2 rounded-full border border-linha px-5 py-2.5 font-medium hover:border-cobalto hover:text-cobalto sm:mt-10"
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
      )}
    </div>
  )
}
