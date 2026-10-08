import { useEffect, useState } from 'react'
import { poucoMovimento } from '../../../lib/transicao'
import type { PecaProps } from './tipos'

/** Uma campanha e o destino das mensagens dela. */
interface Campanha {
  nome: string
  lidas: number
  entregues: number
  falharam: number
}

// Campanhas e quantidades ilustrativas (rotuladas na página).
const CAMPANHAS: Campanha[] = [
  { nome: 'Boas-vindas', lidas: 640, entregues: 420, falharam: 140 },
  { nome: 'Lembrete', lidas: 520, entregues: 230, falharam: 50 },
  { nome: 'Pesquisa', lidas: 180, entregues: 250, falharam: 70 },
]

const SERIES = [
  { chave: 'lidas', rotulo: 'Lida', cor: 'var(--mar)' },
  { chave: 'entregues', rotulo: 'Entregue, sem leitura', cor: 'color-mix(in srgb, var(--mar) 30%, var(--raso))' },
  { chave: 'falharam', rotulo: 'Falhou', cor: 'var(--coral)' },
] as const

const fmt = (n: number) => n.toLocaleString('pt-BR')

/** Conta os segundos até a próxima leitura agendada (a função roda a cada minuto). */
function useProximaLeitura(): number | null {
  const [s, setS] = useState<number | null>(null)
  useEffect(() => {
    if (poucoMovimento()) return
    setS(60 - new Date().getSeconds())
    const t = window.setInterval(() => setS(60 - new Date().getSeconds()), 1000)
    return () => clearInterval(t)
  }, [])
  return s
}

/**
 * Peça da Minu: o destino das mensagens de cada campanha, em barras empilhadas por status, com a
 * contagem até a próxima leitura agendada e a origem de cada dado (Blip, Braze, analytics).
 */
export function BarrasStatus(_: PecaProps) {
  const prox = useProximaLeitura()
  return (
    <div className="barras">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.9rem]" aria-label="Legenda">
          {SERIES.map((s) => (
            <li key={s.chave} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-sm" style={{ background: s.cor }} />
              {s.rotulo}
            </li>
          ))}
        </ul>
        <p className="flex items-center gap-2 rounded-full border border-linha px-3 py-1 text-[0.88rem] tabular-nums">
          <span aria-hidden="true" className="relogio-ponto size-2 rounded-full bg-mata" />
          {prox === null ? 'Lê de novo a cada minuto' : `Próxima leitura em ${prox} s`}
        </p>
      </div>

      <ul className="mt-6 space-y-5">
        {CAMPANHAS.map((c) => {
          const total = c.lidas + c.entregues + c.falharam
          return (
            <li key={c.nome}>
              <p className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{c.nome}</span>
                <span className="text-[0.9rem] text-grafite tabular-nums">{fmt(total)} enviadas</span>
              </p>
              <div
                role="img"
                aria-label={`${c.nome}: ${fmt(c.lidas)} lidas, ${fmt(c.entregues)} entregues sem leitura, ${fmt(c.falharam)} falharam`}
                className="mt-1.5 flex h-8 gap-[2px] overflow-hidden rounded-md"
              >
                {SERIES.map((s) => {
                  const v = c[s.chave]
                  return (
                    <span
                      key={s.chave}
                      className="flex items-center px-2 text-[0.8rem] font-semibold text-on-mar tabular-nums"
                      style={{ width: `${(v / total) * 100}%`, background: s.cor }}
                    >
                      {s.chave === 'lidas' && v / total > 0.15 ? fmt(v) : ''}
                    </span>
                  )
                })}
              </div>
              <p aria-hidden="true" className="mt-1 text-[0.82rem] text-grafite tabular-nums">
                {fmt(c.entregues)} sem leitura, <span className="text-pitanga-texto">{fmt(c.falharam)} falharam</span>
              </p>
            </li>
          )
        })}
      </ul>

      <ol className="mt-8 grid gap-2 text-[0.92rem] sm:grid-cols-3" aria-label="De onde vem cada dado">
        {[
          ['Blip', 'campanhas, audiência e o status de cada mensagem'],
          ['Braze', 'o perfil de quem recebeu'],
          ['Analytics', 'um evento por status, para o painel'],
        ].map(([o, t]) => (
          <li key={o} className="rounded-md border border-linha bg-folha px-3 py-2">
            <span className="font-semibold">{o}: </span>
            <span className="text-grafite">{t}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
