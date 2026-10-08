import { useState } from 'react'
import { caminhoPublico } from '../lib/assets'
import { HASH_PROJETOS } from '../lib/rota'
import { empregos, freelance, type Emprego } from '../trajetoria'
import { Descer } from './Descer'
import { Ilustracao } from './Mare'

/**
 * Mini logo na cor original, sobre uma placa que garante leitura nos dois temas: clara para as
 * logos escuras e escura para as brancas. Sem arquivo, o nome vai em texto na mesma placa.
 */
function PlacaLogo({ nome, logo, clara }: { nome: string; logo?: string; clara?: boolean }) {
  return (
    <span
      className={`grid h-10 w-24 shrink-0 place-items-center rounded-md border px-2.5 sm:h-12 sm:w-28 sm:px-3 ${
        clara ? 'border-white/20 bg-[#0f2a33]' : 'border-linha bg-white'
      }`}
    >
      {logo ? (
        <img
          src={caminhoPublico(import.meta.env.BASE_URL, logo)}
          alt={nome}
          loading="lazy"
          decoding="async"
          className="max-h-7 w-auto max-w-full object-contain"
        />
      ) : (
        <span className="text-[1.05rem] font-bold tracking-[0.01em] text-[#0f2a33]">{nome}</span>
      )}
    </span>
  )
}

/** Um emprego: logo, cargo, empresa e período, e uma linha de resultado (`empilhado` põe a logo acima). */
function Item({ e, empilhado }: { e: Emprego; empilhado?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 ${empilhado ? '' : 'sm:flex-row sm:items-start sm:gap-5'}`}>
      <PlacaLogo nome={e.empresa} logo={e.logo} clara={e.logoClara} />
      <div className="min-w-0">
        <h3 className="text-[1.2rem] leading-[1.3] font-semibold">{e.cargo}</h3>
        <p className="mt-1 flex flex-wrap gap-x-3 text-[0.98rem] text-grafite">
          <span className="font-semibold text-tinta">
            {e.empresa}
            {e.local && <span className="font-normal text-grafite"> {e.local}</span>}
          </span>
          <span className="tabular-nums">{e.periodo}</span>
        </p>
        <p className="mt-2 max-w-[62ch] text-[1.02rem] leading-[1.55]">{e.resultado}</p>
      </div>
    </div>
  )
}

/** Marco da linha do tempo: o ponto sobre o trilho, em destaque no emprego atual. */
function Marco({ atual }: { atual?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-6 -left-[7px] size-3 rounded-full border-2 ${
        atual ? 'border-coral bg-coral ring-4 ring-papel' : 'border-mar bg-papel'
      }`}
    />
  )
}

/** Agrupa os empregos que correram em paralelo com o anterior, para aparecerem lado a lado. */
function agrupar(lista: Emprego[]): Emprego[][] {
  const grupos: Emprego[][] = []
  for (const e of lista) {
    if (e.paralelo && grupos.length) grupos[grupos.length - 1].push(e)
    else grupos.push([e])
  }
  return grupos
}

/** Um grupo da linha do tempo: o emprego atual em destaque, um par em paralelo ou um emprego só. */
function Grupo({ grupo }: { grupo: Emprego[] }) {
  const atual = grupo.some((e) => e.atual)
  return (
    <li className="relative pb-5 pl-6 sm:pl-8">
      <Marco atual={atual} />
      {atual ? (
        <div className="rounded-xl border border-mar bg-raso p-4 sm:p-6">
          <p className="mb-3 inline-flex items-center gap-2 text-[0.85rem] font-semibold text-mata">
            <span aria-hidden="true" className="size-2 rounded-full bg-mata" />
            Emprego atual
          </p>
          <Item e={grupo[0]} />
        </div>
      ) : grupo.length > 1 ? (
        <div className="rounded-xl border border-linha p-5 sm:p-6">
          <p className="mb-4 text-[0.92rem] font-semibold text-grafite">2025: dois trabalhos em paralelo</p>
          <div className="grid gap-7 2xl:grid-cols-2 2xl:gap-6">
            {grupo.map((e) => (
              <Item key={e.slug} e={e} empilhado />
            ))}
          </div>
        </div>
      ) : (
        <div className="px-1 py-4 sm:px-6">
          <Item e={grupo[0]} />
        </div>
      )}
    </li>
  )
}

/**
 * Trajetória: à vista, só o emprego atual; "Descer" abre o resto da linha do tempo (do
 * mais recente ao começo, em 2013) e o trabalho freelance. Fica na coluna larga, ao lado da
 * imprensa (a página principal monta as duas lado a lado).
 *
 * @param embutida `true` dentro da aba "Onde trabalhei" do celular: o título fica só para o leitor
 *   de tela, porque a aba já diz o nome.
 */
export function Trajetoria({ embutida = false }: { embutida?: boolean }) {
  const [aberto, setAberto] = useState(false)
  const recentes = agrupar(empregos.filter((e) => !e.inicio))
  const inicio = empregos.filter((e) => e.inicio)
  const [atual, ...anteriores] = recentes
  return (
    <section id="trajetoria" aria-labelledby="trajetoria-titulo" className="scroll-mt-24 min-w-0">
      <div className={embutida ? 'sr-only' : 'flex items-end gap-4'}>
        <Ilustracao nome="rosa-dos-ventos" className="size-11 shrink-0 text-mar lg:size-14" />
        <h2 id="trajetoria-titulo" className="titulo-secao">
          Onde trabalhei
        </h2>
      </div>
      <p className={`prosa max-w-[52ch] text-[1.05rem] text-grafite ${embutida ? '' : 'mt-2'}`}>
        Treze anos de software, os últimos cinco em IA aplicada.
      </p>
      <ol className="relative mt-4 ml-[5px] border-l-2 border-linha">{atual && <Grupo grupo={atual} />}</ol>
      <Descer id="trajetoria-resto" aberto={aberto} aoAlternar={() => setAberto((v) => !v)} oQue="a carreira toda, de 2013 até hoje" className="mt-1">
        <ol className="relative mt-3 ml-[5px] border-l-2 border-linha">
          {anteriores.map((grupo) => (
            <Grupo key={grupo[0].slug} grupo={grupo} />
          ))}
          {inicio.map((e) => (
            <li key={e.slug} className="relative pb-2 pl-6 sm:pl-8">
              <Marco />
              <div className="px-1 py-4 sm:px-6">
                <Item e={e} />
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-col gap-4 rounded-xl border-2 border-dashed border-linha p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
          <PlacaLogo nome={freelance.empresa} logo={freelance.logo} />
          <div>
            <h3 className="text-[1.2rem] leading-[1.3] font-semibold">
              {freelance.papel} na {freelance.empresa}
            </h3>
            <p className="mt-2 max-w-[62ch] text-[1.02rem] leading-[1.55]">{freelance.resultado}</p>
            <a href={HASH_PROJETOS} className="sublinha mt-3 inline-block font-medium text-mar">
              Ver os projetos
            </a>
          </div>
        </div>
      </Descer>
    </section>
  )
}
