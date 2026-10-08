// Galeria da página de projetos: um item por card, com o tipo (para o filtro) e o status honesto.
// O status não aparece no site desde 07/10/2026 (pedido dele: sem selo de MVP, estudo etc.); fica aqui
// só para os testes garantirem que nenhum texto de projeto próprio afirma produção, cliente ou lucro.
// Os textos vêm de conteudo.ts e clientes.ts; aqui só entra o que a galeria precisa a mais. Os números
// dos projetos próprios saem do banco de provas (medidos em 07/10/2026). Nada de projeto que o banco
// de provas manda não citar (ex.: o bot de pedidos, que não sobe), nem de lucro em trading.

import { empresasDiretas, type EmpresaDireta } from './clientes'
import { cases, type Case, type Fonte } from './conteudo'
import { capasDosProjetos, diagramasDosCasos, printsDosCasos, type Capa, type Diagrama, type Print } from './visuais'

/** Tipo de projeto, usado pelos chips de filtro. */
export type TipoProjeto = 'chatbot' | 'agentes' | 'sistemas' | 'frontend' | 'integracoes' | 'dados'

/** Rótulo de cada tipo, na ordem dos chips. */
export const tiposProjeto: Record<TipoProjeto, string> = {
  chatbot: 'Chatbot e atendimento',
  agentes: 'Agentes de IA',
  sistemas: 'Sistemas e SaaS',
  frontend: 'Frontend e dashboards',
  integracoes: 'Integrações e automação',
  dados: 'Dados e trading',
}

/** Situação real do projeto hoje. */
export type StatusProjeto = 'producao' | 'mvp' | 'prototipo' | 'estudo'

/** Um card da galeria e o conteúdo do painel que ele abre. */
export interface ItemProjeto {
  /** Também é o fim da rota compartilhável: `#/projetos/<slug>`. */
  slug: string
  /** `proprio` vai para a galeria; `empresa`, para a faixa "Em empresas". */
  origem: 'proprio' | 'empresa'
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
  /** Slug da empresa em `clientes.ts`, para a logo dos casos de empresa. */
  empresa?: string
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
  const serasa = empresa('serasa-experian')

