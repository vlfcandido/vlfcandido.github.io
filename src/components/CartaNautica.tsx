import { caminhoPublico } from '../lib/assets'

/** As ilustrações de carta náutica do site (geradas com IA e editadas por ele). */
export type VersaoCarta = 'baleia' | 'tartaruga' | 'rota' | 'faixa'

/** Arquivo, larguras geradas e proporção (largura/altura) de cada versão, em `public/img/`. */
const VERSOES: Record<VersaoCarta, { nome: string; larguras: number[]; razao: number }> = {
  baleia: { nome: 'carta', larguras: [640, 960, 1376], razao: 1376 / 768 },
  tartaruga: { nome: 'tartaruga', larguras: [460, 760], razao: 760 / 600 },
  rota: { nome: 'rota', larguras: [560, 960], razao: 960 / 520 },
  faixa: { nome: 'faixa', larguras: [900, 1600], razao: 2064 / 512 },
}

interface Props {
  versao: VersaoCarta
  /** `sizes` do `<img>`: quanto da tela a imagem ocupa. */
  sizes: string
  /** `true` só na abertura: carrega logo, com prioridade. */
  prioridade?: boolean
  className?: string
}

/**
 * Ilustração de carta náutica em AVIF, WebP e JPEG de reserva, com `srcset`. Decorativa.
 * O papel foi clareado até o branco: no tema claro a imagem se funde ao fundo por `multiply`;
 * no escuro é invertida e somada por `screen` (classe `.carta` em index.css).
 */
export function CartaNautica({ versao, sizes, prioridade, className = '' }: Props) {
  const base = import.meta.env.BASE_URL
  const v = VERSOES[versao]
  const srcset = (ext: string) => v.larguras.map((w) => `${caminhoPublico(base, `img/${v.nome}-${w}.${ext}`)} ${w}w`).join(', ')
  const maior = v.larguras[v.larguras.length - 1]
  return (
    <picture className={`carta ${className}`}>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={caminhoPublico(base, `img/${v.nome}-${v.larguras[0]}.jpg`)}
        srcSet={srcset('jpg')}
        sizes={sizes}
        width={maior}
        height={Math.round(maior / v.razao)}
        alt=""
        aria-hidden="true"
        decoding="async"
        loading={prioridade ? 'eager' : 'lazy'}
        fetchPriority={prioridade ? 'high' : 'auto'}
        className="block h-full w-full object-cover"
      />
    </picture>
  )
}
