// Agente trabalhando sozinho (18/10/2026): a coluna direita do hero mostra o atendimento acontecendo, sem pedir
// que o visitante responda por ele. Um toque escolhe o ramo; a cena roda sozinha, em loop calmo. Todo o roteiro
// sai de lib/agente.ts. No celular (19/10/2026), o cartão inteiro cabe numa tela: a conversa mostra só as três
// últimas falas, sem rolagem interna, e o painel vira progresso, passo atual e três linhas.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { caminhoPublico } from '../lib/assets'
import { medir } from '../lib/medir'
import { linkWhatsapp } from '../lib/whatsapp'
import {
  AGENTE,
  PECA_DO_AGENTE,
  RAMOS,
  RAMO_PADRAO,
  duracao,
  falaQueSai,
  quadroDoRamo,
  ramoPorId,
  ultimasFalas,
  type Acao,
  type Fala,
  type Ramo,
  type RamoId,
} from './lib/agente'

/** Intervalo do relógio da cena. A 120 ms a chegada das falas parece natural e o custo é baixo. */
const PASSO_MS = 120

/** Tempo da saída da fala antiga pelo topo, em milissegundos. Casa com a animação `agente-sai` do CSS. */
const SAIDA_MS = 260

/** Quantas falas cabem na janela fixa da conversa. */
const FALAS_NA_JANELA = 3

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
 * ao trocar de ramo e, com `prefers-reduced-motion`, mostra o quadro final. A conversa tem altura fixa e mostra
 * só as três últimas falas: as novas entram por baixo e as antigas saem pelo topo com fade, sem rolagem interna.
 */