  return [
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
      diagrama: diagramasDosCasos.aprovaos,
      repositorio: 'https://github.com/vlfcandido/aprovaos',
    },
    {
      slug: 'nexus-quant',
      origem: 'proprio',
      nome: 'Bot de trading em cripto',
      resultado: 'Confere cada ordem com a corretora, 24 horas, sem erro de conta.',
      tipos: ['dados', 'integracoes', 'frontend'],
      status: 'estudo',
      etiquetas: ['Python', 'Redis Streams', 'Next.js'],
      stack: quant.stack,
      problema: quant.contexto,
      feito: quant.feito,
      numeros: ['1.060 testes automáticos passando', 'Roda só em simulação, sem dinheiro de verdade', 'A vitrine mostra o que deu errado, inclusive as taxas'],
      print: prints('nexus-quant')[0],
      printExtra: prints('nexus-quant')[1],
      diagrama: diagramasDosCasos['nexus-quant'],
      repositorio: 'https://github.com/vlfcandido/nexus-quant-showcase',
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
      diagrama: diagramasDosCasos['ia-local'],
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
      print: { arquivo: 'prints/app-score.webp', alt: 'App de score com o medidor em arco marcando 742 de 1000 e a explicação do cálculo, com dados fictícios' },
    },
    {
      slug: 'este-site',
      origem: 'proprio',
      nome: 'Este site',
      resultado: 'Galeria filtrável, demonstração ao vivo e tema claro e escuro.',
      tipos: ['frontend'],
      status: 'producao',
      etiquetas: ['React', 'TypeScript', 'Tailwind'],
      stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind 4', 'Vitest', 'SVG'],
      feito:
        'Feito do zero, sem tema pronto: a galeria de projetos com link compartilhável, a demonstração de atendimento, os diagramas desenhados por um motor próprio em SVG e o tema claro e escuro. Funciona no teclado e com leitor de tela, e respeita quem pede menos movimento no sistema.',
      numeros: ['Testes automáticos travam o conteúdo publicado', 'No ar em vlfcandido.github.io'],
      print: { arquivo: 'prints/este-site.webp', alt: 'Seção Interfaces que eu construo deste site, com o gráfico de pedidos, o status do pedido e a lista filtrável' },
      repositorio: 'https://github.com/vlfcandido/vlfcandido.github.io',
    },
    {
      slug: 'design-system-mare',
      origem: 'proprio',
      nome: 'Design system Maré',
      resultado: 'Cores, tipos e regras de uso escritos uma vez e conferidos por teste.',
      tipos: ['frontend'],
      status: 'producao',
      etiquetas: ['design system', 'tokens', 'acessibilidade'],
      stack: ['tokens em JSON', 'CSS', 'Tailwind', 'Vitest'],
      problema: 'Sem regra escrita, cada tela nova escolhe a cor e o espaço de novo, e o produto perde a cara.',
      feito:
        'A identidade deste site virou um design system: cada cor existe no tema claro e no escuro, com o uso escrito ao lado ("fundo, nunca texto"), e um teste confere que o CSS e o arquivo de tokens não divergem. No AprovaOS, fiz o mesmo com regras de componente e uma página de estilo viva.',
      numeros: ['Tema claro e escuro em todos os tokens', 'Teste que trava o contrato de cores'],
      print: { arquivo: 'prints/design-system-mare.webp', alt: 'Folha de cores do design system Maré, com cada cor no tema claro e no escuro e o seu uso' },
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
      diagrama: diagramasDosCasos['revisor-ia'],
      repositorio: 'https://github.com/vlfcandido/revisor-ia',
    },
    {
      slug: 'varredura-voos',
      origem: 'proprio',
      nome: 'Varredura de voos',
      resultado: 'Acha a passagem mais curta, não só a mais barata.',
      tipos: ['integracoes'],
      status: 'mvp',
      etiquetas: ['Python', 'API Amadeus', 'cache'],
      stack: ['Python', 'API Amadeus', 'cache', 'controle de cota', 'rate limit'],
      feito: 'Busca de passagens integrada à API da Amadeus, com controle de cota, cache e limite de chamadas, que prioriza a duração da viagem.',
      numeros: ['109 testes automáticos', 'MVP de uso pessoal'],
      print: { arquivo: 'prints/varredura-voos.webp', alt: 'Terminal com o resultado da varredura de voos ordenado por duração' },
      diagrama: diagramasDosCasos['varredura-voos'],
      repositorio: 'https://github.com/vlfcandido/varredura-voos',
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
      print: { arquivo: 'prints/engenharia-de-agentes.webp', alt: 'Comparação do mesmo agente em três frameworks' },
      diagrama: diagramasDosCasos['engenharia-de-agentes'],
      repositorio: 'https://github.com/vlfcandido/engenharia-de-agentes',
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
      print: { arquivo: 'prints/benchmark-litellm-sdk-proxy.webp', alt: 'Painel do benchmark com gráficos de latência e custo' },
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
      diagrama: diagramasDosCasos.sicoob,
      fonte: sicoob.fonte,
    },
    {
      slug: 'contabilizei',
      origem: 'empresa',
      nome: 'Contabilizei',
      // Corrigido em 08/10/2026 (ele): antes era o atendimento com IA citado pelo Google Cloud, que não foi dele.
      resultado: 'Agentes de IA de vendas (SDR).',
      tipos: ['agentes'],
      status: 'producao',
      etiquetas: ['agentes de IA', 'vendas'],
      stack: vendas.stack,
      problema: vendas.contexto,
      feito: vendas.feito,
      numeros: [],
      papel: empresa('contabilizei').papel,
      empresa: 'contabilizei',
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
      papel: 'Tech lead dos projetos Blip na Vertigo',
      empresa: 'prefeitura-franca',
      capa: capasDosProjetos['prefeitura-franca'],
      fonte: franca.fonte,
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
      papel: 'Tech lead dos projetos Blip na Vertigo',
      empresa: 'araguaia',
      fonte: araguaia.fonte,
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
      fonte: waizer.fonte,
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
      papel: 'Projeto que liderei para a Ecovita',
      diagrama: diagramasDosCasos.ecovita,
      capa: capasDosProjetos.ecovita,
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
      papel: 'Projeto que liderei para a Minu',
      empresa: 'minu',
      diagrama: diagramasDosCasos.minu,
    },
    {
      slug: 'serasa-experian',
      origem: 'empresa',
      nome: 'Serasa Experian',
      resultado: 'Segurança e modernização de aplicações em grande escala.',
      tipos: ['sistemas'],
      status: 'producao',
      etiquetas: ['segurança', 'modernização'],
      stack: ['segurança de aplicações', 'modernização'],
      feito: serasa.feito,
      numeros: [],
      papel: serasa.papel,
      empresa: 'serasa-experian',
    },
  ]
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
