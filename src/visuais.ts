import type { IdDesenho } from './diagramas/desenhos'

// Imagens do site: prints de produto e diagramas desenhados à mão.
// Os textos dos casos ficam em conteudo.ts; aqui só o que é visual, ligado pelo `slug`.

/**
 * Print de uma tela de projeto, em `public/prints/`. Com `variantes`, o site monta um `<picture>` com AVIF e
 * WebP em larguras responsivas; sem elas, usa só o `arquivo` (WebP único, caso dos prints antigos).
 */
export interface Print {
  /** WebP de reserva (a maior largura). */
  arquivo: string
  alt: string
  variantes?: {
    /** Caminho sem largura nem extensão, ex.: `prints/aprovaos-hoje-d`. */
    base: string
    /** Larguras geradas em AVIF e WebP, da menor para a maior. */
    larguras: number[]
    /** Largura e altura do original, para reservar o espaço e evitar salto de layout. */
    largura: number
    altura: number
  }
  /** `true` quando a tela mostra dado inventado: a página põe o selo "dados fictícios" sobre ela. */
  ficticio?: boolean
  /** `true` para tela de celular (retrato), exibida sem cortar. */
  movel?: boolean
}

/** Ilustração-diagrama de um projeto (os desenhos ficam em diagramas/desenhos.ts). */
export type Diagrama = IdDesenho

/**
 * Monta o print de uma tela recriada (gerada por `scripts/otimizar-imagens.sh`). Todas têm dado fictício.
 *
 * @param base nome-base sem largura, ex.: `aprovaos-hoje-d` (sufixo `-d` desktop, `-m` celular).
 * @param alt descrição da tela para leitor de tela.
 */
function tela(base: string, alt: string): Print {
  const movel = base.endsWith('-m')
  const larguras = movel ? [390, 780] : [960, 1600]
  const [largura, altura] = movel ? [780, 1688] : [2880, 1800]
  return {
    arquivo: `prints/${base}-${larguras[larguras.length - 1]}.webp`,
    alt,
    variantes: { base: `prints/${base}`, larguras, largura, altura },
    ficticio: true,
    movel,
  }
}

/**
 * Telas de cada caso, pelo slug de conteudo.ts, recriadas em 08/10/2026 com dados fictícios (substituem os
 * prints antigos). A primeira é a principal.
 */
export const printsDosCasos: Record<string, Print[]> = {
  aprovaos: [
    tela('aprovaos-questao-d', 'AprovaOS: questão de licitações com o motivo da escolha e a margem de erro por matéria'),
    tela('aprovaos-painel-d', 'AprovaOS: painel da curva de aprovação, com o desempenho por matéria'),
    tela('aprovaos-hoje-d', 'AprovaOS: plano do dia, 2h10 em 5 blocos, com o porquê de cada escolha'),
    tela('aprovaos-hoje-m', 'AprovaOS no celular: plano do dia em blocos de estudo'),
  ],
  'nexus-quant': [
    tela('nexus-quant-controle-d', 'Sistema de ordens em simulação: sala de controle com os pares, as ordens e o estado do sistema'),
    tela('nexus-quant-ciclos-d', 'Sistema de ordens em simulação: ciclos, com o resultado por par'),
    tela('nexus-quant-reconciliacao-d', 'Sistema de ordens em simulação: reconciliação de cada ordem com a corretora'),
  ],
  'varredura-voos': [
    tela('varredura-voos-varredura-d', 'Terminal com o resultado da varredura de voos ordenado por preço, com a cota da API ao lado'),
    tela('varredura-voos-simular-d', 'Terminal com a simulação da cota de chamadas da API antes da busca'),
  ],
  'app-score': [
    tela('app-score-consultar-m', 'App de score no celular: consulta do cliente, com o medidor marcando 742 de 1000'),
    tela('app-score-calculo-m', 'App de score no celular: tela "como foi calculado", com o peso de cada evento'),
    tela('app-score-reportar-m', 'App de score no celular: tela para reportar um evento de pagamento'),
  ],
  'engenharia-de-agentes': [
    tela('engenharia-de-agentes-comparar-d', 'Bancada de agentes: o mesmo agente em três frameworks, lado a lado'),
    tela('engenharia-de-agentes-injecao-d', 'Bancada de agentes: teste de defesa contra prompt injection'),
  ],
  'revisor-ia': [
    tela('revisor-ia-revisao-d', 'Revisor de código com IA: a revisão de um pedido de mudança, com os comentários'),
    tela('revisor-ia-avaliacao-d', 'Revisor de código com IA: avaliação das revisões geradas'),
  ],
  'ia-local': [
    tela('ia-local-aprovacao-d', 'IA local: janela de aprovação humana que mostra o comando completo antes de executar'),
    tela('ia-local-auditoria-d', 'IA local: log de auditoria com horário, comando e código de saída'),
  ],
  'benchmark-litellm': [
    tela('benchmark-litellm-resultado-d', 'Bancada LiteLLM: resultado do cenário com streaming, latência e custo'),
    tela('benchmark-litellm-execucao-d', 'Bancada LiteLLM: execução do benchmark em andamento'),
  ],
}

