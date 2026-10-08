// Trajetória: os empregos, do atual para o primeiro, tirados do currículo de out/2026.
// Uma conquista por emprego, com o mesmo cuidado do resto do site: nada que o currículo não diga.
// O vínculo formal do emprego atual não é citado; o site fala de Sicoob, onde o trabalho acontece.
// Os projetos freelance (os da Wiv) ficam separados, em `freelance`, porque não são emprego.

/** Um emprego na linha do tempo. */
export interface Emprego {
  /** Identificador em kebab-case. */
  slug: string
  empresa: string
  /** Complemento do nome quando o trabalho foi alocado num cliente (ex.: "na Serasa Experian"). */
  local?: string
  /** Caminho relativo a `public/`; sem logo, o site mostra o nome em texto. */
  logo?: string
  /** Logo branca ou clara no original: vai sobre placa escura. */
  logoClara?: boolean
  cargo: string
  /** Período como no currículo (ex.: "set/2021 a jan/2025"). */
  periodo: string
  /** Uma linha com o principal resultado. */
  resultado: string
  /** Emprego atual: aparece em destaque. */
  atual?: boolean
  /** Rótulo para empregos que correram ao mesmo tempo que outro. */
  paralelo?: string
  /** Começo de carreira: fica recolhido atrás de "ver mais". */
  inicio?: boolean
}

export const empregos: Emprego[] = [
  {
    slug: 'sicoob',
    empresa: 'Sicoob',
    logo: 'logos/sicoob.svg',
    cargo: 'Engenheiro de IA sênior e tech lead',
    periodo: 'mai/2026 até hoje',
    resultado:
      'Lidero tecnicamente a frente de IA de investimentos: três agentes que montam a simulação de carteira para os consultores das cooperativas.',
    atual: true,
  },
  {
    slug: 'contabilizei',
    empresa: 'Contabilizei',
    logo: 'logos/contabilizei.svg',
    cargo: 'Arquiteto sênior de IA',
    periodo: '2025 a mar/2026',
    resultado: 'Arquitetura do The Concierge, atendimento com IA citado pelo Google Cloud entre 90 casos de IA da América Latina.',
  },
  {
    slug: 'ntt-data',
    empresa: 'NTT DATA',
    local: 'na Serasa Experian',
    logo: 'logos/ntt-data.svg',
    logoClara: true,
    cargo: 'Engenheiro de IA sênior',
    periodo: 'fev/2025 a ago/2025',
    resultado: 'Responsável técnico por um squad que atuou em cerca de 300 aplicações, corrigindo vulnerabilidades e padronizando CI/CD.',
    paralelo: 'Em paralelo à Contabilizei',
  },
  {
    slug: 'vertigo',
    empresa: 'Vertigo',
    logo: 'logos/vertigo.png',
    cargo: 'Tech lead de IA conversacional',
    periodo: 'set/2021 a jan/2025',
    resultado: 'Liderei a entrega de mais de 80 chatbots e a certificação da empresa como parceira oficial Blip.',
  },
  {
    slug: 'sovis',
    empresa: 'Sovis',
    logo: 'logos/sovis.png',
    cargo: 'Desenvolvedor full stack sênior',
    periodo: 'abr/2019 a set/2021',
    resultado: 'APIs em Java com Spring Boot, front-end em Vue.js e app em Flutter, com TDD e CI/CD.',
    inicio: true,
  },
  {
    slug: 'festval',
    empresa: 'Festval',
    logo: 'logos/festval.webp',
    cargo: 'Engenheiro de software Java',
    periodo: '2017 a 2019',
    resultado: 'Sistemas de varejo em Java e SQL.',
    inicio: true,
  },
  {
    slug: 'linx',
    empresa: 'Linx',
    cargo: 'Engenheiro de software Java',
    periodo: '2013 a 2017',
    resultado: 'ERP de varejo em Java e SQL.',
    inicio: true,
  },
]

/** Trabalho freelance: projetos, não emprego. */
export const freelance = {
  empresa: 'Wiv',
  logo: 'logos/wiv.png',
  papel: 'Projetos freelance',
  resultado: 'Trabalhei no Waizer, a plataforma que analisa as conversas dos chatbots e aponta onde travam, e liderei projetos de clientes da Wiv.',
} as const
