import { useId, useState } from 'react'
import { etapasEntrega } from '../entrega'
import { SeloFicticio } from './Print'

/**
 * "Como é uma entrega": linha do tempo vertical e interativa das oito etapas. Uma etapa aberta por vez
 * (botão com `aria-expanded`); a etapa aberta mostra o resumo e uma peça de exemplo com dados fictícios.
 * O trilho à esquerda enche até a etapa aberta, como a cota de profundidade do resto da página.
 */
export function ComoEntrega() {
  const [aberta, setAberta] = useState(0)
  const base = useId()
  const total = etapasEntrega.length
  return (
    <section id="como-entrega" aria-labelledby="entrega-titulo" className="secao scroll-mt-24 border-t border-linha">
      <h2 id="entrega-titulo" className="titulo-secao">
        Como é uma entrega
      </h2>
      <p className="prosa mt-1.5 max-w-[52ch] text-[1.02rem] text-grafite">
        Oito etapas, do escopo à manutenção. Toque numa para ver o que você recebe.
      </p>
      <ol className="entrega-trilho mt-6 max-w-[46rem]" style={{ ['--passo' as string]: aberta / (total - 1) }}>
        {etapasEntrega.map((e, i) => {
          const ativa = i === aberta
          const feita = i < aberta
          return (
            <li key={e.id} className={`entrega-etapa ${ativa ? 'is-ativa' : ''} ${feita ? 'is-feita' : ''}`}>
              <button
                type="button"
                aria-expanded={ativa}
                aria-controls={`${base}-${e.id}`}
                onClick={() => setAberta(i)}
                className="entrega-botao grid w-full grid-cols-[2.4rem_1fr] items-start gap-x-3 text-left"
              >
                <span aria-hidden="true" className="entrega-no font-display italic">
                  {i + 1}
                </span>
                <span className="block min-w-0 py-2.5">
                  <span className="block text-[0.86rem] font-semibold tracking-[0.02em] text-pitanga-texto">{e.quando}</span>
                  <span className={`block text-[1.12rem] leading-snug ${ativa ? 'font-semibold' : 'font-medium'}`}>{e.titulo}</span>
                </span>
              </button>
              {ativa && (
                <div id={`${base}-${e.id}`} className="troca ml-[3.15rem] pb-5">
                  <p className="prosa max-w-[56ch] text-[1.03rem] text-grafite">{e.resumo}</p>
                  <div className="entrega-peca relative mt-4 max-w-[26rem] rounded-xl border border-linha bg-folha p-4 pt-9 text-[0.92rem] leading-snug">
                    <SeloFicticio topo />
                    <p className="font-semibold">{e.peca.titulo}</p>
                    <dl className="mt-2.5 space-y-1.5">
                      {e.peca.linhas.map(([r, t]) => (
                        <div key={r} className="grid grid-cols-[6.4rem_1fr] gap-x-3 border-t border-linha pt-1.5">
                          <dt className="text-grafite">{r}</dt>
                          <dd>{t}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="mt-4 flex gap-5 text-[0.98rem] font-medium text-cobalto">
                    {i > 0 && (
                      <button type="button" onClick={() => setAberta(i - 1)} className="sublinha">
                        Etapa anterior
                      </button>
                    )}
                    {i < total - 1 && (
                      <button type="button" onClick={() => setAberta(i + 1)} className="sublinha">
                        Próxima etapa
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
