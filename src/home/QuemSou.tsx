// Bloco 6: quem vai fazer o sistema (foto e 3 linhas) e a chamada final para o WhatsApp.
import { caminhoPublico } from '../lib/assets'
import { WHATSAPP } from '../lib/whatsapp'
import { LINKEDIN } from '../visuais'
import { conteudoHome } from './conteudo'
import { Marcacao } from './Marcacao'

/**
 * A foto `img/vinicius-640.*` ainda não existe (chega na Task 8). Enquanto for `false`, o quadro 4:5 mostra
 * o monograma "VC"; o layout já é o final, só troca o miolo.
 */
const TEM_FOTO = false

/** Retrato no quadro 4:5: a foto em AVIF/WebP/JPEG quando existir; antes disso, o monograma. */
function Retrato({ foto, alt }: { foto: string; alt: string }) {
  const base = import.meta.env.BASE_URL
  if (!TEM_FOTO)
    return (
      <div className="quadro-retrato flex items-center justify-center" role="img" aria-label="Monograma VC, de Vinicius Candido">
        <span aria-hidden="true" className="font-[family-name:var(--fonte-titulo)] text-7xl font-medium tracking-tight sm:text-8xl">
          <Marcacao tipo="circulo" semente={9}>VC</Marcacao>
        </span>
      </div>
    )
  const semExt = foto.replace(/\.[a-z]+$/, '')
  return (
    <picture className="quadro-retrato block">
      <source type="image/avif" srcSet={caminhoPublico(base, `${semExt}.avif`)} />
      <source type="image/webp" srcSet={caminhoPublico(base, `${semExt}.webp`)} />
      <img src={caminhoPublico(base, foto)} width={640} height={800} alt={alt} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
    </picture>
  )
}

/** Sexto bloco da home: quem sou, o LinkedIn e a chamada final com o WhatsApp. */
export function QuemSou() {
  const { quemSou, chamada } = conteudoHome()
  return (
    <section id="quem" className="secao">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        <div className="mx-auto w-full max-w-[16rem] md:max-w-sm">
          <Retrato foto={quemSou.foto} alt={quemSou.alt} />
        </div>
        <div>
          <h2 className="titulo-bloco">{quemSou.titulo}</h2>
          <div className="mt-6 space-y-3 text-lg text-grafite">
            {quemSou.texto.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <a href={LINKEDIN} target="_blank" rel="noopener" className="link-secundario mt-6">
            LinkedIn
            <span className="seta" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="mt-16 rounded-3xl border border-linha bg-folha px-6 py-10 text-center sm:px-12 sm:py-14">
        <p className="mx-auto max-w-2xl font-[family-name:var(--fonte-titulo)] text-3xl leading-tight font-semibold text-balance sm:text-4xl">
          {chamada.titulo}
        </p>
        <a className="cta mt-8" href={WHATSAPP} target="_blank" rel="noopener">
          {chamada.cta}
          <span className="seta" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
