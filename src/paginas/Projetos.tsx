import { useMemo, useRef } from 'react'
import { ComoMontoAgentes } from '../components/ComoMontoAgentes'
import { CartaNautica } from '../components/CartaNautica'
import { Contato } from '../components/Contato'
import { GaleriaProjetos } from '../components/GaleriaProjetos'
import { PainelProjeto } from '../components/PainelProjeto'
import { HASH_PROJETOS, hashDoProjeto, projetoDoHash } from '../lib/rota'
import { listarProjetos } from '../projetos'

/**
 * Página de projetos: abertura curta, galeria filtrável e a chamada do LinkedIn. O projeto aberto
 * vive no hash (`#/projetos/<slug>`), então o link do painel pode ser compartilhado.
 */
export function PaginaProjetos({ hash }: { hash: string }) {
  const itens = useMemo(listarProjetos, [])
  const slug = projetoDoHash(hash)
  const aberto = slug ? (itens.find((i) => i.slug === slug) ?? null) : null
  // `true` quando o painel foi aberto por clique aqui: fechar volta no histórico em vez de empilhar.
  const abertoPorClique = useRef(false)

  function abrir(s: string) {
    abertoPorClique.current = true
    window.location.hash = hashDoProjeto(s)
  }

  function fechar() {
    const origem = slug
    if (abertoPorClique.current) {
      abertoPorClique.current = false
      history.back()
    } else {
      window.location.hash = HASH_PROJETOS
    }
    // O foco volta ao card que abriu o painel, depois que o hash muda.
    window.setTimeout(() => origem && document.getElementById(`card-${origem}`)?.focus({ preventScroll: true }), 80)
  }

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
      <GaleriaProjetos aoAbrir={abrir} />
      <ComoMontoAgentes />
      <div className="mt-24">
        <Contato />
      </div>
      <PainelProjeto item={aberto} aoFechar={fechar} />
    </>
  )
}