/**
 * Capa de um card, em `public/img/<nome>-<largura>.<ext>` (AVIF, WebP e JPEG).
 * As capas antigas eram ilustrações de papel (tratamento `.carta`); as de 08/10/2026 são coloridas e
 * levam `colorida: true`, sem filtro nenhum.
 */
export interface Capa {
  nome: string
  /** Larguras geradas em AVIF, WebP e JPEG, da menor para a maior. */
  larguras: number[]
  /** Proporção largura/altura do original. */
  razao: number
  alt: string
  /**
   * Nome da versão desenhada para o tema escuro, nas mesmas larguras e formatos. Com ela, a capa troca
   * de arquivo conforme o tema em vez de inverter as cores pelo filtro das cartas náuticas.
   */
  escuro?: string
  /** Capa colorida de tela recriada: aparece igual nos dois temas, sem o tratamento das cartas. */
  colorida?: boolean
  /** Mostra o selo "dados fictícios" sobre a capa. */
  ficticio?: boolean
}

/** Capa recriada em 08/10/2026 (1600x1000 e 1200x750 em PNG; geradas em 640, 1040 e 1200). */
const capaColorida = (slug: string, alt: string): Capa => ({
  nome: `capa-${slug}`,
  larguras: [640, 1040, 1200],
  razao: 1.6,
  alt,
  colorida: true,
  ficticio: true,
})

/** Capas por slug da galeria de projetos. */
export const capasDosProjetos: Record<string, Capa> = {
  ecovita: {
    nome: 'roleta',
    larguras: [640, 1040, 1312],
    razao: 1312 / 816,
    alt: 'Ilustração isométrica: contatos chegando por vários celulares a uma roleta central que distribui cada um para um corretor na sua mesa, com um painel de acompanhamento ao fundo',
  },
  'prefeitura-franca': {
    nome: 'farol',
    larguras: [640, 1040, 1312],
    razao: 1312 / 816,
    alt: 'Ilustração em traço: um farol aponta para dois balões de conversa sobre as curvas de profundidade de uma carta náutica',
  },
  // As capas dos projetos próprios foram trocadas em 08/10/2026 pelas telas recriadas. A de ia-local era um
  // SVG de carta náutica com versão escura (ia-local-escuro); saiu junto com os arquivos.
  aprovaos: capaColorida('aprovaos', 'Capa do AprovaOS: telas do plano de estudo que se ajusta ao desempenho, com dados fictícios'),
  'nexus-quant': capaColorida('nexus-quant', 'Capa do sistema de ordens em tempo real: sala de controle em simulação, com dados fictícios'),
  'varredura-voos': capaColorida('varredura-voos', 'Capa da varredura de voos: terminal com ofertas ordenadas por preço, com dados fictícios'),
  'app-score': capaColorida('app-score', 'Capa do app de score de crédito: três telas de celular com o medidor e o cálculo da nota, com dados fictícios'),
  'engenharia-de-agentes': capaColorida('engenharia-de-agentes', 'Capa da bancada de agentes: o mesmo agente em três frameworks, com dados fictícios'),
  'revisor-ia': capaColorida('revisor-ia', 'Capa do revisor de código com IA: revisão e avaliação, com dados fictícios'),
  'ia-local': capaColorida('ia-local', 'Capa da IA local: janela de aprovação humana e log de auditoria, com dados fictícios'),
  'benchmark-litellm': capaColorida('benchmark-litellm', 'Capa do benchmark de gateway de IA: latência, erros e custo, com dados fictícios'),
}

/** Diagrama por caso, quando existe. */
export const diagramasDosCasos: Record<string, Diagrama> = {
  'nexus-quant': 'nexus-quant',
  aprovaos: 'aprovaos',
  'varredura-voos': 'varredura-voos',
  'revisor-ia': 'agente-rag',
  'engenharia-de-agentes': 'agente-ferramentas',
  sicoob: 'sicoob',
  ecovita: 'ecovita',
  minu: 'minu',
  'ia-local': 'ia-local',
}

/** Endereço do perfil no LinkedIn: a porta de entrada do site, num único lugar. */
export const LINKEDIN = 'https://www.linkedin.com/in/viniciusf-candido'
export const GITHUB = 'https://github.com/vlfcandido'
