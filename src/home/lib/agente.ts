// Agente trabalhando sozinho (18/10/2026): o hero deixa de pedir decisões e passa a mostrar o atendimento
// acontecendo. Fonte única dos quatro roteiros, da linha do tempo e do painel de automação. O campo de pergunta
// saiu em 19/10/2026: a cena roda sozinha e a honestidade mora no selo curto de demonstração.
// Funções puras: nada roda ao importar.

/** Os quatro ramos do seletor. */
export type RamoId = 'pet' | 'clinica' | 'loja' | 'servicos'

/** As cinco ações do painel e a passagem para a equipe. */
export type ChaveAcao = 'consulta' | 'reserva' | 'ficha' | 'dono' | 'lembrete' | 'equipe'

/** Fala da conversa, de um dos dois lados. */
export interface Fala {
  tipo: 'cliente' | 'agente'
  texto: string
  /** Segundo do ciclo em que a fala entra. */
  em: number
  /** Horário mostrado no balão. */
  hora: string
}

/** Ação do painel de automação, acendendo sozinha na linha do tempo. */
export interface Acao {
  tipo: 'acao'
  chave: ChaveAcao
  rotulo: string
  detalhe: string
  em: number
  hora: string
  /** Entra no contador de resolvidos sem ninguém tocar. */
  resolve: boolean
  /** Pedido que fugiu da base e foi passado para uma pessoa. */
  equipe: boolean
}

/** Um evento da cena, de fala ou de ação. */
export type Evento = Fala | Acao

/** Um ramo completo, com conversa e automação. */
export interface Ramo {
  id: RamoId
  rotulo: string
  negocio: string
  descricao: string
  foraDoHorario: string
  /** Mensagem pré-preenchida no wa.me, com o ramo do visitante. */
  mensagemWhatsapp: string
  eventos: Evento[]
}

/** Todo o texto fixo da cena. */
export interface ConteudoAgente {
  rotulo: string
  titulo: string
  texto: string
  chamadaRamo: string
  painelTitulo: string
  contadorSingular: string
  contadorPlural: string
  /** Selo curto de honestidade: a cena é uma demonstração. */
  demonstracao: string
  cta: string
  peca: string
  aoVivo: string
}

/** O que a cena mostra em um instante do ciclo. */
export interface Quadro {
  mensagens: Fala[]
  acoes: Acao[]
  digitando: boolean
  hora: string
  resolvidos: number
  equipe: boolean
  fim: boolean
}

/** Quanto tempo o quadro final fica parado antes de o ciclo recomeçar, em segundos. */
const PAUSA_FIM = 4.2

/** Tempo em que o balão de "digitando" fica visível antes de cada resposta do agente, em segundos. */
const DIGITANDO = 1.6

/** Textos fixos da cena. */
export const AGENTE: ConteudoAgente = {
  rotulo: 'Agente no WhatsApp',
  titulo: 'Ele atende sozinho.',
  texto: 'Escolha o ramo. O resto é com ele.',
  chamadaRamo: 'Veja no seu ramo',
  painelTitulo: 'O que ele fez sozinho',
  contadorSingular: 'resolvido sem ninguém tocar',
  contadorPlural: 'resolvidos sem ninguém tocar',
  demonstracao: 'demonstração',
  cta: 'Quero isso no meu WhatsApp',
  peca: 'Ver o Pelo Solto inteiro',
  aoVivo: 'trabalhando agora',
}

/** Ramo inicial: a cena já roda no pet shop quando a página carrega. */
export const RAMO_PADRAO: RamoId = 'pet'

/** Link da peça que serve de cenário para o agente. */
export const PECA_DO_AGENTE = 'trabalhos/pet-shop-whatsapp-ia-exemplo/'

