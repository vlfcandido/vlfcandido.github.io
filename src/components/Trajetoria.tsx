import { useState } from 'react'
import { caminhoPublico } from '../lib/assets'
import { HASH_PROJETOS } from '../lib/rota'
import { empregos, freelance, type Emprego } from '../trajetoria'
import { Ilustracao } from './Mare'

/**
 * Mini logo na cor original, sobre uma placa que garante leitura nos dois temas: clara para as
 * logos escuras e escura para as brancas. Sem arquivo, o nome vai em texto na mesma placa.
 */
function PlacaLogo({ nome, logo, clara }: { nome: string; logo?: string; clara?: boolean }) {
  return (
    <span
      className={`grid h-12 w-28 shrink-0 place-items-center rounded-md border px-3 ${
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
    <div className={`flex flex-col gap-4 ${empilhado ? '' : 'sm:flex-row sm:items-start sm:gap-5'}`}>
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

/**
 * Trajetória: os empregos do atual para o primeiro numa linha do tempo compacta, com o começo de
 * carreira recolhido, e o trabalho freelance separado logo abaixo.
 */
export function Trajetoria() {
  const [aberto, setAberto] = useState(false)
  const recentes = agrupar(empregos.filter((e) => !e.inicio))
  const inicio = empregos.filter((e) => e.inicio)
  return (
    <section id="trajetoria" aria-labelledby="trajetoria-titulo" className="scroll-mt-24 border-t border-linha py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <Ilustracao nome="rosa-dos-ventos" className="size-14 text-mar" />
          <h2 id="trajetoria-titulo" className="mt-5 text-[2.1rem] leading-[1.15] font-semibold sm:text-[2.6rem]">
            Onde trabalhei
          </h2>
          <p className="prosa mt-4 max-w-[36ch] text-[1.15rem] text-grafite">
            Treze anos de software, os últimos cinco em IA aplicada. Hoje sou engenheiro de IA sênior no Sicoob.
          </p>
        </div>

        <div className="lg:col-span-8">
          <ol className="relative ml-[5px] border-l-2 border-linha">
            {recentes.map((grupo) => {
              const atual = grupo.some((e) => e.atual)
              return (
                <li key={grupo[0].slug} className="relative pb-6 pl-6 sm:pl-8">
                  <Marco atual={atual} />
                  {atual ? (
                    <div className="rounded-xl border border-mar bg-raso p-5 sm:p-6">
                      <p className="mb-4 inline-flex items-center gap-2 text-[0.85rem] font-semibold text-mata">
                        <span aria-hidden="true" className="size-2 rounded-full bg-mata" />
                        Emprego atual
                      </p>
                      <Item e={grupo[0]} />
                    </div>
                  ) : grupo.length > 1 ? (
                    <div className="rounded-xl border border-linha p-5 sm:p-6">
                      <p className="mb-4 text-[0.92rem] font-semibold text-grafite">2025: dois trabalhos em paralelo</p>
                      <div className="grid gap-7 xl:grid-cols-2 xl:gap-6">
                        {grupo.map((e) => (
                          <Item key={e.slug} e={e} empilhado />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="px-1 py-5 sm:px-6">
                      <Item e={grupo[0]} />
                    </div>
                  )}
                </li>
              )
            })}
            <li className="relative pl-6 sm:pl-8">
              <Marco />
              <button
                type="button"
                aria-expanded={aberto}
                aria-controls="trajetoria-inicio"
                onClick={() => setAberto((v) => !v)}
                className="sublinha mt-5 ml-1 font-medium sm:ml-6"
              >
                {aberto ? 'Esconder o começo da carreira' : 'Ver o começo da carreira, de 2013 a 2021'}
              </button>
              <div id="trajetoria-inicio" className="expansivel" data-aberto={aberto} inert={!aberto}>
                <div>
                  <ul className="mt-2 divide-y divide-linha">
                    {inicio.map((e) => (
                      <li key={e.slug} className="px-1 py-5 sm:px-6">
                        <Item e={e} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          </ol>

          <div className="mt-10 flex flex-col gap-4 rounded-xl border-2 border-dashed border-linha p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
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
        </div>
      </div>
    </section>
  )
}
