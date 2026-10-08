import { useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent } from 'react'
import { flushSync } from 'react-dom'
import {
  empresasDiretas,
  faixaProvas,
  gruposClientes,
  ordenarGrade,
  rotuloCurtoRamo,
  segmentos,
  selecaoLogos,
  soParticipei,
  type Cliente,
  type Segmento,
} from '../clientes'
import { Descer } from './Descer'
import { Logo, logoClara } from './Logo'

const TODOS: Cliente[] = gruposClientes.flatMap((g) => g.clientes)
const POR_SLUG = new Map<string, Cliente>([...TODOS, ...empresasDiretas].map((c) => [c.slug, c]))
// A faixa de Provas começa na 7ª logo e termina com as 6 da abertura (rotação, M4 de 08/10/2026).
const SELECAO = faixaProvas.map((s) => POR_SLUG.get(s)).filter((c): c is Cliente => Boolean(c))
const NA_SELECAO = new Set(selecaoLogos)
// Siglas setoriais vão para o fim da grade (M2 de 08/10/2026).
const RESTO = ordenarGrade(TODOS.filter((c) => !NA_SELECAO.has(c.slug)))
const TOTAL = TODOS.length

/** Empresa em que liderei o projeto de cada cliente (Vertigo ou Wiv). */
const ORIGEM = new Map<string, string>(
  gruposClientes.flatMap((g) => g.clientes.map((c) => [c.slug, g.empresa === 'vertigo' ? 'Vertigo' : 'Wiv'] as const)),
)

// Ordem dos chips de ramo em `rotuloCurtoRamo` (clientes.ts, M3 de 08/10/2026).
const FILTROS = (Object.keys(rotuloCurtoRamo) as Segmento[])
  .map((s) => ({ segmento: s, rotulo: rotuloCurtoRamo[s] ?? s, total: TODOS.filter((c) => c.segmento === s).length }))
  .filter((f) => f.total >= 3)

type Filtro = 'todos' | Segmento

/** `true` quando a pessoa pediu menos movimento no sistema. */
function poucoMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Frase da legenda de uma logo: nome, ramo e onde o projeto foi liderado (ou em que só participei). */
function legendaDe(c: Cliente): string {
  const onde = ORIGEM.get(c.slug) ?? 'Vertigo'
  // Minu: ele só participou (decisão dele, 08/10/2026); antes a legenda dizia "Projeto liderado".
  if (soParticipei.has(c.slug)) return `${segmentos[c.segmento]}. Participei do projeto na ${onde}.`
  return `${segmentos[c.segmento]}. Projeto liderado na ${onde}.`
}

interface GradeProps {
  lista: Cliente[]
  ativo: string | null
  definirAtivo: (slug: string | null) => void
  /** `true` para a faixa fechada: uma linha rolável no celular, grade de seis no computador. */
  faixa?: boolean
  /** Dá nome de transição às logos, para a grade se reorganizar animada ao filtrar. */
  comTransicao?: boolean
}

/**
 * Grade de logos em que cada uma é um botão: hover, foco por teclado ou toque destacam a logo
 * (cor original sobre uma placa, leve elevação) e mostram a legenda com o ramo e a empresa.
 */
function Grade({ lista, ativo, definirAtivo, faixa = false, comTransicao = true }: GradeProps) {
  // Guarda o tipo do último ponteiro, para o clique do mouse não desfazer o destaque do hover.
  const ponteiro = useRef<string>('')
  const classe = faixa
    ? 'grade-logos rolagem-lateral -mx-4 flex snap-x gap-x-4 overflow-x-auto px-4 py-2 sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-x-8 sm:gap-y-4 xl:grid-cols-12 xl:gap-x-5 sm:overflow-visible sm:px-0 sm:py-0'
    : 'grade-logos grid grid-cols-3 items-center gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-8 lg:grid-cols-6'

  return (
    <ul className={classe}>
      {lista.map((c) => {
        const esta = ativo === c.slug
        const estilo = comTransicao ? ({ viewTransitionName: `logo-${c.slug}` } as CSSProperties) : undefined
        return (
          <li key={c.slug} style={estilo} className={`flex h-14 items-center ${faixa ? 'w-[5.25rem] shrink-0 snap-start sm:w-auto' : ''}`}>
            <button
              type="button"
              data-ativo={esta}
              data-clara={logoClara(c.slug)}
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
 * Logos dos clientes: à vista, uma faixa com a seleção (linha rolável no celular, duas linhas de
 * seis no computador) e a linha de sondagem da logo escolhida; "Descer" abre as outras empresas
 * com filtro por ramo (com um ramo escolhido, a grade mostra todas as dele). Os chips reorganizam a grade com transição
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
    <div className="mt-6 lg:mt-8">
      <Grade lista={SELECAO} ativo={ativo} definirAtivo={setAtivo} faixa />

      {/* Linha de sondagem: o que a logo tocada, clicada ou focada diz. Vale para toque e mouse. */}
      <p aria-live="polite" className="prosa mt-3 min-h-[1.6em] text-[1rem] text-grafite">
        {ativoCliente ? (
          <>
            <strong className="font-semibold text-tinta">{ativoCliente.nome}</strong>: {legendaDe(ativoCliente)}
          </>
        ) : (
          'Toque numa logo para ver o ramo e onde liderei o projeto.'
        )}
      </p>

      <Descer id="todas-logos" aberto={aberto} aoAlternar={() => comTransicao(() => { setAberto((v) => !v); setFiltro('todos'); setAtivo(null) })} oQue={`as ${TOTAL} empresas, por ramo`} className="mt-2">
        <div role="group" aria-label="Filtrar por ramo" className="rolagem-lateral -mx-4 mt-4 mb-5 flex gap-2 overflow-x-auto px-4 pt-1 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {[{ segmento: 'todos' as Filtro, rotulo: 'Todos', total: TOTAL }, ...FILTROS].map((f) => {
            const marcado = filtro === f.segmento
            return (
              <button
                key={f.segmento}
                type="button"
                aria-pressed={marcado}
                onClick={() => escolher(f.segmento)}
                className={`chip inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.95rem] font-medium whitespace-nowrap ${
                  marcado ? 'border-cobalto bg-cobalto text-nevoa' : 'border-linha bg-folha text-tinta hover:border-cobalto hover:text-cobalto'
                }`}
              >
                {marcado && <span aria-hidden="true" className="ponto ponto-anel" />}
                <span>
                  {f.rotulo} <span className={marcado ? 'opacity-80' : 'text-grafite'}>{f.total}</span>
                </span>
              </button>
            )
          })}
        </div>
        <Grade lista={filtrada ?? RESTO} ativo={ativo} definirAtivo={setAtivo} comTransicao={aberto} />
      </Descer>
    </div>
  )
}