/** Os quatro roteiros. Cada um resolve um atendimento e mostra um pedido que foge da base. */
export const RAMOS: Ramo[] = [
  {
    id: 'pet',
    rotulo: 'Pet shop',
    negocio: 'Pelo Solto',
    descricao: 'banho e tosa com hora marcada',
    foraDoHorario: '02:14 · madrugada',
    mensagemWhatsapp: 'Oi, Vinicius! Vi o agente do site. Tenho um pet shop e queria um atendimento assim no meu WhatsApp.',
    eventos: [
      { tipo: 'cliente', texto: 'Oi! Queria banho e tosa pra Tofu amanhã de manhã. Tem horário?', em: 0, hora: '02:14' },
      { tipo: 'agente', texto: 'Oi, Camila! Claro. O Tofu é de que porte e qual o tipo de pelo?', em: 2, hora: '02:14' },
      { tipo: 'cliente', texto: 'Shih-tzu, 7 kg. Ele tem a pele sensível.', em: 3.4, hora: '02:14' },
      { tipo: 'acao', chave: 'consulta', rotulo: 'Consultou a agenda', detalhe: 'Terça, 9h livre com a Marina', em: 4.6, hora: '02:14', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'reserva', rotulo: 'Reservou 9h com a Marina', detalhe: 'Banho e tosa, 90 min', em: 5.6, hora: '02:14', resolve: true, equipe: false },
      { tipo: 'agente', texto: 'Prontinho. Reservei 9h com a Marina. Banho e tosa, 90 minutos, R$ 95.', em: 6.8, hora: '02:15' },
      { tipo: 'acao', chave: 'ficha', rotulo: 'Criou a ficha do Tofu', detalhe: 'Porte, pelo e pele sensível', em: 8, hora: '02:15', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'dono', rotulo: 'Avisou a dona no WhatsApp', detalhe: 'Novo agendamento às 9h', em: 9, hora: '02:15', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'lembrete', rotulo: 'Agendou o lembrete da véspera', detalhe: 'Mensagem na véspera, às 9h', em: 9.8, hora: '02:15', resolve: false, equipe: false },
      { tipo: 'cliente', texto: 'Ele está vomitando desde ontem. O que eu faço?', em: 10.8, hora: '02:16' },
      { tipo: 'acao', chave: 'equipe', rotulo: 'Passou para a equipe', detalhe: 'Saúde do pet não é resposta do agente', em: 11.8, hora: '02:16', resolve: false, equipe: true },
      { tipo: 'agente', texto: 'Isso eu não consigo avaliar. Já chamei a equipe e o veterinário. Se for urgente, procure um veterinário agora.', em: 12.8, hora: '02:16' },
    ],
  },
  {
    id: 'clinica',
    rotulo: 'Clínica',
    negocio: 'Clínica Aurora',
    descricao: 'consultas e avaliações',
    foraDoHorario: '07:42 · antes de abrir',
    mensagemWhatsapp: 'Oi, Vinicius! Vi o agente do site. Tenho uma clínica e queria um atendimento assim no meu WhatsApp.',
    eventos: [
      { tipo: 'cliente', texto: 'Oi, bom dia. A Dra. Paula atende amanhã? Preciso de uma avaliação.', em: 0, hora: '07:42' },
      { tipo: 'agente', texto: 'Bom dia, Renata! Ela tem 15h30 e 16h10 amanhã. Qual fica melhor?', em: 2, hora: '07:42' },
      { tipo: 'cliente', texto: '15h30 tá ótimo.', em: 3.2, hora: '07:43' },
      { tipo: 'acao', chave: 'consulta', rotulo: 'Consultou a agenda', detalhe: 'Dra. Paula, amanhã à tarde', em: 4.4, hora: '07:43', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'reserva', rotulo: 'Reservou 15h30', detalhe: 'Avaliação, 40 min', em: 5.4, hora: '07:43', resolve: true, equipe: false },
      { tipo: 'agente', texto: 'Pronto. 15h30 com a Dra. Paula amanhã. A recepção confirma o valor da avaliação.', em: 6.6, hora: '07:43' },
      { tipo: 'acao', chave: 'ficha', rotulo: 'Criou a ficha da Renata', detalhe: 'Primeira consulta', em: 7.8, hora: '07:43', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'dono', rotulo: 'Avisou a recepção', detalhe: 'Novo horário na agenda', em: 8.8, hora: '07:43', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'lembrete', rotulo: 'Agendou o lembrete da véspera', detalhe: 'Confirmação às 15h30 de amanhã', em: 9.8, hora: '07:43', resolve: false, equipe: false },
      { tipo: 'cliente', texto: 'Estou com uma dor forte no peito. Pode ser grave?', em: 10.8, hora: '07:44' },
      { tipo: 'acao', chave: 'equipe', rotulo: 'Passou para a equipe', detalhe: 'Sintoma não é resposta do agente', em: 11.8, hora: '07:44', resolve: false, equipe: true },
      { tipo: 'agente', texto: 'Isso eu não consigo avaliar. Se a dor for forte ou estiver piorando, procure atendimento agora. A recepção já foi avisada.', em: 13, hora: '07:44' },
    ],
  },
  {
    id: 'loja',
    rotulo: 'Loja',
    negocio: 'Vestuar',
    descricao: 'moda e retirada na loja',
    foraDoHorario: '23:47 · loja fechada',
    mensagemWhatsapp: 'Oi, Vinicius! Vi o agente do site. Tenho uma loja e queria um atendimento assim no meu WhatsApp.',
    eventos: [
      { tipo: 'cliente', texto: 'Oi! Vi a jaqueta de sarja no site. Tem tamanho M?', em: 0, hora: '23:47' },
      { tipo: 'agente', texto: 'Oi, Bia! Tenho sim. Duas peças no M, uma na loja do centro.', em: 2, hora: '23:47' },
      { tipo: 'cliente', texto: 'Quero uma. Consigo retirar amanhã?', em: 3.2, hora: '23:48' },
      { tipo: 'acao', chave: 'consulta', rotulo: 'Consultou o estoque', detalhe: 'Jaqueta sarja, M, 2 peças', em: 4.4, hora: '23:48', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'reserva', rotulo: 'Reservou uma peça em seu nome', detalhe: 'Retirada até amanhã, 18h', em: 5.4, hora: '23:48', resolve: true, equipe: false },
      { tipo: 'agente', texto: 'Separei a sua. R$ 189, retirada amanhã até 18h na loja do centro.', em: 6.6, hora: '23:48' },
      { tipo: 'acao', chave: 'ficha', rotulo: 'Criou o pedido e o link de pagamento', detalhe: 'PIX ou cartão na retirada', em: 7.8, hora: '23:48', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'dono', rotulo: 'Avisou a loja', detalhe: 'Uma peça separada para retirada', em: 8.8, hora: '23:48', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'lembrete', rotulo: 'Agendou o lembrete de retirada', detalhe: 'Lembrete amanhã às 10h', em: 9.8, hora: '23:48', resolve: false, equipe: false },
      { tipo: 'cliente', texto: 'Meu cartão foi cobrado duas vezes no site. Como resolve?', em: 10.8, hora: '23:49' },
      { tipo: 'acao', chave: 'equipe', rotulo: 'Passou para a equipe', detalhe: 'Cobrança é assunto da loja', em: 11.8, hora: '23:49', resolve: false, equipe: true },
      { tipo: 'agente', texto: 'Isso eu preciso passar para a equipe. Já avisei a loja e alguém te chama para resolver a cobrança.', em: 13, hora: '23:49' },
    ],
  },
  {
    id: 'servicos',
    rotulo: 'Serviços',
    negocio: 'Casa & Reparo',
    descricao: 'reparos com visita marcada',
    foraDoHorario: '06:39 · antes do expediente',
    mensagemWhatsapp: 'Oi, Vinicius! Vi o agente do site. Tenho uma empresa de serviços e queria um atendimento assim no meu WhatsApp.',
    eventos: [
      { tipo: 'cliente', texto: 'Bom dia. Tem como ver um vazamento na cozinha hoje?', em: 0, hora: '06:39' },
      { tipo: 'agente', texto: 'Bom dia, Bruno! Temos 14h com o Diego. O endereço é o mesmo do último serviço?', em: 2, hora: '06:39' },
      { tipo: 'cliente', texto: 'Isso, mesmo endereço.', em: 3.2, hora: '06:40' },
      { tipo: 'acao', chave: 'consulta', rotulo: 'Consultou a agenda', detalhe: 'Hoje, 14h com o Diego', em: 4.4, hora: '06:40', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'reserva', rotulo: 'Reservou a visita das 14h', detalhe: 'Vazamento na cozinha', em: 5.4, hora: '06:40', resolve: true, equipe: false },
      { tipo: 'agente', texto: 'Pronto, 14h hoje com o Diego. A visita de diagnóstico fica em R$ 120, abatidos no serviço.', em: 6.6, hora: '06:40' },
      { tipo: 'acao', chave: 'ficha', rotulo: 'Abriu a ordem de serviço', detalhe: 'Endereço e histórico do cliente', em: 7.8, hora: '06:40', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'dono', rotulo: 'Avisou o Diego', detalhe: 'Visita às 14h na agenda', em: 8.8, hora: '06:40', resolve: false, equipe: false },
      { tipo: 'acao', chave: 'lembrete', rotulo: 'Agendou o lembrete de uma hora antes', detalhe: 'Mensagem às 13h', em: 9.8, hora: '06:40', resolve: false, equipe: false },
      { tipo: 'cliente', texto: 'O vazamento é na parede. Quanto fica pra quebrar?', em: 10.8, hora: '06:41' },
      { tipo: 'acao', chave: 'equipe', rotulo: 'Passou para a equipe', detalhe: 'Orçamento de obra só depois da visita', em: 11.8, hora: '06:41', resolve: false, equipe: true },
      { tipo: 'agente', texto: 'Isso só dá para dizer depois de ver. O Diego avalia às 14h e a equipe te passa o orçamento fechado.', em: 13, hora: '06:41' },
    ],
  },
]

