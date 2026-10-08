import { useEffect, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react'
import { empresasDiretas } from '../clientes'
import type { ItemProjeto } from '../projetos'
import { DiagramaArquitetura } from './Diagramas'
import { FonteLink } from './FonteLink'
import { LinkExterno } from './LinkExterno'
import { Logo } from './Logo'
import { Print } from './Print'
import { SeloStatus } from './SeloStatus'

interface PainelProps {
  /** Projeto aberto, ou `null` com o painel fechado. */
  item: ItemProjeto | null
  /** Pedido de fechar (botão, Esc ou clique fora). Quem chama troca o hash. */
  aoFechar: () => void
}

/** Bloco de texto do painel: título curto e o conteúdo. */
function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-[1rem] font-semibold text-grafite">{titulo}</h3>
      <div className="mt-1.5">{children}</div>
    </section>
  )
}

/**
 * Painel de um projeto em `<dialog>` modal: o resto da página fica inerte (o foco não sai do painel),
 * Esc e clique fora fecham, e o hash `#/projetos/<slug>` torna o painel compartilhável.
 */
export function PainelProjeto({ item, aoFechar }: PainelProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const empresa = item?.empresa ? empresasDiretas.find((e) => e.slug === item.empresa) : undefined

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (item && !dlg.open) {
      dlg.showModal()
      dlg.scrollTop = 0
      dlg.querySelector<HTMLElement>('h2')?.focus()
      document.documentElement.style.overflow = 'hidden'
    } else if (!item && dlg.open) {
      dlg.close()
    }
    if (!item) document.documentElement.style.overflow = ''
  }, [item])

  useEffect(() => () => void (document.documentElement.style.overflow = ''), [])

  /** Esc dispara `cancel`: em vez de deixar o navegador fechar sozinho, passa pelo mesmo caminho do botão. */
  function aoCancelar(e: SyntheticEvent) {
    e.preventDefault()
    aoFechar()
  }

  /** Clique no fundo escurecido (fora da caixa) fecha. */
  function aoClicar(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) aoFechar()
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="painel-titulo"
      onCancel={aoCancelar}
      onClick={aoClicar}
      className="painel-projeto m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[60rem] overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-linha bg-folha p-0 text-tinta shadow-[10px_10px_0_var(--linha)] backdrop:bg-tinta/55 sm:max-h-[calc(100dvh-4rem)]"
    >
      {item && (
        <div className="px-5 pt-5 pb-8 sm:px-10 sm:pt-8 sm:pb-12">
          <div className="sticky top-0 z-10 -mx-5 -mt-5 flex items-start gap-4 border-b border-linha bg-folha/95 px-5 pt-5 pb-4 backdrop-blur sm:-mx-10 sm:-mt-8 sm:px-10 sm:pt-8">
            <div className="min-w-0 flex-1">
              <SeloStatus status={item.status} />
              <h2
                id="painel-titulo"
                tabIndex={-1}
                className="mt-2 text-[1.5rem] leading-[1.15] font-bold tracking-[0.004em] sm:text-[2.2rem]"
              >
                {item.nome}
              </h2>
              {item.papel && <p className="mt-1 font-medium text-cobalto">{item.papel}</p>}
            </div>
            <button
              type="button"
              onClick={aoFechar}
              className="botao-acao grid size-11 shrink-0 place-items-center rounded-full border border-linha bg-folha hover:border-tinta"
            >
              <span className="sr-only">Fechar</span>
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <p className="prosa mt-6 max-w-[58ch] text-[1.25rem] leading-[1.5]">{item.resultado}</p>

          {item.print ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-[2fr_1fr] sm:items-start">
              <Print print={item.print} prioridade className={item.printExtra ? '' : 'sm:col-span-2'} />
              {item.printExtra && <Print print={item.printExtra} />}
            </div>
          ) : (
            empresa && (
              <div className="mt-8 flex h-28 items-center rounded-md border border-linha bg-nevoa px-6">
                <Logo cliente={empresa} className="max-h-12 max-w-[200px]" />
              </div>
            )
          )}

          <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-[3fr_2fr]">
            <div className="space-y-7">
              {item.problema && (
                <Bloco titulo="O problema">
                  <p className="prosa max-w-[60ch] text-[1.1rem]">{item.problema}</p>
                </Bloco>
              )}
              <Bloco titulo="O que foi feito">
                <p className="prosa max-w-[60ch] text-[1.1rem]">{item.feito}</p>
              </Bloco>
            </div>
            <div className="space-y-7">
              {item.numeros.length > 0 && (
                <Bloco titulo="Números">
                  <ul className="space-y-2">
                    {item.numeros.map((n) => (
                      <li key={n} className="flex gap-3 text-[1.02rem] leading-snug font-medium">
                        <span aria-hidden="true" className="mt-[0.55em] h-[2px] w-3 shrink-0 bg-pitanga" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </Bloco>
              )}
              <Bloco titulo="Feito com">
                <p className="text-[1rem] leading-relaxed text-grafite">{item.stack.join(', ')}.</p>
              </Bloco>
              {(item.repositorio || item.fonte) && (
                <div className="flex flex-col items-start gap-3 pt-1">
                  {item.repositorio && (
                    <LinkExterno
                      href={item.repositorio}
                      className="botao-acao inline-flex rounded-full border border-tinta px-5 py-2.5 font-semibold hover:bg-tinta hover:text-folha"
                    >
                      Ver o código no GitHub
                    </LinkExterno>
                  )}
                  {item.fonte && (
                    <p className="text-[0.98rem] text-grafite">
                      Fonte: <FonteLink fonte={item.fonte} />
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {item.diagrama && (
            <div className="mt-10">
              <Bloco titulo="Como as peças conversam">
                <div className="mt-2 rounded-lg border border-linha bg-nevoa p-1.5 sm:p-6">
                  <DiagramaArquitetura id={item.diagrama} />
                </div>
              </Bloco>
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
