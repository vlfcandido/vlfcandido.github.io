// Texto da home nova (14/10/2026): prova na frente, protótipo antes de fechar como diferencial e
// o detalhe como assinatura. Funções em vez de constantes montadas, para nada rodar ao importar.
// Sem preço (decisão dele, 14/10/2026). Garantia de 30 dias de correção (decisão dele, 14/10/2026).

import { listarProjetos } from '../projetos'

/** Um trabalho em destaque, com a dor do cliente e o detalhe marcado à mão. */
export interface Destaque { slug: string; nome: string; dor: string; detalhe: string; href: string; imagem: string; alt: string }
/** Um passo de "Como funciona". */
export interface Passo { titulo: string; texto: string }
/** Uma frente de trabalho (vira chip de filtro da galeria). */
export interface Frente { titulo: string; resultado: string; exemplo: string }

/** Peças navegáveis de /trabalhos/ (HTML estático em public/trabalhos/). */
// 14/10/2026 (fix da Task 5): ganharam imagem e alt, porque entram no topo da página de projetos.
export const PECAS = [
  {
    slug: 'liga-varzea', nome: 'Liga Várzea FC (exemplo)', href: 'trabalhos/liga-varzea/',
    imagem: 'trabalhos/img/liga-varzea.jpg', alt: 'Tela inicial da Liga Várzea FC, com o painel de dados',
  },
  {
    slug: 'consultorio-exemplo', nome: 'Consultório Exemplo', href: 'trabalhos/consultorio-exemplo/',
    imagem: 'trabalhos/img/consultorio-exemplo.jpg', alt: 'Página inicial do Consultório Exemplo, com a busca de psicólogos',
  },
] as const

/**
 * Trechos que levam a marcação à mão, um por bloco. O componente parte o texto neles; o teste garante que
 * cada trecho existe no texto (senão a marcação some sem aviso).
 */
export const FRASES_MARCADAS = {
  promessa: 'Sicoob e Serasa Experian',
  prototipo: 'antes de fechar',
  garantia: '30 dias de correção',
} as const

/** Empresas do bloco "Onde já trabalhei", na ordem de exibição (logos liberados por ele em 14/10/2026). */
export const SLUGS_EMPRESAS = ['sicoob', 'serasa-experian', 'contabilizei', 'prefeitura-franca', 'wiv'] as const

/** Anos de software, de config/privado/carreira/respostas-padrao.md ("Software total = 13"). */
const ANOS_DE_SOFTWARE = 13

/**
 * Números da prova, contados na fonte e nunca arredondados para cima.
 *
 * @returns anos de software, empresas do bloco de logos e projetos (galeria + peças).
 */
export function numerosDeProva(): { anos: number; empresas: number; projetos: number } {
  return { anos: ANOS_DE_SOFTWARE, empresas: SLUGS_EMPRESAS.length, projetos: listarProjetos().length + PECAS.length }
}

/**
 * Monta todo o texto da home. Os componentes não têm texto fixo: tudo sai daqui.
 *
 * @returns os textos dos 6 blocos.
 */
