// Empresas e clientes exibidos no site. Arquivo único e fácil de editar:
// para tirar um nome, apague a linha dele. Para tirar a logo e deixar só o nome, apague o campo `logo`.
// As logos ficam em public/logos/ e foram baixadas do site oficial de cada empresa; quando o site não
// expunha a logo, foi usada a versão publicada pela própria Vertigo ou Wiv na lista de clientes delas.
// Use o caminho com `caminhoPublico(import.meta.env.BASE_URL, logo)`.

/** Segmento usado para agrupar as logos na página. */
export type Segmento =
  | 'publico'
  | 'financeiro'
  | 'saude'
  | 'varejo'
  | 'industria'
  | 'energia'
  | 'servicos'
  | 'telecom'
  | 'logistica'
  | 'tecnologia'

/** Rótulo de cada segmento, na ordem em que devem aparecer. */
export const segmentos: Record<Segmento, string> = {
  publico: 'Setor público e justiça',
  financeiro: 'Bancos, seguros e finanças',
  saude: 'Saúde',
  varejo: 'Varejo e consumo',
  industria: 'Indústria e agro',
  energia: 'Energia e óleo e gás',
  servicos: 'Serviços',
  telecom: 'Telecom',
  logistica: 'Logística',
  tecnologia: 'Tecnologia',
}

/** Empresa ou cliente com logo opcional (sem logo, o site mostra o nome em texto). */
export interface Cliente {
  /** Identificador em kebab-case; também é o nome do arquivo da logo. */
  slug: string
  nome: string
  segmento: Segmento
  /** Caminho relativo a `public/`, ex.: `logos/itau.png`. */
  logo?: string
}

/** Empresa onde o projeto foi meu de forma direta, ligada à história que conta o que eu fiz. */
export interface EmpresaDireta extends Cliente {
  /** Cargo ou papel, em poucas palavras. */
  papel: string
  /** Uma frase com o que eu fiz lá. */
  feito: string
  /** Matéria ou material público que conta a história (quando existe). */
  historia?: { texto: string; url: string }
  /** Slug da notícia em `noticias.ts` ou do case em `conteudo.ts`, quando houver. */
  ligadoA?: string
}

/** Grupo de clientes de uma empresa onde eu liderei os projetos. */
export interface GrupoClientes {
  empresa: 'vertigo' | 'wiv'
  /** Legenda que vai acima do grupo, com o vínculo. */
  legenda: string
  /** Material público de onde saiu a lista. */
  fonte: { texto: string; url: string }
  clientes: Cliente[]
}

