// Galeria da página de projetos: um item por card, com o tipo (para o filtro) e o status honesto.
// O status não aparece no site desde 07/10/2026 (pedido dele: sem selo de MVP, estudo etc.); fica aqui
// só para os testes garantirem que nenhum texto de projeto próprio afirma produção, cliente ou lucro.
// Os textos vêm de conteudo.ts e clientes.ts; aqui só entra o que a galeria precisa a mais. Os números
// dos projetos próprios saem do banco de provas (medidos em 07/10/2026). Nada de projeto que o banco
// de provas manda não citar (ex.: o bot de pedidos, que não sobe), nem de lucro em operação de mercado.

import { empresasDiretas, type EmpresaDireta, type SlugEmpregador } from './clientes'
import { cases, type Case, type Fonte } from './conteudo'
import { capasDosProjetos, diagramasDosCasos, printsDosCasos, type Capa, type Diagrama, type Print } from './visuais'

/** Tipo de projeto, usado pelos chips de filtro. */
export type TipoProjeto = 'chatbot' | 'agentes' | 'sistemas' | 'frontend' | 'integracoes' | 'dados'

/** Rótulo de cada tipo, na ordem dos chips. */
// Ordem e nome do último trocados em 08/10/2026 (M15). Antes: chatbot, agentes, sistemas, frontend,
// integracoes, dados (rótulo antigo trocado por "Dados e tempo real").
export const tiposProjeto: Record<TipoProjeto, string> = {
  integracoes: 'Integrações e automação',
  sistemas: 'Sistemas e SaaS',
  frontend: 'Frontend e dashboards',
  chatbot: 'Chatbot e atendimento',
  agentes: 'Agentes de IA',
  dados: 'Dados e tempo real',
}

/** Situação real do projeto hoje. */
export type StatusProjeto = 'producao' | 'mvp' | 'prototipo' | 'estudo'

/** Um card da galeria e o conteúdo do painel que ele abre. */
export interface ItemProjeto {
  /** Também é o fim da rota compartilhável: `#/projetos/<slug>`. */
  slug: string
  /** `proprio` vai para a galeria; `empresa`, para a faixa "Em empresas". */
  origem: 'proprio' | 'empresa'
  /**
   * `true` quando ele só participou do projeto, sem liderar (decisão dele, 08/10/2026: Ecovita e Minu).
   * Vai para "Outros projetos em empresas", no fim da página, sem destaque.
   */
  participacao?: boolean
  nome: string
  /** Uma linha de resultado, em linguagem de negócio. */
  resultado: string
  tipos: TipoProjeto[]
  status: StatusProjeto
  /** Duas a quatro etiquetas de tecnologia para o card; a lista completa vai no painel. */
  etiquetas: string[]
  stack: string[]
  problema?: string
  feito: string
  /** Números que dá para conferir (testes, volume), um por linha. */
  numeros: string[]
  /** Papel na empresa, nos casos de empresa. */
  papel?: string
  print?: Print
  /** Segundo print, mostrado só no painel. */
  printExtra?: Print
  /** Todas as telas do projeto (08/10/2026), na ordem; a primeira é `print`. */
  telas?: Print[]
  /** Slug da empresa em `clientes.ts`, para a logo dos casos de empresa. */
  empresa?: string
  /**
   * Empresa onde ele trabalhava quando fez o caso, da fonte única `ONDE_TRABALHEI` (15/10/2026). Quando difere de
   * `empresa` (cliente atendido pela Vertigo), o cartão diz de quem era o cliente.
   */
  contratante?: SlugEmpregador
  diagrama?: Diagrama
  /** Ilustração de capa, para projeto sem tela própria: vira a frente do card e o topo do painel. */
  capa?: Capa
  /** Repositório público, quando há. */
  repositorio?: string
  /** Matéria ou material público que conta a história. */
  fonte?: Fonte
}

