// Todo o texto do site mora aqui. Componentes só exibem; nada de lógica neste arquivo.
// Regras: só número com fonte pública ou do próprio código; empregador atual só com a matéria pública (Sicoob),
// nunca o formal; nada de e-mail ou telefone (o teste em conteudo.test.ts barra o build se algo escapar).

/** Origem de um número ou case; com `url` vira link para a fonte pública. */
export interface Fonte {
  texto: string
  url?: string
}

/** Número de destaque com o que ele mede e de onde vem. */
export interface Numero {
  valor: string
  rotulo: string
  fonte: Fonte
}

/** Linha da oferta: o que eu faço, em uma frase, com um exemplo ilustrativo de antes e depois. */
export interface Oferta {
  /** Identificador estável, usado no ícone e no destaque por ramo. */
  id: 'integracao' | 'repetido' | 'resgate' | 'sob-medida' | 'site' | 'whatsapp'
  /** Nome curto da aba no celular (duas palavras no máximo); sem ele, a aba usa o título. */
  curto?: string
  titulo: string
  descricao: string
  /** Como costuma ser hoje (exemplo ilustrativo, não é número de cliente). */
  antes: string
  /** Como fica depois (exemplo ilustrativo). */
  depois: string
  /** Ids de `ramosDemo` em que esta oferta é a sugestão de começo. */
  ramos: string[]
}

/** Case público ou projeto próprio exibido em card. */
export interface Case {
  /** Também é o nome do print: `public/prints/<slug>.png`. */
  slug: string
  /**
   * `publico`: case com matéria pública (fonte com link) · `empresa`: trabalho em empresa sem matéria
   * pública (sem número) · `proprio`: projeto meu.
   */
  tipo: 'publico' | 'empresa' | 'proprio'
  titulo: string
  contexto: string
  feito: string
  metrica: string
  fonte: Fonte
  stack: string[]
  /** `true` só depois que o arquivo do print existir em `public/prints/`. */
  temPrint: boolean
  /** Descrição do print para leitor de tela. */
  alt: string
}

/** Passo do jeito de trabalhar. */
export interface Passo {
  titulo: string
  descricao: string
}

/** Linha da tabela de stack. */
export interface CamadaStack {
  camada: string
  itens: string[]
}

/** Link externo de contato ou perfil. */
export interface LinkExterno {
  rotulo: string
  url: string
  descricao: string
}

export const perfil = {
  nome: 'Vinicius Candido',
  // Trocado em 08/10/2026 (M7). Antes: 'Engenheiro de software há 13 anos'.
  titulo: 'Engenheiro de software sênior · 13 anos',
  // Trocadas em 08/10/2026 (posicionamento amplo). Antes: chamada "Seu projeto feito por quem constrói IA
  // no Sicoob e já construiu na Contabilizei." e linha "Atendimento no WhatsApp, automações, sites e
  // sistemas para o seu negócio. Preço fechado antes de começar e entrega testada."
  chamada: 'O problema de software do seu negócio nas mãos de quem constrói IA no Sicoob.',
  linha: 'Integro sistemas e CRM, crio APIs, automatizo o trabalho repetido e conserto o que travou. Preço fechado antes de começar.',
  resumo:
    'Chatbots de WhatsApp, automações, sites, sistemas e integrações para o seu negócio, com preço fechado na primeira conversa e entrega testada. Hoje sou engenheiro de IA sênior no Sicoob, onde lidero tecnicamente a frente de IA de investimentos. Construo software há 13 anos: back-end em Java, Node.js e Python, front quando o projeto pede e IA aplicada em produção desde 2021. Liderei os projetos de chatbot Blip da Vertigo, parceira certificada da Blip, e trabalhei no Waizer, a plataforma de análise de conversas da Wiv.',
  notaTrabalho: 'Do seu lado, só preciso do acesso ao que já existe e de alguém para tirar dúvidas.',
  convite: 'Me chame no LinkedIn ou no 99Freelas e conte o que você precisa. Respondo com o preço fechado e o prazo.',
} as const

