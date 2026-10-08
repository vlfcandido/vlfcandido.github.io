// Dados da seção "Interfaces que eu construo": os componentes vivos usam dados de exemplo
// (pedidos de uma loja fictícia) e a pilha de frontend diz, item a item, onde aquilo foi usado.
// Regra (08/10/2026): só entra tecnologia que o currículo ou um repositório prova. Angular fica
// fora até haver prova; Vue.js vem do currículo (Sovis, 2019 a 2021).

/** Um dia do gráfico de pedidos (exemplo). */
export interface DiaPedidos {
  /** Rótulo curto do dia, como aparece no eixo. */
  rotulo: string
  /** Rótulo completo, lido pelo leitor de tela. */
  extenso: string
  /** O dia com a preposição certa, para a frase "31 pedidos no sábado". */
  quando: string
  pedidos: number
}

/** Situação de um pedido na lista filtrável. */
export type SituacaoPedido = 'pago' | 'aguardando' | 'atrasado'

/** Pedido de exemplo da lista filtrável. */
export interface PedidoExemplo {
  numero: number
  cliente: string
  valor: number
  situacao: SituacaoPedido
}

/** Camada da pilha de frontend, da superfície (o que a pessoa vê) ao fundo (o que garante). */
export interface CamadaFront {
  id: 'tela' | 'visual' | 'qualidade'
  titulo: string
  /** O que esta camada resolve, em linguagem de quem contrata. */
  papel: string
  itens: ItemFront[]
}

/** Uma tecnologia da pilha e onde ela foi usada de verdade. */
export interface ItemFront {
  nome: string
  /** Onde usei: projeto ou emprego que prova o item. */
  onde: string
}

/** Rótulo de cada situação, na ordem dos chips. */
export const situacoes: Record<SituacaoPedido, string> = {
  pago: 'Pagos',
  aguardando: 'Aguardando',
  atrasado: 'Atrasados',
}

const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const SEMANA_EXTENSO = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

/**
 * Gera a série de pedidos por dia de exemplo, sempre igual (sem aleatório) para o teste e o
 * print baterem. É função para nada rodar quando o módulo é importado.
 *
 * @param dias quantidade de dias, do mais antigo ao mais recente.
 * @returns um item por dia, terminando num sábado.
 */
export function serieDePedidos(dias: 7 | 30): DiaPedidos[] {
  return Array.from({ length: dias }, (_, i) => {
    const atras = dias - 1 - i
    const semana = (6 - (atras % 7) + 7) % 7
    // Onda semanal (sexta e sábado cheios, domingo fraco) com uma subida leve no mês.
    const base = [6, 12, 14, 15, 17, 24, 27][semana]
    const pedidos = base + Math.round(i * 0.25) + ((i * 7) % 5)
    const dia = 30 - (atras % 30)
    return {
      rotulo: dias === 7 ? SEMANA[semana] : String(dia),
      extenso: dias === 7 ? SEMANA_EXTENSO[semana] : `dia ${dia}`,
      quando: dias === 7 ? `${semana === 0 || semana === 6 ? 'no' : 'na'} ${SEMANA_EXTENSO[semana]}` : `no dia ${dia}`,
      pedidos,
    }
  })
}

/** Pedidos de exemplo para a lista filtrável (nomes fictícios). */
export const pedidosExemplo: PedidoExemplo[] = [
  { numero: 1048, cliente: 'Marina Costa', valor: 189.9, situacao: 'pago' },
  { numero: 1047, cliente: 'Padaria Trigo Bom', valor: 642, situacao: 'aguardando' },
  { numero: 1046, cliente: 'Lucas Andrade', valor: 74.5, situacao: 'atrasado' },
  { numero: 1045, cliente: 'Ateliê Linha Fina', valor: 1250, situacao: 'pago' },
  { numero: 1044, cliente: 'Renata Lopes', valor: 98, situacao: 'aguardando' },
  { numero: 1043, cliente: 'Oficina do Zé', valor: 310, situacao: 'pago' },
]

/** Etapas do cartão de status, na ordem em que o pedido avança. */
export const etapasPedido = ['Recebido', 'Pago', 'Separado', 'Enviado', 'Entregue'] as const

/** Hora de exemplo em que cada etapa aconteceu, para o histórico do cartão. */
export const horasEtapas = ['09:12', '09:15', '10:40', '14:05', '16:30'] as const

/** O que o histórico registra em cada etapa (exemplo). */
export const notasEtapas = [
  'Pedido feito pelo site.',
  'Pagamento confirmado pelo banco.',
  'Itens conferidos no estoque.',
  'Saiu com a transportadora.',
  'Cliente avisado no celular.',
] as const

/** A pilha de frontend, da superfície ao fundo, com a prova de cada item. */
export const camadasFront: CamadaFront[] = [
  {
    id: 'tela',
    titulo: 'A tela',
    papel: 'O que a pessoa vê e clica.',
    itens: [
      { nome: 'React', onde: 'Este site e o painel do agente de vídeo, com 10 telas.' },
      { nome: 'Next.js', onde: 'O painel do bot de trading e o app de score de crédito.' },
      { nome: 'Vue.js', onde: 'Front-end de produto na Sovis, de 2019 a 2021.' },
      { nome: 'HTMX', onde: 'As telas do AprovaOS, que atualizam só o pedaço que mudou.' },
    ],
  },
  {
    id: 'visual',
    titulo: 'O visual',
    papel: 'O que deixa tudo consistente de uma tela para a outra.',
    itens: [
      { nome: 'Tailwind', onde: 'Este site, o painel do bot de trading e o app de score.' },
      { nome: 'Design system próprio', onde: 'A Maré, deste site, e o sistema de componentes do AprovaOS.' },
      { nome: 'Gráficos', onde: 'Recharts no painel de vídeo; SVG feito à mão no medidor de score e aqui.' },
    ],
  },
  {
    id: 'qualidade',
    titulo: 'A garantia',
    papel: 'O que faz a tela continuar funcionando depois da entrega.',
    itens: [
      { nome: 'TypeScript', onde: 'Este site, o painel do bot de trading e o app de score.' },
      { nome: 'Testes no navegador', onde: 'Playwright no painel do bot de trading; Vitest neste site.' },
      { nome: 'Acessibilidade', onde: 'Teclado, leitor de tela e menos movimento, aqui mesmo: tente usar esta seção só com o Tab.' },
    ],
  },
]
