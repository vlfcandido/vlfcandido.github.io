import { useEffect, useRef, useState } from 'react'
import { poucoMovimento } from '../../../lib/transicao'
import type { PecaProps } from './tipos'

/** Linha do terminal; `tipo` define a cor e `gasto` quanto da cota a linha consome quando aparece. */
interface Linha {
  texto: string
  tipo: 'comando' | 'info' | 'espera' | 'ok' | 'cabecalho' | 'tabela' | 'branco'
  gasto?: number
}

const COTA = 1000
const USADO_ANTES = 310

// Saída ilustrativa (rotulada na página): o mecanismo é o do projeto (cota, cache, limite de chamadas,
// ordenação por duração); comando, rotas, datas e números são exemplo.
const LINHAS: Linha[] = [
  { texto: '$ varredura CWB LIS --mes 2026-11', tipo: 'comando' },
  { texto: 'cota do mês     310 de 1.000 chamadas usadas', tipo: 'info' },
  { texto: 'esta busca      42 chamadas no pior caso', tipo: 'info' },
  { texto: 'cache           18 rotas já consultadas hoje, 0 chamadas', tipo: 'info' },
  { texto: 'a consultar     24 chamadas, cabe na cota', tipo: 'ok' },
  { texto: 'limite da API   esperando a janela de 1 s', tipo: 'espera', gasto: 8 },
  { texto: 'limite da API   esperando a janela de 1 s', tipo: 'espera', gasto: 8 },
  { texto: 'pronto          24 chamadas gastas, cota em 334 de 1.000', tipo: 'ok', gasto: 8 },
  { texto: '', tipo: 'branco' },
  { texto: 'duração  escalas  saída         rota', tipo: 'cabecalho' },
  { texto: '11h40    1        05/11 22:10   CWB GRU LIS', tipo: 'tabela' },
  { texto: '13h05    1        07/11 19:30   CWB VCP LIS', tipo: 'tabela' },
  { texto: '16h50    2        05/11 06:00   CWB GIG MAD LIS', tipo: 'tabela' },
]

/**
 * Peça da varredura de voos: um terminal que roda uma busca linha a linha e, ao lado, o medidor da
 * cota mensal da API, que só anda quando uma chamada de verdade sai (o cache não gasta nada).
 */
export function TerminalCota(_: PecaProps) {
  const [visiveis, setVisiveis] = useState(LINHAS.length)
  const [rodada, setRodada] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (rodada === 0 || poucoMovimento()) {
      setVisiveis(LINHAS.length)
      return
    }
    setVisiveis(1)
    LINHAS.slice(1).forEach((_l, i) => {
      timers.current.push(window.setTimeout(() => setVisiveis(i + 2), 380 * (i + 1)))
    })
    return () => timers.current.forEach(clearTimeout)
  }, [rodada])

  const usado = USADO_ANTES + LINHAS.slice(0, visiveis).reduce((s, l) => s + (l.gasto ?? 0), 0)
  const pct = (v: number) => `${(v / COTA) * 100}%`

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_15rem]">
      <div className="zona-escura terminal overflow-hidden rounded-lg border border-linha bg-nevoa text-tinta">
        <div className="flex items-center justify-between border-b border-linha px-4 py-2.5">
          <span className="text-[0.85rem] text-grafite">terminal</span>
          <button
            type="button"
            onClick={() => setRodada((r) => r + 1)}
            className="rounded-full border border-linha px-3 py-1 text-[0.85rem] font-semibold hover:border-cobalto hover:text-cobalto"
          >
            Rodar de novo
          </button>
        </div>
        <pre className="terminal-texto overflow-x-auto px-4 py-4 text-[0.74rem] leading-[1.7] sm:text-[0.9rem]" aria-live="off">
          {LINHAS.slice(0, visiveis).map((l, i) => (
            <span key={i} className={`block min-h-[1.7em] terminal-${l.tipo}`}>
              {l.texto}
            </span>
          ))}
        </pre>
      </div>
      <div className="cota flex flex-col rounded-lg border border-linha bg-folha p-4">
        <p id="cota-rotulo" className="text-[1rem] font-semibold">
          Cota do mês
        </p>
        <p className="mt-1 text-[0.9rem] text-grafite">Sobe só com chamada que sai. O cache não gasta.</p>
        <div
          role="meter"
          aria-labelledby="cota-rotulo"
          aria-valuemin={0}
          aria-valuemax={COTA}
          aria-valuenow={usado}
          aria-valuetext={`${usado} de ${COTA} chamadas`}
          className="relative mt-5 h-24 w-full overflow-hidden rounded-md border border-linha bg-nevoa lg:h-auto lg:flex-1"
        >
          <span className="cota-agua absolute inset-x-0 bottom-0 bg-raso" style={{ height: pct(usado) }} />
          <span className="absolute inset-x-0 border-t-2 border-dashed border-pitanga" style={{ bottom: pct(USADO_ANTES) }} />
          <span className="absolute right-2 text-[0.8rem] text-pitanga-texto" style={{ bottom: `calc(${pct(USADO_ANTES)} + 2px)` }}>
            antes da busca
          </span>
        </div>
        <p className="mt-3 font-display text-[1.6rem] leading-none font-semibold">
          {usado.toLocaleString('pt-BR')} <span className="text-[1rem] font-normal text-grafite">de 1.000</span>
        </p>
      </div>
    </div>
  )
}
