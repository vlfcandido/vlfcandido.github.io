import { caminhoPublico } from '../lib/assets'
import type { Print as TPrint } from '../visuais'

interface PrintProps {
  print: TPrint
  className?: string
  prioridade?: boolean
  /** `sizes` do `<img>`: quanto da largura da tela a imagem ocupa. */
  sizes?: string
}

/**
 * Selo "dados fictícios", colado no canto de uma imagem de tela. Aparece em toda tela e capa que mostra
 * dado inventado. O pai precisa ser `position: relative`.
 */
export function SeloFicticio({ className = '' }: { className?: string }) {
  return (
    <span
      className={`selo-ficticio pointer-events-none absolute top-2 left-2 z-10 rounded-full border border-linha bg-folha/95 px-2.5 py-1 text-[0.78rem] leading-none font-semibold tracking-[0.02em] text-grafite ${className}`}
    >
      dados fictícios
    </span>
  )
}

/**
 * Imagem de um print: `<picture>` com AVIF e WebP em larguras responsivas quando há `variantes`; sem elas,
 * o WebP único. O tamanho vem do arquivo original, para o navegador reservar o espaço.
 */
export function ImagemPrint({ print, sizes = '100vw', className = '', prioridade, comAlt = true }: PrintProps & { comAlt?: boolean }) {
  const base = import.meta.env.BASE_URL
  const v = print.variantes
  const img = (
    <img
      src={caminhoPublico(base, print.arquivo)}
      srcSet={v ? v.larguras.map((w) => `${caminhoPublico(base, `${v.base}-${w}.webp`)} ${w}w`).join(', ') : undefined}
      sizes={v ? sizes : undefined}
      alt={comAlt ? print.alt : ''}
      width={v?.largura ?? 1600}
      height={v?.altura ?? 1000}
      loading={prioridade ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
  if (!v) return img
  return (
    <picture>
      <source type="image/avif" srcSet={v.larguras.map((w) => `${caminhoPublico(base, `${v.base}-${w}.avif`)} ${w}w`).join(', ')} sizes={sizes} />
      <source type="image/webp" srcSet={v.larguras.map((w) => `${caminhoPublico(base, `${v.base}-${w}.webp`)} ${w}w`).join(', ')} sizes={sizes} />
      {img}
    </picture>
  )
}

/** Moldura de um print de produto: borda fina e sombra sólida deslocada, sem desfoque, com o selo de dado fictício. */
export function Print({ print, className = '', prioridade, sizes = '(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw' }: PrintProps) {
  return (
    <div className="relative">
      <ImagemPrint
        print={print}
        sizes={sizes}
        prioridade={prioridade}
        className={`block aspect-[16/10] w-full rounded-md border border-linha bg-folha shadow-[6px_6px_0_var(--linha)] ${
          print.movel ? 'object-contain py-1' : 'object-cover object-top'
        } ${className}`}
      />
      {print.ficticio && <SeloFicticio />}
    </div>
  )
}
