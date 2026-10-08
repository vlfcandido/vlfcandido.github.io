import type { PecaProps } from './tipos'

/** Degrau do funil: o que acontece e o que fica anotado para o comercial. */
interface Degrau {
  etapa: string
  anota: string
}

// Perguntas ilustrativas (rotuladas na página): o case público não traz o roteiro do robô.
const DEGRAUS: Degrau[] = [
  { etapa: 'Contato chega pelo WhatsApp', anota: 'nome e telefone' },
  { etapa: 'O que você cultiva?', anota: 'cultura' },
  { etapa: 'Em que região, e quanta área?', anota: 'região e tamanho' },
  { etapa: 'Lead qualificado no CRM', anota: 'a ficha, já preenchida' },
  { etapa: 'Time comercial', anota: 'liga sabendo com quem fala' },
]

/**
 * Peça da Araguaia: o funil do chatbot de captação. Cada degrau estreita o contato até virar lead
 * qualificado no CRM, e ao lado fica o que o robô anotou em cada etapa.
 */
export function FunilQualificacao(_: PecaProps) {
  return (
    <ol className="funil mx-auto max-w-[44rem] space-y-1.5">
      {DEGRAUS.map((d, i) => {
        const largura = 100 - i * 13
        const escuro = i >= 3
        return (
          <li key={d.etapa} className="grid items-center gap-x-5 gap-y-1 sm:grid-cols-[1fr_11rem]">
            <div className="flex justify-center">
              <p
                className={`funil-degrau px-6 py-3.5 text-center text-[0.98rem] leading-snug font-semibold sm:text-[1.05rem] ${escuro ? 'text-on-mar' : 'text-tinta'}`}
                style={{
                  width: `${largura}%`,
                  background: escuro ? (i === 4 ? 'var(--mar-forte)' : 'var(--mar)') : `color-mix(in srgb, var(--mar) ${12 + i * 14}%, var(--raso))`,
                }}
              >
                {d.etapa}
              </p>
            </div>
            <p className="text-center text-[0.9rem] text-grafite sm:text-left">
              <span className="sm:hidden">anota: </span>
              <span className="hidden font-semibold text-tinta sm:inline">Anota: </span>
              {d.anota}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
