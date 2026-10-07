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

/** Linha da oferta: o que eu faço, em uma frase. */
export interface Oferta {
  titulo: string
  descricao: string
}

/** Case público ou projeto próprio exibido em card. */
export interface Case {
  /** Também é o nome do print: `public/prints/<slug>.png`. */
  slug: string
  tipo: 'publico' | 'proprio'
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
  titulo: 'Engenheiro de Software Sênior · 13 anos',
  chamada: 'Seu projeto feito por quem constrói IA no Sicoob e já construiu na Contabilizei.',
  resumo:
    'Chatbots de WhatsApp, automações, sites, sistemas e integrações para o seu negócio, com preço fechado na primeira conversa e entrega testada. Hoje sou engenheiro de IA sênior no Sicoob, onde lidero tecnicamente a frente de IA do assistente de investimentos. Construo software há 13 anos: back-end em Java, Node.js e Python, front quando o projeto pede e IA aplicada em produção desde 2021. Liderei os projetos de chatbot Blip da Vertigo, parceira certificada da Blip, e trabalhei no Waizer, a plataforma de análise de conversas da Wiv.',
  notaTrabalho: 'Do seu lado, só preciso do acesso ao que já existe e de alguém para tirar dúvidas.',
  convite:
    'Me chame pelo 99Freelas ou pelo LinkedIn e conte o que você precisa. Respondo com o preço fechado e o prazo.',
} as const

export const oferta: Oferta[] = [
  {
    titulo: 'Chatbots e agentes de IA no WhatsApp',
    descricao: 'Pela API oficial, que atendem, vendem e agendam, com o custo de mensagens explicado antes.',
  },
  {
    titulo: 'Automações e integrações',
    descricao: 'CRM, ERP, agenda, planilhas e pagamentos conversando entre si, sem copiar e colar.',
  },
  {
    titulo: 'Sites e sistemas',
    descricao: 'Landing pages rápidas, painéis e SaaS com login e pagamento, prontos para uso real.',
  },
  {
    titulo: 'Ajustes, segurança e testes',
    descricao: 'Correções em sistemas que já existem sem quebrar o que funciona, e testes de aplicações e de IA.',
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
    rotulo: 'testes automáticos passando no meu bot de trading',
    fonte: { texto: 'vitrine no GitHub', url: 'https://github.com/vlfcandido/nexus-quant-showcase' },
  },
]