export const empresasDiretas: EmpresaDireta[] = [
  {
    slug: 'sicoob',
    nome: 'Sicoob',
    segmento: 'financeiro',
    logo: 'logos/sicoob.svg',
    papel: 'Engenheiro de IA sênior, à frente técnica da IA de investimentos',
    feito: 'Lidero tecnicamente a frente de IA do assistente de investimentos, com três agentes especializados.',
    historia: { texto: 'MobileTime, 17/07/2026', url: 'https://www.mobiletime.com.br/noticias/17/07/2026/sicoob-ia-investimento/' },
    ligadoA: 'sicoob-ia-investimentos',
  },
  {
    slug: 'contabilizei',
    nome: 'Contabilizei',
    segmento: 'servicos',
    logo: 'logos/contabilizei.svg',
    // Corrigido em 08/10/2026 (ele): o atendimento com IA citado pelo Google Cloud não foi trabalho dele.
    // Antes: papel "Arquiteto sênior de IA", com a matéria do Google como história.
    papel: 'Agentes de IA de vendas (SDR)',
    feito: 'Fiz os agentes de IA de vendas (SDR).',
    ligadoA: 'contabilizei-vendas',
  },
  {
    slug: 'serasa-experian',
    nome: 'Serasa Experian',
    segmento: 'financeiro',
    logo: 'logos/serasa-experian.webp',
    papel: 'Engenheiro de IA sênior e tech lead',
    feito: 'Liderei um squad de engenharia cuidando da segurança e da modernização de aplicações em grande escala.',
  },
  {
    slug: 'vertigo',
    nome: 'Vertigo',
    segmento: 'tecnologia',
    logo: 'logos/vertigo.png',
    papel: 'Tech lead dos projetos Blip',
    feito: 'Liderei o time de projetos de chatbot na Blip, de órgãos públicos a grandes empresas.',
    historia: { texto: 'diretório de parceiros Blip', url: 'https://www.blip.ai/partners/en/experts/vertigo-tecnologia/' },
    ligadoA: 'vertigo-take-blip',
  },
  {
    slug: 'wiv',
    nome: 'Wiv',
    segmento: 'tecnologia',
    logo: 'logos/wiv.png',
    papel: 'Engenheiro no Waizer',
    feito: 'Trabalhei no Waizer, a plataforma da Wiv que analisa as conversas dos chatbots e aponta onde travam.',
    historia: { texto: 'MobileTime, 12/06/2026', url: 'https://www.mobiletime.com.br/noticias/12/06/2026/wiv-5-milhoes/' },
    ligadoA: 'wiv-5-milhoes',
  },
  {
    slug: 'prefeitura-franca',
    nome: 'Prefeitura de Franca',
    segmento: 'publico',
    logo: 'logos/prefeitura-franca.png',
    papel: 'Case Vertigo',
    feito: 'Chatbot da Saúde que automatiza 5 mil atendimentos por mês.',
    historia: {
      texto: 'case publicado pela Vertigo',
      url: 'https://materiais.vertigo.com.br/case-chatbot-prefeitura-de-franca-estado-de-sao-paulo',
    },
    ligadoA: 'prefeitura-franca',
  },
  {
    slug: 'araguaia',
    nome: 'Araguaia',
    segmento: 'industria',
    logo: 'logos/araguaia.png',
    papel: 'Case Vertigo',
    feito: 'Chatbot de atendimento e captação que aumentou os leads do time comercial.',
    historia: { texto: 'case publicado pela Vertigo', url: 'https://materiais.vertigo.com.br/case-araguaia-chatbot' },
    ligadoA: 'araguaia',
  },
]

