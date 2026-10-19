// Agente trabalhando sozinho (18/10/2026): a coluna direita do hero mostra o atendimento acontecendo, sem pedir
// que o visitante responda por ele. Um toque escolhe o ramo; a cena roda sozinha, em loop calmo. Todo o roteiro
// sai de lib/agente.ts. Nada é gravado e nenhum texto digitado sai do navegador.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { caminhoPublico } from '../lib/assets'
import { medir } from '../lib/medir'
import { linkWhatsapp } from '../lib/whatsapp'
import {
  AGENTE,
  PECA_DO_AGENTE,
  RAMOS,
  RAMO_PADRAO,
  duracao,
  quadroDoRamo,
  ramoPorId,
  responderPergunta,
  type Acao,
  type Ramo,
  type RamoId,
} from './lib/agente'

/** Intervalo do relógio da cena. A 120 ms a chegada das falas parece natural e o custo é baixo. */
const PASSO_MS = 120

/** A pessoa pediu menos movimento no sistema. */
function prefereMenosMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Iniciais do negócio para o avatar do WhatsApp. */
function iniciais(nome: string): string {
  return nome.split(' ').filter((p) => p.length > 2 || /^[A-Z]/.test(p)).slice(0, 2)
    .map((p) => p[0]).join('').toUpperCase()
}

/** Só as ações do roteiro, na ordem em que acendem. */
function acoesDe(ramo: Ramo): Acao[] {
  return ramo.eventos.filter((e): e is Acao => e.tipo === 'acao')
}

/**
 * Coluna direita do hero: o agente atendendo sozinho no WhatsApp.
 *
 * O visitante escolhe o ramo no máximo uma vez; o resto acontece sozinho. A cena pausa fora da tela, recomeça
 * ao trocar de ramo e, com `prefers-reduced-motion`, mostra o quadro final. O campo de pergunta é opcional e
 * responde por palavra-chave, sem enviar nada.
 */