/** O que eu resolvo, escrito como resultado para quem contrata. */
// Ofertas ampliadas em 08/10/2026 (posicionamento amplo, textos aprovados pelo adversarial).
// Antes eram 4, com o WhatsApp na frente: whatsapp, repetido, site ("Painéis, dashboards e sistemas
// web") e integracao. Agora são 6, com integração na frente e a IA por último (ela já está na frase).
export const oferta: Oferta[] = [
  {
    id: 'integracao',
    curto: 'Integrações e CRM',
    titulo: 'Seus sistemas e o CRM falando a mesma língua',
    descricao: 'Venda, cliente e pagamento passam de um sistema para o outro sozinhos, sem ninguém digitar duas vezes.',
    antes: 'O vendedor fecha no WhatsApp e digita tudo de novo no CRM.',
    depois: 'O contato entra no CRM com a conversa junto, na hora.',
    ramos: ['industria'],
  },
  {
    id: 'repetido',
    curto: 'Automação',
    titulo: 'Menos trabalho repetido na sua equipe',
    descricao: 'Cadastro, planilha, aviso e cobrança que hoje alguém faz na mão passam a acontecer sozinhos.',
    antes: 'Alguém copia cada pedido para a planilha no fim do dia.',
    depois: 'O pedido entra na planilha na hora em que chega.',
    ramos: ['escritorio'],
  },
  {
    id: 'resgate',
    curto: 'Sistema travado',
    titulo: 'O sistema que travou ou que ninguém entende',
    descricao: 'Acho a causa, corrijo sem quebrar o que funciona, fecho brechas de segurança e deixo tudo documentado.',
    antes: 'O dev saiu, o sistema caiu na sexta e ninguém sabe onde mexer.',
    depois: 'No ar de novo, com a causa explicada e um mapa do código.',
    ramos: [],
  },
  {
    id: 'sob-medida',
    curto: 'Sistema e API sob medida',
    titulo: 'O sistema ou a API que nenhum app pronto faz',
    descricao: 'Quando nada pronto serve, construo o seu, com login, as regras do seu negócio e testes automáticos.',
    antes: 'Três ferramentas pagas e nenhuma faz o que o processo pede.',
    depois: 'Um sistema só, do jeito que a operação funciona.',
    ramos: [],
  },
  {
    id: 'site',
    curto: 'Painéis e sites',
    titulo: 'Painéis, sistemas web e sites',
    descricao: 'Os números do dia numa tela só e a página que traz cliente, no computador e no celular.',
    antes: 'Pedido no caderno e o mês espalhado em três planilhas.',
    depois: 'Um painel mostra os pedidos de hoje, o atrasado e quanto entrou.',
    ramos: ['loja'],
  },
  {
    id: 'whatsapp',
    curto: 'IA no WhatsApp',
    titulo: 'Atendimento com IA no WhatsApp, sem fila',
    descricao: 'Seu cliente tira a dúvida e marca o horário sozinho, sem alguém da equipe preso no celular.',
    antes: '40 mensagens esperando a recepção abrir.',
    depois: 'Horário marcado às 23h.',
    ramos: ['clinica'],
  },
]

/** Case curto da página principal: duas linhas e o resultado, com a fonte pública. */
export interface Destaque {
  slug: string
  /** Slug da empresa em `clientes.ts`, para a logo. */
  empresa: string
  titulo: string
  texto: string
  resultado: string
  /** Matéria pública; sem ela (ex.: Contabilizei), o card não leva número nem link. */
  fonte?: Fonte & { url: string }
}

export const destaques: Destaque[] = [
  {
    slug: 'prefeitura-franca',
    empresa: 'prefeitura-franca',
    titulo: 'Prefeitura de Franca (SP)',
    texto: 'Chatbot da Secretaria de Saúde para as dúvidas repetidas da população. Feito no time de projetos Blip que eu liderava na Vertigo.',
    resultado: '5 mil atendimentos por mês sem ninguém digitar.',
    fonte: {
      texto: 'Ler o case',
      url: 'https://materiais.vertigo.com.br/case-chatbot-prefeitura-de-franca-estado-de-sao-paulo',
    },
  },
  {
    slug: 'sicoob-investimentos',
    empresa: 'sicoob',
    titulo: 'Sicoob',
    texto: 'Assistente de IA que apoia o atendimento de investimentos. Sou engenheiro de IA sênior no Sicoob e lidero tecnicamente a frente de IA de investimentos.',
    resultado: 'Em uso pelas equipes das cooperativas.',
    fonte: { texto: 'Ler a matéria', url: 'https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/' },
  },
  // Corrigido em 08/10/2026 (ele): o atendimento com IA da Contabilizei citado pelo Google Cloud NÃO foi
  // trabalho dele; o dele lá são os agentes de IA de vendas (SDR). Sem fonte pública, sem número.
  {
    slug: 'contabilizei-vendas',
    empresa: 'contabilizei',
    titulo: 'Contabilizei',
    texto: 'Construí os agentes de IA de vendas (SDR) da Contabilizei.',
    resultado: 'Agentes de IA de vendas (SDR).',
  },
]

