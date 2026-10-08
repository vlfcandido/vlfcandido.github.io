import { useId, useState } from 'react'
import type { PecaProps } from './tipos'

/** Evento do log, em minutos desde a chegada do lead. */
interface Evento {
  min: number
  texto: string
  sistema: string
  troca?: boolean
}

// Horários, filas e corretores ilustrativos (rotulados na página). A regra é a do projeto: uma hora
// sem resposta, o job passa para o próximo corretor da mesma fila e atualiza Blip, CRM e analytics.
const EVENTOS: Evento[] = [
  { min: 0, texto: 'Lead chega pelo WhatsApp e cai na fila Zona Sul. Vai para o corretor A.', sistema: 'Blip' },
  { min: 0, texto: 'Ticket aberto; responsável no CRM: corretor A.', sistema: 'CRM' },
  { min: 30, texto: 'Job agendado confere: sem resposta do corretor.', sistema: 'job' },
  { min: 60, texto: 'Job confere de novo: uma hora sem resposta.', sistema: 'job' },
  { min: 61, texto: 'Passa para o corretor B, o próximo da mesma fila.', sistema: 'job', troca: true },
  { min: 61, texto: 'Ticket atualizado no Blip Desk e responsável trocado no CRM.', sistema: 'Blip e CRM', troca: true },
  { min: 61, texto: 'Evento da troca registrado no analytics.', sistema: 'analytics', troca: true },
]

const hora = (min: number) => `${10 + Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`

/**
 * Peça da roleta de corretores: uma hora na vida de um lead. O ponteiro anda pela régua de tempo e o
 * log mostra o que o job fez até ali; quando passa de uma hora, o lead muda de mãos sozinho.
 */
export function RelogioLead(_: PecaProps) {
  const [min, setMin] = useState(61)
  const id = useId()
  const visiveis = EVENTOS.filter((e) => e.min <= min)
  const comB = min >= 61
  return (
    <div className="relogio grid gap-6 lg:grid-cols-[1fr_17rem]">
      <div>
        <label htmlFor={id} className="flex items-baseline justify-between gap-3">
          <span className="font-semibold">Arraste o ponteiro</span>
          <span className="font-display text-[1.6rem] font-semibold tabular-nums">{hora(min)}</span>
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={61}
          step={1}
          value={min}
          aria-valuetext={`${hora(min)}, ${comB ? 'com o corretor B' : 'com o corretor A'}`}
          onChange={(e) => setMin(Number(e.target.value))}
          className="relogio-regua mt-3 w-full"
        />
        <div className="mt-1 flex justify-between text-[0.8rem] text-grafite tabular-nums" aria-hidden="true">
          <span>10:00</span>
          <span>10:15</span>
          <span>10:30</span>
          <span>10:45</span>
          <span className="text-pitanga-texto">11:00</span>
        </div>

        <ol className="mt-6 border-l-2 border-linha" aria-live="polite">
          {visiveis.map((e, i) => (
            <li key={i} className="relative grid grid-cols-[3.4rem_1fr] gap-3 py-2 pl-4">
              <span aria-hidden="true" className={`absolute top-[0.95rem] -left-[5px] size-2 rounded-full ${e.troca ? 'bg-pitanga' : 'bg-mar'}`} />
              <span className="text-[0.9rem] text-grafite tabular-nums">{hora(e.min)}</span>
              <span className="text-[0.98rem] leading-snug">
                {e.texto} <span className="text-[0.82rem] text-grafite">({e.sistema})</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-lg border border-linha bg-folha p-5 lg:self-start">
        <p className="text-[0.9rem] text-grafite">Com quem está o lead</p>
        <p className="mt-1 font-display text-[1.6rem] font-semibold">{comB ? 'Corretor B' : 'Corretor A'}</p>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-raso" aria-hidden="true">
          <span className={`block h-full ${min >= 60 ? 'bg-pitanga' : 'bg-mar'}`} style={{ width: `${Math.min(100, (min / 60) * 100)}%` }} />
        </div>
        <p className="mt-2 text-[0.9rem] text-grafite">
          {comB ? 'Passou de uma hora: trocou sozinho.' : `${60 - Math.min(min, 60)} min até a troca automática`}
        </p>
      </div>
    </div>
  )
}