export const gruposClientes: GrupoClientes[] = [
  {
    empresa: 'vertigo',
    legenda: 'Projetos que liderei na Vertigo',
    fonte: { texto: 'clientes no site da Vertigo', url: 'https://www.vertigo.com.br/' },
    clientes: [
      // setor público e justiça
      { slug: 'mprj', nome: 'MPRJ', segmento: 'publico', logo: 'logos/mprj.png' },
      { slug: 'mpsp', nome: 'MPSP', segmento: 'publico', logo: 'logos/mpsp.png' },
      { slug: 'tjpr', nome: 'TJPR', segmento: 'publico', logo: 'logos/tjpr.png' },
      { slug: 'tjrj', nome: 'TJRJ', segmento: 'publico', logo: 'logos/tjrj.png' },
      { slug: 'tjrr', nome: 'TJRR', segmento: 'publico', logo: 'logos/tjrr.png' },
      { slug: 'defensoria-sp', nome: 'Defensoria Pública de SP', segmento: 'publico', logo: 'logos/defensoria-sp.svg' },
      { slug: 'governo-rj', nome: 'Governo do Estado do RJ', segmento: 'publico', logo: 'logos/governo-rj.png' },
      { slug: 'prefeitura-rio', nome: 'Prefeitura do Rio', segmento: 'publico', logo: 'logos/prefeitura-rio.png' },
      { slug: 'ibge', nome: 'IBGE', segmento: 'publico', logo: 'logos/ibge.png' },
      { slug: 'casa-da-moeda', nome: 'Casa da Moeda', segmento: 'publico', logo: 'logos/casa-da-moeda.png' },
      { slug: 'semad-mg', nome: 'SEMAD-MG', segmento: 'publico', logo: 'logos/semad-mg.png' },
      { slug: 'rnp', nome: 'RNP', segmento: 'publico', logo: 'logos/rnp.png' },
      { slug: 'adasa', nome: 'Adasa', segmento: 'publico', logo: 'logos/adasa.png' },
      // bancos, seguros e finanças
      { slug: 'itau', nome: 'Itaú', segmento: 'financeiro', logo: 'logos/itau.png' },
      { slug: 'banco-do-brasil', nome: 'Banco do Brasil', segmento: 'financeiro', logo: 'logos/banco-do-brasil.png' },
      { slug: 'b3', nome: 'B3', segmento: 'financeiro', logo: 'logos/b3.png' },
      { slug: 'anbima', nome: 'Anbima', segmento: 'financeiro', logo: 'logos/anbima.png' },
      { slug: 'sofisa', nome: 'Banco Sofisa', segmento: 'financeiro', logo: 'logos/sofisa.png' },
      { slug: 'bs2', nome: 'BS2', segmento: 'financeiro', logo: 'logos/bs2.png' },
      { slug: 'cnp-seguros', nome: 'CNP Seguros', segmento: 'financeiro', logo: 'logos/cnp-seguros.png' },
      { slug: 'credsystem', nome: 'Credsystem', segmento: 'financeiro', logo: 'logos/credsystem.png' },
      { slug: 'icatu', nome: 'Icatu', segmento: 'financeiro', logo: 'logos/icatu.png' },
      { slug: 'prudential', nome: 'Prudential', segmento: 'financeiro', logo: 'logos/prudential.svg' },
      { slug: 'sompo', nome: 'Sompo', segmento: 'financeiro', logo: 'logos/sompo.png' },
      { slug: 'valia', nome: 'Valia', segmento: 'financeiro', logo: 'logos/valia.png' },
      // saúde
      { slug: 'sulamerica', nome: 'SulAmérica', segmento: 'saude', logo: 'logos/sulamerica.png' },
      { slug: 'unimed', nome: 'Unimed', segmento: 'saude', logo: 'logos/unimed.png' },
      { slug: 'sharecare', nome: 'Sharecare', segmento: 'saude', logo: 'logos/sharecare.png' },
      // varejo e consumo
      { slug: 'gpa', nome: 'GPA', segmento: 'varejo', logo: 'logos/gpa.svg' },
      { slug: 'b2w', nome: 'B2W', segmento: 'varejo', logo: 'logos/b2w.png' },
      { slug: 'livelo', nome: 'Livelo', segmento: 'varejo', logo: 'logos/livelo.svg' },
      // indústria e agro
      { slug: 'ab-inbev', nome: 'AB InBev', segmento: 'industria', logo: 'logos/ab-inbev.svg' },
      { slug: 'pg', nome: 'P&G', segmento: 'industria', logo: 'logos/pg.png' },
      { slug: 'philip-morris', nome: 'Philip Morris', segmento: 'industria', logo: 'logos/philip-morris.svg' },
      { slug: 'arcelormittal', nome: 'ArcelorMittal', segmento: 'industria', logo: 'logos/arcelormittal.png' },
      { slug: 'cni', nome: 'CNI', segmento: 'industria', logo: 'logos/cni.png' },
      { slug: 'firjan', nome: 'Firjan', segmento: 'industria', logo: 'logos/firjan.png' },
      { slug: 'grupo-petropolis', nome: 'Grupo Petrópolis', segmento: 'industria', logo: 'logos/grupo-petropolis.png' },
      { slug: 'monsanto', nome: 'Monsanto', segmento: 'industria', logo: 'logos/monsanto.png' },
      { slug: 'yara', nome: 'Yara', segmento: 'industria', logo: 'logos/yara.svg' },
      { slug: 'tigre', nome: 'Tigre', segmento: 'industria', logo: 'logos/tigre.svg' },
      { slug: 'vicunha', nome: 'Vicunha', segmento: 'industria', logo: 'logos/vicunha.png' },
      { slug: 'queiroz-galvao', nome: 'Queiroz Galvão', segmento: 'industria', logo: 'logos/queiroz-galvao.png' },
      // energia, óleo e gás
      { slug: 'petrobras', nome: 'Petrobras', segmento: 'energia', logo: 'logos/petrobras.png' },
      { slug: 'engie', nome: 'Engie', segmento: 'energia', logo: 'logos/engie.svg' },
      { slug: 'ipiranga', nome: 'Ipiranga', segmento: 'energia', logo: 'logos/ipiranga.svg' },
      { slug: 'tbg', nome: 'TBG', segmento: 'energia', logo: 'logos/tbg.png' },
      // telecom e logística
      { slug: 'tim', nome: 'TIM', segmento: 'telecom', logo: 'logos/tim.png' },
      { slug: 'rodonaves', nome: 'Rodonaves', segmento: 'logistica', logo: 'logos/rodonaves.png' },
    ],
  },
  {
    empresa: 'wiv',
    legenda: 'Projetos que liderei na Wiv',
    fonte: {
      texto: 'clientes no site da Wiv e O Tempo, 08/06/2026',
      url: 'https://www.otempo.com.br/minas-sa/2026/6/8/wiv-projeta-faturamento-de-r-20-milhoes-ate-2027-com-inteligencia-conversacional',
    },
    clientes: [
      // saúde
      { slug: 'unimed-poa', nome: 'Unimed Porto Alegre', segmento: 'saude', logo: 'logos/unimed-poa.png' },
      { slug: 'bradesco-dental', nome: 'Bradesco Dental', segmento: 'saude', logo: 'logos/bradesco-dental.png' },
      { slug: 'odontoprev', nome: 'OdontoPrev', segmento: 'saude', logo: 'logos/odontoprev.png' },
      { slug: 'conexa', nome: 'Conexa', segmento: 'saude', logo: 'logos/conexa.png' },
      { slug: 'pasa', nome: 'PASA', segmento: 'saude', logo: 'logos/pasa.png' },
      { slug: 'essentia', nome: 'Essentia', segmento: 'saude' },
      // varejo e consumo
      { slug: 'amazon', nome: 'Amazon', segmento: 'varejo', logo: 'logos/amazon.png' },
      { slug: 'vivara', nome: 'Vivara', segmento: 'varejo', logo: 'logos/vivara.png' },
      { slug: 'olx', nome: 'OLX', segmento: 'varejo', logo: 'logos/olx.png' },
      { slug: 'westwing', nome: 'Westwing', segmento: 'varejo', logo: 'logos/westwing.svg' },
      { slug: 'pobre-juan', nome: 'Pobre Juan', segmento: 'varejo', logo: 'logos/pobre-juan.svg' },
      // finanças
      { slug: 'neon', nome: 'Neon', segmento: 'financeiro', logo: 'logos/neon.svg' },
      { slug: 'sicoob-cressem', nome: 'Sicoob Cressem', segmento: 'financeiro', logo: 'logos/sicoob-cressem.png' },
      // serviços
      { slug: 'conta-azul', nome: 'Conta Azul', segmento: 'servicos', logo: 'logos/conta-azul.svg' },
      { slug: 'bluefit', nome: 'Bluefit', segmento: 'servicos', logo: 'logos/bluefit.svg' },
      { slug: 'pluxee', nome: 'Pluxee', segmento: 'servicos', logo: 'logos/pluxee.svg' },
      { slug: 'minu', nome: 'Minu', segmento: 'servicos', logo: 'logos/minu.svg' },
      // energia
      { slug: 'comgas', nome: 'Comgás', segmento: 'energia', logo: 'logos/comgas.svg' },
      { slug: 'bulbe', nome: 'Bulbe', segmento: 'energia', logo: 'logos/bulbe.svg' },
      { slug: 'golden-energy', nome: 'Golden Energy', segmento: 'energia', logo: 'logos/golden-energy.png' },
      // indústria e agro
      { slug: 'scania', nome: 'Scania', segmento: 'industria', logo: 'logos/scania.svg' },
      { slug: 'mosaic', nome: 'Mosaic', segmento: 'industria', logo: 'logos/mosaic.png' },
      { slug: 'boa-safra', nome: 'Boa Safra', segmento: 'industria', logo: 'logos/boa-safra.png' },
    ],
  },
]

