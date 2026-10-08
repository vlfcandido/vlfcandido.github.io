import { noticias, type Noticia } from '../noticias'
import { IlustracaoNoticia } from './Ilustracoes'
import { LinkExterno } from './LinkExterno'

const DATA = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** Data por extenso ("17 de julho de 2026"), a partir do ISO. */
export function dataPorExtenso(iso: string): string {
  return DATA.format(new Date(`${iso}T00:00:00Z`))
}

/** Uma matéria: capa desenhada, veículo e data, título que leva à matéria e o que eu fiz. */
function Materia({ n, grande }: { n: Noticia; grande?: boolean }) {
  return (
    <article className={grande ? 'grid items-center gap-8 md:grid-cols-2 md:gap-12' : ''}>
      <div className="rounded-lg bg-folha p-5">
        <IlustracaoNoticia motivo={n.ilustracao} rotulo={`Ilustração: ${n.titulo}`} />
      </div>
      <div className={grande ? '' : 'mt-5'}>
        <p className="text-[0.95rem] text-grafite">
          {n.veiculo}, <time dateTime={n.data}>{dataPorExtenso(n.data)}</time>
        </p>
        <h3 className={`mt-2 leading-tight font-bold tracking-tight ${grande ? 'text-[1.9rem] sm:text-[2.3rem]' : 'text-[1.3rem]'}`}>
          <LinkExterno href={n.url} className="underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-cobalto">
            {n.titulo}
          </LinkExterno>
        </h3>
        <p className="prosa mt-3 text-[1.08rem] text-grafite">{n.papel}</p>
      </div>
    </article>
  )
}

/** Imprensa: matérias públicas sobre os projetos, a mais recente em destaque. */
export function Imprensa() {
  const [primeira, ...resto] = noticias
  return (
    <section id="imprensa" aria-labelledby="imprensa-titulo" className="scroll-mt-24 border-t border-linha py-16 sm:py-24">
      <h2 id="imprensa-titulo" className="text-[2.2rem] leading-none font-bold tracking-tight sm:text-[3rem]">
        Saiu na imprensa
      </h2>
      <div className="mt-10">
        <Materia n={primeira} grande />
      </div>
      <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {resto.map((n) => (
          <Materia key={n.id} n={n} />
        ))}
      </div>
    </section>
  )
}
