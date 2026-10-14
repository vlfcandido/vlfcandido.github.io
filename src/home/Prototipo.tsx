// Bloco 2: o diferencial. Em vez de proposta em texto, o protótipo navegável; o exemplo abre na mesma aba
// porque as peças de /trabalhos/ têm o próprio cabeçalho com volta. No PC, texto e miniatura lado a lado.
import { caminhoPublico } from '../lib/assets'
import { FRASES_MARCADAS, conteudoHome } from './conteudo'
import { partirNaFrase } from './lib/marcar'
import { Marcacao } from './Marcacao'

/** Segundo bloco da home: "veja o seu sistema funcionando antes de fechar", com um exemplo clicável. */
export function Prototipo() {
  const { prototipo } = conteudoHome()
  const base = import.meta.env.BASE_URL
  const titulo = partirNaFrase(prototipo.titulo, FRASES_MARCADAS.prototipo)
  const href = caminhoPublico(base, prototipo.exemploHref)
  return (
    <section id="prototipo" className="secao tela grid content-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10">
      <div>
        <h2 className="titulo-bloco">
          {titulo ? (
            <>
              {titulo.antes}
              <Marcacao tipo="circulo" semente={2}>
                {titulo.marcado}
              </Marcacao>
              {titulo.depois}
            </>
          ) : (
            prototipo.titulo
          )}
        </h2>
        <p className="mt-4 text-lg text-grafite lg:text-base">{prototipo.texto}</p>
        <a className="link-secundario toque mt-6" href={href}>
          {prototipo.exemploRotulo}
          <span className="seta" aria-hidden="true">→</span>
        </a>
      </div>
      <a href={href} className="toque block rounded-[var(--raio-m)]" tabIndex={-1} aria-hidden="true">
        <div className="moldura-navegador">
          <div className="barra-janela">
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
            className="imagem-reservada block aspect-[1000/625] h-auto w-full"
          />
        </div>
      </a>
    </section>
  )
}