/**
 * Seleção de logos da página principal, na ordem em que aparecem: nomes que o dono de um negócio
 * reconhece de cara, de setores diferentes. Todas saem dos grupos acima; o "ver todas" mostra o resto.
 *
 * Regras (08/10/2026, plano do juiz, M1): as 6 primeiras são de 6 ramos diferentes, nenhum banco nelas,
 * e nunca dois do segmento `financeiro` seguidos. As 6 primeiras vão para a abertura (`logosAbertura`).
 * Ordem anterior: itau, banco-do-brasil, petrobras, unimed, amazon, tim, b3, olx, sulamerica, vivara,
 * ipiranga, scania, gpa, conta-azul, neon, prefeitura-rio, odontoprev, comgas.
 * Comgás saiu e Bradesco Dental entrou (é citada na legenda da demo). A Prefeitura do Rio saiu da faixa
 * por decisão dele (08/10/2026) e ficou só na grade; para não juntar dois bancos no fim, Itaú e GPA
 * trocaram de lugar (11º e 12º) em relação à ordem do juiz.
 */
export const selecaoLogos: string[] = [
  'amazon',
  'unimed',
  'conta-azul',
  'scania',
  'petrobras',
  'tim',
  'olx',
  'odontoprev',
  'vivara',
  'bradesco-dental',
  'itau',
  'gpa',
  'neon',
  'sulamerica',
  'banco-do-brasil',
  'ipiranga',
  'b3',
]