/**
 * Devolve o ramo pedido.
 *
 * @param id identificador do ramo.
 * @returns o roteiro correspondente.
 * @throws Error quando o id não existe na lista.
 */
export function ramoPorId(id: RamoId): Ramo {
  const ramo = RAMOS.find((r) => r.id === id)
  if (!ramo) throw new Error(`ramo desconhecido ${id}`)
  return ramo
}

/**
 * Duração de um ciclo completo da cena, em segundos: o último evento mais a pausa final.
 *
 * @param ramo roteiro em exibição.
 * @returns duração em segundos.
 */
export function duracao(ramo: Ramo): number {
  return ramo.eventos[ramo.eventos.length - 1].em + PAUSA_FIM
}

/**
 * Monta o quadro visível em um instante do ciclo.
 *
 * @param ramo roteiro em exibição.
 * @param t segundos desde o começo do ciclo (valores negativos contam como zero).
 * @param reduzido quando `true`, devolve o quadro final inteiro, para quem pediu menos movimento.
 * @returns falas, ações, indicador de digitação, horário, contador e fim do ciclo.
 */
export function quadroDoRamo(ramo: Ramo, t: number, reduzido = false): Quadro {
  const ultimo = ramo.eventos[ramo.eventos.length - 1]
  const tempo = reduzido ? ultimo.em : Math.max(0, t)
  const visiveis = ramo.eventos.filter((e) => e.em <= tempo)
  const mensagens = visiveis.filter((e): e is Fala => e.tipo !== 'acao')
  const acoes = visiveis.filter((e): e is Acao => e.tipo === 'acao')
  const digitando = !reduzido && ramo.eventos.some(
    (e) => e.tipo === 'agente' && e.em > tempo && e.em - DIGITANDO <= tempo,
  )
  const referencia = visiveis[visiveis.length - 1] ?? ramo.eventos[0]
  return {
    mensagens,
    acoes,
    digitando,
    hora: referencia.hora,
    resolvidos: acoes.filter((a) => a.resolve).length,
    equipe: acoes.some((a) => a.equipe),
    fim: tempo >= ultimo.em,
  }
}

