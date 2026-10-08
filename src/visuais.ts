// Imagens do site: prints de produto, diagramas desenhados à mão e fotos livres.
// Os textos dos casos ficam em conteudo.ts; aqui só o que é visual, ligado pelo `slug`.

/** Print de uma tela real (ou redesenho fiel) de um projeto, em `public/prints/`. */
export interface Print {
  arquivo: string
  alt: string
}

/** Diagramas de arquitetura desenhados em SVG para os projetos com mais peças. */
export type Diagrama = 'nexus-quant' | 'nexus-clips' | 'sicoob'

/** Foto de banco livre, baixada para `public/img/`, com crédito obrigatório no rodapé. */
export interface Foto {
  arquivo: string
  alt: string
  autor: string
  origem: string
  licenca: string
  url: string
}

/** Repositório público que não tem caso próprio em conteudo.ts, exibido na galeria. */
export interface Repositorio {
  nome: string
  descricao: string
  url: string
  print: Print
}

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
  'bureau-credito': [
    { arquivo: 'prints/bureau-credito.webp', alt: 'Consulta de score no app do bureau de crédito com a auditoria do cálculo aberta, dados fictícios' },
  ],
  'revisor-ia': [
    { arquivo: 'prints/revisor-ia.webp', alt: 'Relatório do revisor de código com os comentários e a nota da avaliação' },
  ],
}

/** Diagrama por caso, quando existe. */
export const diagramasDosCasos: Record<string, Diagrama> = {
  'nexus-quant': 'nexus-quant',
  'nexus-clips': 'nexus-clips',
}

/** Outros repositórios públicos, cada um com o print da sua melhor tela. */
export const repositorios: Repositorio[] = [
  {
    nome: 'bot-pedidos-whatsapp-llm',
    descricao: 'Bot de pedidos por WhatsApp com roteador LLM, agentes com tools Pydantic e transbordo humano.',
    url: 'https://github.com/vlfcandido/bot-pedidos-whatsapp-llm',
    print: { arquivo: 'prints/bot-pedidos-whatsapp-llm.webp', alt: 'Conversa de pedido no WhatsApp atendida pelo bot' },
  },
  {
    nome: 'engenharia-de-agentes',
    descricao: 'O mesmo agente em Pydantic puro, LangGraph e Google ADK, mais versões multiagente, rodando offline.',
    url: 'https://github.com/vlfcandido/engenharia-de-agentes',
    print: { arquivo: 'prints/engenharia-de-agentes.webp', alt: 'Comparação do mesmo agente em três frameworks' },
  },
  {
    nome: 'benchmark-litellm-sdk-proxy',
    descricao: 'Latência, tempo até o primeiro token, erros e custo: LiteLLM SDK contra LiteLLM Proxy.',
    url: 'https://github.com/vlfcandido/benchmark-litellm-sdk-proxy',
    print: { arquivo: 'prints/benchmark-litellm-sdk-proxy.webp', alt: 'Painel do benchmark com gráficos de latência e custo' },
  },
  {
    nome: 'varredura-voos',
    descricao: 'Busca de passagens que prioriza a duração da viagem, não só o preço.',
    url: 'https://github.com/vlfcandido/varredura-voos',
    print: { arquivo: 'prints/varredura-voos.webp', alt: 'Terminal com o resultado da varredura de voos ordenado por duração' },
  },
  {
    nome: 'previsao-tempo-chatbot',
    descricao: 'Microsserviço que entrega a previsão de 3 dias num JSON enxuto para chatbots.',
    url: 'https://github.com/vlfcandido/previsao-tempo-chatbot',
    print: { arquivo: 'prints/previsao-tempo-chatbot.webp', alt: 'Conversa de chatbot respondendo a previsão do tempo' },
  },
  {
    nome: 'api-intervalo-premios-filmes',
    descricao: 'API REST em Node.js que calcula o menor e o maior intervalo entre prêmios de produtores.',
    url: 'https://github.com/vlfcandido/api-intervalo-premios-filmes',
    print: { arquivo: 'prints/api-intervalo-premios-filmes.webp', alt: 'Documentação da API com a resposta de intervalos entre prêmios' },
  },
]

/** Fotos livres usadas no site. */
export const fotos = {
  quadro: {
    arquivo: 'img/quadro-branco.jpg',
    alt: 'Mão desenhando um fluxograma de telas num quadro branco',
    autor: 'Christina Morillo',
    origem: 'StockSnap',
    licenca: 'CC0',
    url: 'https://stocksnap.io/photo/whiteboard-webdesign-NUEH6AWK1X',
  },
} satisfies Record<string, Foto>

/** Endereço do perfil no LinkedIn: a porta de entrada do site, num único lugar. */
export const LINKEDIN = 'https://www.linkedin.com/in/viniciusf-candido'
export const GITHUB = 'https://github.com/vlfcandido'
