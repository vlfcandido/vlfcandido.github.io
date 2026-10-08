import type { ReactNode } from 'react'
import type { Cliente } from '../../clientes'
import type { CaseDetalhe, NumeroCase, TomStatus } from '../../casos'
import type { Fonte } from '../../conteudo'
import { tiposProjeto, type ItemProjeto } from '../../projetos'
import { FonteLink } from '../FonteLink'
import { LinkExterno } from '../LinkExterno'
import { Logo } from '../Logo'

// Moldura comum da página de case: o que é igual em todos os projetos. A variedade fica na peça principal.

/** Como a origem do projeto aparece no cabeçalho. */
function rotuloOrigem(item: ItemProjeto): string {
  if (item.origem === 'proprio') return 'Projeto próprio'
  return item.participacao ? 'Participação em empresa' : 'Em empresa'
}

/**
 * Cabeçalho do case: origem e tipos, nome, papel, período, a frase de resultado e a logo pequena.
 *
 * @param props.item projeto da galeria.
 * @param props.caso detalhe do case.
 * @param props.empresa cliente da logo, quando há.
 */
export function CabecalhoCase({ item, caso, empresa }: { item: ItemProjeto; caso: CaseDetalhe; empresa?: Cliente }) {
  const tipos = item.tipos.map((t) => tiposProjeto[t]).join(', ')
  return (
    <header className="case-cabecalho grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="min-w-0">
        <p className="text-[0.95rem] text-grafite">
          <span className="font-semibold text-tinta">{rotuloOrigem(item)}</span>
          <span aria-hidden="true" className="mx-2 inline-block h-[1px] w-5 translate-y-[-0.3em] bg-linha" />
          {tipos}
        </p>
        <h1 id="case-titulo" tabIndex={-1} className="mt-3 text-[2.35rem] leading-[1.06] font-semibold sm:text-[3.4rem]">
          {item.nome}
        </h1>
        {(item.papel || caso.periodo) && (
          <p className="mt-3 text-[1.05rem] font-medium text-cobalto">
            {item.papel}
            {item.papel && caso.periodo ? ', ' : ''}
            {caso.periodo && <span className="text-grafite">{caso.periodo}</span>}
          </p>
        )}
        <p className="prosa mt-5 max-w-[46ch] text-[1.3rem] leading-[1.45] sm:text-[1.5rem]">{item.resultado}</p>
      </div>
      {empresa && (
        <div className="case-placa-logo flex h-20 w-44 items-center justify-center rounded-md border border-linha bg-folha px-5 shadow-[4px_4px_0_var(--linha)]">
          <Logo cliente={empresa} className="max-h-10 max-w-[130px]" />
        </div>
      )}
    </header>
  )
}

const COR_TOM: Record<TomStatus, string> = {
  vivo: 'var(--mata)',
  atencao: 'var(--sol)',
  neutro: 'var(--fundo-suave)',
}

/**
 * Faixa de status: a situação real do projeto numa linha só, separada dos números.
 *
 * @param props.texto a situação, em uma frase.
 * @param props.tom cor do ponto (sempre com a palavra junto).
 */
export function FaixaStatus({ texto, tom }: { texto: string; tom: TomStatus }) {
  return (
    <p className="case-status mt-8 flex items-start gap-3 border-y border-linha py-3.5 text-[1rem] leading-snug">
      <span aria-hidden="true" className="mt-[0.3em] size-3 shrink-0 rounded-full border border-tinta/30" style={{ background: COR_TOM[tom] }} />
      <span>
        <span className="font-semibold">Situação: </span>
        {texto}
      </span>
    </p>
  )
}

/** Um número da régua: grande, com o grifo de marca-texto (só número com fonte) e a origem embaixo. */
function NumeroRegua({ n }: { n: NumeroCase }) {
  return (
    <li className="min-w-0">
      <p className="font-display text-[2.6rem] leading-none font-semibold sm:text-[3.2rem]">
        <span className="grifo">{n.valor}</span>
      </p>
      <p className="mt-2 max-w-[26ch] text-[1rem] leading-snug">{n.rotulo}</p>
      <p className="mt-1 text-[0.9rem] text-grafite">
        {n.url ? (
          <LinkExterno href={n.url} className="sublinha hover:text-tinta">
            {n.origem}
          </LinkExterno>
        ) : (
          n.origem
        )}
      </p>
    </li>
  )
}

/**
 * Régua de números: de 1 a 3, cada um com a origem. Sem número, não renderiza (nada de régua vazia).
 *
 * @param props.numeros números do case.
 */
export function ReguaNumeros({ numeros }: { numeros: NumeroCase[] }) {
  const validos = numeros.filter((n) => n.origem.trim() !== '')
  if (validos.length === 0) return null
  return (
    <section aria-label="Números" className="case-regua mt-14">
      <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {validos.map((n) => (
          <NumeroRegua key={n.valor + n.rotulo} n={n} />
        ))}
      </ul>
    </section>
  )
}

/**
 * Meu papel: o que foi meu e, separado, o que não foi ou não posso contar.
 *
 * @param props.papel textos do case.
 */
export function MeuPapel({ papel }: { papel: CaseDetalhe['papel'] }) {
  return (
    <aside aria-labelledby="case-papel" className="case-papel rounded-xl border border-linha bg-folha p-5 sm:p-6">
      <h2 id="case-papel" className="text-[1.2rem] font-semibold">
        O que foi meu
      </h2>
      <p className="mt-2 text-[1.02rem] leading-relaxed">{papel.meu}</p>
      {papel.resto && (
        <>
          <h3 className="mt-5 border-t border-dashed border-linha pt-4 text-[1rem] font-semibold text-grafite">O resto</h3>
          <p className="mt-1.5 text-[0.98rem] leading-relaxed text-grafite">{papel.resto}</p>
        </>
      )}
    </aside>
  )
}

/**
 * Selo obrigatório em toda peça com dado de exemplo.
 *
 * @param props.children o texto do rótulo.
 */
export function RotuloFicticio({ children }: { children: ReactNode }) {
  return (
    <p className="rotulo-ficticio inline-flex items-start gap-2 rounded-md border border-dashed border-pitanga px-2.5 py-1.5 text-[0.88rem] leading-snug text-pitanga-texto">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="mt-[0.15em] shrink-0">
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 4.6v4.2M8 10.9v.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </p>
  )
}

/**
 * Rodapé do case: com o que foi feito, o código (só os repositórios do banco) e a fonte pública.
 *
 * @param props.item projeto da galeria.
 * @param props.fonte matéria ou material público, quando há.
 */
export function RodapeFonte({ item, fonte }: { item: ItemProjeto; fonte?: Fonte }) {
  return (
    <footer className="case-rodape mt-16 grid gap-8 border-t border-linha pt-8 md:grid-cols-[2fr_1fr]">
      <div>
        <h2 className="text-[1.1rem] font-semibold">Feito com</h2>
        <p className="mt-2 text-[1rem] leading-relaxed text-grafite">{item.stack.join(', ')}.</p>
      </div>
      {(item.repositorio || fonte) && (
        <div className="flex flex-col items-start gap-3">
          {item.repositorio && (
            <LinkExterno
              href={item.repositorio}
              className="botao-acao inline-flex rounded-full border border-tinta px-5 py-2.5 font-semibold hover:bg-tinta hover:text-folha"
            >
              Ver o código no GitHub
            </LinkExterno>
          )}
          {fonte && (
            <p className="text-[0.98rem] text-grafite">
              Fonte: <FonteLink fonte={fonte} />
            </p>
          )}
        </div>
      )}
    </footer>
  )
}
