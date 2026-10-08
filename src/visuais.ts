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
    { arquivo: 'prints/nexus-quant.webp', alt: 'Painel do bot de trading em simulação com pares, livro de ofertas, curva de patrimônio e trades' },
    { arquivo: 'prints/nexus-quant-backtest.webp', alt: 'Tela de ciclos do bot em simulação com o resultado por par' },
  ],
  'nexus-clips': [
    { arquivo: 'prints/nexus-clips.webp', alt: 'Painel do agente de vídeos com totais, vídeos por dia, atividade por hora e contas conectadas' },
  ],
  aprovaos: [
    { arquivo: 'prints/aprovaos.webp', alt: 'Diagnóstico adaptativo do AprovaOS com a questão, o motivo da escolha e a margem de erro por matéria' },
    { arquivo: 'prints/aprovaos-plano.webp', alt: 'Plano do dia do AprovaOS com os blocos de estudo e o porquê de cada escolha' },
  ],
  'revisor-ia': [
    { arquivo: 'prints/revisor-ia.webp', alt: 'Relatório do revisor de código com os comentários e a nota da avaliação' },
  ],
}

/** Diagrama por caso, quando existe. */
export const diagramasDosCasos: Record<string, Diagrama> = {
  'nexus-quant': 'nexus-quant',
  'nexus-clips': 'nexus-clips',
  aprovaos: 'aprovaos',
  'varredura-voos': 'varredura-voos',
  'revisor-ia': 'agente-rag',
  'engenharia-de-agentes': 'agente-ferramentas',
  sicoob: 'sicoob',
  ecovita: 'ecovita',
  minu: 'minu',
}

/** Endereço do perfil no LinkedIn: a porta de entrada do site, num único lugar. */
export const LINKEDIN = 'https://www.linkedin.com/in/viniciusf-candido'
export const GITHUB = 'https://github.com/vlfcandido'
