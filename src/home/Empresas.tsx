// Bloco 3: onde já trabalhei. Só as empresas de SLUGS_EMPRESAS (logos liberados por ele). No celular, uma
// faixa de logos; no PC, logo, nome e o papel real de clientes.ts (nunca um papel inventado), ou a LINHA_EMPRESA
// de conteudo.ts quando o papel não diz nada ao cliente (Prefeitura de Franca, Task 10).
import { empresasDiretas, type EmpresaDireta } from '../clientes'
import { logoClara } from '../components/Logo'
import { caminhoPublico } from '../lib/assets'
import { LINHA_EMPRESA, SLUGS_EMPRESAS, conteudoHome } from './conteudo'

/** Terceiro bloco da home: as empresas onde ele trabalhou, na ordem de `SLUGS_EMPRESAS`. */
export function Empresas() {
  const base = import.meta.env.BASE_URL
  const { empresas: textos } = conteudoHome()
  const empresas = SLUGS_EMPRESAS.map((slug) => empresasDiretas.find((e) => e.slug === slug)).filter(
    (e): e is EmpresaDireta => Boolean(e),
  )
  return (
    <section id="empresas" className="secao">
      <h2 className="titulo-bloco alvo-secao"><span className="titulo-texto">{textos.titulo}</span></h2>
      {/* 15/10/2026 (revisor, rodada 2): o subtítulo promete "o que fiz em cada uma", que só aparece do PC para cima
          (no celular o papel fica para leitor de tela). Antes ele aparecia em toda largura. */}
      <p className="mt-2 hidden text-base text-grafite lg:block">{textos.subtitulo}</p>
      {/* Celular: 3 + 2 logos centradas (antes grade de 3 colunas, que deixava a 2ª linha torta, com vão à direita). */}
      <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-4 sm:grid sm:grid-cols-5 lg:mt-8 lg:grid-cols-1 lg:gap-y-0">
        {empresas.map((e) => (
          <li key={e.slug} className="empresa flex w-[calc((100%-3rem)/3)] flex-col items-center sm:w-auto sm:items-start lg:flex-row lg:items-center lg:gap-4 lg:border-t lg:border-linha lg:py-4">
            <div className="flex h-10 w-full flex-none items-center justify-center sm:justify-start lg:w-24">
              {e.logo ? (
                // O nome está no texto ao lado (visível no PC, para leitor de tela no celular): a logo não repete.
                <img className="logo-empresa" data-slug={e.slug} data-clara={logoClara(e.slug)} src={caminhoPublico(base, e.logo)} alt="" height={32} loading="lazy" decoding="async" />
              ) : null}
            </div>
            {/* No celular só há a logo: o "pela NTT DATA" vai embaixo dela (no PC já está no papel ao lado). */}
            {e.via && <p aria-hidden="true" className="mt-1 text-center text-[0.7rem] leading-tight text-grafite sm:text-left lg:hidden">pela {e.via}</p>}
            <div className={e.logo ? 'sr-only lg:not-sr-only lg:min-w-0' : 'min-w-0'}>
              <p className="text-sm font-semibold">{e.nome}</p>
              <p className="text-sm leading-snug text-grafite">{LINHA_EMPRESA[e.slug as keyof typeof LINHA_EMPRESA] ?? e.papel}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
