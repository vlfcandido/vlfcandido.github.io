import { useId, useState } from 'react'
import { etapasEntrega } from '../entrega'

/**
 * "Como é uma entrega": faixa compacta com as oito etapas (número, rótulo curto e quando).
 * No computador é uma linha do tempo horizontal e o detalhe (uma frase) aparece num popover ao passar o
 * mouse, focar com o teclado ou tocar; Esc fecha. No celular vira uma lista de uma linha por etapa, e a
 * frase abre logo abaixo da linha tocada. O trilho enche até a etapa ativa (só transform).
 */
export function ComoEntrega() {
  const [aberta, setAberta] = useState<number | null>(null)
  const base = useId()
  const total = etapasEntrega.length
  return (
    <section id="como-entrega" aria-labelledby="entrega-titulo" className="secao entrega-secao scroll-mt-24 border-t border-linha">
      <h2 id="entrega-titulo" className="titulo-secao">
        Como é uma entrega
      </h2>
      <p className="prosa mt-1.5 text-[1.02rem] text-grafite">Oito etapas, do escopo à manutenção.</p>
      <ol
        className="entrega-faixa mt-5"
        style={{ ['--passo' as string]: (aberta ?? 0) / (total - 1) }}
        onKeyDown={(ev) => ev.key === 'Escape' && setAberta(null)}
      >
        {etapasEntrega.map((e, i) => {
          const ativa = i === aberta
          const feita = aberta !== null && i < aberta
          const lado = i === 0 ? 'is-inicio' : i === total - 1 ? 'is-fim' : ''
          return (
            <li
              key={e.id}
              className={`entrega-etapa ${lado} ${ativa ? 'is-ativa' : ''} ${feita ? 'is-feita' : ''}`}
              onMouseEnter={() => setAberta(i)}
              onMouseLeave={() => setAberta((a) => (a === i ? null : a))}
            >
              <button
                type="button"
                aria-expanded={ativa}
                aria-controls={`${base}-${e.id}`}
                onFocus={() => setAberta(i)}
                onBlur={() => setAberta((a) => (a === i ? null : a))}
                onClick={() => setAberta(i)}
                className="entrega-botao"
              >
                <span aria-hidden="true" className="entrega-no font-display italic">
                  {i + 1}
                </span>
                <span className="entrega-rotulo">{e.rotulo}</span>
                <span className="entrega-quando">{e.quando}</span>
              </button>
              <p id={`${base}-${e.id}`} role="tooltip" hidden={!ativa} className="entrega-detalhe">
                {e.frase}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
