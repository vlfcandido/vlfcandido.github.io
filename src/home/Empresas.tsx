// Bloco 3: onde já trabalhei. Logo, nome e o papel real de clientes.ts (nunca um papel inventado).
import { empresasDiretas, type EmpresaDireta } from '../clientes'
import { logoClara } from '../components/Logo'
import { caminhoPublico } from '../lib/assets'
import { SLUGS_EMPRESAS } from './conteudo'

/** Terceiro bloco da home: as empresas onde ele trabalhou, na ordem de `SLUGS_EMPRESAS`. */
export function Empresas() {
  const base = import.meta.env.BASE_URL
  const empresas = SLUGS_EMPRESAS.map((slug) => empresasDiretas.find((e) => e.slug === slug)).filter(
    (e): e is EmpresaDireta => Boolean(e),
  )
  return (
    <section id="empresas" className="secao">
      <h2 className="titulo-bloco">Onde já trabalhei</h2>
      <ul className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-6">
        {empresas.map((e) => (
          <li key={e.slug} className="empresa flex items-center gap-5 border-t border-linha py-5 lg:flex-col lg:items-start lg:gap-4 lg:py-6">
            <div className="flex h-12 w-28 flex-none items-center overflow-hidden lg:w-36">
              {e.logo ? (
                <img className="logo-empresa" data-clara={logoClara(e.slug)} src={caminhoPublico(base, e.logo)} alt={e.nome} loading="lazy" decoding="async" />
              ) : (
                <span className="font-[family-name:var(--fonte-titulo)] text-xl">{e.nome}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold">{e.nome}</p>
              <p className="mt-1 text-sm leading-snug text-grafite">{e.papel}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
