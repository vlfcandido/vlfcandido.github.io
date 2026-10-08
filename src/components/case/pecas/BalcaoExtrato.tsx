import { useState } from 'react'
import { MolduraCelular } from '../MolduraCelular'
import type { PecaProps } from './tipos'

/** Uma linha do extrato da nota: o fato e o peso dele. */
interface LinhaNota {
  fato: string
  detalhe: string
  peso: number
}

const BASE = 600
// Dados fictícios (rotulados na página): o mecanismo é o do projeto (cada pagamento, atraso e quitação
// com o seu peso); os valores são exemplo.
const LINHAS: LinhaNota[] = [
  { fato: 'Pagamentos em dia', detalhe: '18 parcelas', peso: 144 },
  { fato: 'Quitação antes do prazo', detalhe: '1 contrato', peso: 38 },
  { fato: 'Atraso', detalhe: '12 dias, uma vez', peso: -40 },
]

/** Arco do medidor (meia-lua), de 0 a 1000. */
function Medidor({ nota }: { nota: number }) {
  const r = 70
  const comprimento = Math.PI * r
  const frac = Math.max(0, Math.min(1, nota / 1000))
  return (
    <svg viewBox="0 0 180 104" className="mx-auto block w-[78%]" aria-hidden="true">
      <path d="M20 94 A70 70 0 0 1 160 94" fill="none" stroke="var(--raso)" strokeWidth="14" strokeLinecap="round" />
      <path
        d="M20 94 A70 70 0 0 1 160 94"
        fill="none"
        stroke="var(--mar)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${comprimento * frac} ${comprimento}`}
        className="medidor-arco"
      />
    </svg>
  )
}

const sinal = (n: number) => (n > 0 ? `+${n}` : `−${Math.abs(n)}`)

/**
 * Peça do app de score: o app no celular, com a nota no medidor, e ao lado o extrato que soma a nota
 * linha por linha. Tirar uma linha recalcula a nota, para mostrar que não há caixa-preta.
 */
export function BalcaoExtrato(_: PecaProps) {
  const [fora, setFora] = useState<Set<number>>(new Set())
  const nota = BASE + LINHAS.reduce((s, l, i) => s + (fora.has(i) ? 0 : l.peso), 0)

  function alternar(i: number) {
    setFora((f) => {
      const n = new Set(f)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })
  }

  return (
    <div className="grid items-start gap-10 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
      <MolduraCelular
        rotulo="Tela do app de score, com dados fictícios"
        topo={
          <div className="flex items-center justify-between border-b border-linha px-5 pb-3">
            <span className="text-[0.95rem] font-semibold">Consulta</span>
            <span className="text-[0.85rem] text-grafite">Loja Exemplo</span>
          </div>
        }
      >
        <div className="px-5 pt-5 pb-7 text-center">
          <p className="text-[0.95rem] text-grafite">Cliente fictício 0427</p>
          <div className="relative mt-3">
            <Medidor nota={nota} />
            <p className="absolute inset-x-0 bottom-0 font-display text-[2.6rem] leading-none font-semibold" aria-live="polite">
              {nota}
            </p>
          </div>
          <p className="mt-1 text-[0.85rem] text-grafite">de 1000</p>
          <p className="mt-5 rounded-full border border-cobalto px-4 py-2 text-[0.92rem] font-semibold text-cobalto">
            Como esta pontuação foi calculada
          </p>
        </div>
      </MolduraCelular>

      <div className="extrato relative mx-auto w-full max-w-[26rem] bg-folha px-6 pt-7 pb-9 shadow-[6px_6px_0_var(--linha)] md:mx-0">
        <p className="text-center font-display text-[1.25rem] font-semibold">Como a nota foi calculada</p>
        <p className="mt-1 text-center text-[0.85rem] text-grafite">Toque numa linha para ver a nota sem ela</p>
        <ul className="extrato-linhas mt-5 border-t border-dashed border-linha">
          <li className="flex items-baseline gap-3 border-b border-dashed border-linha py-3">
            <span className="flex-1">Ponto de partida</span>
            <span className="tabular-nums">{BASE}</span>
          </li>
          {LINHAS.map((l, i) => {
            const ativa = !fora.has(i)
            return (
              <li key={l.fato} className="border-b border-dashed border-linha">
                <button
                  type="button"
                  aria-pressed={ativa}
                  onClick={() => alternar(i)}
                  className={`flex w-full items-baseline gap-3 py-3 text-left ${ativa ? '' : 'text-grafite line-through'}`}
                >
                  <span className="flex-1">
                    {l.fato}
                    <span className="block text-[0.85rem] text-grafite no-underline">{l.detalhe}</span>
                  </span>
                  <span className={`tabular-nums font-semibold ${l.peso < 0 ? 'text-pitanga-texto' : 'text-mata'}`}>{sinal(l.peso)}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-4 flex items-baseline justify-between font-display text-[1.4rem] font-semibold">
          <span>Nota</span>
          <span className="tabular-nums">{nota}</span>
        </p>
      </div>
    </div>
  )
}
