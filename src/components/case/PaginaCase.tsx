import { useEffect } from 'react'
import { casoDe } from '../../casos'
import { empresasDiretas, gruposClientes } from '../../clientes'
import { hashDoProjeto } from '../../lib/rota'
import type { ItemProjeto } from '../../projetos'
import { DiagramaMare } from '../DiagramaMare'
import { CabecalhoCase, FaixaStatus, MeuPapel, ReguaNumeros, RodapeFonte, RotuloFicticio } from './Moldura'
import { PECAS } from './pecas'
import { PrintAmpliavel } from './PrintAmpliavel'

interface Props {
  item: ItemProjeto
  /** Lista da galeria, na ordem da página, para o "anterior" e o "próximo". */
  itens: ItemProjeto[]
  /** Volta para a galeria (quem chama cuida do histórico e do foco no card). */
  aoVoltar: () => void
}

/** Botão de voltar para a galeria, com a seta desenhada (não um caractere). */
function Voltar({ aoVoltar }: { aoVoltar: () => void }) {
  return (
    <button type="button" onClick={aoVoltar} className="inline-flex items-center gap-2 text-[0.98rem] text-grafite hover:text-tinta">
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <path d="M16 10H4M9 5l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sublinha">Todos os projetos</span>
    </button>
  )
}

/**
 * Página de case de um projeto, em tela cheia (`#/projetos/<slug>`). A moldura é a mesma em todos:
 * cabeçalho, situação, peça principal, números, história, papel, o que falta e a fonte. A peça principal
 * é a de cada projeto e não se repete.
 */
export function PaginaCase({ item, itens, aoVoltar }: Props) {
  const caso = casoDe(item.slug)
  const empresa = item.empresa
    ? [...empresasDiretas, ...gruposClientes.flatMap((g) => g.clientes)].find((e) => e.slug === item.empresa)
    : undefined
  const i = itens.findIndex((x) => x.slug === item.slug)
  const anterior = i > 0 ? itens[i - 1] : undefined
  const proximo = i >= 0 && i < itens.length - 1 ? itens[i + 1] : undefined

  useEffect(() => {
    const antes = document.title
    document.title = `${item.nome}, projeto de Vinicius Candido`
    return () => void (document.title = antes)
  }, [item.nome])

  if (!caso) return null
  const Peca = PECAS[caso.peca]
  const prints = item.telas ?? [item.print, item.printExtra].filter((p) => p !== undefined)

  return (
    <article aria-labelledby="case-titulo" className={`pagina-case pagina-case-${caso.peca} pt-8 pb-6 sm:pt-12`}>
      <Voltar aoVoltar={aoVoltar} />
      <div className="mt-8">
        <CabecalhoCase item={item} caso={caso} empresa={empresa} />
      </div>
      <FaixaStatus texto={caso.status.texto} tom={caso.status.tom} />

      <section aria-labelledby="case-peca" className="case-peca mt-12">
        <h2 id="case-peca" className="text-[1.6rem] leading-[1.2] font-semibold sm:text-[2rem]">
          {caso.tituloPeca}
        </h2>
        <div className="mt-6">
          <Peca item={item} caso={caso} />
        </div>
        <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="prosa max-w-[60ch] text-[1.02rem] text-grafite italic">{caso.legendaPeca}</p>
          {caso.ficticio && <RotuloFicticio>{caso.ficticio}</RotuloFicticio>}
        </div>
      </section>

      <ReguaNumeros numeros={caso.regua} />

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="space-y-9">
          {caso.historia.map((t) => (
            <section key={t.titulo}>
              <h2 className="text-[1.35rem] font-semibold">{t.titulo}</h2>
              <p className="prosa mt-2 max-w-[62ch] text-[1.12rem]">{t.texto}</p>
            </section>
          ))}
          {caso.falta && caso.falta.length > 0 && (
            <section>
              <h2 className="text-[1.35rem] font-semibold">O que ainda falta</h2>
              <ul className="mt-3 max-w-[62ch] space-y-2.5">
                {caso.falta.map((f) => (
                  <li key={f} className="grid grid-cols-[1.4rem_1fr] text-[1.05rem] leading-relaxed">
                    <span aria-hidden="true" className="mt-[0.8em] h-[2px] w-3 bg-pitanga" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div className="lg:pt-1">
          <MeuPapel papel={caso.papel} />
        </div>
      </div>

      {caso.comPrints && prints.length > 0 && (
        <section aria-labelledby="case-telas" className="mt-16">
          <h2 id="case-telas" className="text-[1.35rem] font-semibold">
            As telas, com dados fictícios
          </h2>
          <div className={`mt-5 grid gap-6 ${prints.length > 1 ? 'md:grid-cols-2' : 'md:max-w-[44rem]'}`}>
            {prints.map((p) => (
              <PrintAmpliavel key={p.arquivo} print={p} legenda={p.alt} />
            ))}
          </div>
        </section>
      )}

      {caso.comDiagrama && item.diagrama && (
        <section aria-labelledby="case-diagrama" className="mt-16">
          <h2 id="case-diagrama" className="text-[1.35rem] font-semibold">
            Como as peças conversam
          </h2>
          <div className="mt-4 rounded-lg border border-linha bg-folha px-1 py-3 sm:p-6">
            <DiagramaMare id={item.diagrama} />
          </div>
        </section>
      )}

      <RodapeFonte item={item} fonte={item.fonte} />

      <nav aria-label="Outros projetos" className="mt-14 grid gap-3 border-t border-linha pt-8 sm:grid-cols-2">
        {anterior ? (
          <a href={hashDoProjeto(anterior.slug)} className="case-vizinho rounded-lg border border-linha p-4 hover:border-cobalto">
            <span className="block text-[0.88rem] text-grafite">Anterior</span>
            <span className="mt-1 block font-display text-[1.15rem] font-semibold">{anterior.nome}</span>
          </a>
        ) : (
          <span />
        )}
        {proximo && (
          <a href={hashDoProjeto(proximo.slug)} className="case-vizinho rounded-lg border border-linha p-4 text-right hover:border-cobalto">
            <span className="block text-[0.88rem] text-grafite">Próximo</span>
            <span className="mt-1 block font-display text-[1.15rem] font-semibold">{proximo.nome}</span>
          </a>
        )}
      </nav>
      <div className="mt-8">
        <Voltar aoVoltar={aoVoltar} />
      </div>
    </article>
  )
}