export function conteudoHome() {
  const n = numerosDeProva()
  return {
    promessa: {
      titulo: `${n.anos} anos construindo sistemas para Sicoob e Serasa Experian.`,
      subtitulo: 'Agora para o seu negócio, cuidando até do detalhe que ninguém viu.',
      cta: 'Conversar no WhatsApp',
    },
    // Tela do 1º bloco no PC (decisão dele, 14/10/2026: "acaba a metade vazia"): um trabalho com o círculo
    // de caneta em volta do detalhe. `alvo` é a caixa do detalhe na imagem, em % da largura e da altura.
    vitrine: {
      slug: 'liga-varzea',
      href: 'trabalhos/liga-varzea/',
      imagem: 'trabalhos/img/liga-varzea-detalhe.jpg',
      alt: 'Painel da Liga Várzea com o valor da API ao lado do valor no banco, esperando conferência',
      legenda: 'A correção manual sobrevive à sincronização.',
      alvo: { x: 25.6, y: 71.2, l: 38.4, a: 9.6 },
    },
    prototipo: {
      titulo: 'Veja o seu sistema funcionando antes de fechar.',
      texto:
        'Em vez de uma proposta em texto, você recebe um protótipo navegável com a cara do seu negócio. Dá para clicar, testar e decidir com o sistema na mão.',
      exemploHref: 'trabalhos/consultorio-exemplo/',
      exemploRotulo: 'Abrir um exemplo navegável',
    },
    destaques: [
      {
        slug: 'liga-varzea', nome: 'Liga Várzea FC (exemplo)',
        dor: 'Cada atualização automática apagava a correção feita à mão.',
        detalhe: 'A correção manual sobrevive à sincronização e mostra de onde veio cada número.',
        href: 'trabalhos/liga-varzea/', imagem: 'trabalhos/img/liga-varzea.jpg',
        alt: 'Tela da Liga Várzea com a coluna de origem de cada número',
      },
      {
        slug: 'consultorio-exemplo', nome: 'Consultório Exemplo',
        dor: 'Paciente só marca terapia online quando confia em quem atende.',
        detalhe: 'O CRP é reconferido todo mês, e perfil irregular sai da busca com a agenda pausada.',
        href: 'trabalhos/consultorio-exemplo/', imagem: 'trabalhos/img/consultorio-exemplo.jpg',
        alt: 'Painel de verificação de CRP com um registro irregular em destaque',
      },
      {
        slug: 'aprovaos', nome: 'AprovaOS',
        dor: 'Ordem de serviço aprovada no papel some, e o cliente diz que não aprovou.',
        detalhe: 'Cada aprovação fica registrada com quem, quando e o que foi aprovado.',
        href: '#/projetos/aprovaos', imagem: 'img/capa-aprovaos-1040.jpg',
        alt: 'Tela do AprovaOS com o histórico de aprovação de uma ordem de serviço',
      },
    ] satisfies Destaque[],
    empresas: { titulo: 'Onde já trabalhei' },
    trabalhos: { titulo: 'Trabalhos com o detalhe marcado', verTodos: 'Ver todos os projetos' },
    como: { titulo: 'Como funciona' },
    passos: [
      { titulo: 'Protótipo antes de fechar', texto: 'Você vê e clica no seu sistema antes de decidir.' },
      { titulo: 'Escopo de 1 página', texto: 'O que entra, o que não entra e o prazo, por escrito.' },
      { titulo: 'Atualização a cada 12 h', texto: 'Você acompanha o andamento sem precisar cobrar.' },
      { titulo: 'Entrega documentada', texto: 'Manual, documentação técnica e testes automatizados.' },
      { titulo: 'Garantia', texto: '30 dias de correção depois da entrega.' },
    ] satisfies Passo[],
    garantia: '30 dias de correção depois da entrega, por escrito. E o pagamento fica retido pela plataforma até você receber.',
    frentes: [
      { titulo: 'IA e WhatsApp', resultado: 'Atendimento que responde sozinho e passa para você o que precisa de gente.', exemplo: 'Chatbot de agendamento' },
      { titulo: 'Sistemas e painéis', resultado: 'O controle do seu negócio numa tela, sem planilha perdida.', exemplo: 'Painel de gestão' },
      { titulo: 'Integrações e APIs', resultado: 'Os sistemas que você já usa conversando entre si.', exemplo: 'CRM ligado ao financeiro' },
    ] satisfies Frente[],
    quemSou: {
      titulo: 'Quem vai fazer o seu sistema',
      texto: [
        `Sou o Vinicius Candido, engenheiro de software há ${n.anos} anos.`,
        'Construí sistemas que aguentam escala de banco e de birô de crédito.',
        'Hoje levo esse cuidado para negócios que precisam de um sistema que funcione de verdade.',
      ],
      foto: 'img/vinicius-640.jpg',
      alt: 'Foto de Vinicius Candido',
    },
    chamada: { titulo: 'Me conte o que está travando o seu negócio.', cta: 'Conversar no WhatsApp' },
  }
}