export const numeros: Numero[] = [
  {
    valor: '13 anos',
    rotulo: 'de engenharia de software, 5 deles com IA em produção',
    fonte: { texto: 'LinkedIn', url: 'https://www.linkedin.com/in/viniciusf-candido' },
  },
  {
    valor: '4,6 / 5',
    rotulo: 'nota da Vertigo no diretório oficial de parceiros Blip',
    fonte: { texto: 'blip.ai', url: 'https://www.blip.ai/partners/en/experts/vertigo-tecnologia/' },
  },
  {
    valor: '5 mil / mês',
    rotulo: 'atendimentos automatizados no chatbot da Prefeitura de Franca',
    fonte: {
      texto: 'case Vertigo',
      url: 'https://materiais.vertigo.com.br/case-chatbot-prefeitura-de-franca-estado-de-sao-paulo',
    },
  },
  {
    valor: '1.060',
    rotulo: 'testes automáticos passando no meu sistema de ordens em tempo real',
    fonte: { texto: 'vitrine no GitHub', url: 'https://github.com/vlfcandido/nexus-quant-showcase' },
  },
]

export const cases: Case[] = [
  {
    slug: 'sicoob-investimentos',
    tipo: 'publico',
    titulo: 'Assistente de investimentos com IA no Sicoob',
    contexto: 'As equipes das cooperativas precisavam de apoio rápido e confiável no atendimento consultivo de investimentos.',
    feito:
      'Sou engenheiro de IA sênior no Sicoob e lidero tecnicamente a frente de IA do assistente, que usa três agentes: um encaminha a pergunta, um responde sobre investimentos e um cuida das perguntas frequentes.',
    metrica: 'Em uso pelas equipes das cooperativas, segundo a matéria publicada.',
    fonte: { texto: 'MobileTime, 17/07/2026', url: 'https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/' },
    stack: ['Python', 'agentes de IA', 'multiagente', 'RAG'],
    temPrint: false,
    alt: 'Ilustração do assistente de investimentos com três agentes de IA',
  },
  // Corrigido em 08/10/2026 (ele): este case era o atendimento com IA citado pelo Google Cloud, que não foi
  // trabalho dele. Agora só os agentes de IA de vendas (SDR), sem número (o volume não tem fonte pública).
  {
    slug: 'contabilizei-vendas',
    tipo: 'empresa',
    titulo: 'Agentes de IA de vendas (SDR) na Contabilizei',
    contexto: 'O time de vendas precisava de ajuda no primeiro contato e na qualificação de quem chegava interessado.',
    // Texto aprovado por ele em 08/10/2026. Antes: 'Construí os agentes de IA de vendas (SDR) da Contabilizei,
    // de 2025 a mar/2026.' e stack ['agentes de IA', 'multiagente'].
    feito:
      'Vendedor de IA no WhatsApp para uma contabilidade digital: um orquestrador e 8 agentes especializados (Google ADK + Gemini no Vertex AI) que qualificam o lead, apresentam planos, simulam taxas e geram a cobrança. Trabalhei no backend em Python, no handoff automático para o time humano e nas integrações com WhatsApp e CRM.',
    metrica: '',
    fonte: { texto: 'Contabilizei, 2025 a mar/2026' },
    stack: ['Python', 'Google ADK', 'LangGraph', 'Gemini no Vertex AI', 'Postgres', 'Redis', 'Cloud Run', 'WhatsApp', 'CRM'],
    temPrint: false,
    alt: 'Ilustração dos agentes de IA de vendas da Contabilizei',
  },
  {
    slug: 'prefeitura-franca',
    tipo: 'publico',
    titulo: 'Chatbot da Saúde da Prefeitura de Franca (SP)',
    contexto: 'A Secretaria de Saúde respondia à mão um volume alto de dúvidas repetidas da população.',
    feito: 'Chatbot na plataforma Blip, entregue pela Vertigo no time de projetos Blip que eu liderava.',
    metrica: '5 mil atendimentos por mês automatizados.',
    fonte: {
      texto: 'case publicado pela Vertigo',
      url: 'https://materiais.vertigo.com.br/case-chatbot-prefeitura-de-franca-estado-de-sao-paulo',
    },
    stack: ['Blip', 'WhatsApp', 'APIs REST'],
    temPrint: false,
    alt: 'Tela do chatbot de atendimento da Saúde da Prefeitura de Franca',
  },
  {
    slug: 'araguaia',
    tipo: 'publico',
    titulo: 'Chatbot de captação da Araguaia (fertilizantes)',
    contexto: 'O time comercial precisava de mais contatos qualificados chegando pelo atendimento digital.',
    feito: 'Chatbot de atendimento e captação na Blip, entregue pela Vertigo no time de projetos Blip que eu liderava.',
    metrica: 'Mais leads com o chatbot, segundo o case publicado.',
    fonte: { texto: 'case publicado pela Vertigo', url: 'https://materiais.vertigo.com.br/case-araguaia-chatbot' },
    stack: ['Blip', 'WhatsApp', 'CRM'],
    temPrint: false,
    alt: 'Tela do chatbot de captação de leads da Araguaia',
  },
  {
    slug: 'waizer-wiv',
    tipo: 'publico',
    titulo: 'Waizer, análise de conversas de chatbot (Wiv)',
    contexto: 'Empresas com vários robôs de atendimento não sabiam onde as conversas travavam.',
    // Atualizado em 08/10/2026 (ele confirmou). Antes: 'Trabalhei no Waizer e em chatbots da Wiv, plataforma que
    // analisa as conversas e aponta o que melhorar.'
    feito:
      'Construí o backend da análise de conversas do Waizer (APIs e processamento em Python que montam os indicadores) e a camada de IA que classifica intenção, abandono e qualidade do robô.',
    metrica: 'A plataforma passou de 5 milhões de conversas analisadas e monitora mais de 300 robôs.',
    fonte: {
      texto: 'MobileTime, 12/06/2026',
      url: 'https://www.mobiletime.com.br/noticias/12/06/2026/wiv-5-milhoes/',
    },
    stack: ['Python', 'IA conversacional', 'análise de conversas', 'chatbots'],
    temPrint: false,
    alt: 'Painel do Waizer com indicadores de conversas de chatbot',
  },
  {
    slug: 'nexus-quant',
    tipo: 'proprio',
    // Renomeado em 08/10/2026 (M13); antes o título falava em robô de cripto.
    titulo: 'Sistema de ordens em tempo real (estudo)',
    contexto: 'Operar 24 horas exige reconciliar ordens com a corretora sem erro.',
    feito:
      'Serviço em Python com reconciliação na corretora, filas Redis, monitoramento e painel web próprio. Hoje roda só em simulação.',
    metrica: '1.060 testes automáticos passando; a vitrine mostra o que deu errado, inclusive as taxas.',
    fonte: { texto: 'vitrine no GitHub', url: 'https://github.com/vlfcandido/nexus-quant-showcase' },
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Redis Streams', 'Next.js', 'Cloud Run'],
    temPrint: true,
    alt: 'Painel do sistema de ordens em tempo real com posições, ordens e métricas',
  },
  // nexus-clips removido em 08/10/2026 (M14).
  {
    slug: 'revisor-ia',
    tipo: 'proprio',
    titulo: 'Revisor de código com IA',
    contexto: 'Revisão automática só vale se a resposta da IA for medida, não apenas gerada.',
    feito: 'Revisor com busca em documentos (RAG), servidores MCP e avaliação automática das respostas.',
    metrica: 'Respostas avaliadas com LLM como juiz e comparação de prompts.',
    fonte: { texto: 'repositório no GitHub', url: 'https://github.com/vlfcandido/revisor-ia' },
    stack: ['LangGraph', 'RAG', 'pgvector', 'MCP', 'Ragas', 'DeepEval'],
    temPrint: false,
    alt: 'Relatório do revisor de código com os comentários e a nota da avaliação',
  },
  {
    slug: 'aprovaos',
    tipo: 'proprio',
    titulo: 'AprovaOS, SaaS de estudos com agente de IA',
    contexto: 'Concurseiro precisa de plano de estudo que se ajusta ao desempenho, não de lista fixa.',
    feito: 'SaaS com agente de IA, back-end em FastAPI e decisões de arquitetura registradas desde o início.',
    metrica: 'Mais de 1.600 testes automáticos e 53 decisões de arquitetura documentadas. MVP em desenvolvimento.',
    fonte: { texto: 'repositório no GitHub', url: 'https://github.com/vlfcandido/aprovaos' },
    stack: ['FastAPI', 'SQLAlchemy 2', 'Gemini', 'Google ADK', 'pydantic-ai', 'LiteLLM'],
    temPrint: true,
    alt: 'Tela do AprovaOS com o plano de estudos gerado pelo agente',
  },
  {
    slug: 'bureau-credito',
    tipo: 'proprio',
    titulo: 'Bureau de crédito (prova de conceito)',
    contexto: 'Score de crédito auditável e um app web para consultar.',
    feito: 'Prova de conceito com score, app web instalável e deploy automatizado no Google Cloud.',
    metrica: 'Pipeline de CI/CD até o Google Cloud desde a primeira versão.',
    fonte: { texto: 'projeto próprio (código privado)' },
    stack: ['FastAPI', 'PostgreSQL', 'Redis', 'Next.js', 'PWA', 'GCP'],
    temPrint: false,
    alt: 'Tela do app do bureau de crédito com a consulta de score',
  },
]

