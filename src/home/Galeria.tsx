// Bloco 4: todos os projetos. Primeiro os 3 destaques com o detalhe marcado à mão; depois a galeria
// completa (peças de /trabalhos/ + projetos.ts) com filtro por tipo. Destaque não se repete na grade.
import { useState } from 'react'
import { empresasDiretas } from '../clientes'
import { CapaProjeto } from '../components/CapaProjeto'
import { ImagemPrint, SeloFicticio } from '../components/Print'
import { logoClara } from '../components/Logo'
import { caminhoPublico } from '../lib/assets'
import { hashDoProjeto } from '../lib/rota'
import { listarProjetos, tiposProjeto, type ItemProjeto, type TipoProjeto } from '../projetos'
import { conteudoHome, PECAS, type Destaque } from './conteudo'
import { contarPorTipo, filtrarGaleria } from './lib/galeria'
import { Marcacao } from './Marcacao'

const TAMANHOS = '(min-width: 1024px) 400px, (min-width: 768px) 46vw, 82vw'

/** Link de um destaque: hash fica como está; caminho de `public/` ganha a base do site. */
function hrefDe(href: string): string {
  return href.startsWith('#') ? href : caminhoPublico(import.meta.env.BASE_URL, href)
}

/** Cartão grande de um destaque: a dor do cliente e o detalhe que ninguém viu, marcado. */
function CartaoDestaque({ d }: { d: Destaque }) {
  return (
    <li className="cartao flex flex-col">
      <a href={hrefDe(d.href)} className="flex h-full flex-col">
        <div className="aspect-[16/10] overflow-hidden border-b border-linha bg-raso">
          <img
            src={caminhoPublico(import.meta.env.BASE_URL, d.imagem)}
            width={1000}
            height={625}
            alt={d.alt}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover object-top"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-xl font-semibold">{d.nome}</h3>
          <p className="mt-2 text-sm text-grafite">{d.dor}</p>
          <p className="mt-4 leading-relaxed">
            <Marcacao tipo="grifo">{d.detalhe}</Marcacao>
          </p>
        </div>
      </a>
    </li>
  )
}

/** Iniciais das duas primeiras palavras com mais de 2 letras (ex.: "Rastreio de campanhas" → "RC"). */
function iniciais(nome: string): string {
  return nome.split(/\s+/).filter((p) => p.length > 2).slice(0, 2).map((p) => p[0].toUpperCase()).join('')
}

/** Frente do cartão: a capa ilustrada, a tela (com o selo de dado fictício) ou a logo da empresa. */
function FrenteDoCartao({ item }: { item: ItemProjeto }) {
  if (item.capa) return <CapaProjeto capa={item.capa} sizes={TAMANHOS} className="h-full" />
  if (item.print)
    return (
      <>
        <ImagemPrint print={item.print} sizes={TAMANHOS} className="block h-full w-full object-cover object-top" />
        <SeloFicticio />
      </>
    )
  const empresa = item.empresa ? empresasDiretas.find((e) => e.slug === item.empresa) : undefined
  return (
    <div className="flex h-full items-center justify-center p-8">
      {empresa?.logo ? (
        <img className="logo-empresa !h-12" data-clara={logoClara(empresa.slug)} src={caminhoPublico(import.meta.env.BASE_URL, empresa.logo)} alt="" loading="lazy" decoding="async" />
      ) : (
        <span aria-hidden="true" className="font-[family-name:var(--fonte-titulo)] text-6xl font-medium text-grafite/70">
          {iniciais(item.nome)}
        </span>
      )}
    </div>
  )
}

/** Cartão comum da galeria. */
function CartaoProjeto({ item }: { item: ItemProjeto }) {
  return (
    <li className="cartao flex flex-col">
      <a href={hashDoProjeto(item.slug)} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-linha bg-raso">
          <FrenteDoCartao item={item} />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold">{item.nome}</h3>
          <p className="mt-2 text-sm text-grafite">{item.resultado}</p>
        </div>
      </a>
    </li>
  )
}

/** Cartão de uma peça navegável de /trabalhos/ que não está entre os destaques. */
function CartaoPeca({ nome, href }: { nome: string; href: string }) {
  return (
    <li className="cartao flex flex-col">
      <a href={hrefDe(href)} className="flex min-h-11 flex-1 flex-col justify-end p-5">
        <h3 className="text-lg font-semibold">{nome}</h3>
      </a>
    </li>
  )
}

/** Quarto bloco da home: os destaques e a galeria completa com filtro por tipo. */
export function Galeria() {
  const { destaques } = conteudoHome()
  const [tipo, setTipo] = useState<string | null>(null)
  const projetos = listarProjetos()
  const emDestaque = new Set<string>(destaques.map((d) => d.slug))
  const contagem = contarPorTipo(projetos)
  // A grade nunca repete um destaque; a contagem do chip é a do que a grade mostra com ele ativo.
  const naGrade = (lista: ItemProjeto[]) => lista.filter((p) => !emDestaque.has(p.slug))
  const filtro = filtrarGaleria(projetos, tipo)
  const pecas = filtro.tipo ? [] : PECAS.filter((p) => !emDestaque.has(p.slug))
  const itens = naGrade(filtro.itens)
  const totalTodos = PECAS.filter((p) => !emDestaque.has(p.slug)).length + naGrade(projetos).length
  const contaNaGrade = (t: TipoProjeto) => naGrade(projetos.filter((p) => p.tipos.includes(t))).length
  const tipos = (Object.keys(tiposProjeto) as TipoProjeto[]).filter((t) => contagem[t] > 0 && contaNaGrade(t) > 0)
  return (
    <section id="trabalhos" className="secao">
      <h2 className="titulo-bloco">Todos os projetos</h2>
      <ul className="carrossel mt-10">
        {destaques.map((d) => (
          <CartaoDestaque key={d.slug} d={d} />
        ))}
      </ul>
      <div className="filtros mt-14" role="group" aria-label="Filtrar por tipo">
        <button type="button" className="filtro" aria-pressed={filtro.tipo === null} onClick={() => setTipo(null)}>
          Todos <span className="conta">{totalTodos}</span>
        </button>
        {tipos.map((t) => (
          <button key={t} type="button" className="filtro" aria-pressed={filtro.tipo === t} onClick={() => setTipo(t)}>
            {tiposProjeto[t]} <span className="conta">{contaNaGrade(t)}</span>
          </button>
        ))}
      </div>
      <ul className="carrossel mt-6" aria-live="polite">
        {pecas.map((p) => (
          <CartaoPeca key={p.slug} nome={p.nome} href={p.href} />
        ))}
        {itens.map((p) => (
          <CartaoProjeto key={p.slug} item={p} />
        ))}
      </ul>
    </section>
  )
}
