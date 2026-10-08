import { useState } from 'react'
import { passos, recebe } from '../conteudo'
import { Abas, idAba, idPainel } from './Abas'
import { FluxoAgente } from './FluxoAgente'

/** Nome curto de cada passo, para caber na linha do stepper no celular. */
const CURTOS = ['Preço fechado', 'Teste em 48 h', 'Entrega testada', '7 dias de correção']

/** Barrinha que faz as vezes de texto nas miniaturas. */
function Barra({ l, forte }: { l: string; forte?: boolean }) {
  return <span className={`block h-[7px] rounded-full ${forte ? 'bg-grafite/60' : 'bg-linha'}`} style={{ width: l }} />
}

/** Visto pequeno, no verde da identidade. */
function Visto() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" className="shrink-0 text-mata">
      <path d="M3 8.5l3 3l7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Miniatura do que a pessoa recebe em cada passo: a proposta, o link de teste, a ficha de entrega
 * e a semana de correção. É ilustração (o texto de verdade está ao lado), fora do leitor de tela.
 */
function Miniatura({ i }: { i: number }) {
  const papel = 'recebe rounded-xl border border-linha bg-folha p-4 text-[0.82rem] leading-tight'
  if (i === 0)
    return (
      <div aria-hidden="true" className={papel}>
        <p className="font-semibold">Proposta</p>
        <p className="mt-3 text-grafite">O que entra</p>
        <div className="mt-1.5 space-y-1.5">
          <Barra l="85%" /> <Barra l="70%" /> <Barra l="55%" />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-linha pt-3">
          <span className="text-grafite">Prazo e valor</span>
          <span className="rotate-[-4deg] rounded border-2 border-pitanga px-1.5 py-0.5 font-bold text-pitanga-texto">fechado</span>
        </div>
      </div>
    )
  if (i === 1)
    return (
      <div aria-hidden="true" className={papel}>
        <div className="flex items-center gap-1.5 rounded-md border border-linha bg-nevoa px-2 py-1.5">
          <span className="size-1.5 rounded-full bg-linha" />
          <span className="size-1.5 rounded-full bg-linha" />
          <span className="ml-1 truncate text-grafite">link para testar</span>
        </div>
        <div className="mt-3 space-y-1.5">
          <Barra l="60%" forte /> <Barra l="90%" /> <Barra l="75%" />
        </div>
        <div className="mt-3 rounded-lg rounded-bl-sm bg-cobalto px-2.5 py-2 text-nevoa">
          <span className="font-semibold">Notícia das 12h:</span> o cadastro está pronto, o painel sai à noite.
        </div>
      </div>
    )
  if (i === 2)
    return (
      <div aria-hidden="true" className={papel}>
        <p className="font-semibold">Ficha de entrega</p>
        <ul className="mt-3 space-y-2">
          {['O que foi feito', 'Como usar', 'Testes'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Visto />
              <span className="w-24 shrink-0">{t}</span>
              <Barra l="100%" />
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-linha pt-2.5 font-semibold text-mata">Todos os testes passaram</p>
      </div>
    )
  return (
    <div aria-hidden="true" className={papel}>
      <p className="font-semibold">Semana de correção</p>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }, (_, d) => (
          <span
            key={d}
            className={`grid aspect-square place-items-center rounded border text-[0.75rem] ${
              d === 3 ? 'border-pitanga bg-pitanga/15 font-bold text-pitanga-texto' : 'border-linha text-grafite'
            }`}
          >
            {d + 1}
          </span>
        ))}
      </div>
      <p className="mt-3 text-grafite">Dia 4: falhou, corrigido no mesmo dia, sem custo.</p>
    </div>
  )
}

/**
 * Os quatro passos num stepper horizontal (também no celular): cada passo é uma aba, e o painel
 * embaixo mostra o passo escolhido, o que a pessoa recebe nele e a miniatura.
 */
