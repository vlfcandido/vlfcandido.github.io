import { links } from '../conteudo'
import { HORA_EXTRA, pacotes, reais, terceiros, valorHora, type Pacote } from '../pacotes'
import { LINKEDIN } from '../visuais'
import { FonteLink } from './FonteLink'
import { LinkExterno } from './LinkExterno'

/** Cartão compacto: horas e preço em destaque, hora no pé e uma linha do que cabe. */
function Cartao({ p, destaque }: { p: Pacote; destaque?: boolean }) {
  return (
    <li
      className={`pacote flex w-[78%] shrink-0 snap-start flex-col rounded-xl border border-t-[3px] bg-folha p-5 sm:w-auto sm:shrink ${destaque ? 'border-cobalto' : 'border-linha'}`}
    >
      <h3 className="text-[1.02rem] font-semibold tracking-[0.02em] text-grafite">{p.nome}</h3>
      <p className="mt-2 flex items-baseline gap-2 leading-none">
        <span className="font-display text-[2.6rem] font-bold text-tinta">{p.horas} h</span>
        <span className="text-[0.95rem] text-grafite">por mês</span>
      </p>
      <p className="mt-3 font-display text-[1.6rem] leading-none font-bold text-cobalto">
        {reais(p.valor)}
        <span className="ml-1.5 text-[0.9rem] font-medium text-grafite">/ mês</span>
      </p>
      <p className="mt-1 text-[0.9rem] text-grafite">{reais(valorHora(p))} a hora</p>
      <p className="mt-4 border-t border-linha pt-3 text-[0.98rem] leading-snug">{p.cabe}</p>
    </li>
  )
}

/**
 * Seção "Pacotes": três bancos de horas mensais (sustentação e evolução). Projeto novo sai com preço fechado
 * pelo escopo de uma página. No celular os cartões rolam em linha; no computador ficam lado a lado.
 */
export function Pacotes() {
  const noventaENove = links.find((l) => l.rotulo === '99Freelas')
  return (
    <section id="pacotes" aria-labelledby="pacotes-titulo" className="secao scroll-mt-24 border-t border-linha">
      <h2 id="pacotes-titulo" className="titulo-secao">
        Pacotes de sustentação e evolução
      </h2>
      <p className="prosa mt-1.5 max-w-[60ch] text-[1.02rem] text-grafite">
        Projeto novo sai com preço fechado, pelo escopo de uma página. Depois, o banco de horas mensal mantém e evolui o que foi entregue.
      </p>
      <ul className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0" aria-label="Pacotes mensais">
        {pacotes.map((p) => (
          <Cartao key={p.id} p={p} destaque={p.id === 'evolucao'} />
        ))}
      </ul>
      <p className="mt-4 text-[0.95rem] text-grafite">
        Hora extra {reais(HORA_EXTRA)}, avisada antes. Horas não usadas não acumulam. {terceiros.texto} <FonteLink fonte={terceiros.fonte} />
      </p>
      <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[1.02rem]">
        <span className="text-grafite">Quer um preço fechado?</span>
        {noventaENove && (
          <LinkExterno href={noventaENove.url} className="sublinha font-semibold text-cobalto">
            Fale comigo pelo 99Freelas
          </LinkExterno>
        )}
        <LinkExterno href={LINKEDIN} className="sublinha font-semibold text-cobalto">
          ou pelo LinkedIn
        </LinkExterno>
      </p>
    </section>
  )
}