export function Agente() {
  const base = import.meta.env.BASE_URL
  const [ramoId, setRamoId] = useState<RamoId>(RAMO_PADRAO)
  const ramo = ramoPorId(ramoId)
  const [reduzido, setReduzido] = useState(prefereMenosMovimento)
  const [t, setT] = useState(() => (reduzido ? duracao(ramo) : 0))
  const [naTela, setNaTela] = useState(true)
  const [pergunta, setPergunta] = useState('')
  const [resposta, setResposta] = useState<{ pergunta: string; texto: string; equipe: boolean } | null>(null)
  const raiz = useRef<HTMLElement>(null)
  const conversa = useRef<HTMLDivElement>(null)
  const tAtual = useRef(t)

  const quadro = quadroDoRamo(ramo, t, reduzido)
  const acoes = acoesDe(ramo)
  const [, periodo] = ramo.foraDoHorario.split(' · ')

  // Visibilidade: fora da tela a cena pausa. A primeira metade vista é medida uma vez no Clarity.
  useEffect(() => {
    const el = raiz.current
    if (!el || !('IntersectionObserver' in window)) {
      setNaTela(true)
      medir('hero_agente_visto')
      return
    }
    let mediu = false
    const obs = new IntersectionObserver(([entrada]) => {
      setNaTela(entrada.isIntersecting)
      if (!mediu && entrada.isIntersecting && entrada.intersectionRatio >= 0.5) {
        mediu = true
        medir('hero_agente_visto')
      }
    }, { threshold: [0.12, 0.5] })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Segue a preferência do sistema, inclusive quando ela muda com a página aberta.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aoMudar = () => {
      setReduzido(mq.matches)
      const novo = mq.matches ? duracao(ramo) : 0
      tAtual.current = novo
      setT(novo)
    }
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [ramo])

  // Relógio da cena: pausa fora da tela, retoma de onde parou e recomeça ao trocar de ramo.
  useEffect(() => {
    if (!naTela || reduzido) return
    const ciclo = duracao(ramo)
    const inicio = performance.now() - tAtual.current * 1000
    const id = window.setInterval(() => {
      const agora = ((performance.now() - inicio) / 1000) % ciclo
      tAtual.current = agora
      setT(agora)
    }, PASSO_MS)
    return () => window.clearInterval(id)
  }, [naTela, reduzido, ramo])

  // A conversa acompanha a última fala, rolando por dentro do celular (nunca a página).
  useEffect(() => {
    const el = conversa.current
    if (!el) return
    const reiniciou = quadro.mensagens.length <= 1
    el.scrollTo({ top: el.scrollHeight, behavior: reduzido || reiniciou ? 'auto' : 'smooth' })
  }, [quadro.mensagens.length, quadro.digitando, ramoId, reduzido])

  /** Troca o ramo, zera a cena e limpa a resposta anterior. */
  const escolherRamo = (id: RamoId) => {
    if (id === ramoId) return
    medir('hero_agente_ramo')
    tAtual.current = 0
    setT(0)
    setRamoId(id)
    setPergunta('')
    setResposta(null)
  }

  /** Responde a pergunta do visitante com o roteiro do ramo, sem enviar nada para fora. */
  const perguntar = (e: FormEvent) => {
    e.preventDefault()
    const r = responderPergunta(ramo, pergunta)
    if (!r) return
    medir('hero_agente_pergunta')
    setResposta({ pergunta: pergunta.trim(), ...r })
    setPergunta('')
  }

  return (
    <section ref={raiz} className="agente" data-sem-parada aria-labelledby="agente-titulo">
      <div className="agente-topo">
        <p className="agente-rotulo">
          <span className="agente-vivo" aria-hidden="true" />
          {AGENTE.rotulo}
          <span className="agente-ao-vivo">{AGENTE.aoVivo}</span>
        </p>
        <span className="agente-hora">
          {quadro.hora}
          {periodo && <span className="agente-periodo"> · {periodo}</span>}
        </span>
      </div>

      <h2 id="agente-titulo" className="agente-titulo">{AGENTE.titulo}</h2>
      <p className="agente-texto">{AGENTE.texto}</p>

      <div className="agente-seletor">
        <p className="agente-chamada" id="agente-ramos-rotulo">{AGENTE.chamadaRamo}</p>
        <div className="agente-ramos" role="group" aria-labelledby="agente-ramos-rotulo">
          {RAMOS.map((r) => (
            <button
              key={r.id}
              type="button"
              className="agente-ramo"
              aria-pressed={r.id === ramoId}
              onClick={() => escolherRamo(r.id)}
            >
              {r.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div className="agente-cena">
        <div className="agente-celular" aria-label={`Conversa de demonstração do ${ramo.negocio}`}>
          <div className="agente-celular-topo">
            <span className="agente-avatar" aria-hidden="true">{iniciais(ramo.negocio)}</span>
            <span className="agente-contato">
              <strong>{ramo.negocio}</strong>
              <small>agente IA · {ramo.descricao}</small>
            </span>
            <span className="agente-selo" aria-hidden="true">IA</span>
          </div>

          <div
            ref={conversa}
            className="agente-conversa"
            role="log"
            aria-live="off"
            aria-label="Conversa entre o cliente e o agente"
          >
            {quadro.mensagens.map((m, i) => (
              <div key={`${ramoId}-${i}-${m.em}`} className={`agente-fala agente-fala-${m.tipo}`}>
                <p>
                  {m.texto}
                  <time className="agente-fala-hora">{m.hora}</time>
                </p>
              </div>
            ))}
            {quadro.digitando && (
              <div className="agente-fala agente-fala-agente agente-digitando" aria-hidden="true">
                <span className="agente-pontos"><i /><i /><i /></span>
              </div>
            )}
          </div>

          <p className="agente-celular-pe" aria-hidden="true">WhatsApp · demonstração</p>
        </div>

        <aside className="agente-painel" aria-label={AGENTE.painelTitulo}>
          <div className="agente-painel-topo">
            <p className="agente-painel-titulo">{AGENTE.painelTitulo}</p>
            <p className="agente-contador">
              <strong key={quadro.resolvidos} className="agente-contador-num">{quadro.resolvidos}</strong>
              <span>{quadro.resolvidos === 1 ? AGENTE.contadorSingular : AGENTE.contadorPlural}</span>
            </p>
          </div>

          <ol className="agente-lista">
            {acoes.map((a) => (
              <li
                key={a.chave}
                className="agente-acao"
                data-visivel={reduzido || a.em <= t}
                data-equipe={a.equipe}
              >
                <span className="agente-acao-icone" aria-hidden="true">{a.equipe ? '→' : '✓'}</span>
                <span className="agente-acao-texto">
                  <span className="agente-acao-rotulo">{a.rotulo}</span>
                  <span className="agente-acao-detalhe">{a.detalhe}</span>
                </span>
                <span className="agente-acao-hora">{a.hora}</span>
              </li>
            ))}
          </ol>
          <p className="agente-painel-pe">Ninguém online. Ele seguiu o combinado.</p>
        </aside>
      </div>

      <form className="agente-pergunta" onSubmit={perguntar}>
        <label className="agente-pergunta-rotulo" htmlFor="agente-pergunta">{AGENTE.perguntaRotulo}</label>
        <p id="agente-pergunta-ajuda" className="sr-only">{AGENTE.perguntaDica}</p>
        <div className="agente-pergunta-linha">
          <input
            id="agente-pergunta"
            type="text"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder={AGENTE.perguntaExemplo}
            maxLength={120}
            autoComplete="off"
            aria-describedby="agente-pergunta-ajuda"
          />
          <button type="submit" className="agente-pergunta-botao">{AGENTE.perguntaBotao}</button>
        </div>
        <div className="agente-resposta" data-vazia={!resposta} data-equipe={resposta?.equipe ?? false} aria-live="polite">
          {resposta ? (
            <>
              <p className="agente-resposta-pergunta">Você perguntou · {resposta.pergunta}</p>
              <p className="agente-resposta-texto">
                <span className="agente-demo">{AGENTE.demonstracao}</span>
                {resposta.texto}
              </p>
            </>
          ) : (
            <p className="agente-resposta-texto">{AGENTE.notaPergunta}</p>
          )}
        </div>
      </form>

      <div className="agente-fim">
        <a
          className="cta toque agente-cta"
          href={linkWhatsapp(ramo.mensagemWhatsapp)}
          target="_blank"
          rel="noopener"
          onClick={() => medir('hero_agente_whatsapp')}
        >
          {AGENTE.cta}
          <span className="seta" aria-hidden="true">→</span>
        </a>
        <div className="agente-fim-linha">
          <a
            className="agente-peca"
            href={caminhoPublico(base, PECA_DO_AGENTE)}
            onClick={() => medir('hero_agente_peca')}
          >
            {AGENTE.peca}
            <span className="seta" aria-hidden="true">→</span>
          </a>
          <p className="agente-preco">
            {AGENTE.preco}
            <span className="agente-preco-nota">{AGENTE.notaPreco}</span>
          </p>
        </div>
      </div>

      <p className="agente-honestidade">{AGENTE.honestidade}</p>
    </section>
  )
}
