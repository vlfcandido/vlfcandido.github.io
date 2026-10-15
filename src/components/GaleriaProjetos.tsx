import { useMemo, useState, type CSSProperties } from 'react'
import { ONDE_TRABALHEI, empresasDiretas, gruposClientes } from '../clientes'
import { filtrarProjetos, listarProjetos, separarGaleria, tiposProjeto, type ItemProjeto, type TipoProjeto } from '../projetos'
import { CapaProjeto } from './CapaProjeto'
import { DiagramaMare } from './DiagramaMare'
import { Logo, logoClara } from './Logo'
import { Print, SeloFicticio } from './Print'
import { comTransicao } from '../lib/transicao'
import { caminhoPublico } from '../lib/assets'
import type { Peca } from '../home/lib/universo'

type Filtro = TipoProjeto | 'todos'

interface CartaoProps {
  item: ItemProjeto
  aoAbrir: (slug: string) => void
}

/** Logo de uma empresa, entre as diretas e as dos grupos de clientes. */
const logoDe = (slug?: string) =>
  slug ? [...empresasDiretas, ...gruposClientes.flatMap((g) => g.clientes)].find((e) => e.slug === slug) : undefined

/**
 * Card da galeria. O botão está no título (leitor de tela ouve o nome) e se estende pelo card
 * inteiro com um pseudo-elemento, então o clique vale em qualquer ponto. Quando o projeto tem tela
 * (ou logo) e desenho, um botão pequeno alterna entre os dois sem abrir o painel.
 */
function Cartao({ item, aoAbrir }: CartaoProps) {
  const empresa = logoDe(item.empresa)
  const contratante = item.contratante && item.contratante !== item.empresa ? logoDe(item.contratante) : undefined
  // Frente: capa ilustrada, senão a tela, senão a logo. Verso: o diagrama; sem ele, a tela/logo atrás da capa.
  const temTelaOuLogo = Boolean(item.print || empresa)
  const temFrente = Boolean(item.capa) || temTelaOuLogo
  const verso: 'diagrama' | 'tela' | null = item.diagrama ? 'diagrama' : item.capa && temTelaOuLogo ? 'tela' : null
  const [noVerso, setNoVerso] = useState(!temFrente)
  const mostra = noVerso && verso ? verso : item.capa ? 'capa' : 'tela'
  const rotuloFrente = item.capa ? 'Ver a ilustração' : item.print ? 'Ver a tela' : 'Ver a logo'
  const rotuloVerso = verso === 'diagrama' ? 'Ver o desenho' : item.print ? 'Ver a tela' : 'Ver a logo'
  const moldura = 'moldura-logo overflow-hidden rounded-md border border-linha bg-folha shadow-[6px_6px_0_var(--linha)]'
  return (
    <article className="cartao-projeto group relative flex h-full flex-col">
      <div className="relative">
        {mostra === 'diagrama' && item.diagrama ? (
          <div className={`${moldura} flex aspect-[16/10] items-center px-2`}>
            <DiagramaMare id={item.diagrama} modo="largo" className="w-full" />
          </div>
        ) : mostra === 'capa' && item.capa ? (
          <div className={`${moldura} relative aspect-[16/10]`}>
            <CapaProjeto capa={item.capa} sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw" className="h-full" />
            {item.capa.ficticio && <SeloFicticio />}
          </div>
        ) : item.print ? (
          <Print print={item.print} />
        ) : (
          // 14/10/2026 (fix final): a logo também em 16/10 (antes 16/7 sem capa), para toda imagem de cartão ter a mesma
          // proporção e os títulos de uma linha da grade alinharem.
          <div className={`${moldura} flex aspect-[16/10] items-center justify-center px-8`}>
            {empresa && <Logo cliente={empresa} className="max-h-11 max-w-[170px]" />}
          </div>
        )}
        {verso && temFrente && (
          <button
            type="button"
            aria-pressed={noVerso}
            onClick={() => setNoVerso((v) => !v)}
            className="absolute right-2 bottom-2 z-10 rounded-full border border-linha bg-folha/95 px-3 py-1.5 text-[0.85rem] leading-none font-semibold text-tinta hover:border-tinta hover:text-tinta"
          >
            {noVerso ? rotuloFrente : rotuloVerso}
          </button>
        )}
      </div>
      {/* 15/10/2026: caso de cliente atendido por uma empresa onde ele trabalhava (fonte única ONDE_TRABALHEI). */}
      {contratante && (
        <p className="mt-5 text-[0.85rem] font-semibold tracking-[0.02em] text-grafite">Cliente da {contratante.nome}</p>
      )}
      <h3 className={`${contratante ? 'mt-1' : 'mt-5'} text-[1.3rem] leading-[1.25] font-semibold tracking-[0.004em]`}>
        <button
          type="button"
          id={`card-${item.slug}`}
          onClick={() => aoAbrir(item.slug)}
          className="text-left group-hover:text-tinta after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:outline-none"
        >
          {item.nome}
        </button>
      </h3>
      <p className="prosa mt-1.5 text-[1.06rem] leading-[1.55] text-grafite">{item.resultado}</p>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-4" aria-label="Tecnologias">
        {item.etiquetas.map((t) => (
          <li key={t} className="rounded-full bg-tinta/[0.06] px-2.5 py-1 text-[0.82rem] leading-none font-medium text-grafite">
            {t}
          </li>
        ))}
      </ul>
    </article>
  )
}

