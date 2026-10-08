import { useMemo } from 'react'
import { ComoMontoAgentes } from '../components/ComoMontoAgentes'
import { CartaNautica } from '../components/CartaNautica'
import { Contato } from '../components/Contato'
import { GaleriaProjetos } from '../components/GaleriaProjetos'
import { PaginaCase } from '../components/case/PaginaCase'
import { HASH_PROJETOS, filtroDoHash, hashDoProjeto, projetoDoHash } from '../lib/rota'
import { listarProjetos, separarGaleria, tiposProjeto, type TipoProjeto } from '../projetos'

/**
 * Página de projetos: abertura curta, galeria filtrável e a chamada do LinkedIn. Com um projeto no hash
 * (`#/projetos/<slug>`), a página vira o case daquele projeto, em tela cheia e com link compartilhável.
 */
export function PaginaProjetos({ hash }: { hash: string }) {
  const itens = useMemo(listarProjetos, [])
  // Ordem de leitura da galeria (Em empresas, próprios, outros), para o "anterior" e o "próximo" do case.
  const ordem = useMemo(() => {
    const s = separarGaleria(itens)
    return [...s.emEmpresas, ...s.proprios, ...s.outros]
  }, [itens])
  const slug = projetoDoHash(hash)
  const aberto = slug ? (itens.find((i) => i.slug === slug) ?? null) : null
  // `#/projetos/tipo/frontend` abre a galeria já filtrada (link da seção "Interfaces que eu construo").
  const pedido = filtroDoHash(hash)
  const filtroInicial = pedido && pedido in tiposProjeto ? (pedido as TipoProjeto) : undefined

  function abrir(s: string) {
    window.location.hash = hashDoProjeto(s)
  }

  /** Volta para a galeria; o App leva o foco e a rolagem de volta ao card do projeto. */
  function voltar() {
    window.location.hash = HASH_PROJETOS
  }

  if (aberto) return <PaginaCase key={aberto.slug} item={aberto} itens={ordem} aoVoltar={voltar} />

  return (
    <>
      <section aria-labelledby="projetos-pagina-titulo" className="relative isolate bg-nevoa pt-10 pb-8 sm:pt-14 sm:pb-10">
        <CartaNautica
          versao="tartaruga"
          sizes="(min-width: 640px) 420px, 60vw"
          className="carta-topo pointer-events-none absolute top-0 right-0 -z-10 h-full w-[62%] sm:w-[min(48%,460px)]"
        />
        <a href="#/" className="sublinha text-[0.98rem] text-grafite hover:text-tinta">
          Voltar para o início
        </a>
        <h1 id="projetos-pagina-titulo" className="mt-5 text-[2.6rem] leading-[1.05] font-bold tracking-[0.004em] sm:text-[3.6rem]">
          Projetos
        </h1>
        <p className="prosa mt-3 max-w-[62ch] text-[1.15rem] leading-[1.5] text-grafite sm:text-[1.25rem]">
          A tela de cada produto e o que ele resolve. Toque em um para ver como foi feito.
        </p>
      </section>
      <GaleriaProjetos aoAbrir={abrir} filtroInicial={filtroInicial} />
      <ComoMontoAgentes />
      <div className="mt-24">
        <Contato />
      </div>
    </>
  )
}
