// Bloco 6: quem vai fazer o sistema (retrato e 3 linhas) e a chamada final para o WhatsApp, numa tela só.
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
        <span aria-hidden="true" className="font-[family-name:var(--fonte-titulo)] text-4xl font-medium tracking-tight">
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
    <section id="quem" className="secao tela">
      <div className="alvo-secao grid grid-cols-[6rem_1fr] items-end gap-4 lg:grid-cols-[5rem_1fr]">
        <Retrato foto={quemSou.foto} alt={quemSou.alt} />
        <h2 className="titulo-bloco lg:!text-[1.75rem]"><span className="titulo-texto">{quemSou.titulo}</span></h2>
      </div>
      <div className="mt-4 space-y-2 text-grafite">
        {quemSou.texto.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>
      <a href={LINKEDIN} target="_blank" rel="noopener" className="link-secundario toque mt-4 self-start">
        LinkedIn
        <span className="seta" aria-hidden="true">↗</span>
      </a>
      <div className="mt-8 rounded-[var(--raio-m)] border border-linha bg-folha p-6 text-center">
        <p className="font-[family-name:var(--fonte-titulo)] text-2xl leading-tight font-semibold text-balance">{chamada.titulo}</p>
        <a className="cta toque mt-4" href={WHATSAPP} target="_blank" rel="noopener">
          {chamada.cta}
          <span className="seta" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
