// Agente trabalhando sozinho (18/10/2026): a coluna direita do hero mostra o atendimento acontecendo, sem pedir
// que o visitante responda por ele. Um toque escolhe o ramo; a cena roda sozinha, em loop calmo. Todo o roteiro
// sai de lib/agente.ts. No site publicado (19/10/2026), a pergunta do visitante vai para o Worker de IA e nada
// é gravado; em erro, tempo esgotado ou execução local, a resposta é por palavra-chave e não sai do navegador.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { caminhoPublico } from '../lib/assets'
import { medir } from '../lib/medir'
import { linkWhatsapp } from '../lib/whatsapp'
import { URL_DO_AGENTE, deveUsarRemoto, perguntarAoAgente } from './lib/agente-remoto'
import {
  AGENTE,
  PECA_DO_AGENTE,
  RAMOS,
  RAMO_PADRAO,
  duracao,
  inicioDaJanela,
  quadroDoRamo,
  ramoPorId,
  rotuloDaFonte,
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
 * ao trocar de ramo e, com `prefers-reduced-motion`, mostra o quadro final. O campo de pergunta é opcional: no
 * site publicado, a pergunta vai para o Worker de IA, presa à ficha do ramo; em erro ou até 6 s sem resposta,
 * cai na palavra-chave local. Nenhuma conversa é gravada.
 */
export function Agente() {
  const base = import.meta.env.BASE_URL
  const [ramoId, setRamoId] = useState<RamoId>(RAMO_PADRAO)
  const ramo = ramoPorId(ramoId)
  const [reduzido, setReduzido] = useState(prefereMenosMovimento)
  const [t, setT] = useState(() => (reduzido ? duracao(ramo) : 0))
  const [naTela, setNaTela] = useState(true)
  const [pergunta, setPergunta] = useState('')
  const [resposta, setResposta] = useState<{
    pergunta: string
    texto: string
    equipe: boolean
    /** `ia` e `simulado` vêm do Worker; `palavra-chave` é o plano B local; `consultando` é a espera. */
    fonte: 'ia' | 'simulado' | 'palavra-chave' | 'consultando'
  } | null>(null)
  const [respondendo, setRespondendo] = useState(false)
  /**
   * O hero só chama o Worker no site publicado. `?agente-real` força a tentativa no teste local, mas a chamada
   * só passa se a origem local estiver em `ORIGENS` no Worker (ou se um proxy trocar a Origin).
   */
  const [remoto] = useState(
    () => typeof window !== 'undefined' && deveUsarRemoto(window.location.hostname, window.location.search),
  )
  const raiz = useRef<HTMLElement>(null)
  const conversa = useRef<HTMLDivElement>(null)
  const tAtual = useRef(t)
  /** Identifica o pedido em voo: a resposta de um ramo antigo não sobrescreve o ramo atual. */
  const pedido = useRef(0)

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

  // A conversa acompanha a última fala, rolando por dentro do celular (nunca a página). A janela começa numa
  // fala inteira, para nenhum balão aparecer cortado no topo.
  useEffect(() => {
    const el = conversa.current
    if (!el) return
    const id = requestAnimationFrame(() => {
      const bolhas = [...el.querySelectorAll<HTMLElement>('.agente-fala')]
      const espaco = Number.parseFloat(getComputedStyle(el).rowGap) || 0
      const primeira = bolhas[inicioDaJanela(bolhas.map((b) => b.offsetHeight), el.clientHeight, espaco)]
      if (!primeira || el.scrollHeight <= el.clientHeight) {
        el.style.setProperty('--folga-conversa', '0px')
        el.scrollTop = 0
        return
      }
      // A fala escolhida vira o topo da janela. Quando o que sobra abaixo é menor que o celular, o navegador
      // não deixaria rolar até ali; a folga temporária no pé dá o espaço exato e evita o balão cortado.
      el.style.setProperty('--folga-conversa', '0px')
      const alvo = primeira.offsetTop
      const folga = Math.max(0, alvo + el.clientHeight - el.scrollHeight)
      el.style.setProperty('--folga-conversa', `${Math.ceil(folga)}px`)
      void el.scrollHeight
      el.scrollTo({ top: alvo, behavior: 'auto' })
    })
    return () => cancelAnimationFrame(id)
  }, [quadro.mensagens.length, quadro.digitando, ramoId, reduzido])

  /** Troca o ramo, zera a cena e limpa a resposta anterior. */
  const escolherRamo = (id: RamoId) => {
    if (id === ramoId) return
    medir('hero_agente_ramo')
    pedido.current += 1
    setRespondendo(false)
    tAtual.current = 0
    setT(0)
    setRamoId(id)
    setPergunta('')
    setResposta(null)
  }

  /**
   * Responde a pergunta do visitante.
   *
   * No site publicado, tenta a IA real do Worker e troca o selo para "IA de verdade". Em erro, tempo esgotado
   * (6 s) ou fora do site, cai na resposta por palavra-chave do roteiro, que nunca sai do navegador.
   */
  const perguntar = async (e: FormEvent) => {
    e.preventDefault()
    if (respondendo) return
    const texto = pergunta.trim()
    const local = responderPergunta(ramo, texto)
    if (!local) return
    medir('hero_agente_pergunta')
    setPergunta('')
    const id = ++pedido.current

    if (!remoto) {
      setResposta({ pergunta: texto, texto: local.texto, equipe: local.equipe, fonte: 'palavra-chave' })
      return
    }

    setRespondendo(true)
    setResposta({ pergunta: texto, texto: '', equipe: false, fonte: 'consultando' })
    const remota = await perguntarAoAgente(URL_DO_AGENTE, ramo.id, texto)
    if (id !== pedido.current) return
    setRespondendo(false)
    setResposta(
      remota
        ? { pergunta: texto, texto: remota.texto, equipe: remota.equipe, fonte: remota.origem }
        : { pergunta: texto, texto: local.texto, equipe: local.equipe, fonte: 'palavra-chave' },
    )
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

      <form className="agente-pergunta" onSubmit={perguntar} aria-busy={respondendo}>
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
          <button type="submit" className="agente-pergunta-botao" disabled={respondendo}>
            {respondendo ? AGENTE.perguntaBotaoOcupado : AGENTE.perguntaBotao}
          </button>
        </div>
        <div
          className="agente-resposta"
          data-vazia={!resposta}
          data-equipe={resposta?.equipe ?? false}
          data-consultando={resposta?.fonte === 'consultando'}
          aria-live="polite"
        >
          {resposta ? (
            <>
              <p className="agente-resposta-pergunta">Você perguntou · {resposta.pergunta}</p>
              <p className="agente-resposta-texto">
                {resposta.fonte !== 'consultando' && (
                  <>
                    <span
                      className={`agente-demo${resposta.fonte === 'ia' ? ' agente-demo-ia' : ''}`}
                      aria-hidden="true"
                    >
                      {resposta.fonte === 'ia' ? AGENTE.iaVerdade : AGENTE.demonstracao}
                    </span>
                    <span className="sr-only">{rotuloDaFonte(resposta.fonte)} </span>
                  </>
                )}
                {resposta.fonte === 'consultando' ? AGENTE.consultando : resposta.texto}
              </p>
            </>
          ) : (
            <p className="agente-resposta-texto">{remoto ? AGENTE.notaPerguntaIA : AGENTE.notaPergunta}</p>
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
