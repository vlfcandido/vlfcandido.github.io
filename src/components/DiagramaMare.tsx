import { useId, useMemo } from 'react'
import { listarDesenhos, type IdDesenho } from '../diagramas/desenhos'
import { desenharSvg, paletaDoTema, type Modo } from '../diagramas/motor'

interface Props {
  id: IdDesenho
  /**
   * `auto`: composição larga no computador e estreita no celular (texto sempre legível).
   * `largo` ou `estreito`: força uma das duas (miniatura de card usa `largo`).
   */
  modo?: Modo | 'auto'
  className?: string
}

/** SVG de uma composição, com ids únicos para as pontas de seta não colidirem na página. */
function Svg({ id, modo, prefixo, className = '' }: { id: IdDesenho; modo: Modo; prefixo: string; className?: string }) {
  const html = useMemo(() => desenharSvg(listarDesenhos()[id], modo, paletaDoTema(), { prefixo }), [id, modo, prefixo])
  // O SVG é gerado aqui mesmo, a partir de dados do próprio site (texto escapado no motor).
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

/**
 * Ilustração-diagrama da identidade Maré. As cores vêm das variáveis do tema, então o mesmo
 * desenho funciona no claro e no escuro. No modo `auto` há duas composições e o CSS mostra uma:
 * a larga a partir de 1024 px, a estreita abaixo (no celular o texto fica em ~15 px).
 */
export function DiagramaMare({ id, modo = 'auto', className = '' }: Props) {
  const prefixo = `d${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  if (modo !== 'auto') return <Svg id={id} modo={modo} prefixo={prefixo} className={className} />
  return (
    <div className={className}>
      <Svg id={id} modo="largo" prefixo={prefixo} className="hidden lg:block" />
      <Svg id={id} modo="estreito" prefixo={prefixo} className="mx-auto max-w-[400px] lg:hidden" />
    </div>
  )
}
