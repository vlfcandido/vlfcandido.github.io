import { useState } from 'react'
import type { PecaProps } from './tipos'

/** Uma etapa do vendedor de IA: quem atende, o campo que ele preenche na ficha e o valor de exemplo. */
interface Etapa {
  etapa: string
  agente: string
  campo: string
  valor: string
}

// As etapas são as do texto aprovado por ele (qualificar, apresentar planos, simular taxas, gerar a
// cobrança, handoff para o time humano). Nomes de agente e valores são ilustrativos e rotulados na página.
const ETAPAS: Etapa[] = [
  { etapa: 'Qualificação', agente: 'agente de qualificação', campo: 'Quem é', valor: 'Prestador de serviço, quer abrir empresa' },
  { etapa: 'Planos', agente: 'agente de planos', campo: 'Plano apresentado', valor: 'O plano que cabe no porte informado' },
  { etapa: 'Taxas', agente: 'agente de simulação', campo: 'Simulação', valor: 'Imposto e mensalidade comparados, enviada no chat' },
  { etapa: 'Cobrança', agente: 'agente de cobrança', campo: 'Pagamento', valor: 'Cobrança gerada e enviada' },
  { etapa: 'Time humano', agente: 'handoff automático', campo: 'Com quem está', valor: 'Vendedor, com o resumo da conversa' },
]

/**
 * Peça da Contabilizei: a ficha de um lead no CRM sendo preenchida, etapa por etapa, pelo agente que o
 * orquestrador chamou. Na última, a conversa passa para o time humano com tudo já anotado.
 */
export function FichaLead(_: PecaProps) {
  const [feitas, setFeitas] = useState(1)
  const atual = ETAPAS[Math.min(feitas, ETAPAS.length) - 1]
  const fim = feitas >= ETAPAS.length
  return (
    <div className="ficha grid gap-6 lg:grid-cols-[14rem_1fr]">
      <ol className="ficha-trilho flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:overflow-visible" aria-label="Etapas">
        {ETAPAS.map((e, i) => {
          const estado = i < feitas - 1 ? 'feita' : i === feitas - 1 ? 'agora' : 'depois'
          return (
            <li key={e.etapa} className={`ficha-passo ficha-${estado} flex shrink-0 items-center gap-3 lg:py-3`} aria-current={estado === 'agora' ? 'step' : undefined}>
              <span aria-hidden="true" className="ficha-marco grid size-7 shrink-0 place-items-center rounded-full border-2 text-[0.8rem] font-semibold">
                {estado === 'feita' ? '✓' : i + 1}
              </span>
              <span className={`text-[0.95rem] whitespace-nowrap ${estado === 'depois' ? 'text-grafite' : 'font-semibold'}`}>{e.etapa}</span>
            </li>
          )
        })}
      </ol>

      <div>
        <p className="flex flex-wrap items-center gap-2 text-[0.95rem]" aria-live="polite">
          <span className="rounded-full bg-tinta px-3 py-1 font-semibold text-nevoa">Orquestrador</span>
          <svg viewBox="0 0 24 12" width="26" height="12" aria-hidden="true" className="text-grafite">
            <path d="M1 6h20M16 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="rounded-full border border-cobalto px-3 py-1 font-semibold text-cobalto">{atual.agente}</span>
        </p>

        <div className="mt-4 rounded-lg border border-linha bg-folha shadow-[4px_4px_0_var(--linha)]">
          <div className="flex items-baseline justify-between gap-3 border-b border-linha px-4 py-3 sm:px-5">
            <p className="font-display text-[1.15rem] font-semibold">Lead de exemplo, via WhatsApp</p>
            <p className="text-[0.85rem] text-grafite">CRM</p>
          </div>
          <dl className="divide-y divide-dashed divide-linha">
            {ETAPAS.map((e, i) => {
              const preenchido = i < feitas
              return (
                <div key={e.campo} className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:px-5">
                  <dt className="text-[0.92rem] text-grafite">{e.campo}</dt>
                  <dd className={preenchido ? 'ficha-preenchido' : 'text-grafite'}>
                    {preenchido ? (
                      <>
                        <span className="block">{e.valor}</span>
                        <span className="mt-0.5 block text-[0.82rem] text-grafite">preenchido pelo {e.agente}</span>
                      </>
                    ) : (
                      <span aria-label="vazio" className="inline-block h-[2px] w-16 translate-y-[-0.3em] bg-linha" />
                    )}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFeitas((f) => (fim ? 1 : f + 1))}
            className="botao-acao rounded-full bg-cobalto px-5 py-2.5 font-semibold text-nevoa hover:bg-cobalto-forte"
          >
            {fim ? 'Recomeçar' : 'Próxima etapa'}
          </button>
          {!fim && (
            <button type="button" onClick={() => setFeitas(ETAPAS.length)} className="sublinha self-center text-[0.95rem] text-grafite hover:text-tinta">
              Ver a ficha pronta
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
