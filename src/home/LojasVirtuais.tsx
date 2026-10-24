// Bloco de lojas virtuais da home (23/10/2026): o diagnóstico antes do orçamento.
// 23/10/2026 (decisão do dono, home "muito gigante"): a mesa de diagnóstico inteira saiu da home e ficou só na
// página do case. Aqui ficam o título, um parágrafo, o funil com os números e a origem, a linha do alto ticket e o
// caminho para o caso completo. Nada de nome de loja, de dono, de valor em dinheiro nem de IA.
import { hashDoProjeto } from '../lib/rota'
import { conteudoHome } from './conteudo'

/** Slug do projeto que o bloco mostra. O caminho vem da fonte única da rota, não de cópia local. */
const SLUG = 'loja-virtual'

/**
 * Bloco "lojas virtuais" da home: o funil do catálogo em uma linha, os números em faixa com a origem ao lado e o
 * caminho para o case. A peça animada do diagnóstico continua inteira em `#/projetos/loja-virtual`.
 */
export function LojasVirtuais() {
  const { lojas } = conteudoHome()
  return (
    <section id="lojas" className="secao">
      <h2 className="titulo-bloco alvo-secao"><span className="titulo-texto">{lojas.titulo}</span></h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed">{lojas.texto}</p>
      <ol className="lojas-funil mt-5" aria-label={lojas.funilRotulo}>
        {lojas.funil.map((elo) => <li key={elo}>{elo}</li>)}
      </ol>
      <p className="lojas-numeros mt-3">{lojas.numeros}</p>
      <p className="lojas-origem mt-1">{lojas.origem}</p>
      <p className="mt-4 max-w-[62ch] leading-relaxed">{lojas.altoTicket}</p>
      <div className="mt-5 lg:mt-6">
        <a href={hashDoProjeto(SLUG)} className="link-secundario toque">
          {lojas.cta}
          <span className="seta" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
