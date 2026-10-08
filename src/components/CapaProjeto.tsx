import { caminhoPublico } from '../lib/assets'
import type { Capa } from '../visuais'

interface Props {
  capa: Capa
  /** `sizes` do `<img>`: quanto da tela a imagem ocupa. */
  sizes: string
  /** `true` no painel aberto: carrega logo, sem esperar o scroll. */
  prioridade?: boolean
  className?: string
}

/**
 * Capa ilustrada de um projeto em AVIF, WebP e JPEG de reserva, com `srcset` e carregamento preguiçoso.
 * Usa o mesmo tratamento das cartas náuticas (classe `.carta`): `multiply` no claro; invertida e
 * somada por `screen` no escuro.
 */
export function CapaProjeto({ capa, sizes, prioridade, className = '' }: Props) {
  const base = import.meta.env.BASE_URL
  const srcset = (ext: string) => capa.larguras.map((w) => `${caminhoPublico(base, `img/${capa.nome}-${w}.${ext}`)} ${w}w`).join(', ')
  const maior = capa.larguras[capa.larguras.length - 1]
  return (
    <picture className={`carta capa-projeto block ${className}`}>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={caminhoPublico(base, `img/${capa.nome}-${capa.larguras[0]}.jpg`)}
        srcSet={srcset('jpg')}
        sizes={sizes}
        width={maior}
        height={Math.round(maior / capa.razao)}
        alt={capa.alt}
        decoding="async"
        loading={prioridade ? 'eager' : 'lazy'}
        className="block h-full w-full object-cover"
      />
    </picture>
  )
}
