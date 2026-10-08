import { statusProjeto, type StatusProjeto } from '../projetos'

/** Marcador de cada status: só "em produção" leva o ponto de acento; o resto fica em tinta neutra. */
const MARCADOR: Record<StatusProjeto, string> = {
  producao: 'bg-pitanga',
  mvp: 'bg-cobalto',
  prototipo: 'border-[1.5px] border-grafite',
  estudo: 'border-[1.5px] border-grafite',
}

/** Etiqueta com o status honesto do projeto (em produção, MVP, protótipo, estudo). */
export function SeloStatus({ status, className = '' }: { status: StatusProjeto; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-linha bg-folha px-2.5 py-1 text-[0.82rem] leading-none font-semibold text-tinta ${className}`}
    >
      <span aria-hidden="true" className={`size-2 rounded-full ${MARCADOR[status]}`} />
      {statusProjeto[status]}
    </span>
  )
}
