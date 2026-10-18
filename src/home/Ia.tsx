// Seção "IA e agentes" (18/10/2026, brief do dono). É o bloco que põe a especialidade no centro logo depois da
// prova, com o Pelo Solto como exemplo principal. O fundo escuro dá força à cor da marca e faz a captura do
// atendimento aparecer; o texto continua saindo de conteudo.ts, e a peça abre na mesma aba (ela tem volta própria).
import { caminhoPublico } from '../lib/assets'
import { conteudoHome } from './conteudo'

/** Terceiro bloco da home: o que é feito em IA e agentes, o exemplo do Pelo Solto e as provas reais. */
export function Ia() {
  const { ia } = conteudoHome()
  const base = import.meta.env.BASE_URL
  const href = caminhoPublico(base, ia.exemplo.href)
  return (
    <section id="ia" aria-labelledby="ia-titulo" className="secao ia">
      <div className="ia-painel">
        <div className="ia-topo">
          <p className="ia-rotulo">{ia.rotulo}</p>
          <h2 id="ia-titulo" className="ia-titulo alvo-secao">{ia.titulo}</h2>
          <p className="ia-lede">{ia.lede}</p>
        </div>

        <div className="ia-exemplo">
          <div className="ia-exemplo-texto">
            <p className="ia-exemplo-rotulo">
              <span>{ia.exemplo.rotulo}</span>
              <span aria-hidden="true"> · </span>
              {ia.exemplo.nome}
            </p>
            <h3>{ia.exemplo.titulo}</h3>
            <p>{ia.exemplo.texto}</p>
            <a className="cta toque ia-exemplo-cta" href={href}>
              {ia.exemplo.cta}
              <span className="seta" aria-hidden="true">→</span>
            </a>
          </div>
          <a className="ia-exemplo-tela toque" href={href} tabIndex={-1} aria-hidden="true">
            <span className="moldura-navegador">
              <span className="barra-janela"><i /><i /><i /></span>
              <img
                src={caminhoPublico(base, ia.exemplo.imagem)}
                width={1000}
                height={625}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </span>
          </a>
        </div>

        <div className="ia-frentes">
          <h3 className="ia-subtitulo">O que fazemos</h3>
          <ul>
            {ia.frentes.map((f, i) => (
              <li key={f.titulo}>
                <span className="ia-numero" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h4>{f.titulo}</h4>
                <p>{f.texto}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="ia-provas">
          <h3 className="ia-subtitulo">Provas</h3>
          <ul>
            {ia.provas.map((p) => (
              <li key={p.nome}>
                <p className="ia-prova-nome">{p.nome}</p>
                <p className="ia-prova-texto">{p.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
