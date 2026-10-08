import { useRef, type MouseEvent } from 'react'
import { caminhoPublico } from '../../lib/assets'
import type { Print } from '../../visuais'

interface Props {
  print: Print
  /** Legenda curta embaixo da miniatura. */
  legenda?: string
  className?: string
}

/**
 * Print com ampliação: a miniatura é um botão que abre a tela inteira num `<dialog>`. No celular a
 * imagem abre no tamanho real com rolagem, em vez de virar uma miniatura em que não se lê nada.
 */
export function PrintAmpliavel({ print, legenda, className = '' }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const src = caminhoPublico(import.meta.env.BASE_URL, print.arquivo)

  /** Clique no fundo (fora da imagem) fecha. */
  function aoClicar(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) ref.current?.close()
  }

  return (
    <figure className={className}>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="group relative block w-full overflow-hidden rounded-md border border-linha bg-folha text-left shadow-[6px_6px_0_var(--linha)]"
      >
        <img
          src={src}
          alt={print.alt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="block aspect-[16/10] w-full object-cover object-top"
        />
        <span className="absolute right-2 bottom-2 rounded-full border border-linha bg-folha/95 px-3 py-1.5 text-[0.85rem] leading-none font-semibold text-tinta group-hover:border-cobalto group-hover:text-cobalto">
          Ampliar a tela
        </span>
      </button>
      {legenda && <figcaption className="mt-3 text-[0.95rem] text-grafite">{legenda}</figcaption>}
      <dialog
        ref={ref}
        aria-label={print.alt}
        onClick={aoClicar}
        className="print-ampliado m-0 h-dvh max-h-none w-screen max-w-none bg-tinta/90 p-0 backdrop:bg-tinta/70"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-nevoa">
            <p className="min-w-0 truncate text-[0.95rem]">{legenda ?? 'Tela real do projeto'}</p>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="shrink-0 rounded-full border border-nevoa/50 px-4 py-2 text-[0.95rem] font-semibold text-nevoa hover:bg-nevoa hover:text-tinta"
            >
              Fechar
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain px-4 pb-6">
            <img src={src} alt={print.alt} width={1600} height={1000} className="block h-auto w-[1400px] max-w-none rounded-md lg:mx-auto lg:w-full lg:max-w-[1400px]" />
          </div>
        </div>
      </dialog>
    </figure>
  )
}
