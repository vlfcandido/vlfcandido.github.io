import { empresasDiretas, type EmpresaDireta } from '../clientes'
import { cases, type Case } from '../conteudo'
import { DiagramaArquitetura } from './Diagramas'
import { FonteLink } from './FonteLink'
import { IlustracaoNoticia } from './Ilustracoes'
import { LinkExterno } from './LinkExterno'
import { Logo } from './Logo'

/** Caso de conteudo.ts que conta a história de cada empresa, quando existe. */
const CASO_DA_EMPRESA: Record<string, string> = {
  sicoob: 'sicoob-investimentos',
  contabilizei: 'concierge-contabilizei',
  wiv: 'waizer-wiv',
  'prefeitura-franca': 'prefeitura-franca',
  araguaia: 'araguaia',
}

function casoDe(e: EmpresaDireta): Case | undefined {
  return cases.find((c) => c.slug === CASO_DA_EMPRESA[e.slug])
}

/** Logo que leva à matéria ou ao material público da história, quando há. */
function LogoComLink({ empresa }: { empresa: EmpresaDireta }) {
  const logo = <Logo cliente={empresa} className="max-h-12 max-w-[160px]" />
  if (!empresa.historia) return logo
  return (
    <LinkExterno href={empresa.historia.url} className="inline-block">
      {logo}
    </LinkExterno>
  )
}

/** As duas histórias mais recentes, em destaque, com o desenho de como funcionam. */
function Destaque({ empresa, invertido }: { empresa: EmpresaDireta; invertido?: boolean }) {
  const caso = casoDe(empresa)
  return (
    <article className="grid items-center gap-8 py-12 lg:grid-cols-12 lg:gap-12">
      <div className={`lg:col-span-5 ${invertido ? 'lg:order-2 lg:col-start-8' : ''}`}>
        <LogoComLink empresa={empresa} />
        <h3 className="mt-6 text-[1.6rem] leading-tight font-bold tracking-tight sm:text-[1.9rem]">
          {caso?.titulo ?? empresa.nome}
        </h3>
        <p className="mt-2 font-semibold text-cobalto">{empresa.papel}</p>
        {caso ? (
          <>
            <p className="prosa mt-4 text-[1.1rem] text-grafite">{caso.contexto}</p>
            <p className="prosa mt-3 text-[1.1rem]">{caso.feito}</p>
            <p className="mt-4 font-semibold">
              <span className="grifo">{caso.metrica}</span>
            </p>
            <p className="mt-3 text-[0.95rem] text-grafite">
              Fonte: <FonteLink fonte={caso.fonte} />
            </p>
          </>
        ) : (
          <p className="prosa mt-4 text-[1.1rem]">{empresa.feito}</p>
        )}
      </div>
      <div className={`min-w-0 rounded-lg border border-linha bg-folha p-4 sm:p-8 lg:col-span-7 ${invertido ? 'lg:order-1' : ''}`}>
        {empresa.slug === 'sicoob' ? (
          <DiagramaArquitetura id="sicoob" />
        ) : (
          <IlustracaoNoticia motivo="atendimento" rotulo="Atendimento ao cliente respondido por IA" />
        )}
      </div>
    </article>
  )
}

/** Uma linha por empresa: logo, papel, o que fiz e onde ler a história. */
function Linha({ empresa }: { empresa: EmpresaDireta }) {
  const caso = casoDe(empresa)
  return (
    <li className="grid gap-4 py-7 sm:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr_260px] lg:gap-10">
      <div className="flex items-center">
        <LogoComLink empresa={empresa} />
      </div>
      <div>
        <h3 className="text-[1.2rem] font-semibold">{empresa.nome}</h3>
        <p className="text-[0.98rem] font-medium text-cobalto">{empresa.papel}</p>
        <p className="prosa mt-2 max-w-[62ch] text-[1.08rem] text-grafite">{caso?.feito ?? empresa.feito}</p>
        {caso && <p className="mt-2 font-semibold">{caso.metrica}</p>}
      </div>
      {empresa.historia && (
        <p className="text-[0.95rem] text-grafite sm:col-start-2 lg:col-start-3 lg:text-right">
          <LinkExterno
            href={empresa.historia.url}
            className="underline decoration-linha decoration-2 underline-offset-4 hover:text-tinta hover:decoration-cobalto"
          >
            Ler no {empresa.historia.texto}
          </LinkExterno>
        </p>
      )}
    </li>
  )
}

/** Onde trabalhei: as empresas em que o projeto foi meu, cada uma ligada à sua história pública. */
export function Empresas() {
  const [primeira, segunda, ...resto] = empresasDiretas
  return (
    <section id="empresas" aria-labelledby="empresas-titulo" className="scroll-mt-24 border-t border-linha pt-16 pb-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <h2 id="empresas-titulo" className="text-[2.2rem] leading-none font-bold tracking-tight sm:text-[3rem] lg:col-span-6">
          Onde construí IA e chatbots
        </h2>
        <p className="prosa max-w-[52ch] text-[1.15rem] text-grafite lg:col-span-5 lg:col-start-8">
          Empresas em que o projeto foi meu. A logo leva à matéria ou ao material público que conta a história.
        </p>
      </div>
      <div className="divide-y divide-linha">
        <Destaque empresa={primeira} />
        <Destaque empresa={segunda} invertido />
      </div>
      <ul className="divide-y divide-linha border-t border-linha">
        {resto.map((e) => (
          <Linha key={e.slug} empresa={e} />
        ))}
      </ul>
    </section>
  )
}
