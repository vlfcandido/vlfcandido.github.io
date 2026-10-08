import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { empresasDiretas, gruposClientes, type Cliente } from '../clientes'
import { cenasDemo, painelDemo, ramosDemo, vendaDemo, type CenaDemo, type RamoDemo } from '../conteudo'
import { poucoMovimento } from '../lib/transicao'
import { Abas, idAba, idPainel } from './Abas'

const NOMES = new Map<string, string>(
  [...empresasDiretas, ...gruposClientes.flatMap((g) => g.clientes)].map((c: Cliente) => [c.slug, c.nome]),
)

/** Junta nomes em português: "A", "A e B", "A, B e C". */
function juntar(nomes: string[]): string {
  return nomes.length < 2 ? (nomes[0] ?? '') : `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
}

/** Quantos passos cada cena tem (mensagens, campos, números), para o relógio da animação. */
function totalDe(cena: CenaDemo['id'], ramo: RamoDemo): number {
  if (cena === 'integracao') return 2 + vendaDemo.campos.length
  if (cena === 'painel') return painelDemo.numeros.length + 1
  return ramo.conversa.length
}

/**
 * Faz uma cena acontecer passo a passo: devolve quantos passos já apareceram e se ainda há o que
 * mostrar. Com movimento reduzido, a cena aparece inteira de uma vez. Muda de cena ou de rodada,
 * recomeça; nada troca de cena sozinho.
 */
function usePassos(total: number, chave: string): number {
  const [visiveis, setVisiveis] = useState(0)
  const timers = useRef<number[]>([])
  useEffect(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (poucoMovimento()) {
      setVisiveis(total)
      return
    }
    setVisiveis(0)
    let t = 300
    for (let i = 0; i < total; i++) {
      t += i === 0 ? 350 : 750
      timers.current.push(window.setTimeout(() => setVisiveis(i + 1), t))
    }
    return () => timers.current.forEach(clearTimeout)
  }, [total, chave])
  return visiveis
}

/** Cena de integração: a mensagem de venda no WhatsApp e o negócio sendo criado no CRM. */
function CenaIntegracao({ visiveis }: { visiveis: number }) {
  return (
    <div className="flex h-full flex-col gap-3">
      {visiveis >= 1 && (
        <div className="balao">
          <p className="text-[0.8rem] font-semibold text-grafite">WhatsApp, {vendaDemo.cliente}</p>
          <p className="mt-1 max-w-[88%] rounded-2xl rounded-bl-sm bg-nevoa px-3.5 py-2 text-[0.98rem] leading-snug">{vendaDemo.mensagem}</p>
        </div>
      )}
      {visiveis >= 2 && (
        <p className="balao flex items-center gap-2 pl-2 text-[0.85rem] font-semibold text-pitanga-texto" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <path d="M8 2v11M3.5 8.5L8 13l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          vai para o CRM
        </p>
      )}
      {visiveis >= 2 && (
        <div className="balao rounded-xl border border-linha bg-nevoa/60 p-3.5">
          <p className="text-[0.9rem] font-semibold">CRM: novo negócio</p>
          <dl className="mt-2 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5 text-[0.92rem]">
            {vendaDemo.campos.map((c, i) => (
              <div key={c.rotulo} className="contents">
                <dt className="text-grafite">{c.rotulo}</dt>
                <dd className={visiveis >= 3 + i ? 'balao font-medium' : 'invisible'}>{c.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}

/** Cena de painel: os números do dia em três blocos e os pedidos por hora em barrinhas. */
function CenaPainel({ visiveis }: { visiveis: number }) {
  const maximo = Math.max(...painelDemo.porHora)
  const barras = visiveis > painelDemo.numeros.length
  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-[0.9rem] font-semibold">Hoje, até as 18h</p>
      <dl className="grid grid-cols-3 gap-2">
        {painelDemo.numeros.map((n, i) => (
          <div key={n.rotulo} className={`rounded-xl border border-linha bg-nevoa/60 p-2.5 ${visiveis > i ? 'balao' : 'invisible'}`}>
            <dt className="text-[0.78rem] leading-tight text-grafite">{n.rotulo}</dt>
            <dd className={`mt-1 text-[1.15rem] font-bold tabular-nums ${n.rotulo === 'Atrasados' ? 'text-pitanga-texto' : ''}`}>{n.valor}</dd>
          </div>
        ))}
      </dl>
      <div aria-hidden="true" className="mt-auto">
        <div className="flex h-20 items-end gap-1.5">
          {painelDemo.porHora.map((v, i) => (
            <span
              key={i}
              className="barra-demo flex-1 rounded-t-[3px] bg-cobalto/70"
              style={{ '--altura': barras ? `${(v / maximo) * 100}%` : '4%' } as CSSProperties}
            />
          ))}
        </div>
        <p className="mt-1.5 flex justify-between text-[0.75rem] text-grafite">
          <span>8h</span>
          <span>pedidos por hora</span>
          <span>18h</span>
        </p>
      </div>
    </div>
  )
}

/** Cena de atendimento: a conversa do ramo, mensagem a mensagem, com o "digitando". */
function CenaAtendimento({ ramo, visiveis }: { ramo: RamoDemo; visiveis: number }) {
  const proxima = ramo.conversa[visiveis]
  return (
    <ul className="flex h-full flex-col justify-end gap-2.5" aria-label={`Conversa de exemplo: ${ramo.rotulo}`}>
      {ramo.conversa.slice(0, visiveis).map((m, i) => (
        <li key={`${ramo.id}-${i}`} className={`balao flex ${m.de === 'cliente' ? 'justify-start' : 'justify-end'}`}>
          <p
            className={`max-w-[84%] rounded-2xl px-3.5 py-2 text-[0.98rem] leading-snug ${
              m.de === 'cliente' ? 'rounded-bl-sm bg-nevoa text-tinta' : 'rounded-br-sm bg-cobalto text-nevoa'
            }`}
          >
            {m.texto}
          </p>
        </li>
      ))}
      {proxima?.de === 'robo' && (
        <li className="flex justify-end" aria-hidden="true">
          <span className="pontinhos rounded-2xl rounded-br-sm bg-cobalto/15 px-4 py-3">
            <i />
            <i />
            <i />
          </span>
        </li>
      )}
    </ul>
  )
}

interface PropsDemo {
  ramo: string
  aoEscolher: (id: string) => void
  /** Cena à vista; a página guarda, porque a carta das ofertas também a troca. */
  cena: CenaDemo['id']
  aoTrocarCena: (id: CenaDemo['id']) => void
}

/**
 * Demonstração do topo: a pessoa escolhe o ramo e vê, numa janela, uma de três cenas curtas: a
 * venda que entra no CRM, o painel do dia ou o atendimento com IA. O ramo e a boia sondada na carta
 * das ofertas abrem a cena que combina, e as abas trocam de cena; nada troca sozinho. Com movimento reduzido, cada cena
 * aparece inteira de uma vez.
 */
export function Demonstracao({ ramo: idRamo, aoEscolher, cena, aoTrocarCena }: PropsDemo) {
  const indice = Math.max(0, ramosDemo.findIndex((r) => r.id === idRamo))
  const ramo = ramosDemo[indice]
  const [rodada, setRodada] = useState(0)

  const total = totalDe(cena, ramo)
  const visiveis = usePassos(total, `${cena}-${ramo.id}-${rodada}`)
  const andando = visiveis < total
  const atual = cenasDemo.find((c) => c.id === cena) ?? cenasDemo[0]

  return (
    <figure className="mx-auto w-full max-w-[460px]">
      <fieldset>
        <legend className="mb-2.5 text-[1.05rem] font-semibold">Qual é o seu negócio?</legend>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {ramosDemo.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={i === indice}
              onClick={() => (i === indice ? setRodada((n) => n + 1) : aoEscolher(r.id))}
              className={`chip inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.95rem] font-medium sm:gap-2 sm:px-3.5 sm:text-[0.98rem] ${
                i === indice ? 'border-cobalto bg-cobalto text-nevoa' : 'border-linha bg-folha text-tinta hover:border-cobalto hover:text-cobalto'
              }`}
            >
              {i === indice && <span aria-hidden="true" className="ponto ponto-anel" />}
              {r.rotulo}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 rounded-[1.5rem] border border-linha bg-folha shadow-[8px_8px_0_var(--linha)]">
        <Abas
          base="cena"
          rotulo="Cenas da demonstração"
          ativa={cena}
          aoTrocar={(id) => aoTrocarCena(id as CenaDemo['id'])}
          abas={cenasDemo.map((c) => ({ id: c.id, rotulo: c.rotulo }))}
          className="grid grid-cols-3 border-b border-linha"
          classeAba={(marcada) =>
            `cena-aba px-2 py-2.5 text-center text-[0.85rem] leading-tight font-semibold sm:text-[0.92rem] ${marcada ? 'is-ativa' : 'text-grafite hover:text-tinta'}`
          }
        />
        <div
          role="tabpanel"
          id={idPainel('cena', cena)}
          aria-labelledby={idAba('cena', cena)}
          aria-live="polite"
          className="h-[15rem] overflow-hidden p-4 sm:h-[16.5rem] sm:p-5"
        >
          {cena === 'integracao' && <CenaIntegracao visiveis={visiveis} />}
          {cena === 'painel' && <CenaPainel visiveis={visiveis} />}
          {cena === 'atendimento' && <CenaAtendimento ramo={ramo} visiveis={visiveis} />}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-linha px-4 py-2 sm:px-5">
          <p className="text-[0.88rem] leading-snug text-grafite">{atual.legenda}</p>
          <button
            type="button"
            onClick={() => setRodada((n) => n + 1)}
            disabled={andando}
            className="shrink-0 rounded-full px-2 py-1 text-[0.9rem] font-medium text-cobalto underline decoration-linha decoration-2 underline-offset-4 hover:decoration-pitanga disabled:invisible"
          >
            Ver de novo
          </button>
        </div>
      </div>
      <figcaption className="prosa mt-3 text-[0.92rem] leading-snug text-grafite">
        Dados fictícios. No ramo, já liderei projetos para {juntar(ramo.clientes.map((s) => NOMES.get(s) ?? s))}.
      </figcaption>
    </figure>
  )
}
