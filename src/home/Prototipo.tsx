// Bloco 2: o diferencial. Em vez de proposta em texto, o protótipo navegável; o exemplo abre na mesma aba
// porque as peças de /trabalhos/ têm o próprio cabeçalho com volta.
import { caminhoPublico } from '../lib/assets'
import { conteudoHome } from './conteudo'
import { Marcacao } from './Marcacao'

const FRASE_MARCADA = 'antes de fechar'

/** Segundo bloco da home: "veja o seu sistema funcionando antes de fechar", com um exemplo clicável. */
export function Prototipo() {
  const { prototipo } = conteudoHome()
  const base = import.meta.env.BASE_URL
  const [antes, depois] = prototipo.titulo.split(FRASE_MARCADA)
  const href = caminhoPublico(base, prototipo.exemploHref)
  return (
    <section id="prototipo" className="secao grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-14">
      <div>
        <h2 className="titulo-bloco max-w-[18ch]">
          {antes}
          <Marcacao tipo="circulo" semente={2}>{FRASE_MARCADA}</Marcacao>
          {depois}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-grafite">{prototipo.texto}</p>
        <a className="link-secundario mt-8" href={href}>
          {prototipo.exemploRotulo}
          <span className="seta" aria-hidden="true">→</span>
        </a>
      </div>
      <a href={href} className="block rounded-[14px]" aria-label={prototipo.exemploRotulo}>
        <div className="moldura-navegador">
          <div className="barra-janela" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <img
            src={caminhoPublico(base, 'trabalhos/img/consultorio-exemplo.jpg')}
            width={1000}
            height={625}
            alt=""
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
      </a>
    </section>
  )
}