/** Quantas logos da seleção sobem para a abertura (M4). */
export const QTD_ABERTURA = 6

/** As logos da abertura: as primeiras da seleção. */
export const logosAbertura: string[] = selecaoLogos.slice(0, QTD_ABERTURA)

/**
 * Linha-âncora abaixo das logos da abertura, calculada a partir do total (nunca um número fixo).
 *
 * @param total quantas empresas há nos grupos (Vertigo + Wiv).
 * @returns por exemplo "e mais 66 empresas" para 72.
 */
export function textoMaisEmpresas(total: number): string {
  return `e mais ${total - QTD_ABERTURA} empresas`
}

/**
 * Ordem da faixa da seção de Provas: começa na 7ª logo da seleção e põe as da abertura no fim
 * (rotação), para a pessoa não ver as mesmas logos duas vezes seguidas. Nenhuma logo some.
 */
export const faixaProvas: string[] = [...selecaoLogos.slice(QTD_ABERTURA), ...logosAbertura]

/**
 * Siglas setoriais que vão para o fim da grade "Todas" (M2): sem elas no começo, quem abre a grade vê
 * marcas antes de cinco siglas de justiça em sequência. O resto segue a ordem de declaração.
 */
export const fimDaGrade: string[] = ['mprj', 'mpsp', 'tjpr', 'tjrj', 'tjrr', 'semad-mg', 'rnp', 'adasa', 'tbg']

/**
 * Devolve a lista com os clientes de `fimDaGrade` no fim, na ordem dessa lista; os outros mantêm a ordem.
 *
 * @param lista clientes na ordem de declaração.
 * @returns nova lista, sem alterar a original.
 */
export function ordenarGrade<T extends { slug: string }>(lista: T[]): T[] {
  const fim = new Set(fimDaGrade)
  const fimOrdenado = fimDaGrade.flatMap((s) => lista.filter((c) => c.slug === s))
  return [...lista.filter((c) => !fim.has(c.slug)), ...fimOrdenado]
}

/**
 * Rótulo curto de cada filtro de ramo, na ordem dos chips (M3: a ordem dos ramos que mais pedem no 99).
 * Ordem anterior: Finanças, Indústria e agro, Setor público, Saúde, Varejo, Energia, Serviços.
 * Segmentos com menos de três empresas ficam só em "Todos".
 */
export const rotuloCurtoRamo: Partial<Record<Segmento, string>> = {
  saude: 'Saúde',
  varejo: 'Varejo',
  servicos: 'Serviços',
  industria: 'Indústria e agro',
  financeiro: 'Finanças',
  energia: 'Energia',
  publico: 'Setor público',
}

/**
 * Clientes em cujo projeto ele só participou, sem liderar (decisão dele, 08/10/2026). A legenda da logo
 * diz "participei", nunca "liderei".
 */
export const soParticipei: ReadonlySet<string> = new Set(['minu'])
