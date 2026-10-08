// Matérias públicas sobre projetos em que trabalhei. Cada link foi conferido em 07/10/2026.
// Os títulos são reescritos (não copiam o da matéria) e o papel diz só o que eu fiz ali.

/** Motivo da ilustração em SVG própria de cada notícia (sem logo nem imagem da matéria). */
export type Ilustracao = 'agentes' | 'atendimento' | 'conversas' | 'chatbot' | 'parceria'

/** Matéria publicada por um veículo sobre um projeto em que trabalhei. */
export interface Noticia {
  /** Identificador em kebab-case, único. */
  id: string
  veiculo: string
  /** Data de publicação em ISO (AAAA-MM-DD). */
  data: string
  /** Título curto, reescrito. */
  titulo: string
  /** Uma frase com o que eu fiz no projeto citado. */
  papel: string
  url: string
  /** Slug da empresa em `clientes.ts` (e nome da logo em `public/logos/`). */
  empresa: string
  ilustracao: Ilustracao
}

export const noticias: Noticia[] = [
  {
    id: 'sicoob-ia-investimentos',
    veiculo: 'MobileTime',
    data: '2026-07-17',
    titulo: 'Sicoob põe IA generativa para apoiar decisões de investimento',
    papel: 'Lidero a equipe de IA que construiu o serviço, com três agentes especializados.',
    url: 'https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/',
    empresa: 'sicoob',
    ilustracao: 'agentes',
  },
  {
    id: 'wiv-5-milhoes',
    veiculo: 'MobileTime',
    data: '2026-06-12',
    titulo: 'Waizer passa de 5 milhões de conversas analisadas',
    papel: 'Trabalhei no Waizer, a plataforma da Wiv que analisa as conversas dos chatbots.',
    url: 'https://www.mobiletime.com.br/noticias/12/06/2026/wiv-5-milhoes/',
    empresa: 'wiv',
    ilustracao: 'conversas',
  },
  {
    id: 'wiv-o-tempo',
    veiculo: 'O Tempo',
    data: '2026-06-08',
    titulo: 'Wiv cresce com inteligência conversacional e mira R$ 20 milhões',
    papel: 'Trabalhei no Waizer, o produto de análise de conversas citado na matéria.',
    url: 'https://www.otempo.com.br/minas-sa/2026/6/8/wiv-projeta-faturamento-de-r-20-milhoes-ate-2027-com-inteligencia-conversacional',
    empresa: 'wiv',
    ilustracao: 'chatbot',
  },
  {
    id: 'contabilizei-concierge',
    veiculo: 'Blog do Google',
    data: '2025-03-20',
    titulo: 'Google Cloud destaca o The Concierge, IA de atendimento da Contabilizei',
    papel: 'Como arquiteto sênior de IA, fiz o The Concierge com Vertex AI.',
    url: 'https://blog.google/intl/pt-br/produtos/nas-nuvens/google-cloud-90-casos-de-ia-na-america-latina-que-estao-moldando-o-futuro-da-inovacao/',
    empresa: 'contabilizei',
    ilustracao: 'atendimento',
  },
  {
    id: 'vertigo-take-blip',
    veiculo: 'Vertigo',
    data: '2021-11-09',
    titulo: 'Vertigo vira parceira da Take Blip em chatbots',
    papel: 'Liderei os projetos de chatbot na Blip dentro da Vertigo.',
    url: 'https://vertigo.com.br/nova-parceria-vertigo-agora-e-take-blip-partner/',
    empresa: 'vertigo',
    ilustracao: 'parceria',
  },
]
