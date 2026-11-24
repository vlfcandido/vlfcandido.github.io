// Bloco de criativo e vídeo na home (23/11/2026). A seção existia só como um link dentro da vitrine de telas, e o
// dono pediu que ela aparecesse na home: hoje é preciso procurar para achar. Quatro peças na frente — cliente e marca
// inventada misturados de propósito, porque o que vende é o vídeo — e a página completa em /trabalhos/criativo/.
import { caminhoPublico } from '../lib/assets'

interface Peca {
  slug: string
  nome: string
  linha: string
  formato: string
}

const PECAS: Peca[] = [
  {
    slug: 'viveras-life',
    nome: 'Viveras Life',
    linha: 'Imóveis para estudantes na Itália: o apartamento em 3D, o simulador de preço e a reserva.',
    formato: 'cliente · 16:9',
  },
  {
    slug: 'match5',
    nome: 'Match5',
    linha: 'Plataforma de campeonato: app do atleta e do público, agenda de provas e painel de quem organiza.',
    formato: 'cliente · 16:9',
  },
  {
    slug: 'reel-sainte-chapelle',
    nome: 'Sainte Chapelle',
    linha: 'Reel de viagem com narração em inglês, corte no ritmo da fala e legenda queimada.',
    formato: 'cliente · 9:16',
  },
  {
    slug: 'ugc-lume-skin',
    nome: 'Lumê Skin',
    linha: 'Depoimento no formato UGC, com apresentadora e voz geradas por IA, para uma marca inventada.',
    formato: 'marca inventada · 9:16',
  },
]

/**
 * Bloco de criativo e vídeo: quatro peças em cartão, com a duração e o formato, e o caminho para a página inteira.
 * As imagens são as capas 1000 × 625 da lista de trabalhos; o cartão leva à página da peça, que tem o vídeo.
 */
export function Criativos() {
  const base = import.meta.env.BASE_URL
  const verTodas = caminhoPublico(base, 'trabalhos/criativo/')
  return (
    <section id="criativos" aria-labelledby="criativos-titulo" className="secao criativos">
      <div className="criativos-topo">
        <h2 id="criativos-titulo" className="titulo-bloco alvo-secao">
          <span className="titulo-texto">Vídeo e criativo</span>
        </h2>
        <div>
          <p className="vitrine-lede">
            Anúncio, tutorial de sistema, apresentação de plataforma e reel: roteiro, captura, edição, narração e legenda
            feitos aqui. As peças de cliente saem com autorização deles.
          </p>
          <a className="cta toque vitrine-cta" href={verTodas}>
            Ver as peças de vídeo
            <span className="seta" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <ul className="criativos-grade">
        {PECAS.map((peca) => (
          <li key={peca.slug}>
            <a className="criativo-card toque" href={caminhoPublico(base, `trabalhos/criativo/${peca.slug}/`)}>
              <span className="criativo-tela">
                <img
                  src={caminhoPublico(base, `trabalhos/img/${peca.slug}.jpg`)}
                  width={1000}
                  height={625}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="criativo-play" aria-hidden="true">▶</span>
              </span>
              <span className="criativo-ficha">
                <span className="criativo-formato">{peca.formato}</span>
                <span className="criativo-nome">{peca.nome}</span>
                <span className="criativo-linha">{peca.linha}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
