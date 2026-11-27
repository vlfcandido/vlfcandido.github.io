// Mural "O que você precisa" (26/11/2026): as oito demandas das capas do perfil no 99Freelas, ilustradas.
// Cada capa tem o título em Fraunces com o grifo de marca-texto na segunda linha, a frase em Inter e um desenho em
// SVG de verdade (lib/desenhos.ts), na paleta do próprio site: os fundos alternam tinta, papel e sol. A capa inteira
// é o link para a peça que prova a demanda. 4 colunas no PC, 2 no celular.
// Histórico do mesmo dia: a primeira versão era um mural de cartazes de rua (cor chapada, Archivo condensada em
// caixa alta, um objeto em CSS e a linha ajustada à largura por ResizeObserver). O dono reprovou e pediu os
// desenhos ilustrados numa paleta só com o site; a Archivo saiu junto.
import { caminhoPublico } from '../lib/assets'
import { DEMANDAS, conteudoHome, destinoDaDemanda, type Demanda } from './conteudo'
import { desenhoDaDemanda } from './lib/desenhos'

/**
 * Uma capa do mural: o link inteiro, com o título em duas linhas, a frase e o desenho.
 *
 * @param props.demanda a demanda de `DEMANDAS`.
 */
function Capa({ demanda }: { demanda: Demanda }) {
  const destino = destinoDaDemanda(demanda)
  // Hash da galeria (#/projetos/...) fica como está; peça de /trabalhos/ ganha a base do site.
  const href = destino.startsWith('#') ? destino : caminhoPublico(import.meta.env.BASE_URL, destino)
  return (
    <a className={`capa capa-${demanda.fundo}`} href={href} data-demanda={demanda.id}>
      <span className="capa-folha">
        <h3 className="capa-titulo">
          <span>{demanda.titulo[0]}</span>{' '}
          <mark className="capa-grifo">{demanda.titulo[1]}</mark>
        </h3>
        <span className="capa-frase">{demanda.frase}</span>
        {/* O desenho é enfeite e fica fora da leitura. O miolo é texto fixo de lib/desenhos.ts, sem dado de fora. */}
        <svg
          className="capa-desenho"
          viewBox="0 0 960 660"
          aria-hidden="true"
          focusable="false"
          dangerouslySetInnerHTML={{ __html: desenhoDaDemanda(demanda.id) }}
        />
        <span className="sr-only">. {demanda.destino}</span>
      </span>
    </a>
  )
}

/** Segundo bloco da home: o mural das oito demandas, cada capa levando à peça que a prova. */
export function Mural() {
  const { mural } = conteudoHome()
  return (
    <section id="demandas" aria-labelledby="demandas-titulo" className="secao mural">
      <div className="mural-topo">
        <h2 id="demandas-titulo" className="titulo-bloco alvo-secao">
          <span className="titulo-texto">{mural.titulo}</span>
        </h2>
        <p className="vitrine-lede">
          <span className="so-toque">{mural.lede.toque}</span>
          <span className="so-clique">{mural.lede.clique}</span>
        </p>
      </div>
      <ul className="mural-grade">
        {DEMANDAS.map((d) => (
          <li key={d.id}>
            <Capa demanda={d} />
          </li>
        ))}
      </ul>
    </section>
  )
}
