import { cases, type Case } from '../conteudo'
import { diagramasDosCasos, printsDosCasos, repositorios } from '../visuais'
import { DiagramaArquitetura } from './Diagramas'
import { FonteLink } from './FonteLink'
import { LinkExterno } from './LinkExterno'
import { Print } from './Print'

/** Casos com produto para mostrar: os que têm print. Os públicos de agência vão para Clientes. */
const comPrint = cases.filter((c) => printsDosCasos[c.slug]?.length)

/** Texto de um estudo de caso: problema, o que fiz, resultado com fonte e stack em linha. */
function TextoCaso({ item }: { item: Case }) {
  return (
    <div className="max-w-[46ch]">
      <h3 id={`caso-${item.slug}`} className="text-[1.6rem] leading-[1.2] font-bold tracking-[0.004em] sm:text-[1.9rem]">{item.titulo}</h3>
      <p className="prosa mt-4 text-[1.1rem] text-grafite">{item.contexto}</p>
      <p className="prosa mt-3 text-[1.1rem]">{item.feito}</p>
      <p className="mt-4 text-[1.05rem] font-semibold">
        <span className="grifo">{item.metrica}</span>
      </p>
      <p className="mt-3 text-[0.95rem] text-grafite">
        Fonte: <FonteLink fonte={item.fonte} />
      </p>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-grafite">
        <span className="font-semibold text-tinta">Feito com </span>
        {item.stack.join(', ')}.
      </p>
    </div>
  )
}

/** Um estudo de caso: print grande do produto real, alternando de lado, e o diagrama quando há. */
function EstudoDeCaso({ item, indice }: { item: Case; indice: number }) {
  const prints = printsDosCasos[item.slug]
  const diagrama = diagramasDosCasos[item.slug]
  const invertido = indice % 2 === 1
  return (
    <article aria-labelledby={`caso-${item.slug}`} className="py-14 sm:py-20">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className={`lg:col-span-8 ${invertido ? 'lg:order-2' : ''}`}>
          <div className="relative">
            <Print print={prints[0]} />
            {prints[1] && (
              <Print
                print={prints[1]}
                className={`mt-6 w-[62%]! sm:absolute sm:-bottom-12 sm:mt-0 ${invertido ? 'sm:-left-6' : 'sm:-right-6'}`}
              />
            )}
          </div>
        </div>
        <div className={`lg:col-span-4 ${invertido ? 'lg:order-1' : ''} ${prints[1] ? 'sm:pt-10 lg:pt-0' : ''}`}>
          <TextoCaso item={item} />
        </div>
      </div>
      {diagrama && (
        <div className="mt-16 grid min-w-0 gap-6 rounded-lg border border-linha bg-folha p-4 sm:p-8 lg:grid-cols-12">
          <p className="text-[1.05rem] font-semibold lg:col-span-3">Como as peças conversam</p>
          <div className="min-w-0 lg:col-span-9">
            <DiagramaArquitetura id={diagrama} />
          </div>
        </div>
      )}
    </article>
  )
}

/** Projetos: estudos de caso com o produto real e, depois, a galeria dos outros repositórios. */
export function Projetos() {
  return (
    <section id="projetos" aria-labelledby="projetos-titulo" className="scroll-mt-24 border-t border-linha pt-16">
      <div className="grid gap-4 lg:grid-cols-12">
        <h2 id="projetos-titulo" className="text-[2.2rem] leading-[1.12] font-bold tracking-[0.004em] sm:text-[3rem] lg:col-span-5">
          Projetos, com a tela de verdade
        </h2>
        <p className="prosa max-w-[56ch] text-[1.15rem] text-grafite lg:col-span-6 lg:col-start-7">
          Cada imagem abaixo é o produto rodando, com dados fictícios no lugar dos reais. Onde há muitas peças, o
          desenho mostra como elas se ligam.
        </p>
      </div>

      <div className="divide-y divide-linha">
        {comPrint.map((c, i) => (
          <EstudoDeCaso key={c.slug} item={c} indice={i} />
        ))}
      </div>

      <div className="border-t border-linha pt-14 pb-6">
        <h3 className="text-[1.6rem] font-bold tracking-[0.004em]">Mais código aberto</h3>
        <p className="prosa mt-2 max-w-[60ch] text-grafite">
          Repositórios menores, cada um resolvendo um problema só. Todos com testes e README.
        </p>
        <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {repositorios.map((r, i) => (
            <li key={r.nome} className={i % 3 === 1 ? 'lg:mt-10' : ''}>
              <LinkExterno href={r.url} className="group block">
                <Print print={r.print} />
                <span className="mt-5 block text-[1.1rem] font-semibold group-hover:text-cobalto">{r.nome}</span>
                <span className="prosa mt-1 block text-grafite">{r.descricao}</span>
              </LinkExterno>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