const caso = (slug: string): Case => {
  const c = cases.find((x) => x.slug === slug)
  if (!c) throw new Error(`caso ausente em conteudo.ts: ${slug}`)
  return c
}

const empresa = (slug: string): EmpresaDireta => {
  const e = empresasDiretas.find((x) => x.slug === slug)
  if (!e) throw new Error(`empresa ausente em clientes.ts: ${slug}`)
  return e
}

const prints = (slug: string) => printsDosCasos[slug] ?? []

/**
 * Quantos projetos o print de "Este site" (public/prints/este-site.webp) mostra na prova da home. 18/10/2026: a peça
 * do atendimento com IA subiu a contagem de 25 para 26, e o print foi recapturado da home em 1440x900 (1600x1000).
 */
export const PROJETOS_NO_PRINT_ESTE_SITE = 26

/**
 * Monta a lista da galeria. É função (e não constante) para nada rodar quando o módulo é importado.
 *
 * @returns os projetos próprios e os casos de empresa, na ordem em que aparecem.
 */
export function listarProjetos(): ItemProjeto[] {
  const quant = caso('nexus-quant')
  const aprova = caso('aprovaos')
  const revisor = caso('revisor-ia')
  const sicoob = caso('sicoob-investimentos')
  const vendas = caso('contabilizei-vendas')
  const franca = caso('prefeitura-franca')
  const araguaia = caso('araguaia')
  const waizer = caso('waizer-wiv')

  return [
    // Ordem de 08/10/2026 (M13 e M12 do juiz). Próprios por prova medida > aderência às ofertas > estágio;
    // casos de empresa com fonte primeiro. Ordem anterior: aprovaos, nexus-quant, ia-local, app-score, este-site,
    // design-system-mare, revisor-ia, varredura-voos, engenharia-de-agentes, benchmark-litellm; sicoob, contabilizei,
    // prefeitura-franca, araguaia, wiv, ecovita, minu, serasa-experian. Serasa saiu da galeria por decisão dele
    // (08/10/2026): fica na seção Carreira. Ecovita e Minu: só participação, em "Outros projetos em empresas".
    {
      slug: 'aprovaos',
      origem: 'proprio',
      nome: 'AprovaOS',
      resultado: 'Plano de estudo que se ajusta ao desempenho de cada aluno.',
      tipos: ['sistemas', 'agentes', 'frontend'],
      status: 'mvp',
      etiquetas: ['FastAPI', 'Google ADK', 'Gemini'],
      stack: aprova.stack,
      problema: aprova.contexto,
      feito: aprova.feito,
      numeros: ['Mais de 1.600 testes automáticos', '53 decisões de arquitetura documentadas', 'MVP em desenvolvimento, sem usuário pagante'],
      print: prints('aprovaos')[0],
      printExtra: prints('aprovaos')[1],
      telas: prints('aprovaos'),
      capa: capasDosProjetos.aprovaos,
      diagrama: diagramasDosCasos.aprovaos,
      repositorio: 'https://github.com/vlfcandido/aprovaos',
    },
    {
      slug: 'nexus-quant',
      origem: 'proprio',
      // Renomeado em 08/10/2026 (M13): antes o nome era o de um robô de cripto, com o resultado "Confere cada ordem
      // com a corretora, 24 horas, sem erro de conta.". O status honesto fica à vista no card.
      nome: 'Sistema de ordens em tempo real',
      // 14/10/2026 (fix final): antes 'Confere cada ordem com a corretora, 24 horas. Cripto, só em simulação, sem lucro.',
      // frase truncada que o leigo não entendia.
      resultado: 'Confere cada ordem de cripto com a corretora. Só em simulação, sem dinheiro de verdade.',
      tipos: ['dados', 'integracoes', 'frontend'],
      status: 'estudo',
      etiquetas: ['Python', 'Redis Streams', 'Next.js'],
      stack: quant.stack,
      problema: quant.contexto,
      feito: quant.feito,
      numeros: ['1.060 testes automáticos passando', 'Roda só em simulação, sem dinheiro de verdade', 'A vitrine mostra o que deu errado, inclusive as taxas'],
      print: prints('nexus-quant')[0],
      printExtra: prints('nexus-quant')[1],
      telas: prints('nexus-quant'),
      capa: capasDosProjetos['nexus-quant'],
      diagrama: diagramasDosCasos['nexus-quant'],
      repositorio: 'https://github.com/vlfcandido/nexus-quant-showcase',
    },
    {
      slug: 'varredura-voos',
      origem: 'proprio',
      nome: 'Varredura de voos',
      // Corrigido em 08/10/2026: o ranking é por PREÇO (como no código), dentro de um teto de duração por perna.
      // Antes: 'Acha a passagem mais curta, não só a mais barata.' e "prioriza a duração da viagem".
      resultado: 'Acha a passagem mais barata dentro de um teto de duração, sem estourar a cota da API.',
      tipos: ['integracoes'],
      status: 'mvp',
      etiquetas: ['Python', 'API Amadeus', 'cache'],
      stack: ['Python', 'API Amadeus', 'cache', 'controle de cota', 'rate limit'],
      feito: 'Busca de passagens integrada à API da Amadeus, com controle de cota, cache e limite de chamadas, que ordena o resultado por preço e descarta o que passa do teto de duração de cada perna.',
      numeros: ['109 testes automáticos', 'MVP de uso pessoal'],
      print: prints('varredura-voos')[0],
      printExtra: prints('varredura-voos')[1],
      telas: prints('varredura-voos'),
      capa: capasDosProjetos['varredura-voos'],
      diagrama: diagramasDosCasos['varredura-voos'],
      repositorio: 'https://github.com/vlfcandido/varredura-voos',
    },
    {
      slug: 'app-score',
      origem: 'proprio',
      nome: 'App de score de crédito',
      resultado: 'O lojista vê a nota do cliente e entende como ela foi calculada.',
      tipos: ['frontend', 'sistemas'],
      status: 'prototipo',
      etiquetas: ['Next.js', 'TypeScript', 'Tailwind'],
      stack: ['Next.js 14', 'React', 'TypeScript', 'Tailwind', 'PWA', 'FastAPI', 'PostgreSQL'],
      problema: 'Quem vende a prazo precisa decidir na hora, no balcão, se aquele cliente costuma pagar em dia.',
      feito:
        'App web que abre no celular como aplicativo: o lojista consulta o cliente, vê a nota num medidor e abre "como esta pontuação foi calculada", com o peso de cada pagamento, atraso e quitação. Rotas protegidas por login e tipos iguais aos do servidor.',
      numeros: ['41 testes no cálculo da nota', 'Prova de conceito, sem cliente', 'Print com dados fictícios'],
      print: prints('app-score')[0],
      printExtra: prints('app-score')[1],
      telas: prints('app-score'),
      capa: capasDosProjetos['app-score'],
    },
    {
      slug: 'engenharia-de-agentes',
      origem: 'proprio',
      nome: 'Engenharia de agentes',
      resultado: 'O mesmo agente em três frameworks, lado a lado, para escolher com base.',
      tipos: ['agentes'],
      status: 'estudo',
      etiquetas: ['Pydantic', 'LangGraph', 'Google ADK'],
      stack: ['Pydantic', 'LangGraph', 'Google ADK', 'multiagente'],
      feito: 'O mesmo agente em Pydantic puro, LangGraph e Google ADK, mais versões multiagente com defesa contra prompt injection, rodando offline.',
      numeros: ['24 testes de fumaça'],
      print: prints('engenharia-de-agentes')[0],
      printExtra: prints('engenharia-de-agentes')[1],
      telas: prints('engenharia-de-agentes'),
      capa: capasDosProjetos['engenharia-de-agentes'],
      diagrama: diagramasDosCasos['engenharia-de-agentes'],
      repositorio: 'https://github.com/vlfcandido/engenharia-de-agentes',
    },
    {
      slug: 'revisor-ia',
      origem: 'proprio',
      nome: 'Revisor de código com IA',
      resultado: 'Revisão automática em que a resposta da IA é medida, não só gerada.',
      tipos: ['agentes'],
      status: 'estudo',
      etiquetas: ['LangGraph', 'RAG', 'MCP'],
      stack: revisor.stack,
      problema: revisor.contexto,
      feito: revisor.feito,
      numeros: [revisor.metrica],
      print: prints('revisor-ia')[0],
      printExtra: prints('revisor-ia')[1],
      telas: prints('revisor-ia'),
      capa: capasDosProjetos['revisor-ia'],
      diagrama: diagramasDosCasos['revisor-ia'],
      repositorio: 'https://github.com/vlfcandido/revisor-ia',
    },
    // nexus-clips removido em 08/10/2026 (M14): o print mostrava números de visualização fictícios num
    // protótipo. Volta quando o README estiver limpo e houver testes.
    {
      // Case de 08/10/2026: só o texto e as ilustrações. O código não é público e não ganha link; o
      // ângulo é privacidade na máquina, aprovação humana de cada ação e log de auditoria.
      slug: 'ia-local',
      origem: 'proprio',
      nome: 'IA local com humano no circuito',
      resultado: 'Assistente que roda na sua máquina: o dado não sai e nada executa sem o seu ok.',
      tipos: ['agentes'],
      status: 'prototipo',
      etiquetas: ['Ollama', 'llama.cpp', 'Python'],
      stack: ['Ollama', 'llama.cpp (GGUF Q4)', 'qwen3 4B quantizado', 'Python, só biblioteca padrão', 'HTML e JavaScript puros', 'Playwright'],
      problema:
        'Quem não pode mandar dado para fora da empresa fica sem IA na nuvem. E um agente que executa sozinho não deixa claro quem decidiu o quê.',
      feito:
        'Um laboratório de IA que roda inteiro na máquina, sem nuvem: o conteúdo da conversa e dos arquivos não sai do aparelho. Sobre ele, um modo agente com uma regra fixa: o modelo nunca age sozinho. Ele propõe um comando ou a gravação de um arquivo, e um modal mostra o texto completo para aprovar, editar ou negar. Nada roda antes. O que é aprovado executa, a saída volta para a conversa e vai para um log de auditoria com horário, comando e código de saída. A gravação fica restrita a pastas de trabalho e o backend exige token. O limite de memória virou o eixo do projeto: num MacBook Air M1 de 8 GB, só modelos de 3B a 4B quantizados em Q4 cabem sem esgotar a memória.',
      numeros: [
        'Roda num MacBook Air M1 de 8 GB, sem nuvem',
        'Modelos de 3B a 4B em Q4, um por vez',
        'Cada ação passa pela aprovação e fica no log',
        'Laboratório pessoal, sem cliente',
      ],
      capa: capasDosProjetos['ia-local'],
      print: prints('ia-local')[0],
      printExtra: prints('ia-local')[1],
      telas: prints('ia-local'),
      diagrama: diagramasDosCasos['ia-local'],
    },
    {
      slug: 'este-site',
      origem: 'proprio',
      nome: 'Este site',
      // 14/10/2026 (fix final, revisor de detalhes): o texto anterior descrevia o site velho e afirmava o que não existe
      // aqui. Antes: resultado 'Galeria filtrável, demonstração ao vivo e tema claro e escuro.'; feito 'Feito do zero, sem
      // tema pronto: a galeria de projetos com link compartilhável, a demonstração de atendimento, os diagramas desenhados
      // por um motor próprio em SVG e o tema claro e escuro. Funciona no teclado e com leitor de tela, e respeita quem
      // pede menos movimento no sistema.'; print com a seção "Interfaces que eu construo", que saiu.
      resultado: 'A prova na frente, um exemplo para clicar e versões próprias para celular e PC.',
      tipos: ['frontend'],
      status: 'producao',
      etiquetas: ['React', 'TypeScript', 'Tailwind'],
      stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind 4', 'Vitest', 'Playwright'],
      feito:
        'Feito do zero, sem tema pronto. A página inicial abre com a prova, com anos, empresas e projetos contados na fonte, e leva a um protótipo navegável para clicar antes de fechar. O detalhe de cada trabalho ganha uma marcação de caneta que se desenha na tela. Celular e PC têm versões próprias, cada uma com o seu limite de rolagem. Antes de publicar, um robô abre o site no navegador em três larguras e nos dois temas e mede rolagem lateral, alvos de toque e salto de layout.',
      numeros: ['Testes automáticos travam o conteúdo publicado', 'Medido no navegador em 390, 1280 e 1440 px'],
      print: { arquivo: 'prints/este-site.webp', alt: 'Página inicial deste site no PC, com a prova à esquerda e a tela de um trabalho com o detalhe circulado à direita' },
      repositorio: 'https://github.com/vlfcandido/vlfcandido.github.io',
    },
    {
      slug: 'design-system-mare',
      origem: 'proprio',
      // 14/10/2026 (fix final): o Maré era a identidade do site anterior; este site usa outra. Antes: nome 'Design system
      // Maré', resultado 'Cores, tipos e regras de uso escritos uma vez e conferidos por teste.' e o feito no presente
      // ("A identidade deste site virou um design system"), que dizia estar no ar aqui. O status fica 'producao' porque
      // o Maré esteve no ar no site anterior; o texto visível diz que foi.
      nome: 'Design system do site anterior',
      resultado: 'Cores, tipos e regras do site anterior, escritos num lugar só e conferidos por teste.',
      tipos: ['frontend'],
      status: 'producao',
      etiquetas: ['design system', 'tokens', 'acessibilidade'],
      stack: ['tokens em JSON', 'CSS', 'Tailwind', 'Vitest'],
      problema: 'Sem regra escrita, cada tela nova escolhe a cor e o espaço de novo, e o produto perde a cara.',
      feito:
        'A identidade do site anterior, o Maré, virou um design system. Cada cor existia no tema claro e no escuro, com o uso escrito ao lado ("fundo, nunca texto"), e um teste conferia que o CSS e o arquivo de tokens não divergiam. No AprovaOS, fiz o mesmo com regras de componente e uma página de estilo viva.',
      numeros: ['Tema claro e escuro em todos os tokens', 'Um teste travava o contrato de cores'],
      print: { arquivo: 'prints/design-system-mare.webp', alt: 'Folha de cores do Maré, o design system do site anterior, com cada cor no tema claro e no escuro e o seu uso' },
    },
    {
      slug: 'benchmark-litellm',
      origem: 'proprio',
      nome: 'Benchmark de gateway de IA',
      resultado: 'Latência, erros e custo medidos antes de escolher a arquitetura.',
      tipos: ['dados'],
      status: 'estudo',
      etiquetas: ['LiteLLM', 'Python'],
      stack: ['LiteLLM SDK', 'LiteLLM Proxy', 'Python'],
      feito: 'Latência, tempo até o primeiro token, erros e custo: LiteLLM SDK contra LiteLLM Proxy.',
      numeros: [],
      print: prints('benchmark-litellm')[0],
      printExtra: prints('benchmark-litellm')[1],
      telas: prints('benchmark-litellm'),
      capa: capasDosProjetos['benchmark-litellm'],
      repositorio: 'https://github.com/vlfcandido/benchmark-litellm-sdk-proxy',
    },
    // previsao-tempo-chatbot e api-premios-filmes removidos em 08/10/2026 (M16): estudos pequenos.
    {
      slug: 'sicoob',
      origem: 'empresa',
      nome: 'Sicoob',
      resultado: 'Assistente de IA em uso pelas equipes das cooperativas.',
      tipos: ['agentes'],
      status: 'producao',
      etiquetas: ['Python', 'multiagente', 'RAG'],
      stack: sicoob.stack,
      problema: sicoob.contexto,
      feito: sicoob.feito,
      numeros: [sicoob.metrica],
      papel: empresa('sicoob').papel,
      empresa: 'sicoob',
      contratante: 'sicoob',
      diagrama: diagramasDosCasos.sicoob,
      fonte: sicoob.fonte,
    },
    {
      slug: 'contabilizei',
      origem: 'empresa',
      nome: 'Contabilizei',
      // Corrigido em 08/10/2026 (ele): antes era o atendimento com IA citado pelo Google Cloud, que não foi dele.
      // Atualizado em 08/10/2026 com o texto aprovado por ele. Antes: resultado 'Agentes de IA de vendas (SDR).',
      // tipos ['agentes'] e etiquetas ['agentes de IA', 'vendas'].
      resultado: 'Vendedor de IA no WhatsApp: um orquestrador e 8 agentes especializados.',
      tipos: ['agentes', 'chatbot', 'integracoes'],
      status: 'producao',
      etiquetas: ['Google ADK', 'Gemini', 'WhatsApp'],
      stack: vendas.stack,
      problema: vendas.contexto,
      feito: vendas.feito,
      numeros: [],
      papel: empresa('contabilizei').papel,
      empresa: 'contabilizei',
      contratante: 'contabilizei',
    },
    {
      slug: 'prefeitura-franca',
      origem: 'empresa',
      nome: 'Prefeitura de Franca',
      resultado: '5 mil atendimentos da Saúde por mês sem ninguém digitar.',
      tipos: ['chatbot'],
      status: 'producao',
      etiquetas: ['Blip', 'WhatsApp'],
      stack: franca.stack,
      problema: franca.contexto,
      feito: franca.feito,
      numeros: [franca.metrica],
      papel: 'Líder técnico dos projetos Blip na Vertigo',
      empresa: 'prefeitura-franca',
      contratante: 'vertigo',
      fonte: franca.fonte,
    },
    {
      slug: 'wiv',
      origem: 'empresa',
      nome: 'Wiv',
      resultado: 'Mostra onde as conversas dos robôs travam, em mais de 300 robôs.',
      tipos: ['chatbot', 'dados'],
      status: 'producao',
      etiquetas: ['IA conversacional', 'análise de conversas'],
      stack: waizer.stack,
      problema: waizer.contexto,
      feito: waizer.feito,
      numeros: [waizer.metrica],
      papel: empresa('wiv').papel,
      empresa: 'wiv',
      contratante: 'wiv',
      fonte: waizer.fonte,
    },
    {
      slug: 'araguaia',
      origem: 'empresa',
      nome: 'Araguaia',
      resultado: 'Mais contatos qualificados chegando ao time comercial.',
      tipos: ['chatbot'],
      status: 'producao',
      etiquetas: ['Blip', 'WhatsApp', 'CRM'],
      stack: araguaia.stack,
      problema: araguaia.contexto,
      feito: araguaia.feito,
      numeros: [araguaia.metrica],
      papel: 'Líder técnico dos projetos Blip na Vertigo',
      empresa: 'araguaia',
      contratante: 'vertigo',
      fonte: araguaia.fonte,
    },
    {
      slug: 'ecovita',
      origem: 'empresa',
      nome: 'Roleta de corretores',
      resultado: 'Lead parado há mais de uma hora passa sozinho para o próximo corretor.',
      tipos: ['integracoes', 'chatbot'],
      // Situação de hoje não conferida: fica como MVP (o status não aparece no site).
      status: 'mvp',
      etiquetas: ['.NET', 'Hangfire', 'API do Blip'],
      stack: ['.NET', 'Hangfire', 'SQL Server', 'API do Blip', 'API do CRM', 'Azure Blob'],
      problema: 'Na Ecovita, lead de imóvel sem resposta de um corretor precisava mudar de mãos sem ninguém fazer isso à mão.',
      feito:
        'Um job agendado lê a fila, confere no CRM e no Blip Desk onde cada lead está e, se ninguém respondeu em uma hora, passa o atendimento para o próximo corretor da mesma fila, atualizando o ticket no Blip, o responsável no CRM e o analytics.',
      numeros: [],
      // Antes: 'Projeto que liderei para a Ecovita' (corrigido por ele em 08/10/2026: só participou).
      // 15/10/2026 (decisão dele): a Ecovita foi cliente da Wiv, como a Minu. Antes: 'Projeto de que participei na Ecovita'.
      papel: 'Cliente da Wiv',
      contratante: 'wiv',
      participacao: true,
      // 15/10/2026 (revisor, rodada 2): saiu a capa isométrica azul-petróleo (linguagem do Maré); o cartão abre no
      // desenho do fluxo. Antes: capa: capasDosProjetos.ecovita.
      diagrama: diagramasDosCasos.ecovita,
    },
    {
      slug: 'minu',
      origem: 'empresa',
      nome: 'Rastreio de campanhas no WhatsApp',
      resultado: 'Mostra quantas mensagens de cada campanha chegaram, foram lidas ou falharam.',
      tipos: ['integracoes', 'chatbot'],
      // Situação de hoje não conferida: fica como MVP (o status não aparece no site).
      status: 'mvp',
      etiquetas: ['Firebase Functions', 'Hono', 'TypeScript'],
      stack: ['Firebase Functions', 'Hono', 'TypeScript', 'Zod', 'Cloud Scheduler', 'API do Blip', 'API do Braze'],
      problema: 'A Minu precisava saber o que acontecia com cada mensagem das campanhas de WhatsApp depois do envio.',
      feito:
        'Uma função agendada a cada minuto busca as campanhas e a audiência no Blip, lê o status de cada mensagem, junta o perfil do usuário no Braze e registra um evento por status no analytics.',
      numeros: [],
      // Antes: 'Projeto que liderei para a Minu' (corrigido por ele em 08/10/2026: só participou).
      // 15/10/2026 (revisor, rodada 2): a Minu é cliente da Wiv (clientes.ts, grupo wiv); "participei na Minu" dava a
      // entender um 6º empregador. Antes: papel 'Projeto de que participei na Minu', sem contratante.
      papel: 'Cliente da Wiv',
      participacao: true,
      empresa: 'minu',
      contratante: 'wiv',
      diagrama: diagramasDosCasos.minu,
    },
  ]
}

