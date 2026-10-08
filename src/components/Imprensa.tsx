import { useState } from 'react'
import { noticias, type Noticia } from '../noticias'
import { Descer } from './Descer'
import { LinkExterno } from './LinkExterno'

/** Data ISO (AAAA-MM-DD) no formato brasileiro, sem passar por fuso horário. */
function dataBr(iso: string): string {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

/** Uma matéria: veículo, data e manchete, levando à matéria; o que eu fiz aparece no hover. */
function Faixa({ n }: { n: Noticia }) {
  return (
    <li>
      <LinkExterno href={n.url} className="faixa-noticia group -mx-3 grid grid-cols-[1fr_auto] gap-x-3 rounded-lg px-3 py-3.5">
        <span className="min-w-0">
          <span className="block text-[0.88rem] text-grafite">
            <span className="font-semibold">{n.veiculo}</span>, <span className="tabular-nums">{dataBr(n.data)}</span>
          </span>
          <span className="mt-1 block text-[1.02rem] leading-[1.35] font-medium underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-pitanga group-focus-visible:decoration-pitanga">
            {n.titulo}
          </span>
          <span className="revela">
            <span className="prosa block pt-1.5 text-[0.95rem] text-grafite">{n.papel}</span>
          </span>
        </span>
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" className="seta-noticia mt-1 text-cobalto">
          <path d="M6 14L14 6M8 6h6v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </LinkExterno>
    </li>
  )
}

/** Quantas matérias ficam à vista antes do "ver mais". */
const A_VISTA = 2

/**
 * Imprensa em formato compacto, na coluna estreita ao lado de "Onde trabalhei": as duas matérias
 * mais recentes à vista e o resto em "Descer". No hover ou no foco aparece o que eu fiz no
 * projeto; em tela de toque isso já vem aberto.
 *
 * @param embutida `true` dentro da aba "Na imprensa" do celular: o título fica só para o leitor de tela.
 */
export function Imprensa({ embutida = false }: { embutida?: boolean }) {
  const [aberto, setAberto] = useState(false)
  const resto = noticias.slice(A_VISTA)
  return (
    <section id="imprensa" aria-labelledby="imprensa-titulo" className="scroll-mt-24 min-w-0 lg:sticky lg:top-28 lg:self-start">
      <h2 id="imprensa-titulo" className={embutida ? 'sr-only' : 'text-[1.4rem] leading-[1.2] font-semibold lg:text-[1.6rem]'}>
        Saiu na imprensa
      </h2>
      <ul className={`divide-y divide-linha border-t border-linha ${embutida ? '' : 'mt-4'}`}>
        {noticias.slice(0, A_VISTA).map((n) => (
          <Faixa key={n.id} n={n} />
        ))}
      </ul>
      {resto.length > 0 && (
        <Descer id="imprensa-resto" aberto={aberto} aoAlternar={() => setAberto((v) => !v)} oQue={`mais ${resto.length} matérias`} className="border-t border-linha pt-2">
          <ul className="divide-y divide-linha">
            {resto.map((n) => (
              <Faixa key={n.id} n={n} />
            ))}
          </ul>
        </Descer>
      )}
    </section>
  )
}