export function Agente() {
  const base = import.meta.env.BASE_URL
  const [ramoId, setRamoId] = useState<RamoId>(RAMO_PADRAO)
  const ramo = ramoPorId(ramoId)
  const [reduzido, setReduzido] = useState(prefereMenosMovimento)
  const [t, setT] = useState(() => (reduzido ? duracao(ramo) : 0))
  const [naTela, setNaTela] = useState(true)
  const raiz = useRef<HTMLElement>(null)
  /** Pilha da conversa: as falas ficam absolutas e só se deslocam por `translate`, para não gerar CLS. */
  const pilha = useRef<HTMLDivElement>(null)
  const tAtual = useRef(t)

  const quadro = quadroDoRamo(ramo, t, reduzido)
  const acoes = acoesDe(ramo)
  const [, periodo] = ramo.foraDoHorario.split(' · ')

  const visiveis = ultimasFalas(quadro.mensagens, FALAS_NA_JANELA)
  /** Assinatura da janela: só muda quando entra ou sai fala, não a cada tique do relógio. */
  const chaveJanela = visiveis.map((m) => `${m.tipo}:${m.em}:${m.texto}`).join('|')
  const [saindo, setSaindo] = useState<Fala | null>(null)
  const janelaAnterior = useRef<Fala[]>([])

  const totalAcoes = acoes.length
  const feitas = quadro.acoes.length
  const progresso = totalAcoes > 0 ? (feitas / totalAcoes) * 100 : 0
  /** Última ação já acesa: é o passo atual em destaque no painel compacto. */
  const passoAtual = feitas > 0 ? quadro.acoes[feitas - 1].chave : null
  /**
   * No celular, três linhas sempre visíveis: com menos de três ações acesas, mostra as próximas apagadas, para
   * o painel não abrir vazio; depois, as três últimas que acenderam.
   */
  const janelaAcoes = feitas >= 3 ? quadro.acoes.slice(-3) : acoes.slice(0, 3)

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

  // Janela da conversa: quando uma fala nova entra e a mais antiga sai, guarda a que saiu por um instante para
  // ela desaparecer pelo topo com fade. Recomeço do ciclo e janela enchendo não animam saída.
  useEffect(() => {
    const saiu = falaQueSai(janelaAnterior.current, visiveis)
    janelaAnterior.current = visiveis
    if (!saiu) return
    setSaindo(saiu)
    const id = window.setTimeout(() => setSaindo(null), SAIDA_MS)
    return () => window.clearTimeout(id)
    // `chaveJanela` resume a janela; as falas em si mudam de identidade a cada tique do relógio.
  }, [chaveJanela])

  // A janela anda: cada fala é posicionada da última para a primeira, por `translate`, dentro da altura fixa.
  // Posição absoluta + transform não é reflow, então a entrada e a saída não contam como layout shift.
  useLayoutEffect(() => {
    const el = pilha.current
    if (!el) return
    const bolhas = [...el.querySelectorAll<HTMLElement>('.agente-fala')]
    let deslocamento = 0
    for (let i = bolhas.length - 1; i >= 0; i--) {
      bolhas[i].style.setProperty('--deslocamento', `${deslocamento}px`)
      deslocamento += bolhas[i].offsetHeight + 5
    }
  }, [chaveJanela, saindo, quadro.digitando])

  /** Troca o ramo e zera a cena. */
  const escolherRamo = (id: RamoId) => {
    if (id === ramoId) return
    medir('hero_agente_ramo')
    tAtual.current = 0
    setT(0)
    setRamoId(id)
  }

  /** Uma linha do painel. `chave` é explícita: a lista compacta usa slots fixos para não deslocar linhas. */
  const itemDeAcao = (a: Acao, chave: string) => (
    <li
      key={chave}
      className="agente-acao"
      data-visivel={reduzido || a.em <= t}
      data-equipe={a.equipe}
      data-atual={a.chave === passoAtual}
    >
      <span className="agente-acao-icone" aria-hidden="true">{a.equipe ? '→' : '✓'}</span>
      <span className="agente-acao-texto">
        <span className="agente-acao-rotulo">{a.rotulo}</span>
        <span className="agente-acao-detalhe">{a.detalhe}</span>
      </span>
      <span className="agente-acao-hora">{a.hora}</span>
    </li>
  )

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
        <p className="agente-chamada" aria-hidden="true">{AGENTE.chamadaRamo}</p>
        <div className="agente-ramos" role="group" aria-label={AGENTE.chamadaRamo}>
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
            ref={pilha}
            className="agente-conversa"
            role="log"
            aria-live="off"
            aria-label="Conversa entre o cliente e o agente"
          >
            {saindo && (
              <div
                className={`agente-fala agente-fala-${saindo.tipo} agente-fala-sai`}
                aria-hidden="true"
              >
                <p>
                  {saindo.texto}
                  <time className="agente-fala-hora">{saindo.hora}</time>
                </p>
              </div>
            )}
            {visiveis.map((m) => (
              <div key={`${ramoId}-${m.em}-${m.texto}`} className={`agente-fala agente-fala-${m.tipo}`}>
                <p>
                  {m.texto}
                  <time className="agente-fala-hora">{m.hora}</time>
                </p>
              </div>
            ))}
            {quadro.digitando && (
              <div key="digitando" className="agente-fala agente-fala-agente agente-digitando" aria-hidden="true">
                <span className="agente-pontos"><i /><i /><i /></span>
              </div>
            )}
          </div>

          <p className="agente-celular-pe">WhatsApp · {AGENTE.demonstracao}</p>
        </div>

        <aside className="agente-painel" aria-label={AGENTE.painelTitulo}>
          <div className="agente-painel-topo">
            <p className="agente-painel-titulo">{AGENTE.painelTitulo}</p>
            <p className="agente-contador">
              <strong key={quadro.resolvidos} className="agente-contador-num">{quadro.resolvidos}</strong>
              <span>{quadro.resolvidos === 1 ? AGENTE.contadorSingular : AGENTE.contadorPlural}</span>
            </p>
          </div>

          <div
            className="agente-progresso"
            role="progressbar"
            aria-label="Passos concluídos"
            aria-valuemin={0}
            aria-valuemax={totalAcoes}
            aria-valuenow={feitas}
          >
            <span style={{ width: `${progresso}%` }} />
          </div>

          <ol className="agente-lista agente-lista-ampla">
            {acoes.map((a) => itemDeAcao(a, a.chave))}
          </ol>
          <ol className="agente-lista agente-lista-compacta" aria-label="Últimos passos">
            {janelaAcoes.map((a, i) => itemDeAcao(a, `slot-${i}`))}
          </ol>
          <p className="agente-painel-pe">Ninguém online. Ele seguiu o combinado.</p>
        </aside>
      </div>

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
        </div>
      </div>
    </section>
  )
}
