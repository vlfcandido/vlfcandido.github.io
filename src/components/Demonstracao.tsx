import { useEffect, useRef, useState } from 'react'
import { empresasDiretas, gruposClientes, type Cliente } from '../clientes'
import { ramosDemo } from '../conteudo'

const NOMES = new Map<string, string>(
  [...empresasDiretas, ...gruposClientes.flatMap((g) => g.clientes)].map((c: Cliente) => [c.slug, c.nome]),
)

/** Junta nomes em português: "A", "A e B", "A, B e C". */
function juntar(nomes: string[]): string {
  return nomes.length < 2 ? (nomes[0] ?? '') : `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
}

/** `true` quando a pessoa pediu menos movimento no sistema. */
function poucoMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Demonstração interativa: a pessoa escolhe o ramo e a conversa de exemplo acontece na tela,
 * mensagem a mensagem. O ramo vive na página, porque "O que eu resolvo" destaca a oferta dele. Com movimento reduzido, a conversa aparece inteira de uma vez.
 */
export function Demonstracao({ ramo: idRamo, aoEscolher }: { ramo: string; aoEscolher: (id: string) => void }) {
  const indice = Math.max(0, ramosDemo.findIndex((r) => r.id === idRamo))
  const [visiveis, setVisiveis] = useState(0)
  const [rodada, setRodada] = useState(0)
  const timers = useRef<number[]>([])
  const ramo = ramosDemo[indice]
  const total = ramo.conversa.length
  const digitando = visiveis < total

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (poucoMovimento()) {
      setVisiveis(total)
      return
    }
    setVisiveis(0)
    // Cliente aparece rápido; a resposta espera um instante, como quem digita.
    let t = 350
    ramo.conversa.forEach((m, i) => {
      t += m.de === 'robo' ? 1100 : 650
      timers.current.push(window.setTimeout(() => setVisiveis(i + 1), t))
    })
    return () => timers.current.forEach(clearTimeout)
  }, [indice, rodada, total, ramo.conversa])

  const proxima = ramo.conversa[visiveis]
  return (
    <figure className="mx-auto w-full max-w-[440px]">
      <fieldset>
        <legend className="mb-3 text-[1.05rem] font-semibold">Qual é o seu negócio?</legend>
        <div className="flex flex-wrap gap-2">
          {ramosDemo.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={i === indice}
              onClick={() => (i === indice ? setRodada((n) => n + 1) : aoEscolher(r.id))}
              className={`chip inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.98rem] font-medium ${
                i === indice
                  ? 'border-cobalto bg-cobalto text-nevoa'
                  : 'border-linha bg-folha text-tinta hover:border-cobalto hover:text-cobalto'
              }`}
            >
              {i === indice && <span aria-hidden="true" className="ponto ponto-anel" />}
              {r.rotulo}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 rounded-[1.75rem] border border-linha bg-folha p-4 shadow-[8px_8px_0_var(--linha)] sm:p-5">
        <div className="flex items-center gap-3 border-b border-linha pb-3">
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-cobalto text-[0.95rem] font-bold text-nevoa">
            {ramo.rotulo[0]}
          </span>
          <div className="leading-tight">
            <p className="font-semibold">Sua {ramo.id === 'escritorio' || ramo.id === 'industria' ? 'empresa' : ramo.rotulo.toLowerCase()}</p>
            <p className="text-[0.85rem] text-grafite" aria-hidden="true">
              {digitando && proxima?.de === 'robo' ? 'digitando…' : 'online'}
            </p>
          </div>
        </div>
        <ul className="mt-4 min-h-[15.5rem] space-y-2.5" aria-live="polite" aria-label={`Conversa de exemplo: ${ramo.rotulo}`}>
          {ramo.conversa.slice(0, visiveis).map((m, i) => (
            <li key={`${ramo.id}-${rodada}-${i}`} className={`balao flex ${m.de === 'cliente' ? 'justify-start' : 'justify-end'}`}>
              <p
                className={`max-w-[84%] rounded-2xl px-3.5 py-2 text-[0.98rem] leading-snug ${
                  m.de === 'cliente' ? 'rounded-bl-sm bg-nevoa text-tinta' : 'rounded-br-sm bg-cobalto text-nevoa'
                }`}
              >
                {m.texto}
              </p>
            </li>
          ))}
          {digitando && proxima?.de === 'robo' && (
            <li className="flex justify-end" aria-hidden="true">
              <span className="pontinhos rounded-2xl rounded-br-sm bg-cobalto/15 px-4 py-3">
                <i />
                <i />
                <i />
              </span>
            </li>
          )}
        </ul>
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setRodada((n) => n + 1)}
            disabled={digitando}
            className="rounded-full px-3 py-1.5 text-[0.92rem] font-medium text-cobalto underline decoration-linha decoration-2 underline-offset-4 hover:decoration-pitanga disabled:invisible"
          >
            Ver de novo
          </button>
        </div>
      </div>
      <figcaption className="prosa mt-4 text-[1rem] text-grafite">
        Exemplo de atendimento que responde e resolve sozinho. No ramo, já liderei projetos para{' '}
        {juntar(ramo.clientes.map((s) => NOMES.get(s) ?? s))}.
      </figcaption>
    </figure>
  )
}
