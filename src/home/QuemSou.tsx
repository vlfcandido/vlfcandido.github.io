// Bloco 6: quem vai fazer o sistema (retrato e 3 linhas) e a chamada final para o WhatsApp, numa tela só.
import { caminhoPublico } from '../lib/assets'
import { WHATSAPP } from '../lib/whatsapp'
import { LINKEDIN } from '../visuais'
import { FOTO_BASE, FOTO_LARGURAS, FOTO_PRONTA, conteudoHome } from './conteudo'
import { Marcacao } from './Marcacao'

/**
 * Retrato do "Quem sou". Com `FOTO_PRONTA` (conteudo.ts), um avatar redondo com a foto do LinkedIn (96 px no celular,
 * 80 px no PC; arquivos de 105 e 210 px em AVIF, WebP e JPEG, nunca ampliados). Sem a foto, o quadro 4:5 com o
 * monograma "VC". 15/10/2026: antes a constante era local (TEM_FOTO) e a foto previa um retrato 4:5 em 640 px.
 */
function Retrato({ alt }: { alt: string }) {
  const base = import.meta.env.BASE_URL
  if (!FOTO_PRONTA)
    return (
      <div className="quadro-retrato flex items-center justify-center" role="img" aria-label="Monograma VC, de Vinicius Candido">
        <span aria-hidden="true" className="font-[family-name:var(--fonte-titulo)] text-4xl font-medium tracking-tight">
          <Marcacao tipo="circulo" semente={9}>VC</Marcacao>
        </span>
      </div>
    )
  const conjunto = (ext: string) => FOTO_LARGURAS.map((l) => `${caminhoPublico(base, `${FOTO_BASE}-${l}.${ext}`)} ${l}w`).join(', ')
  const tamanhos = '(min-width: 1024px) 80px, 96px'
  return (
    <picture className="avatar-retrato block">
      <source type="image/avif" srcSet={conjunto('avif')} sizes={tamanhos} />
      <source type="image/webp" srcSet={conjunto('webp')} sizes={tamanhos} />
      <img src={caminhoPublico(base, `${FOTO_BASE}-210.jpg`)} srcSet={conjunto('jpg')} sizes={tamanhos} width={210} height={210} alt={alt} loading="lazy" decoding="async" className="block h-full w-full object-cover" />
    </picture>
  )
}

/** Sexto bloco da home: quem sou, o LinkedIn e a chamada final com o WhatsApp. */
export function QuemSou() {
  const { quemSou, chamada } = conteudoHome()
  return (
    <section id="quem" className="secao tela">
      <div className={`alvo-secao grid grid-cols-[6rem_1fr] gap-4 lg:grid-cols-[5rem_1fr] ${FOTO_PRONTA ? 'items-center' : 'items-end'}`}>
        <Retrato alt={quemSou.alt} />
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