/**
 * Recorta as últimas falas que ficam na janela fixa da conversa.
 *
 * O celular mostra só as três últimas falas, sem rolagem interna. As novas entram por baixo e as antigas saem
 * pelo topo com fade, o que mantém a cena do mesmo tamanho do começo ao fim.
 *
 * @param mensagens falas visíveis no instante da cena.
 * @param max quantas falas cabem na janela.
 * @returns as últimas falas, na ordem original.
 */
export function ultimasFalas(mensagens: Fala[], max = 3): Fala[] {
  if (max <= 0) return []
  return mensagens.slice(-max)
}

/**
 * Acha a fala que acabou de sair quando a janela da conversa anda uma posição.
 *
 * Compara a janela anterior com a atual. Só devolve uma fala quando a nova janela é exatamente a anterior sem a
 * primeira e com uma nova no fim. No começo da cena (a janela ainda enchendo), no recomeço do ciclo e quando nada
 * mudou, devolve `null`: nesses casos não há saída para animar.
 *
 * @param anterior falas que estavam na janela no quadro anterior.
 * @param atual falas que estão na janela no quadro atual.
 * @returns a fala que saiu, ou `null` quando a janela não andou uma posição.
 */
export function falaQueSai(anterior: Fala[], atual: Fala[]): Fala | null {
  if (anterior.length === 0 || atual.length === 0) return null
  if (anterior.length !== atual.length) return null
  for (let i = 1; i < anterior.length; i++) {
    if (anterior[i].texto !== atual[i - 1].texto) return null
  }
  return anterior[0].texto === atual[atual.length - 1].texto ? null : anterior[0]
}
