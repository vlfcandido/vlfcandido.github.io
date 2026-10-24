// Bloco de lojas virtuais da home (23/10/2026): o diagnóstico antes do orçamento. Título, o problema em uma frase,
// a linha de serviços em corpo menor, a mesa de diagnóstico do case loja-virtual e o caminho para o caso completo.
// Seção nova, entre os projetos e o "Como funciona"; não substitui nenhum dos três destaques.
import { casoDe } from '../casos'
import { MesaDiagnostico } from '../components/case/pecas/MesaDiagnostico'
import { hashDoProjeto } from '../lib/rota'
import { listarProjetos } from '../projetos'
import { conteudoHome } from './conteudo'

/** Slug do projeto que o bloco mostra. O item e o case vêm das fontes únicas, não de cópia local. */
const SLUG = 'loja-virtual'

/**
 * Bloco "lojas virtuais" da home: o método de diagnóstico com a peça revisada do case.
 * O item sai de `listarProjetos()` e o caso de `casoDe()`; os testes de projetos e de casos garantem que
 * `loja-virtual` existe nos dois, e o bloco só renderiza a peça quando acha os dois.
 */
export function LojasVirtuais() {
  const { lojas } = conteudoHome()
  const item = listarProjetos().find((i) => i.slug === SLUG)
  const caso = casoDe(SLUG)
  return (
    <section id="lojas" className="secao">
      <h2 className="titulo-bloco alvo-secao"><span className="titulo-texto">{lojas.titulo}</span></h2>
      <p className="mt-4 max-w-[62ch] leading-relaxed">{lojas.texto}</p>
      <p className="mt-2 max-w-[62ch] text-sm text-grafite">{lojas.servicos}</p>
      {item && caso && (
        <div className="mt-8 lg:mt-10">
          <MesaDiagnostico item={item} caso={caso} />
        </div>
      )}
      <div className="mt-6 lg:mt-8">
        <a href={hashDoProjeto(SLUG)} className="link-secundario toque">
          {lojas.cta}
          <span className="seta" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
