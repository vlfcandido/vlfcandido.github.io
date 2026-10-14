// Bloco 3: onde já trabalhei. Só as empresas de SLUGS_EMPRESAS (logos liberados por ele). No celular, uma
// faixa de logos; no PC, logo, nome e o papel real de clientes.ts (nunca um papel inventado).
import { empresasDiretas, type EmpresaDireta } from '../clientes'
import { logoClara } from '../components/Logo'
import { caminhoPublico } from '../lib/assets'
import { SLUGS_EMPRESAS, conteudoHome } from './conteudo'

/** Terceiro bloco da home: as empresas onde ele trabalhou, na ordem de `SLUGS_EMPRESAS`. */
export function Empresas() {
  const base = import.meta.env.BASE_URL
  const { empresas: textos } = conteudoHome()
  const empresas = SLUGS_EMPRESAS.map((slug) => empresasDiretas.find((e) => e.slug === slug)).filter(
    (e): e is EmpresaDireta => Boolean(e),
  )
  return (
    <section id="empresas" className="secao">
      <h2 className="titulo-bloco">{textos.titulo}</h2>
      <ul className="mt-4 grid grid-cols-3 gap-x-6 gap-y-4 sm:grid-cols-5 lg:mt-8 lg:grid-cols-1 lg:gap-y-0">
        {empresas.map((e) => (
          <li key={e.slug} className="empresa flex items-center lg:gap-4 lg:border-t lg:border-linha lg:py-4">
            <div className="flex h-10 w-full flex-none items-center lg:w-24">
              {e.logo ? (
                // O nome está no texto ao lado (visível no PC, para leitor de tela no celular): a logo não repete.
                <img className="logo-empresa" data-clara={logoClara(e.slug)} src={caminhoPublico(base, e.logo)} alt="" height={32} loading="lazy" decoding="async" />
              ) : null}
            </div>
            <div className={e.logo ? 'sr-only lg:not-sr-only lg:min-w-0' : 'min-w-0'}>
              <p className="text-sm font-semibold">{e.nome}</p>
              <p className="text-sm leading-snug text-grafite">{e.papel}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
