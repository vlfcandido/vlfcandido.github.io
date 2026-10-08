import { Empresas } from '../components/Empresas'
import { Ferramentas } from '../components/Ferramentas'
import { Projetos } from '../components/Projetos'
import { perfil } from '../conteudo'

/** Página de projetos: o detalhe técnico que saiu da principal (diagramas, prints, testes e ferramentas). */
export function PaginaProjetos() {
  return (
    <>
      <section aria-labelledby="projetos-pagina-titulo" className="pt-12 pb-12 sm:pt-16">
        <a href="#/" className="text-grafite underline decoration-linha decoration-2 underline-offset-4 hover:text-tinta">
          Voltar para o início
        </a>
        <h1 id="projetos-pagina-titulo" className="mt-6 text-[2.4rem] leading-[1.05] font-bold tracking-tight sm:text-[3.4rem]">
          Projetos em detalhe
        </h1>
        <p className="prosa mt-6 max-w-[64ch] text-[1.15rem] text-grafite">{perfil.resumo}</p>
      </section>
      <Empresas />
      <Projetos />
      <Ferramentas />
    </>
  )
}
