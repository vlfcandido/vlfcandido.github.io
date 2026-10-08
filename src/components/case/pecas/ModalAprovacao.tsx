import { useId, useRef, useState } from 'react'
import type { PecaProps } from './tipos'

/** Linha do log de auditoria. */
interface Registro {
  hora: string
  comando: string
  resultado: string
  aprovado: boolean
}

// Exemplo rotulado na página: o pedido, as pastas e os horários são ilustrativos.
const PROPOSTAS = ['mkdir relatorios/outubro', 'mv relatorio-10-*.pdf relatorios/outubro/', 'ls relatorios/outubro']

const agora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

/**
 * Peça da IA local: o momento em que o modelo propõe um comando e espera. Aprovar, editar ou negar
 * gera uma linha no log de auditoria, com horário, comando e resultado. Nada roda antes do clique.
 */
export function ModalAprovacao(_: PecaProps) {
  const [indice, setIndice] = useState(0)
  const [comando, setComando] = useState(PROPOSTAS[0])
  const [editando, setEditando] = useState(false)
  const [decidido, setDecidido] = useState<null | 'aprovado' | 'negado'>(null)
  const [log, setLog] = useState<Registro[]>([])
  const campo = useRef<HTMLInputElement>(null)
  const idCampo = useId()

  function decidir(aprovado: boolean) {
    setLog((l) => [{ hora: agora(), comando, resultado: aprovado ? 'saída 0' : 'negado, não executou', aprovado }, ...l].slice(0, 5))
    setDecidido(aprovado ? 'aprovado' : 'negado')
    setEditando(false)
  }

  function proxima() {
    const n = (indice + 1) % PROPOSTAS.length
    setIndice(n)
    setComando(PROPOSTAS[n])
    setDecidido(null)
  }

  function editar() {
    setEditando(true)
    window.setTimeout(() => campo.current?.focus(), 0)
  }

  return (
    <div className="aprovacao grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-xl border border-linha bg-nevoa p-4 sm:p-5">
        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-cobalto px-4 py-2 text-[0.98rem] text-nevoa">
          Organize os relatórios de outubro numa pasta.
        </p>
        <p className="mt-4 text-[0.9rem] text-grafite">O modelo, rodando nesta máquina, propõe:</p>

        <div role="group" aria-labelledby={`${idCampo}-t`} className="aprovacao-modal mt-2 rounded-lg border-2 border-tinta bg-folha p-4 shadow-[6px_6px_0_var(--linha)]">
          <p id={`${idCampo}-t`} className="font-display text-[1.1rem] font-semibold">
            Executar este comando?
          </p>
          <label htmlFor={idCampo} className="sr-only">
            Comando proposto
          </label>
          <input
            id={idCampo}
            ref={campo}
            value={comando}
            readOnly={!editando || decidido !== null}
            onChange={(e) => setComando(e.target.value)}
            className={`mt-3 w-full rounded-md border px-3 py-2 font-mono text-[0.9rem] ${editando ? 'border-cobalto bg-folha' : 'border-linha bg-nevoa'}`}
          />
          {decidido === null ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => decidir(true)} className="botao-acao rounded-full bg-cobalto px-4 py-2 font-semibold text-nevoa hover:bg-cobalto-forte">
                Aprovar
              </button>
              <button type="button" onClick={editar} disabled={editando} className="rounded-full border border-tinta px-4 py-2 font-semibold disabled:opacity-50">
                Editar
              </button>
              <button type="button" onClick={() => decidir(false)} className="rounded-full border border-pitanga px-4 py-2 font-semibold text-pitanga-texto">
                Negar
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
              <p className={`font-semibold ${decidido === 'aprovado' ? 'text-mata' : 'text-pitanga-texto'}`}>
                {decidido === 'aprovado' ? 'Aprovado: rodou e foi para o log.' : 'Negado: nada rodou, e a recusa foi para o log.'}
              </p>
              <button type="button" onClick={proxima} className="rounded-full border border-linha px-4 py-2 text-[0.95rem] font-semibold hover:border-cobalto hover:text-cobalto">
                Próxima proposta
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="font-display text-[1.2rem] font-semibold">Log de auditoria</h3>
        <p className="mt-1 text-[0.92rem] text-grafite">Cada decisão fica registrada: o comando, o horário e o resultado.</p>
        <div className="mt-3 flex-1 overflow-x-auto rounded-lg border border-linha bg-folha">
          <table className="w-full min-w-[22rem] text-left text-[0.9rem]">
            <thead className="border-b border-linha text-grafite">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Horário</th>
                <th scope="col" className="px-3 py-2 font-semibold">Comando</th>
                <th scope="col" className="px-3 py-2 font-semibold">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {log.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-grafite">
                    Vazio: nada rodou ainda. Decida a proposta ao lado.
                  </td>
                </tr>
              ) : (
                log.map((r, i) => (
                  <tr key={`${r.hora}-${i}`} className={`border-b border-dashed border-linha ${i === 0 ? 'log-nova' : ''}`}>
                    <td className="px-3 py-2 tabular-nums">{r.hora}</td>
                    <td className="px-3 py-2 font-mono text-[0.85rem] break-all">{r.comando}</td>
                    <td className={`px-3 py-2 ${r.aprovado ? 'text-mata' : 'text-pitanga-texto'}`}>{r.resultado}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