/** O que a pessoa recebe em cada passo, para a miniatura da linha do tempo. */
export const recebe: string[] = [
  'Uma proposta de uma página: o que entra, o prazo e o valor fechado.',
  'Um link para testar e uma notícia a cada 12 horas.',
  'A ficha de entrega: o que foi feito, como usar e os testes.',
  'Sete dias em que qualquer falha do que foi entregue é corrigida sem custo.',
]

export const passos: Passo[] = [
  {
    titulo: 'Preço fechado na primeira conversa',
    descricao: 'Você sabe o que entra, o prazo e o valor antes de qualquer coisa começar.',
  },
  {
    titulo: 'Versão para testar em 24 a 48 horas',
    descricao: 'Você testa por um link e recebe notícia a cada 12 horas.',
  },
  {
    titulo: 'Entrega com ficha e testes',
    descricao: 'Uma ficha diz o que foi feito, como usar e o resultado dos testes.',
  },
  {
    titulo: '7 dias de correção sem custo',
    descricao: 'Se algo do que foi entregue falhar, eu corrijo.',
  },
]

export const stack: CamadaStack[] = [
  { camada: 'Back-end', itens: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'Node.js', 'TypeScript', 'REST', 'webhooks'] },
  { camada: 'IA', itens: ['agentes', 'multiagente', 'RAG', 'LangGraph', 'Google ADK', 'OpenAI', 'Gemini', 'Claude', 'Vertex AI', 'avaliação de LLM'] },
  { camada: 'Chatbots', itens: ['WhatsApp API oficial', 'Blip', 'Telegram'] },
  { camada: 'Front e mobile', itens: ['Angular', 'React', 'Next.js', 'Vue.js', 'TypeScript', 'Tailwind', 'design system', 'Flutter'] },
  { camada: 'Dados', itens: ['PostgreSQL', 'Redis', 'BigQuery', 'Firestore'] },
  { camada: 'Nuvem e qualidade', itens: ['GCP', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'TDD', 'pytest'] },
]

