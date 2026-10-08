import type { IdDesenho } from './diagramas/desenhos'

// Imagens do site: prints de produto e diagramas desenhados à mão.
// Os textos dos casos ficam em conteudo.ts; aqui só o que é visual, ligado pelo `slug`.

/** Print de uma tela real (ou redesenho fiel) de um projeto, em `public/prints/`. */
export interface Print {
  arquivo: string
  alt: string
}

/** Ilustração-diagrama de um projeto (os desenhos ficam em diagramas/desenhos.ts). */
export type Diagrama = IdDesenho

/** Prints de cada caso, pelo slug de conteudo.ts. O primeiro é o principal. */
export const printsDosCasos: Record<string, Print[]> = {
  'nexus-quant': [
    { arquivo: 'prints/nexus-quant.webp', alt: 'Painel do sistema de ordens em tempo real, em simulação, com os pares, o livro de ofertas e as ordens' },
    { arquivo: 'prints/nexus-quant-backtest.webp', alt: 'Tela de ciclos do bot em simulação com o resultado por par' },
  ],
  aprovaos: [
    { arquivo: 'prints/aprovaos.webp', alt: 'Diagnóstico adaptativo do AprovaOS com a questão, o motivo da escolha e a margem de erro por matéria' },
    { arquivo: 'prints/aprovaos-plano.webp', alt: 'Plano do dia do AprovaOS com os blocos de estudo e o porquê de cada escolha' },
  ],
  'revisor-ia': [
    { arquivo: 'prints/revisor-ia.webp', alt: 'Relatório do revisor de código com os comentários e a nota da avaliação' },
  ],
}

/**
 * Ilustração de capa de um card (gerada com IA por ele e editada), em `public/img/<nome>-<largura>.<ext>`.
 * O papel foi clareado até o branco, como nas cartas náuticas, para o mesmo tratamento no tema escuro.
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
}

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
  // Desenhada em SVG nas duas versões (claro e escuro) e rasterizada com o Chromium do Playwright.
  'ia-local': {
    nome: 'ia-local',
    escuro: 'ia-local-escuro',
    larguras: [640, 1040, 1312],
    razao: 800 / 500,
    alt: 'Ilustração em traço de carta náutica: um farol protege o porto e, na base, o fluxo pedido, aprovação humana, execução local e auditoria',
  },
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