/**
 * Faixa "Onde trabalhei" de #/projetos (15/10/2026): as mesmas empresas e a mesma ordem do bloco "Onde já trabalhei"
 * da home, lidas da fonte única `ONDE_TRABALHEI`. Antes a página só mostrava as logos dos casos (clientes como a
 * Prefeitura de Franca) e a home mostrava outras empresas.
 */
function OndeTrabalhei() {
  const base = import.meta.env.BASE_URL
  const empresas = ONDE_TRABALHEI.map((slug) => empresasDiretas.find((e) => e.slug === slug)).filter((e) => e !== undefined)
  return (
    <div className="mt-8 border-y border-linha py-5">
      <p className="text-[0.85rem] font-semibold tracking-[0.02em] text-grafite">Onde trabalhei</p>
      <ul className="mt-3 grid grid-cols-3 items-center gap-x-6 gap-y-4 sm:grid-cols-5">
        {empresas.map((e) => (
          <li key={e.slug} className="empresa flex h-10 items-center">
            {e.logo ? (
              <img className="logo-empresa max-w-[128px]" data-clara={logoClara(e.slug)} src={caminhoPublico(base, e.logo)} alt={e.nome} height={32} loading="lazy" decoding="async" />
            ) : (
              <span className="text-sm font-semibold">{e.nome}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Grade de cards; cada card tem nome de transição para a grade se reorganizar animada no filtro. */
function Grade({ itens, aoAbrir }: { itens: ItemProjeto[]; aoAbrir: (slug: string) => void }) {
  return (
    <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {itens.map((p) => (
        <li key={p.slug} style={{ viewTransitionName: `projeto-${p.slug}` } as CSSProperties}>
          <Cartao item={p} aoAbrir={aoAbrir} />
        </li>
      ))}
    </ul>
  )
}

/**
 * Cartão de uma peça navegável de /trabalhos/ (14/10/2026): abre a peça na mesma aba, porque ela tem o
 * próprio cabeçalho com volta.
 */
function CartaoPeca({ peca }: { peca: Peca }) {
  const base = import.meta.env.BASE_URL
  return (
    <article className="cartao-projeto group relative flex h-full flex-col">
      <div className="moldura-logo relative aspect-[16/10] overflow-hidden rounded-md border border-linha bg-folha shadow-[6px_6px_0_var(--linha)]">
        <img src={caminhoPublico(base, peca.imagem)} width={1000} height={625} alt={peca.alt} loading="lazy" decoding="async" className="block h-full w-full object-cover object-top" />
        <SeloFicticio />
      </div>
      <h3 className="mt-5 text-[1.3rem] leading-[1.25] font-semibold tracking-[0.004em]">
        <a href={caminhoPublico(base, peca.href)} className="text-left group-hover:text-tinta after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:outline-none">
          {peca.nome}
        </a>
      </h3>
      {/* Task 10: antes as duas peças repetiam 'Exemplo navegável: dá para clicar e testar.' */}
      <p className="prosa mt-1.5 text-[1.06rem] leading-[1.55] text-grafite">{peca.resumo}</p>
    </article>
  )
}

/**
 * Galeria da página de projetos: chips de filtro por tipo e três seções no mesmo padrão de card:
 * "Em empresas", "Projetos próprios" e, no fim, "Outros projetos em empresas" (só participação). O clique abre o case do projeto (quem chama cuida do hash).
 */
export function GaleriaProjetos({
  aoAbrir,
  filtroInicial,
  pecas = [],
}: {
  aoAbrir: (slug: string) => void
  filtroInicial?: TipoProjeto
  /** Peças navegáveis, no topo e só em "Todos" (não têm tipo). Entram na contagem de "Todos". */
  pecas?: readonly Peca[]
}) {
  const todos = useMemo(listarProjetos, [])
  const [filtro, setFiltro] = useState<Filtro>(filtroInicial ?? 'todos')
  const lista = filtrarProjetos(todos, filtro)
  const { emEmpresas, proprios, outros } = separarGaleria(lista)
  const pecasVisiveis = filtro === 'todos' ? pecas : []
  const chips: { valor: Filtro; rotulo: string; total: number }[] = [
    { valor: 'todos', rotulo: 'Todos', total: todos.length + pecas.length },
    ...(Object.keys(tiposProjeto) as TipoProjeto[]).map((t) => ({
      valor: t,
      rotulo: tiposProjeto[t],
      total: filtrarProjetos(todos, t).length,
    })),
  ]

  return (
    <>
      <div
        role="group"
        aria-label="Filtrar por tipo de projeto"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pt-1 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {chips.map((c) => {
          const marcado = filtro === c.valor
          return (
            <button
              key={c.valor}
              type="button"
              aria-pressed={marcado}
              onClick={() => c.valor !== filtro && comTransicao(() => setFiltro(c.valor))}
              className={`chip inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.95rem] font-medium whitespace-nowrap ${
                marcado ? 'border-tinta bg-tinta text-nevoa' : 'border-linha bg-folha text-tinta hover:border-tinta hover:text-tinta'
              }`}
            >
              {/* 14/10/2026 (fix final): saiu o ponto coral do chip ativo; o destaque do site é um só (marca-texto). */}
              <span>
                {c.rotulo} <span className={marcado ? 'opacity-80' : 'text-grafite'}>{c.total}</span>
              </span>
            </button>
          )
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {lista.length + pecasVisiveis.length} projetos
      </p>

      {pecasVisiveis.length > 0 && (
        <section aria-labelledby="pecas-titulo" className="mt-12">
          <h2 id="pecas-titulo" className="text-[1.9rem] leading-[1.15] font-bold tracking-[0.004em] sm:text-[2.3rem]">
            Exemplos navegáveis
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {pecasVisiveis.map((p) => (
              <li key={p.slug}>
                <CartaoPeca peca={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Ordem trocada em 08/10/2026 (M11): "Em empresas" sobe e ganha o lugar de primeira seção; os próprios
          descem com título visível; Ecovita e Minu (só participação) ficam no fim, sem destaque. */}
      {emEmpresas.length > 0 && (
        <section aria-labelledby="empresas-titulo" className={pecasVisiveis.length > 0 ? 'mt-24 border-t border-linha pt-14' : 'mt-12'}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
            <h2 id="empresas-titulo" className="text-[1.9rem] leading-[1.15] font-bold tracking-[0.004em] sm:text-[2.3rem]">
              {/* 14/10/2026 (fix final): antes "Em empresas"; a home tem "Onde já trabalhei" (empregos), aqui são casos. */}
              Casos em empresas
            </h2>
            <p className="prosa max-w-[44ch] text-[1.08rem] text-grafite">Projetos que fiz ou liderei como contratado. O desenho mostra como as peças conversam.</p>
          </div>
          <OndeTrabalhei />
          <div className="mt-10">
            <Grade itens={emEmpresas} aoAbrir={aoAbrir} />
          </div>
        </section>
      )}

      {proprios.length > 0 && (
        <section aria-labelledby="proprios-titulo" className={emEmpresas.length > 0 ? 'mt-24 border-t border-linha pt-14' : 'mt-12'}>
          <h2 id="proprios-titulo" className="text-[1.9rem] leading-[1.15] font-bold tracking-[0.004em] sm:text-[2.3rem]">
            Projetos próprios
          </h2>
          <div className="mt-10">
            <Grade itens={proprios} aoAbrir={aoAbrir} />
          </div>
        </section>
      )}

      {outros.length > 0 && (
        <section aria-labelledby="outros-titulo" className="mt-20 border-t border-linha pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
            <h2 id="outros-titulo" className="text-[1.35rem] leading-[1.2] font-semibold sm:text-[1.5rem]">
              Outros projetos em empresas
            </h2>
            <p className="prosa max-w-[44ch] text-[1rem] text-grafite">Projetos de que participei, sem liderar.</p>
          </div>
          <div className="mt-8">
            <Grade itens={outros} aoAbrir={aoAbrir} />
          </div>
        </section>
      )}
    </>
  )
}