export const links: LinkExterno[] = [
  { rotulo: 'GitHub', url: 'https://github.com/vlfcandido', descricao: 'código e projetos' },
  { rotulo: 'LinkedIn', url: 'https://www.linkedin.com/in/viniciusf-candido', descricao: 'carreira' },
  { rotulo: '99Freelas', url: 'https://www.99freelas.com.br/user/vinicius-candido-ia', descricao: 'contratar um projeto' },
]

/** Mensagem da conversa de exemplo: quem fala e o texto. */
export interface MensagemDemo {
  de: 'cliente' | 'robo'
  texto: string
}

/** Ramo do seletor "qual é o seu negócio?": conversa de exemplo e clientes do mesmo ramo. */
export interface RamoDemo {
  id: string
  rotulo: string
  conversa: MensagemDemo[]
  /** Slugs de `clientes.ts`, de projetos que liderei nesse ramo (forma de citar do banco de provas). */
  clientes: string[]
}

// Conversas ilustrativas: mostram o tipo de atendimento, não um cliente real.
export const ramosDemo: RamoDemo[] = [
  {
    id: 'clinica',
    rotulo: 'Clínica',
    conversa: [
      { de: 'cliente', texto: 'Oi, tem horário com dentista essa semana?' },
      { de: 'robo', texto: 'Tenho quinta às 14h ou sexta às 10h. Qual fica melhor?' },
      { de: 'cliente', texto: 'Sexta às 10h.' },
      { de: 'robo', texto: 'Marcado para sexta às 10h. Mando um lembrete na véspera.' },
    ],
    clientes: ['unimed', 'odontoprev', 'bradesco-dental'],
  },
  {
    id: 'loja',
    rotulo: 'Loja',
    conversa: [
      { de: 'cliente', texto: 'Vocês têm esse tênis no 40?' },
      { de: 'robo', texto: 'Tenho no 40, preto ou branco. Quer o link para pagar?' },
      { de: 'cliente', texto: 'Quero o preto.' },
      { de: 'robo', texto: 'Aqui está o link. Quando o pagamento cair, aviso o prazo de entrega.' },
    ],
    clientes: ['vivara', 'olx', 'gpa'],
  },
  {
    id: 'escritorio',
    rotulo: 'Escritório',
    conversa: [
      { de: 'cliente', texto: 'Preciso da segunda via do boleto de outubro.' },
      { de: 'robo', texto: 'Encontrei. Posso mandar o PDF aqui mesmo?' },
      { de: 'cliente', texto: 'Pode.' },
      { de: 'robo', texto: 'Pronto, segue o boleto. Ele vence no dia 10.' },
    ],
    clientes: ['conta-azul', 'itau', 'icatu'],
  },
  {
    id: 'industria',
    rotulo: 'Indústria',
    conversa: [
      { de: 'cliente', texto: 'Qual o prazo do pedido 4521?' },
      { de: 'robo', texto: 'Ele sai da fábrica amanhã e chega em 3 dias úteis.' },
      { de: 'cliente', texto: 'Dá para adiantar?' },
      { de: 'robo', texto: 'Já passei para o time comercial. Eles respondem ainda hoje.' },
    ],
    clientes: ['petrobras', 'scania', 'yara'],
  },
]