export const cases: Case[] = [
  {
    slug: 'sicoob-investimentos',
    tipo: 'publico',
    titulo: 'Assistente de investimentos com IA · Sicoob',
    contexto: 'As equipes das cooperativas precisavam de apoio rápido e confiável no atendimento consultivo de investimentos.',
    feito:
      'Sou engenheiro de IA sênior no Sicoob e lidero tecnicamente a frente de IA do assistente, que usa três agentes: um encaminha a pergunta, um responde sobre investimentos e um cuida das perguntas frequentes.',
    metrica: 'Em uso pelas equipes das cooperativas, segundo a matéria publicada.',
    fonte: { texto: 'MobileTime, 17/07/2026', url: 'https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/' },
    stack: ['Python', 'agentes de IA', 'multiagente', 'RAG'],
    temPrint: false,
    alt: 'Ilustração do assistente de investimentos com três agentes de IA',
  },
  {
    slug: 'concierge-contabilizei',
    tipo: 'publico',
    titulo: 'The Concierge · atendimento com IA na Contabilizei',
    contexto: 'Clientes de contabilidade precisavam de respostas rápidas e certas sobre serviços contábeis e financeiros.',
    feito:
      'Fui arquiteto sênior de IA na Contabilizei (2025–2026) e trabalhei no The Concierge, o atendimento ao cliente com IA generativa construído em Vertex AI.',
    metrica: 'Citado pelo Google Cloud entre 90 casos de IA da América Latina.',
    fonte: {
      texto: 'Google Cloud, 20/03/2025',
      url: 'https://blog.google/intl/pt-br/produtos/nas-nuvens/google-cloud-90-casos-de-ia-na-america-latina-que-estao-moldando-o-futuro-da-inovacao/',
    },
    stack: ['Vertex AI', 'Vertex AI Search', 'Model Garden', 'IA generativa'],
    temPrint: false,
    alt: 'Ilustração do atendimento com IA da Contabilizei',
  },
  {
    slug: 'prefeitura-franca',
    tipo: 'publico',
    titulo: 'Chatbot da Saúde · Prefeitura de Franca (SP)',
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
    titulo: 'Chatbot de captação · Araguaia (fertilizantes)',
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
    titulo: 'Waizer · análise de conversas de chatbot (Wiv)',
    contexto: 'Empresas com vários robôs de atendimento não sabiam onde as conversas travavam.',
    feito: 'Trabalhei no Waizer e em chatbots da Wiv, plataforma que analisa as conversas e aponta o que melhorar.',
    metrica: 'A plataforma passou de 5 milhões de conversas analisadas e monitora mais de 300 robôs.',
    fonte: {
      texto: 'MobileTime, 12/06/2026',
      url: 'https://www.mobiletime.com.br/noticias/12/06/2026/wiv-5-milhoes/',
    },
    stack: ['IA conversacional', 'análise de conversas', 'chatbots'],
    temPrint: false,
    alt: 'Painel do Waizer com indicadores de conversas de chatbot',
  },
  {
    slug: 'nexus-quant',
    tipo: 'proprio',
    titulo: 'Bot de trading em cripto (estudo)',
    contexto: 'Operar 24 horas exige reconciliar ordens com a corretora sem erro.',
    feito:
      'Serviço em Python com reconciliação na corretora, filas Redis, monitoramento e painel web próprio. Hoje roda só em simulação.',
    metrica: '1.060 testes automáticos passando; a vitrine mostra o que deu errado, inclusive as taxas.',
    fonte: { texto: 'vitrine no GitHub', url: 'https://github.com/vlfcandido/nexus-quant-showcase' },
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Redis Streams', 'Next.js', 'Cloud Run'],
    temPrint: true,
    alt: 'Painel do bot de trading com posições, ordens e métricas',
  },
  {
    slug: 'nexus-clips',
    tipo: 'proprio',
    titulo: 'Agente que transforma notícia em vídeo curto',
    contexto: 'Produzir cortes para TikTok, Reels e Shorts sobre o assunto do momento toma horas por vídeo.',
    feito: 'Protótipo de agente que acompanha X, YouTube e RSS, escolhe o tema e prepara o corte com legenda.',
    metrica: 'Upload no YouTube funcionando; o fluxo de ponta a ponta ainda está em construção.',
    fonte: { texto: 'projeto próprio (em construção)' },
    stack: ['LangGraph', 'Claude API', 'Whisper', 'TTS', 'FFmpeg', 'React'],
    temPrint: true,
    alt: 'Tela do agente de vídeo com a fila de cortes gerados',
  },
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
    titulo: 'AprovaOS · SaaS de estudos com agente de IA',
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
    titulo: 'Bureau de crédito · prova de conceito',
    contexto: 'Score de crédito auditável e um app web para consultar.',
    feito: 'Prova de conceito com score, app web instalável e deploy automatizado no Google Cloud.',
    metrica: 'Pipeline de CI/CD até o Google Cloud desde a primeira versão.',
    fonte: { texto: 'projeto próprio (código privado)' },
    stack: ['FastAPI', 'PostgreSQL', 'Redis', 'Next.js', 'PWA', 'GCP'],
    temPrint: false,
    alt: 'Tela do app do bureau de crédito com a consulta de score',
  },
]

export const passos: Passo[] = [
  {
    titulo: 'Preço fechado na primeira mensagem',
    descricao: 'Com o que entra e o que não entra. Nada começa sem o seu ok.',
  },
  {
    titulo: 'Versão de teste em 24 a 48 horas',
    descricao: 'Você acompanha por um link desde cedo e recebe notícia a cada 12 horas.',
  },
  {
    titulo: 'Entrega com Ficha de Entrega',
    descricao: 'O que foi feito, como testar, resultado dos testes e o próximo passo já orçado.',
  },
  {
    titulo: '7 dias de correção sem custo',
    descricao: 'Apareceu algo no que foi entregue, eu corrijo.',
  },
]

export const stack: CamadaStack[] = [
  { camada: 'Back-end', itens: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'Node.js', 'TypeScript', 'REST', 'webhooks'] },
  { camada: 'IA', itens: ['agentes', 'multiagente', 'RAG', 'LangGraph', 'Google ADK', 'OpenAI', 'Gemini', 'Claude', 'Vertex AI', 'avaliação de LLM'] },
  { camada: 'Chatbots', itens: ['WhatsApp API oficial', 'Blip', 'Telegram'] },
  { camada: 'Front e mobile', itens: ['React', 'Next.js', 'Vue.js', 'Flutter'] },
  { camada: 'Dados', itens: ['PostgreSQL', 'Redis', 'BigQuery', 'Firestore'] },
  { camada: 'Nuvem e qualidade', itens: ['GCP', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'TDD', 'pytest'] },
]

export const links: LinkExterno[] = [
  { rotulo: 'GitHub', url: 'https://github.com/vlfcandido', descricao: 'código e projetos' },
  { rotulo: 'LinkedIn', url: 'https://www.linkedin.com/in/viniciusf-candido', descricao: 'carreira' },
  { rotulo: '99Freelas', url: 'https://www.99freelas.com.br/user/vinicius-candido-ia', descricao: 'contratar um projeto' },
]
