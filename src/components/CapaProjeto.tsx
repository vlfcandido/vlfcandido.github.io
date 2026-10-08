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

interface ImagemProps extends Required<Pick<Props, 'capa' | 'sizes' | 'className'>> {
  /** Nome-base dos arquivos em `public/img/`. */
  nome: string
  prioridade?: boolean
}

/**
 * Um `<picture>` com AVIF, WebP e JPEG de reserva para um nome-base de arquivo. As duas versões de uma
 * capa levam o mesmo `alt`: a que está escondida pelo tema (`display: none`) some também do leitor de tela.
 */
function Imagem({ nome, capa, sizes, prioridade, className }: ImagemProps) {
  const base = import.meta.env.BASE_URL
  const srcset = (ext: string) => capa.larguras.map((w) => `${caminhoPublico(base, `img/${nome}-${w}.${ext}`)} ${w}w`).join(', ')
  const maior = capa.larguras[capa.larguras.length - 1]
  return (
    <picture className={`capa-projeto block ${className}`}>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={caminhoPublico(base, `img/${nome}-${capa.larguras[0]}.jpg`)}
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

/**
 * Capa ilustrada de um projeto em AVIF, WebP e JPEG de reserva, com `srcset` e carregamento preguiçoso.
 * Sem versão escura, usa o tratamento das cartas náuticas (classe `.carta`): `multiply` no claro;
 * invertida e somada por `screen` no escuro. Com versão escura desenhada (`capa.escuro`), mostra uma
 * ou outra conforme o tema (classes `.capa-clara` e `.capa-escura`), sem filtro.
 */
export function CapaProjeto({ capa, sizes, prioridade, className = '' }: Props) {
  if (capa.colorida) return <Imagem nome={capa.nome} capa={capa} sizes={sizes} prioridade={prioridade} className={className} />
  if (!capa.escuro) return <Imagem nome={capa.nome} capa={capa} sizes={sizes} prioridade={prioridade} className={`carta ${className}`} />
  return (
    <>
      <Imagem nome={capa.nome} capa={capa} sizes={sizes} prioridade={prioridade} className={`capa-clara ${className}`} />
      <Imagem nome={capa.escuro} capa={capa} sizes={sizes} prioridade={prioridade} className={`capa-escura ${className}`} />
    </>
  )
}