/** Cena da demonstração do topo: o que acontece na tela (exemplo ilustrativo, dados fictícios). */
export interface CenaDemo {
  id: 'integracao' | 'painel' | 'atendimento'
  /** Texto do botão que escolhe a cena. */
  rotulo: string
  /** Legenda curta embaixo da janela. */
  legenda: string
}

// Três cenas para o topo não ler só como "chatbot" (08/10/2026): a venda que entra no CRM, os números
// do dia num painel e o atendimento com IA (as conversas por ramo, em `ramosDemo`).
export const cenasDemo: CenaDemo[] = [
  { id: 'integracao', rotulo: 'Venda no CRM', legenda: 'A venda fechada no WhatsApp entra no CRM sozinha, com a conversa junto.' },
  { id: 'painel', rotulo: 'Painel do dia', legenda: 'Os números do dia numa tela só, no computador e no celular.' },
  { id: 'atendimento', rotulo: 'Atendimento com IA', legenda: 'O cliente tira a dúvida e marca o horário sozinho.' },
]

/** Cena que abre quando a pessoa escolhe cada ramo no "Qual é o seu negócio?". */
export const cenaDoRamo: Record<string, CenaDemo['id']> = {
  clinica: 'atendimento',
  loja: 'painel',
  escritorio: 'integracao',
  industria: 'integracao',
}

/**
 * Estado em que a página abre (M5, 08/10/2026): ramo Clínica (a legenda continua Unimed, OdontoPrev e
 * Bradesco Dental), mas na cena "Venda no CRM" e com a oferta de integração ativa, para a 1ª tela não ler
 * só "chatbot". Quem clica em Clínica depois vê a cena do ramo (`cenaDoRamo.clinica`, atendimento).
 * Antes: ramo `ramosDemo[0]`, com a cena e a oferta desse ramo (atendimento e WhatsApp).
 */
