// Agente trabalhando sozinho (18/10/2026): o hero deixa de pedir decisões e passa a mostrar o atendimento
// acontecendo. Fonte única dos quatro roteiros, da linha do tempo, do painel de automação e das respostas
// roteirizadas do campo "pergunte você também". Funções puras: nada roda ao importar.

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

/** Resposta roteirizada do campo de pergunta. */
export interface RespostaRoteirizada {
  /** Palavras que disparam a resposta, sem acento e em minúscula. Vazio marca a resposta padrão. */
  chaves: string[]
  resposta: string
  /** A resposta não vem da base: o agente avisa que passou para a equipe. */
  equipe: boolean
}

/** Um ramo completo, com conversa, automação e respostas ao visitante. */
export interface Ramo {
  id: RamoId
  rotulo: string
  negocio: string
  descricao: string
  foraDoHorario: string
  /** Mensagem pré-preenchida no wa.me, com o ramo do visitante. */
  mensagemWhatsapp: string
  eventos: Evento[]
  respostas: RespostaRoteirizada[]
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
  perguntaRotulo: string
  perguntaExemplo: string
  perguntaDica: string
  perguntaBotao: string
  demonstracao: string
  notaPergunta: string
  cta: string
  peca: string
  preco: string
  notaPreco: string
  honestidade: string
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

/** Textos fixos da cena. */export const AGENTE: ConteudoAgente = {
  rotulo: 'Agente no WhatsApp',
  titulo: 'Ele atende sozinho.',
  texto: 'Escolha o ramo e veja o atendimento acontecer. Um toque, nada para configurar.',
  chamadaRamo: 'Veja no seu ramo',
  painelTitulo: 'O que ele fez sozinho',
  contadorSingular: 'resolvido sem ninguém tocar',
  contadorPlural: 'resolvidos sem ninguém tocar',
  perguntaRotulo: 'Pergunte você também',
  perguntaExemplo: 'Quanto custa?',
  perguntaDica: 'Pergunte algo e veja o agente responder.',
  perguntaBotao: 'Perguntar',
  demonstracao: 'demonstração',
  notaPergunta: 'Resposta por palavra-chave. Nada é enviado.',
  cta: 'Quero isso no meu WhatsApp',
  peca: 'Ver o Pelo Solto inteiro',
  preco: 'R$ 590 + R$ 149/mês no lançamento. Depois, R$ 990 + R$ 199/mês.',
  notaPreco: 'Valores de 09/10/2026. O orçamento fecha depois do escopo.',
  honestidade: 'Dados fictícios. O agente responde só o que está na base do negócio. Fora dela, chama a equipe.',
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
    respostas: [
      { chaves: ['preco', 'valor', 'quanto custa', 'quanto fica'], resposta: 'Banho e tosa para shih-tzu de 7 kg fica em R$ 95. O valor final depende do pelo e do estado do pet, e a equipe confirma na hora.', equipe: false },
      { chaves: ['horario', 'abre', 'fecha', 'funciona'], resposta: 'Atendemos de segunda a sábado, das 8h às 19h. O agente responde no WhatsApp a qualquer hora.', equipe: false },
      { chaves: ['onde', 'endereco', 'fica'], resposta: 'A loja fica na rua das Acácias, 210, no centro. O atendimento é com hora marcada.', equipe: false },
      { chaves: ['lembrete', 'aviso', 'avisa'], resposta: 'O lembrete da véspera é automático, no mesmo WhatsApp da conversa.', equipe: false },
      { chaves: ['pessoa', 'humano', 'equipe', 'atendente', 'falar com'], resposta: 'Quando a resposta não está na base, o agente chama a equipe. Nesta demonstração, o pedido não é enviado.', equipe: true },
      { chaves: [], resposta: 'Essa eu não sei responder com segurança. Na versão real, eu passaria a sua pergunta para a equipe e ela responderia por aqui.', equipe: true },
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
    respostas: [
      { chaves: ['preco', 'valor', 'quanto custa', 'quanto fica'], resposta: 'A avaliação com a Dra. Paula fica em R$ 280. A recepção confirma antes da consulta.', equipe: false },
      { chaves: ['horario', 'abre', 'fecha', 'funciona'], resposta: 'A clínica atende de segunda a sexta, das 8h às 18h. O agente responde a qualquer hora.', equipe: false },
      { chaves: ['onde', 'endereco', 'fica'], resposta: 'A clínica fica na avenida Central, 45, sala 12.', equipe: false },
      { chaves: ['dor', 'sintoma', 'remedio', 'doente', 'febre', 'urgencia'], resposta: 'Sintoma eu não consigo avaliar. A orientação é falar com a equipe e, se for urgente, procurar atendimento agora.', equipe: true },
      { chaves: ['pessoa', 'humano', 'equipe', 'atendente', 'falar com'], resposta: 'Quando a resposta não está na base, o agente chama a equipe. Nesta demonstração, o pedido não é enviado.', equipe: true },
      { chaves: [], resposta: 'Essa eu não sei responder com segurança. Na versão real, eu passaria a sua pergunta para a equipe e ela responderia por aqui.', equipe: true },
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
    respostas: [
      { chaves: ['preco', 'valor', 'quanto custa', 'quanto fica'], resposta: 'A jaqueta de sarja fica em R$ 189. Parcelamos em até 3 vezes sem juros.', equipe: false },
      { chaves: ['horario', 'abre', 'fecha', 'funciona'], resposta: 'A loja do centro abre de segunda a sábado, das 9h às 18h.', equipe: false },
      { chaves: ['onde', 'endereco', 'fica'], resposta: 'A loja do centro fica na rua das Palmeiras, 88.', equipe: false },
      { chaves: ['troca', 'devolucao', 'devolver', 'tamanho'], resposta: 'A troca pode ser feita em até 30 dias, com a etiqueta. A equipe confirma o caso pelo WhatsApp.', equipe: false },
      { chaves: ['pessoa', 'humano', 'equipe', 'atendente', 'falar com'], resposta: 'Quando a resposta não está na base, o agente chama a equipe. Nesta demonstração, o pedido não é enviado.', equipe: true },
      { chaves: [], resposta: 'Essa eu não sei responder com segurança. Na versão real, eu passaria a sua pergunta para a equipe e ela responderia por aqui.', equipe: true },
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
    respostas: [
      { chaves: ['preco', 'valor', 'quanto custa', 'quanto fica'], resposta: 'A visita de diagnóstico fica em R$ 120, abatidos no serviço. O orçamento da obra só depois da visita.', equipe: false },
      { chaves: ['horario', 'abre', 'fecha', 'funciona'], resposta: 'Atendemos de segunda a sábado, das 8h às 18h. O agente responde a qualquer hora.', equipe: false },
      { chaves: ['onde', 'endereco', 'fica'], resposta: 'A base fica na rua do Comércio, 31. O atendimento é no endereço do cliente.', equipe: false },
      { chaves: ['urgencia', 'vazamento', 'agua', 'registro'], resposta: 'Se houver água corrente, feche o registro. Se houver risco elétrico, procure ajuda agora e a equipe continua com você pelo WhatsApp.', equipe: true },
      { chaves: ['pessoa', 'humano', 'equipe', 'atendente', 'falar com'], resposta: 'Quando a resposta não está na base, o agente chama a equipe. Nesta demonstração, o pedido não é enviado.', equipe: true },
      { chaves: [], resposta: 'Essa eu não sei responder com segurança. Na versão real, eu passaria a sua pergunta para a equipe e ela responderia por aqui.', equipe: true },
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
 * Tira acento e caixa para comparar a pergunta do visitante com as chaves do roteiro.
 *
 * @param texto texto original.
 * @returns texto sem acento e em minúscula.
 */
export function semAcento(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Responde a pergunta do visitante só com o que está no roteiro do ramo.
 *
 * @param ramo roteiro em exibição.
 * @param pergunta texto digitado (pode vir com acento ou maiúscula).
 * @returns resposta e se ela passa para a equipe; `null` quando a pergunta está vazia.
 */
export function responderPergunta(ramo: Ramo, pergunta: string): { texto: string; equipe: boolean } | null {
  const texto = semAcento(pergunta).trim()
  if (!texto) return null
  const regra = ramo.respostas.find((r) => r.chaves.length > 0 && r.chaves.some((c) => texto.includes(semAcento(c))))
    ?? ramo.respostas.find((r) => r.chaves.length === 0)
  return regra ? { texto: regra.resposta, equipe: regra.equipe } : null
}