function Passos() {
  const [ativo, setAtivo] = useState(0)
  const ultimo = ativo === passos.length - 1
  const p = passos[ativo]
  return (
    <div>
      <Abas
        base="passo"
        rotulo="Passos, do contato à entrega"
        ativa={String(ativo)}
        aoTrocar={(id) => setAtivo(Number(id))}
        abas={passos.map((x, i) => ({
          id: String(i),
          nome: `Passo ${i + 1}: ${x.titulo}`,
          rotulo: (
            <>
              <span aria-hidden="true" className="etapa-numero grid size-9 place-items-center rounded-full text-[1rem] font-bold lg:size-10">
                {i + 1}
              </span>
              <span className="etapa-titulo mt-2 block text-[0.88rem] leading-tight font-semibold sm:text-[0.98rem] lg:text-[1.05rem]">
                <span className="lg:hidden">{CURTOS[i] ?? x.titulo}</span>
                <span className="hidden lg:inline">{x.titulo}</span>
              </span>
            </>
          ),
        }))}
        className="grid grid-cols-4 gap-2 lg:gap-6"
        classeAba={(marcada) => `etapa relative flex flex-col items-start rounded-lg pb-1 text-left ${marcada ? 'is-ativa' : ''}`}
      />
      {/* O traço preenchido até o passo ativo fica fora das abas, só como desenho. */}
      <div
        role="tabpanel"
        id={idPainel('passo', String(ativo))}
        aria-labelledby={idAba('passo', String(ativo))}
        className="mt-4 grid gap-5 rounded-2xl border border-linha bg-folha/60 p-4 sm:grid-cols-[1fr_15rem] sm:items-center sm:p-6 lg:grid-cols-[1fr_17rem] lg:gap-10 lg:p-7"
      >
        <div key={ativo} className="troca">
          <p className="text-[0.92rem] font-semibold text-pitanga-texto">
            Passo {ativo + 1} de {passos.length}
          </p>
          <h3 className="mt-1 text-[1.25rem] leading-snug font-semibold lg:text-[1.45rem]">{p.titulo}</h3>
          <p className="prosa mt-2 text-[1.03rem] text-grafite">{p.descricao}</p>
          <p className="mt-3 text-[1.03rem]">
            <span className="font-semibold">Você recebe: </span>
            {recebe[ativo]}
          </p>
          <button type="button" onClick={() => setAtivo(ultimo ? 0 : ativo + 1)} className="sublinha mt-3 font-medium text-cobalto">
            {ultimo ? 'Voltar ao primeiro passo' : 'Próximo passo'}
          </button>
        </div>
        <div key={`m${ativo}`} className="troca hidden max-w-[18rem] sm:block">
          <Miniatura i={ativo} />
        </div>
      </div>
    </div>
  )
}

const VISTAS = [
  { id: 'passos', rotulo: 'O processo' },
  { id: 'agente', rotulo: 'Por dentro do agente' },
]

/**
 * Como funciona: duas vistas em abas, o processo (quatro passos, do primeiro contato à semana
 * depois da entrega) e o desenho de como um agente se liga ao que a empresa já usa.
 */
export function ComoFunciona() {
  const [vista, setVista] = useState('passos')
  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="secao scroll-mt-24 border-t border-linha">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <h2 id="como-titulo" className="titulo-secao">
            Como funciona
          </h2>
          <p className="prosa mt-1.5 max-w-[52ch] text-[1.02rem] text-grafite">Do primeiro contato à semana depois da entrega.</p>
        </div>
        <Abas
          base="como"
          rotulo="Vistas de como funciona"
          ativa={vista}
          aoTrocar={setVista}
          abas={VISTAS}
          className="inline-flex rounded-full border border-linha bg-folha p-1"
          classeAba={(marcada) =>
            `chip rounded-full px-4 py-2 text-[0.95rem] font-medium ${marcada ? 'bg-cobalto text-nevoa' : 'text-tinta hover:text-cobalto'}`
          }
        />
      </div>
      <div role="tabpanel" id={idPainel('como', 'passos')} aria-labelledby={idAba('como', 'passos')} hidden={vista !== 'passos'} className="mt-7 lg:mt-10">
        <Passos />
      </div>
      <div role="tabpanel" id={idPainel('como', 'agente')} aria-labelledby={idAba('como', 'agente')} hidden={vista !== 'agente'} className="mt-7 lg:mt-10">
        <FluxoAgente />
      </div>
    </section>
  )
}
