import { useMemo } from 'react'
import { Contato } from '../components/Contato'
import { GaleriaProjetos } from '../components/GaleriaProjetos'
import { PaginaCase } from '../components/case/PaginaCase'
import { universoDeProjetos } from '../home/lib/universo'
import { HASH_PROJETOS, filtroDoHash, hashDoProjeto, projetoDoHash } from '../lib/rota'
import { listarProjetos, separarGaleria, tiposProjeto, type TipoProjeto } from '../projetos'

/**
 * Página de projetos: abertura curta, galeria filtrável e a chamada para conversar. Com um projeto no hash
 * (`#/projetos/<slug>`), a página vira o case daquele projeto, em tela cheia e com link compartilhável.
 */
export function PaginaProjetos({ hash }: { hash: string }) {
  const itens = useMemo(listarProjetos, [])
  // As peças navegáveis entram no topo da galeria: o total da página bate com o número da prova (14/10/2026).
  const { pecas } = useMemo(() => universoDeProjetos(), [])
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
      {/* 14/10/2026 (fix final): saíram a carta náutica com tartaruga ao lado do título e o bloco "Como eu monto
          agentes" do fim da página (identidade Maré, spec §4). */}
      <section aria-labelledby="projetos-pagina-titulo" className="pt-10 pb-8 sm:pt-14 sm:pb-10">
        <a href="#/" className="sublinha text-[0.98rem] text-grafite hover:text-tinta">
          Voltar para o início
        </a>
        <h1 id="projetos-pagina-titulo" className="mt-5 text-[2.6rem] leading-[1.05] font-bold tracking-[0.004em] sm:text-[3.6rem]">
          Projetos
        </h1>
        <p className="prosa mt-3 max-w-[62ch] text-[1.15rem] leading-[1.5] text-grafite sm:text-[1.25rem]">
          A tela de cada produto e o que ele resolve.{' '}
          {/* "Toque" só onde se toca; com mouse, "Clique" (fix final, 14/10/2026). */}
          <span className="so-toque">Toque em um para ver como foi feito.</span>
          <span className="so-clique">Clique em um para ver como foi feito.</span>
        </p>
      </section>
      <GaleriaProjetos aoAbrir={abrir} filtroInicial={filtroInicial} pecas={pecas} />
      <div className="mt-24">
        <Contato />
      </div>
    </>
  )
}
