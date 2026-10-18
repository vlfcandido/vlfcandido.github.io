// Plantão do atendente (18/10/2026): a coluna direita do hero deixa de ser captura e vira o visitante no lugar do
// agente. Ele escolhe a resposta em três decisões reais do Pelo Solto e vê a regra que barra a resposta inventada.
// Todo o texto sai de lib/plantao.ts. Nada é gravado; a medição manda só o nome da etapa para o Clarity.
import { useEffect, useRef, useState } from 'react'
import { caminhoPublico } from '../lib/assets'
import { medir } from '../lib/medir'
import { linkWhatsapp } from '../lib/whatsapp'
import {
  PECA_DO_PLANTAO,
  PLANTAO,
  escolher,
  estadoInicial,
  mensagemWhatsapp,
  opcaoDoPasso,
  resumoDe,
  type Estado,
  type Fala as FalaDoPlantao,
  type Segmento,
} from './lib/plantao'

/** Fala da conversa, com o carimbo da regra quando a resposta veio de uma regra de verdade. */
function Fala({ fala }: { fala: FalaDoPlantao }) {
  if (fala.de === 'sistema') {
    return (
      <p className="plantao-sistema">
        {fala.regra && (
          <span className="plantao-sistema-regra">Regra {fala.regra}</span>
        )}
        {fala.texto}
      </p>
    )
  }
  const regra = fala.regra ? PLANTAO.regras.find((r) => r.id === fala.regra) : undefined
  return (
    <div className={`plantao-fala plantao-fala-${fala.de}`}>
      <span className="plantao-quem">{fala.de === 'cliente' ? 'Camila' : 'Atendente'}</span>
      <p>{fala.texto}</p>
      {regra && (
        <span className="plantao-carimbo">Regra {regra.id} · {regra.nome}</span>
      )}
    </div>
  )
}

/** Conta quantas respostas a regra barrou, no singular e no plural. */
function textoDeBloqueios(n: number): string {
  if (n === 0) return 'Nenhuma resposta barrada pela regra.'
  return n === 1 ? '1 resposta barrada pela regra.' : `${n} respostas barradas pela regra.`
}

/**
 * Coluna direita do hero: o plantão interativo do atendente.
 *
 * O estado vive só na memória da página. Não há campo de texto, `localStorage`, cookie nem query string. Os eventos
 * do Clarity levam apenas o nome da etapa (`hero_plantao_*`), nunca a escolha ou o segmento.
 */