/** As três seções da galeria, na ordem da página. */
export interface SecoesGaleria {
  /** Casos de empresa que liderei ou fiz: sobem para o topo (M11, 08/10/2026). */
  emEmpresas: ItemProjeto[]
  proprios: ItemProjeto[]
  /** Casos em que só participei (Ecovita, Minu): no fim, sem destaque. */
  outros: ItemProjeto[]
}

/**
 * Separa a lista (já filtrada) nas três seções da galeria, mantendo a ordem de `listarProjetos`.
 *
 * @param itens projetos a exibir.
 * @returns "Em empresas", "Projetos próprios" e "Outros projetos em empresas".
 */
export function separarGaleria(itens: ItemProjeto[]): SecoesGaleria {
  return {
    emEmpresas: itens.filter((i) => i.origem === 'empresa' && !i.participacao),
    proprios: itens.filter((i) => i.origem === 'proprio'),
    outros: itens.filter((i) => i.origem === 'empresa' && i.participacao),
  }
}

/**
 * Filtra a galeria pelo tipo escolhido.
 *
 * @param itens lista completa.
 * @param tipo tipo do chip, ou `todos`.
 * @returns os itens daquele tipo (um item pode ter mais de um tipo).
 */
export function filtrarProjetos(itens: ItemProjeto[], tipo: TipoProjeto | 'todos'): ItemProjeto[] {
  return tipo === 'todos' ? itens : itens.filter((i) => i.tipos.includes(tipo))
}
