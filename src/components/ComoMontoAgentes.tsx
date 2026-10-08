import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { listarPadroes, type IdDesenho } from '../diagramas/desenhos'
import { CartaNautica } from './CartaNautica'
import { DiagramaMare } from './DiagramaMare'

/** Etiquetas discretas de cada padrão (as ferramentas que usei nele). */
const FERRAMENTAS: Record<string, string> = {
  'agente-roteador': 'Google ADK, LangGraph',
  'agente-grafo': 'LangGraph, LangChain',
  'agente-ferramentas': 'Google ADK, Pydantic',
  'agente-rag': 'LangGraph, pgvector, MCP',
}

/**
 * "Como eu monto agentes": quatro padrões em grade (2 x 2 no computador, carrossel no celular).
 * Cada miniatura abre o desenho grande num `<dialog>`, que fecha com Esc, botão ou clique fora.
 */
export function ComoMontoAgentes() {
  const padroes = useMemo(listarPadroes, [])
  const [aberto, setAberto] = useState<IdDesenho | null>(null)
  const ref = useRef<HTMLDialogElement>(null)
  const atual = padroes.find((p) => p.id === aberto)

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (aberto && !dlg.open) dlg.showModal()
    if (!aberto && dlg.open) dlg.close()
  }, [aberto])

  /** Fecha e devolve o foco à miniatura que abriu. */
  function fechar() {
    const origem = aberto
    setAberto(null)
    window.setTimeout(() => origem && document.getElementById(`padrao-${origem}`)?.focus(), 30)
  }

  return (
    <section aria-labelledby="agentes-titulo" className="relative isolate mt-24 border-t border-linha bg-nevoa pt-14">
      {/* A rota tracejada entre boias até o farol: as etapas de um fluxo de agentes. */}
      <CartaNautica
        versao="rota"
        sizes="(min-width: 640px) 560px, 80vw"
        className="carta-topo pointer-events-none absolute top-0 right-0 -z-10 h-[180px] w-[80%] sm:h-[230px] sm:w-[min(52%,600px)]"
      />
      <div className="relative max-w-[30rem]">
        <h2 id="agentes-titulo" className="text-[1.9rem] leading-[1.15] font-bold tracking-[0.004em] sm:text-[2.3rem]">
          Como eu monto agentes
        </h2>
        <p className="prosa mt-2 max-w-[44ch] text-[1.08rem] text-grafite">Os padrões que uso nos projetos. Toque num desenho para ampliar.</p>
      </div>
      <ul className="-mx-4 mt-10 flex snap-x snap-proximity gap-5 overflow-x-auto scroll-px-4 px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:overflow-visible md:px-0 md:pb-0">
        {padroes.map((p) => (
          <li key={p.id} className="cartao-projeto group relative w-[86%] shrink-0 snap-start md:w-auto">
            <div className="moldura-logo flex aspect-[16/10] items-center overflow-hidden rounded-md border border-linha bg-folha px-2 shadow-[6px_6px_0_var(--linha)]">
              <DiagramaMare id={p.id} modo="largo" className="w-full" />
            </div>
            <h3 className="mt-5 text-[1.25rem] leading-[1.25] font-semibold">
              <button
                type="button"
                id={`padrao-${p.id}`}
                aria-haspopup="dialog"
                onClick={() => setAberto(p.id)}
                className="text-left group-hover:text-cobalto after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:outline-none"
              >
                {p.titulo}
              </button>
            </h3>
            <p className="prosa mt-1.5 text-[1.04rem] leading-[1.5] text-grafite">{p.resolve}</p>
            <p className="mt-2 text-[0.88rem] text-grafite">{FERRAMENTAS[p.id]}</p>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        aria-labelledby="padrao-aberto-titulo"
        onCancel={(e) => {
          e.preventDefault()
          fechar()
        }}
        onClick={(e: MouseEvent<HTMLDialogElement>) => e.target === e.currentTarget && fechar()}
        className="painel-projeto m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[60rem] overflow-y-auto overscroll-contain rounded-2xl border border-linha bg-folha p-0 text-tinta shadow-[10px_10px_0_var(--linha)] backdrop:bg-tinta/55"
      >
        {atual && (
          <div className="px-4 pt-5 pb-8 sm:px-10 sm:pt-8">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <h2 id="padrao-aberto-titulo" className="text-[1.45rem] leading-[1.15] font-bold sm:text-[2rem]">
                  {atual.titulo}
                </h2>
                <p className="prosa mt-2 text-[1.08rem] text-grafite">{atual.resolve}</p>
              </div>
              <button
                type="button"
                onClick={fechar}
                className="botao-acao grid size-11 shrink-0 place-items-center rounded-full border border-linha bg-folha hover:border-tinta"
              >
                <span className="sr-only">Fechar</span>
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mt-6 rounded-lg border border-linha bg-nevoa px-1 py-3 sm:p-6">
              <DiagramaMare id={atual.id} />
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
