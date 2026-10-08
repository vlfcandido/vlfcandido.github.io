import { useState } from 'react'
import { links } from '../conteudo'
import { pacotesManutencao, pacotesProjeto, precoInicial, type Pacote } from '../pacotes'
import { LINKEDIN } from '../visuais'
import { Abas, idAba, idPainel } from './Abas'
import { FonteLink } from './FonteLink'
import { LinkExterno } from './LinkExterno'

const VISTAS = [
  { id: 'projeto', rotulo: 'Projeto' },
  { id: 'manutencao', rotulo: 'Manutenção mensal' },
]

/** Cartão de um pacote: nome, preço inicial, o que entra e, quando há, o custo de terceiros com a fonte. */
function Cartao({ p, mensal }: { p: Pacote; mensal?: boolean }) {
  return (
    <li className="pacote flex flex-col rounded-xl border border-linha bg-folha p-5">
      <h3 className="text-[1.2rem] leading-snug font-semibold">{p.nome}</h3>
      <p className="mt-1 text-[0.98rem] text-grafite">{p.para}</p>
      <p className="mt-4 font-display text-[1.55rem] leading-tight font-bold text-cobalto">{precoInicial(p.valor, mensal ? 'mês' : undefined)}</p>
      <ul className="mt-3 space-y-1.5 text-[0.98rem]">
        {p.inclui.map((t) => (
          <li key={t} className="grid grid-cols-[1.1rem_1fr]">
            <span aria-hidden="true" className="mt-[0.7em] h-[2px] w-2.5 bg-pitanga" />
            {t}
          </li>
        ))}
      </ul>
      {p.terceiros && (
        <p className="mt-4 border-t border-linha pt-3 text-[0.92rem] leading-relaxed text-grafite">
          <span className="font-semibold text-tinta">Custo de terceiros. </span>
          {p.terceiros.texto} <FonteLink fonte={p.terceiros.fonte} />
        </p>
      )}
    </li>
  )
}

/**
 * Seção "Pacotes — a partir de": pacotes de projeto e de manutenção mensal, com preço sempre "a partir de".
 * Sem contato direto: a ação é o 99Freelas ou o LinkedIn, como no resto do site.
 */
export function Pacotes() {
  const [vista, setVista] = useState('projeto')
  const noventaENove = links.find((l) => l.rotulo === '99Freelas')
  return (
    <section id="pacotes" aria-labelledby="pacotes-titulo" className="secao scroll-mt-24 border-t border-linha">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <h2 id="pacotes-titulo" className="titulo-secao">
            Pacotes — a partir de
          </h2>
          <p className="prosa mt-1.5 max-w-[56ch] text-[1.02rem] text-grafite">
            O valor fechado sai do escopo de uma página, antes de começar. Aqui está o ponto de partida de cada tipo de pedido.
          </p>
        </div>
        <Abas
          base="pacotes"
          rotulo="Tipo de pacote"
          ativa={vista}
          aoTrocar={setVista}
          abas={VISTAS}
          className="inline-flex rounded-full border border-linha bg-folha p-1"
          classeAba={(marcada) => `chip rounded-full px-4 py-2 text-[0.95rem] font-medium ${marcada ? 'bg-cobalto text-nevoa' : 'text-tinta hover:text-cobalto'}`}
        />
      </div>
      {VISTAS.map((v) => (
        <div key={v.id} role="tabpanel" id={idPainel('pacotes', v.id)} aria-labelledby={idAba('pacotes', v.id)} hidden={vista !== v.id} className="mt-7">
          {v.id === 'manutencao' && (
            <p className="prosa mb-5 max-w-[60ch] text-[1.02rem] text-grafite">
              Opcional, depois dos 7 dias de correção sem custo. Hora acima das incluídas: avisada antes de ser feita.
            </p>
          )}
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(v.id === 'projeto' ? pacotesProjeto : pacotesManutencao).map((p) => (
              <Cartao key={p.id} p={p} mensal={v.id === 'manutencao'} />
            ))}
          </ul>
        </div>
      ))}
      <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[1.02rem]">
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
