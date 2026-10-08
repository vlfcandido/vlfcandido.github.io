import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { PERGUNTAS_ESCOPO } from '../../chatbot/escopo'
import { LIMITES, type Aderencia, type Porta } from '../../chatbot/protocolo'
import { COMO_FUNCIONA, TEXTOS } from '../../chatbot/textos'
import { FolhaEscopo } from './FolhaEscopo'
import { useAssistente, type ItemConversa } from './useAssistente'

/** Tabela de aderência a uma vaga, em três listas. */
function TabelaAderencia({ a }: { a: Aderencia }) {
  return (
    <div className="folha-escopo text-[0.9rem] leading-snug">
      <h3 className="text-[1.05rem] font-semibold">Aderência à vaga</h3>
      {a.comProva.length > 0 && (
        <>
          <h4 className="mt-3 text-[0.82rem] font-semibold text-grafite">Com prova no site</h4>
          <ul className="mt-1 space-y-1">
            {a.comProva.map((l) => (
              <li key={l.requisito} className="folha-item">
                <strong className="font-semibold">{l.requisito}</strong>: {l.prova}
              </li>
            ))}
          </ul>
        </>
      )}
      {a.semProva.length > 0 && (
        <>
          <h4 className="mt-3 text-[0.82rem] font-semibold text-grafite">Sem prova no site</h4>
          <ul className="mt-1 space-y-1">
            {a.semProva.map((l) => (
              <li key={l} className="folha-item">
                {l}
              </li>
            ))}
          </ul>
        </>
      )}
      <h4 className="mt-3 text-[0.82rem] font-semibold text-grafite">Perguntar na entrevista</h4>
      <ul className="mt-1 space-y-1">
        {a.perguntar.map((l) => (
          <li key={l} className="folha-item">
            {l}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Uma fala na conversa. */
function Fala({ i }: { i: ItemConversa }) {
  if (i.de === 'aviso') return <p className="fala-aviso">{i.texto}</p>
  if (i.de === 'visitante') return <p className="fala-visitante">{i.texto}</p>
  return (
    <div className="fala-assistente">
      <p className="whitespace-pre-line">{i.texto}</p>
      {i.escopo && <FolhaEscopo escopo={i.escopo} />}
      {i.aderencia && <TabelaAderencia a={i.aderencia} />}
    </div>
  )
}

/** O painel "como este assistente funciona". */
function ComoOAssistenteFunciona({ aoVoltar }: { aoVoltar: () => void }) {
  const voltar = useRef<HTMLButtonElement>(null)
  // O foco entra no painel (o link que o abriu sai da tela) e fica no botão de voltar.
  useEffect(() => voltar.current?.focus(), [])
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
      <h3 className="text-[1.2rem] font-semibold">{TEXTOS.comoFunciona}</h3>
      <dl className="mt-3 space-y-3">
        {COMO_FUNCIONA.map((c) => (
          <div key={c.titulo}>
            <dt className="font-semibold">{c.titulo}</dt>
            <dd className="text-[0.93rem] leading-snug text-grafite">{c.texto}</dd>
          </div>
        ))}
      </dl>
      <button ref={voltar} type="button" onClick={aoVoltar} className="sublinha mt-5 font-semibold text-cobalto">
        {TEXTOS.voltar}
      </button>
    </div>
  )
}

/**
 * Painel do assistente: as duas portas (Monte o escopo e Pergunte sobre o trabalho), a conversa, o campo de
 * mensagem e o painel "como funciona". Em telas pequenas ocupa a tela inteira.
 *
 * @param urlWorker URL do Worker; vazia, só o roteiro fixo.
 * @param aoFechar fecha o painel (Esc também fecha).
 */
export function Painel({ urlWorker, aoFechar }: { urlWorker: string; aoFechar: () => void }) {
  const turnstile = useRef<HTMLDivElement>(null)
  const { modo, porta, setPorta, estado, ocupado, enviar, recomecar } = useAssistente(urlWorker, turnstile)
  const [texto, setTexto] = useState('')
  const [vendoComoFunciona, setVendoComoFunciona] = useState(false)
  const [modoVaga, setModoVaga] = useState(false)
  const campo = useRef<HTMLTextAreaElement>(null)
  const lista = useRef<HTMLDivElement>(null)
  const painel = useRef<HTMLDivElement>(null)
  const idTitulo = useId()
  const idAviso = useId()

  // Esc fecha de qualquer ponto da página enquanto o painel está aberto.
  useEffect(() => {
    const aoTeclar = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && aoFechar()
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aoFechar])

  // Foco no campo ao abrir e ao trocar de porta.
  useEffect(() => {
    if (!vendoComoFunciona) campo.current?.focus()
  }, [porta, vendoComoFunciona])

  // Desce até a última fala quando chega uma nova.
  useEffect(() => {
    const el = lista.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [estado.itens.length])

  const respostasEscopo = estado.itens.filter((i) => i.de === 'visitante').length
  const placeholder =
    porta === 'escopo'
      ? PERGUNTAS_ESCOPO[Math.min(respostasEscopo, PERGUNTAS_ESCOPO.length - 1)].exemplo
      : modoVaga
        ? TEXTOS.placeholderVaga
        : TEXTOS.placeholderTrabalho
  const terminou = estado.itens.some((i) => i.tipo === 'escopo' || (porta === 'escopo' && i.tipo === 'recusa'))
  const semMensagens = estado.restantes === 0

  async function mandar() {
    if (!texto.trim() || ocupado) return
    const t = texto
    setTexto('')
    setModoVaga(false)
    await enviar(t)
    campo.current?.focus()
  }

  function teclas(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      void mandar()
    }
  }

  // Tab fica preso dentro do painel enquanto ele está aberto.
  function prender(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab' || !painel.current) return
    const focaveis = painel.current.querySelectorAll<HTMLElement>('button:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]')
    if (!focaveis.length) return
    const primeiro = focaveis[0]
    const ultimo = focaveis[focaveis.length - 1]
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault()
      primeiro.focus()
    }
  }

  const aviso = modo === 'simulado' ? TEXTOS.avisoSimulado : modo === 'roteiro' ? TEXTOS.avisoRoteiro : TEXTOS.aviso

  return (
    <div
      ref={painel}
      role="dialog"
      aria-modal="true"
      aria-labelledby={idTitulo}
      aria-describedby={idAviso}
      onKeyDown={prender}
      className="painel-assistente"
    >
      <header className="flex items-start justify-between gap-3 border-b border-linha px-4 pt-4 pb-3 sm:px-5">
        <div>
          <h2 id={idTitulo} className="text-[1.25rem] leading-tight font-semibold">
            {TEXTOS.titulo}
          </h2>
          <p id={idAviso} className="mt-1 text-[0.8rem] leading-snug text-grafite">
            {aviso}
          </p>
        </div>
        <button type="button" onClick={aoFechar} aria-label={TEXTOS.fechar} title={TEXTOS.fechar} className="grid size-10 shrink-0 place-items-center rounded-full text-grafite hover:bg-nevoa hover:text-tinta">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {vendoComoFunciona ? (
        <ComoOAssistenteFunciona aoVoltar={() => setVendoComoFunciona(false)} />
      ) : (
        <>
          <div role="tablist" aria-label="O que você quer fazer" className="portas">
            {(['escopo', 'trabalho'] as Porta[]).map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={porta === p}
                tabIndex={porta === p ? 0 : -1}
                onClick={() => setPorta(p)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') setPorta(p === 'escopo' ? 'trabalho' : 'escopo')
                }}
                className="porta"
              >
                {TEXTOS.portas[p]}
              </button>
            ))}
          </div>

          <div ref={lista} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5" aria-live="polite" aria-relevant="additions" role="log">
            {estado.itens.map((i) => (
              <Fala key={i.id} i={i} />
            ))}
            {ocupado && (
              <p className="fala-assistente text-grafite" aria-live="off">
                <span className="pensando" aria-hidden="true" />
                <span className="sr-only">{TEXTOS.enviando}</span>
              </p>
            )}
            {porta === 'trabalho' && estado.itens.length === 1 && !modoVaga && (
              <button
                type="button"
                onClick={() => {
                  setModoVaga(true)
                  campo.current?.focus()
                }}
                className="rounded-full border border-grafite px-3 py-1.5 text-[0.9rem] hover:bg-nevoa"
              >
                {TEXTOS.colarVaga}
              </button>
            )}
            <div ref={turnstile} />
          </div>

          <form
            className="border-t border-linha px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5"
            onSubmit={(e) => {
              e.preventDefault()
              void mandar()
            }}
          >
            {terminou || semMensagens ? (
              <button type="button" onClick={recomecar} className="botao-acao w-full rounded-full border border-cobalto py-2.5 font-semibold text-cobalto">
                {TEXTOS.recomecar}
              </button>
            ) : (
              <>
                <label htmlFor={`${idTitulo}-campo`} className="sr-only">
                  Sua mensagem
                </label>
                <div className="flex items-end gap-2">
                  <textarea
                    id={`${idTitulo}-campo`}
                    ref={campo}
                    value={texto}
                    onChange={(e) => setTexto(e.target.value.slice(0, LIMITES.entradaMax))}
                    onKeyDown={teclas}
                    rows={modoVaga ? 5 : 3}
                    maxLength={LIMITES.entradaMax}
                    placeholder={placeholder}
                    className="campo-assistente"
                  />
                  <button
                    type="submit"
                    disabled={!texto.trim() || ocupado}
                    className="botao-acao h-11 shrink-0 rounded-full bg-cobalto px-4 font-semibold text-nevoa disabled:opacity-50"
                  >
                    {ocupado ? TEXTOS.enviando : TEXTOS.enviar}
                  </button>
                </div>
              </>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[0.8rem] text-grafite">
              <button type="button" onClick={() => setVendoComoFunciona(true)} className="sublinha hover:text-tinta">
                {TEXTOS.comoFunciona}
              </button>
              <span aria-live="polite">
                {!terminou && estado.restantes !== null && estado.restantes <= 3 ? TEXTOS.limiteRestante(estado.restantes) : texto.length > LIMITES.entradaMax * 0.8 ? TEXTOS.contador(texto.length) : ''}
              </span>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
