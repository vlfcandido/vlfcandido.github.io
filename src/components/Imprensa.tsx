import { noticias } from '../noticias'
import { LinkExterno } from './LinkExterno'

/** Data ISO (AAAA-MM-DD) no formato brasileiro, sem passar por fuso horário. */
function dataBr(iso: string): string {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

/**
 * Imprensa em uma faixa: veículo e manchete curta, cada uma levando à matéria. No hover ou no
 * foco a linha se destaca e revela o que eu fiz no projeto; em tela de toque isso já vem aberto.
 */
export function Imprensa() {
  return (
    <section id="imprensa" aria-labelledby="imprensa-titulo" className="scroll-mt-24 border-t border-linha py-20 sm:py-28">
      <h2 id="imprensa-titulo" className="text-[2rem] leading-[1.12] font-bold tracking-[0.004em] sm:text-[2.6rem]">
        Saiu na imprensa
      </h2>
      <ul className="mt-10 divide-y divide-linha border-y border-linha">
        {noticias.map((n) => (
          <li key={n.id}>
            <LinkExterno
              href={n.url}
              className="faixa-noticia group -mx-3 grid gap-1 rounded-lg px-3 py-5 sm:grid-cols-[11rem_1fr_auto] sm:items-baseline sm:gap-6"
            >
              <span className="text-[0.98rem] font-semibold text-grafite">
                {n.veiculo}
                <span className="block text-[0.9rem] font-normal">{dataBr(n.data)}</span>
              </span>
              <span>
                <span className="block text-[1.15rem] leading-[1.35] font-medium underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-cobalto">
                  {n.titulo}
                </span>
                <span className="revela">
                  <span className="prosa block pt-2 text-[1.02rem] text-grafite">{n.papel}</span>
                </span>
              </span>
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="seta-noticia hidden text-cobalto sm:block">
                <path d="M6 14L14 6M8 6h6v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </LinkExterno>
          </li>
        ))}
      </ul>
    </section>
  )
}