export const inicioDemo: { ramo: string; cena: CenaDemo['id']; oferta: Oferta['id'] } = {
  ramo: 'clinica',
  cena: 'integracao',
  oferta: 'integracao',
}

/** Cena da demonstração do topo que cada oferta mostra quando é sondada na carta. */
export const cenaDaOferta: Record<Oferta['id'], CenaDemo['id']> = {
  integracao: 'integracao',
  repetido: 'integracao',
  resgate: 'painel',
  'sob-medida': 'painel',
  site: 'painel',
  whatsapp: 'atendimento',
}

/** A venda de exemplo da cena de integração: a mensagem e os campos que chegam ao CRM. */
export const vendaDemo = {
  mensagem: 'Fechado! Pode mandar o boleto das 3 caixas.',
  cliente: 'Mercado Bom Preço',
  campos: [
    { rotulo: 'Cliente', valor: 'Mercado Bom Preço' },
    { rotulo: 'Pedido', valor: '3 caixas, R$ 1.240' },
    { rotulo: 'Etapa', valor: 'Venda ganha' },
    { rotulo: 'Conversa', valor: 'anexada' },
  ],
} as const

/** Os números do dia da cena de painel (fictícios). */
export const painelDemo = {
  numeros: [
    { rotulo: 'Pedidos hoje', valor: '42' },
    { rotulo: 'Atrasados', valor: '3' },
    { rotulo: 'Entrou hoje', valor: 'R$ 6.180' },
  ],
  /** Pedidos por hora, das 8h às 18h, para as barrinhas. */
  porHora: [2, 3, 5, 4, 6, 3, 4, 6, 5, 3, 1],
} as const

/** Ponto do fluxo do agente: onde a conversa está. */
export type NoFluxo = 'whatsapp' | 'agente' | 'sistemas' | 'equipe'

/** Uma etapa da conversa de exemplo passando pelo fluxo. */
export interface EtapaFluxo {
  no: NoFluxo
  /** O que acontece ali, em uma frase. */
  texto: string
  /** Mensagem que aparece nessa etapa, quando há. */
  mensagem?: { de: 'cliente' | 'robo' | 'equipe'; texto: string }
}

/** Caminho da conversa: resolvido pelo agente ou passado para alguém da equipe. */
export interface CaminhoFluxo {
  id: 'resolve' | 'equipe'
  rotulo: string
  etapas: EtapaFluxo[]
}

// Conversas ilustrativas do diagrama "como eu ligo um agente": mostram o caminho, não um cliente real.
export const caminhosFluxo: CaminhoFluxo[] = [
  {
    id: 'resolve',
    rotulo: 'O agente resolve',
    etapas: [
      { no: 'whatsapp', texto: 'A mensagem chega a qualquer hora, inclusive de madrugada.', mensagem: { de: 'cliente', texto: 'Tem horário quinta à tarde?' } },
      { no: 'agente', texto: 'Entende que é um pedido de horário e decide olhar a agenda.' },
      { no: 'sistemas', texto: 'Vê que quinta às 15h está livre, reserva e anota o cliente no CRM.' },
      { no: 'whatsapp', texto: 'A confirmação volta na mesma conversa.', mensagem: { de: 'robo', texto: 'Marcado: quinta às 15h. Te lembro na véspera.' } },
    ],
  },
  {
    id: 'equipe',
    rotulo: 'Vai para a equipe',
    etapas: [
      { no: 'whatsapp', texto: 'A mensagem chega como qualquer outra.', mensagem: { de: 'cliente', texto: 'Cobraram um valor diferente do combinado.' } },
      { no: 'agente', texto: 'Percebe que é reclamação de cobrança e não tenta resolver sozinho.' },
      { no: 'equipe', texto: 'Alguém da equipe recebe a conversa com o resumo do caso e responde dali.' },
      { no: 'whatsapp', texto: 'O cliente segue na mesma conversa, agora com uma pessoa, sem repetir nada.', mensagem: { de: 'equipe', texto: 'Oi, aqui é do financeiro. Já estou vendo o seu caso.' } },
    ],
  },
]
