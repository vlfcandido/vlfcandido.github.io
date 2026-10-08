import { LinkExterno } from '../../LinkExterno'
import type { PecaProps } from './tipos'

const MATERIA = 'https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/'

/** Nota a lápis sobre o recorte. */
function Nota({ children, className = '' }: { children: string; className?: string }) {
  return <p className={`nota-lapis rounded-md px-3 py-2 font-display text-[1.02rem] leading-snug italic ${className}`}>{children}</p>
}

/**
 * Peça do Sicoob: a matéria da MobileTime como recorte de jornal (título e trecho literais, com link) e,
 * ao lado, os três agentes anotados a lápis. Nada além do que a matéria publicou.
 */
export function RecorteImprensa(_: PecaProps) {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <article className="recorte relative bg-folha px-6 pt-9 pb-10 sm:px-9" aria-labelledby="recorte-titulo">
        <p className="flex items-baseline justify-between gap-4 border-b-2 border-tinta pb-2">
          <span className="font-display text-[1.25rem] font-semibold">MobileTime</span>
          <span className="text-[0.9rem] text-grafite">17/07/2026</span>
        </p>
        <h3 id="recorte-titulo" className="mt-5 font-display text-[1.65rem] leading-[1.18] font-semibold sm:text-[2rem]">
          Sicoob usa IA generativa para auxiliar equipes em decisões de investimento
        </h3>
        <p className="mt-3 text-[0.92rem] text-grafite">Por Henrique Medeiros</p>
        <blockquote className="mt-6 border-l-2 border-pitanga pl-4 font-display text-[1.12rem] leading-relaxed">
          <p>
            “…lançou um serviço interno de apoio às suas cooperativas para o atendimento consultivo de investimentos com inteligência artificial generativa.”
          </p>
          <p className="mt-3">“Também conta com três agentes com tarefas dedicadas:”</p>
        </blockquote>
        <p className="mt-7">
          <LinkExterno href={MATERIA} className="sublinha font-semibold">
            Ler a matéria inteira
          </LinkExterno>
        </p>
      </article>

      <figure aria-label="Os três agentes, anotados a partir da matéria" className="anotacao mx-auto w-full max-w-[26rem] lg:mt-10">
        <Nota className="mx-auto w-fit">um encaminha a pergunta</Nota>
        <svg viewBox="0 0 300 70" className="block h-16 w-full text-grafite" preserveAspectRatio="none" aria-hidden="true">
          <path d="M150 4 C 148 30, 95 36, 72 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M150 4 C 153 30, 205 38, 228 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M64 56 L72 64 L80 55 M220 55 L228 64 L236 56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="grid grid-cols-2 gap-3">
          <Nota>um responde sobre investimentos</Nota>
          <Nota>um cuida das perguntas frequentes</Nota>
        </div>
        <figcaption className="mt-6 text-[0.95rem] leading-relaxed text-grafite">
          Quem usa: as equipes das cooperativas, no atendimento consultivo. Eu lidero tecnicamente a frente de IA.
        </figcaption>
      </figure>
    </div>
  )
}
