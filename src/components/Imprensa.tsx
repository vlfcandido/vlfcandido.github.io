import { noticias } from '../noticias'
import { LinkExterno } from './LinkExterno'

/** Data ISO (AAAA-MM-DD) no formato brasileiro, sem passar por fuso horário. */
function dataBr(iso: string): string {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

/**
 * Imprensa em formato compacto, na coluna estreita ao lado de "Onde trabalhei": veículo, data e
 * manchete curta, cada uma levando à matéria. No hover ou no foco aparece o que eu fiz no projeto;
 * em tela de toque isso já vem aberto.
 */
export function Imprensa() {
  return (
    <section id="imprensa" aria-labelledby="imprensa-titulo" className="scroll-mt-24 min-w-0 lg:sticky lg:top-28 lg:self-start">
      <h2 id="imprensa-titulo" className="text-[1.6rem] leading-[1.2] font-semibold">
        Saiu na imprensa
      </h2>
      <ul className="mt-6 divide-y divide-linha border-y border-linha">
        {noticias.map((n) => (
          <li key={n.id}>
            <LinkExterno href={n.url} className="faixa-noticia group -mx-3 grid grid-cols-[1fr_auto] gap-x-3 rounded-lg px-3 py-4">
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
        ))}
      </ul>
    </section>
  )
}
