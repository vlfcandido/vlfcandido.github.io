import { useEffect, useState } from 'react'
import { oferta, ramosDemo, type Oferta } from '../conteudo'
import { FluxoAgente } from './FluxoAgente'
import { IconeOferta } from './IconesOferta'

/** Índice da oferta sugerida para um ramo do seletor (a primeira, se o ramo não tiver sugestão). */
function ofertaDoRamo(ramo: string): number {
  return Math.max(0, oferta.findIndex((o) => o.ramos.includes(ramo)))
}

/** "numa clínica", "num escritório": o ramo com o artigo certo. */
function noRamo(ramo: string): string | null {
  const r = ramosDemo.find((x) => x.id === ramo)
  if (!r) return null
  return `${ramo === 'escritorio' ? 'num' : 'numa'} ${r.rotulo.toLowerCase()}`
}

/** Antes e depois de uma oferta: o exemplo concreto, escrito como ilustração. */
function AntesDepois({ o, grande }: { o: Oferta; grande?: boolean }) {
  return (
    <div className={grande ? 'flex flex-col gap-6' : 'flex flex-col gap-4'}>
      <div className="border-l-2 border-linha pl-4">
        <p className="text-[0.92rem] font-semibold text-grafite">Antes</p>
        <p className={`prosa mt-1 text-grafite ${grande ? 'text-[1.3rem] leading-[1.4]' : 'text-[1.05rem]'}`}>{o.antes}</p>
      </div>
      <div className="border-l-2 border-pitanga pl-4">
        <p className="text-[0.92rem] font-semibold text-pitanga-texto">Depois</p>
        <p className={`mt-1 font-semibold text-tinta ${grande ? 'text-[1.45rem] leading-[1.3]' : 'text-[1.1rem] leading-[1.35]'}`}>{o.depois}</p>
      </div>
    </div>
  )
}

/**
 * O que eu resolvo: quatro ofertas. Passar o mouse, focar ou tocar numa delas mostra um exemplo
 * de antes e depois; o ramo escolhido no "Qual é o seu negócio?" da abertura marca a sugestão.
 * No computador o exemplo fica num painel ao lado; no celular, abre embaixo da oferta tocada.
 */
export function Resolvo({ ramo }: { ramo: string }) {
  const [ativo, setAtivo] = useState(() => ofertaDoRamo(ramo))
  const sugerida = ofertaDoRamo(ramo)
  const onde = noRamo(ramo)

  // Trocar o ramo na abertura leva o destaque para a oferta sugerida.
  useEffect(() => setAtivo(ofertaDoRamo(ramo)), [ramo])

  const atual = oferta[ativo]
  return (
    <section id="o-que-eu-resolvo" aria-labelledby="resolvo-titulo" className="scroll-mt-24 border-t border-linha py-20 sm:py-28">
      <h2 id="resolvo-titulo" className="text-[2rem] leading-[1.12] font-bold tracking-[0.004em] sm:text-[2.6rem]">
        O que eu resolvo
      </h2>
      <p className="prosa mt-3 max-w-[52ch] text-[1.08rem] text-grafite">
        Toque numa oferta para ver um exemplo de antes e depois. Os exemplos são ilustrativos.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <ul className="grid gap-3 lg:col-span-7">
          {oferta.map((o, i) => {
            const eAtivo = i === ativo
            return (
              <li key={o.id} data-ativo={eAtivo} className="oferta rounded-r-xl border-l-[3px]">
                <button
                  type="button"
                  aria-expanded={eAtivo}
                  aria-controls={`exemplo-${o.id} exemplo-oferta`}
                  onClick={() => setAtivo(i)}
                  onMouseEnter={() => setAtivo(i)}
                  onFocus={() => setAtivo(i)}
                  className="grid w-full grid-cols-[3rem_1fr] items-start gap-4 rounded-r-xl px-4 py-4 text-left sm:gap-5 sm:px-5"
                >
                  <IconeOferta id={o.id} className="oferta-icone size-12" />
                  <span className="block min-w-0">
                    <span className="oferta-titulo block text-[1.2rem] leading-snug font-semibold text-balance">{o.titulo}</span>
                    <span className="prosa mt-1 block text-[1.03rem] text-grafite">{o.descricao}</span>
                    {i === sugerida && onde && (
                      <span className="mt-2 inline-flex items-center gap-2 text-[0.92rem] font-semibold text-pitanga-texto">
                        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-pitanga" />
                        Por onde eu começaria {onde}
                      </span>
                    )}
                  </span>
                </button>
                {/* Celular: o exemplo abre embaixo da oferta tocada. */}
                <div className="lg:hidden">
                  <div id={`exemplo-${o.id}`} className="expansivel" data-aberto={eAtivo} inert={!eAtivo}>
                    <div>
                      <div className="pt-1 pr-4 pb-5 pl-[5rem] sm:pl-[5.25rem]">
                        <AntesDepois o={o} />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Computador: o exemplo da oferta ativa num painel fixo ao lado. */}
        <div id="exemplo-oferta" aria-live="polite" className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28 rounded-2xl border border-linha bg-folha p-8 shadow-[8px_8px_0_var(--linha)]">
            <div className="flex items-center gap-4">
              <IconeOferta id={atual.id} className="size-14 text-cobalto" />
              <p className="text-[1rem] font-semibold text-grafite">Exemplo ilustrativo</p>
            </div>
            <p className="mt-5 text-[1.15rem] leading-snug font-semibold">{atual.titulo}</p>
            <div key={atual.id} className="troca mt-6">
              <AntesDepois o={atual} grande />
            </div>
          </div>
        </div>
      </div>

      <FluxoAgente />
    </section>
  )
}