export function Plantao() {
  const base = import.meta.env.BASE_URL
  const [estado, setEstado] = useState<Estado>(estadoInicial)
  const [segmento, setSegmento] = useState<Segmento | null>(null)
  const raiz = useRef<HTMLElement>(null)
  const conversa = useRef<HTMLDivElement>(null)
  const opcoes = useRef<HTMLDivElement>(null)
  const resumo = useRef<HTMLDivElement>(null)
  const interagiu = useRef(false)

  const resumoDoCaminho = resumoDe(estado)
  const ultimaRegra = [...estado.falas].reverse().find((f) => f.regra)?.regra ?? null
  const passo = estado.fim ? null : PLANTAO.passos[estado.passo]

  // Etapa vista: uma vez, quando metade do componente entra na tela.
  useEffect(() => {
    const el = raiz.current
    if (!el || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return
      medir('hero_plantao_visto')
      obs.disconnect()
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // A conversa acompanha a última fala, rolando por dentro do cartão (nunca a página).
  useEffect(() => {
    const el = conversa.current
    if (!el) return
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: el.scrollHeight, behavior: semMovimento ? 'auto' : 'smooth' })
  }, [estado.falas.length])

  // Depois de uma escolha, o foco vai para a próxima decisão ou para o título do resumo. Na montagem, não mexe:
  // o ref só vira `true` dentro de responder(), então o duplo efeito do StrictMode também não rouba o foco.
  useEffect(() => {
    if (!interagiu.current) return
    const alvo = estado.fim
      ? resumo.current?.querySelector<HTMLElement>('h3')
      : opcoes.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')
    alvo?.focus({ preventScroll: true })
  }, [estado])

  /** Aplica a escolha, mede a etapa e deixa o estado cuidar do resto. */
  const responder = (id: string) => {
    const opcao = opcaoDoPasso(estado, id)
    if (!opcao) return
    interagiu.current = true
    if (passo) medir(`hero_plantao_${passo.id}`)
    if (opcao.tipo === 'bloqueada') medir('hero_plantao_bloqueio')
    const novo = escolher(estado, id)
    if (novo.fim) medir('hero_plantao_resumo')
    setEstado(novo)
  }

  /** Reinicia a simulação, sem guardar o caminho anterior. */
  const reiniciar = () => {
    medir('hero_plantao_reinicio')
    interagiu.current = true
    setEstado(estadoInicial())
    setSegmento(null)
  }

  /** Guarda o segmento só na memória, para a mensagem do WhatsApp. */
  const escolherSegmento = (s: Segmento) => {
    medir('hero_plantao_segmento')
    setSegmento((atual) => (atual?.id === s.id ? null : s))
  }

  return (
    <section ref={raiz} className="plantao" data-sem-parada aria-labelledby="plantao-titulo">
      <div className="plantao-topo">
        <p className="plantao-rotulo">{PLANTAO.rotulo}</p>
        <h2 id="plantao-titulo" className="plantao-titulo">{PLANTAO.titulo}</h2>
        <p className="plantao-texto">{PLANTAO.texto}</p>
      </div>

      <div className="plantao-grade">
        <div className="plantao-folha">
          <div className="plantao-cabecalho">
            <span className="plantao-selo">Pelo Solto · simulação</span>
            <span className="plantao-progresso">
              {estado.fim ? 'resumo' : `${estado.passo + 1} de 3`}
            </span>
          </div>

          {/* No celular e no tablet o painel lateral de regras não cabe; esta faixa mostra as quatro e acende a
              regra da última resposta. No PC ela some, porque o painel ao lado já mostra o texto inteiro. */}
          <p className="plantao-regras-linha">
            <span className="sr-only">As quatro regras do atendimento.</span>
            {PLANTAO.regras.map((r) => (
              <span key={r.id} data-ativa={ultimaRegra === r.id}>
                <b aria-hidden="true">{r.id}</b> {r.curto}
              </span>
            ))}
          </p>

          {estado.fim ? (
            <div ref={resumo} className="plantao-resumo" role="group" aria-label="Resumo do atendimento">
              <p className="plantao-resumo-rotulo">{PLANTAO.resumo.rotulo}</p>
              <h3 tabIndex={-1}>{PLANTAO.resumo.titulo}</h3>
              <ul className="plantao-fatos">
                <li data-ok={resumoDoCaminho.perguntouPorte}>
                  <span aria-hidden="true">{resumoDoCaminho.perguntouPorte ? '✓' : '×'}</span>
                  <span className="sr-only">{resumoDoCaminho.perguntouPorte ? 'Feito. ' : 'Não feito. '}</span>
                  Porte
                </li>
                <li data-ok={resumoDoCaminho.consultouAgenda}>
                  <span aria-hidden="true">{resumoDoCaminho.consultouAgenda ? '✓' : '×'}</span>
                  <span className="sr-only">{resumoDoCaminho.consultouAgenda ? 'Feito. ' : 'Não feito. '}</span>
                  Agenda
                </li>
                <li data-ok={resumoDoCaminho.combinouLembrete}>
                  <span aria-hidden="true">{resumoDoCaminho.combinouLembrete ? '✓' : '×'}</span>
                  <span className="sr-only">{resumoDoCaminho.combinouLembrete ? 'Feito. ' : 'Não feito. '}</span>
                  Lembrete
                </li>
                <li data-ok={resumoDoCaminho.consultouBase}>
                  <span aria-hidden="true">{resumoDoCaminho.consultouBase ? '✓' : '×'}</span>
                  <span className="sr-only">{resumoDoCaminho.consultouBase ? 'Feito. ' : 'Não feito. '}</span>
                  Base
                </li>
                <li data-ok={resumoDoCaminho.passouEquipe}>
                  <span aria-hidden="true">{resumoDoCaminho.passouEquipe ? '✓' : '×'}</span>
                  <span className="sr-only">{resumoDoCaminho.passouEquipe ? 'Feito. ' : 'Não feito. '}</span>
                  Equipe
                </li>
              </ul>
              {resumoDoCaminho.bloqueios > 0 && (
                <p className="plantao-bloqueios">{textoDeBloqueios(resumoDoCaminho.bloqueios)}</p>
              )}

              <div className="plantao-segmentos">
                <p className="plantao-segmentos-titulo">{PLANTAO.resumo.chamadaSegmento}</p>
                <div className="plantao-segmentos-botoes" role="group" aria-label={PLANTAO.resumo.chamadaSegmento}>
                  {PLANTAO.segmentos.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={segmento?.id === s.id}
                      onClick={() => escolherSegmento(s)}
                    >
                      {s.rotulo}
                    </button>
                  ))}
                </div>
              </div>

              <p className="plantao-preco">{PLANTAO.resumo.preco}</p>
              <p className="plantao-preco-nota">{PLANTAO.resumo.notaPreco}</p>

              <a
                className="cta toque plantao-cta"
                href={linkWhatsapp(mensagemWhatsapp(estado, segmento))}
                target="_blank"
                rel="noopener"
                onClick={() => medir('hero_plantao_whatsapp')}
              >
                {PLANTAO.resumo.cta}
                <span className="seta" aria-hidden="true">→</span>
              </a>

              <div className="plantao-acoes">
                <a
                  className="plantao-link"
                  href={caminhoPublico(base, PECA_DO_PLANTAO)}
                  onClick={() => medir('hero_plantao_peca')}
                >
                  {PLANTAO.resumo.peca}
                  <span className="seta" aria-hidden="true">→</span>
                </a>
                <button type="button" className="plantao-reiniciar" onClick={reiniciar}>
                  {PLANTAO.resumo.reiniciar}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={conversa}
                className="plantao-conversa"
                role="log"
                aria-live="polite"
                aria-label="Conversa da Camila com o atendente do Pelo Solto"
              >
                {estado.falas.map((fala, i) => <Fala key={i} fala={fala} />)}
                {/* Dica visual do PC, onde sobra altura no cartão. No celular ela some para a conversa caber; a
                    instrução já está no texto acima do cartão. Não entra no log falado (aria-hidden). */}
                <p className="plantao-dica" aria-hidden="true">Escolha a resposta do atendente.</p>
              </div>

              {passo && (
                <div ref={opcoes} className="plantao-opcoes" role="group" aria-label="Escolha a resposta do atendente">
                  {passo.opcoes.map((o) => {
                    const barrada = estado.bloqueadas.includes(o.id)
                    return (
                      <button
                        key={o.id}
                        type="button"
                        className="plantao-opcao"
                        onClick={() => responder(o.id)}
                        disabled={barrada}
                      >
                        <span>{o.rotulo}</span>
                        {barrada && <span className="plantao-opcao-barrada">Regra {o.regra} barrou</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <aside className="plantao-regras" aria-label="As quatro regras do atendimento">
          <p className="plantao-regras-titulo">As 4 regras</p>
          <ol>
            {PLANTAO.regras.map((r) => (
              <li key={r.id} data-ativa={ultimaRegra === r.id}>
                <span className="plantao-regra-numero" aria-hidden="true">{r.id}</span>
                <span className="plantao-regra-nome">{r.nome}</span>
                <span className="plantao-regra-texto">{r.texto}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <p className="plantao-honestidade">{PLANTAO.honestidade}</p>
    </section>
  )
}
