// Plantão do atendente (18/10/2026): o visitante assume o lugar do agente em três decisões reais do Pelo Solto.
// Fonte única dos dados, das regras, do preço e da máquina de estados. Funções puras: nada roda ao importar.

/** Uma das quatro regras que sustentam o atendimento. */
export interface Regra {
  id: 1 | 2 | 3 | 4
  nome: string
  /** Nome de uma palavra para a faixa compacta do celular. */
  curto: string
  texto: string
}

/** Uma resposta possível do atendente em um passo. */
export interface Opcao {
  id: string
  rotulo: string
  /** `certa` avança com a resposta; `parcial` avança com uma nota; `bloqueada` não avança. */
  tipo: 'certa' | 'parcial' | 'bloqueada'
  regra: Regra['id']
  /** O que o agente responde quando a opção avança. */
  resposta?: string
  /** O que a tela explica quando a opção é bloqueada ou deixa algo de lado. */
  nota?: string
  /** Linha de sistema que aparece junto da resposta, quando há. */
  sistema?: string
}

/** Um passo da conversa. */
export interface Passo {
  id: 'd1' | 'd2' | 'd3'
  /** A mensagem da Camila que abre o passo. */
  mensagem: string
  opcoes: Opcao[]
}

/** Uma fala já mostrada na conversa. */
export interface Fala {
  de: 'cliente' | 'agente' | 'sistema'
  texto: string
  regra?: Regra['id']
}

/** Estado da simulação. */
export interface Estado {
  passo: number
  falas: Fala[]
  escolhas: string[]
  bloqueios: number
  /** Ids das opções que a regra já barrou, para a tela não oferecer de novo. */
  bloqueadas: string[]
  fim: boolean
}

/** O que o resumo mostra sobre o caminho percorrido. */
export interface Resumo {
  perguntouPorte: boolean
  consultouAgenda: boolean
  combinouLembrete: boolean
  consultouBase: boolean
  passouEquipe: boolean
  bloqueios: number
}

/** Um segmento do negócio do visitante, usado só na mensagem do WhatsApp. */
export interface Segmento {
  id: string
  rotulo: string
  mensagem: string
}

/** Todo o conteúdo do plantão, em um tipo só, para o componente e os testes lerem os mesmos campos. */
export interface ConteudoPlantao {
  rotulo: string
  titulo: string
  texto: string
  honestidade: string
  resumo: {
    rotulo: string
    titulo: string
    chamadaSegmento: string
    preco: string
    notaPreco: string
    cta: string
    peca: string
    reiniciar: string
  }
  regras: Regra[]
  passos: Passo[]
  segmentos: Segmento[]
}

/** Textos e roteiro do plantão. */
export const PLANTAO: ConteudoPlantao = {
  rotulo: 'Plantão do atendente',
  titulo: 'Você no lugar do agente.',
  texto: 'A Camila escreveu. Escolha a resposta e veja a regra que segura o agente.',
  honestidade: 'Roteiro fixo, 3 decisões, sem IA no navegador. Nada é gravado.',
  resumo: {
    rotulo: 'Atendimento concluído',
    titulo: 'O caminho que você escolheu',
    chamadaSegmento: 'O seu negócio é de que área?',
    preco: 'Atendente assim no seu WhatsApp, R$ 590 + R$ 149/mês no lançamento. Depois, R$ 990 + R$ 199/mês.',
    notaPreco: 'Valores de 09/10/2026. O orçamento fecha depois do escopo.',
    cta: 'Quero um assim no WhatsApp',
    peca: 'Abrir o Pelo Solto inteiro',
    reiniciar: 'Recomeçar',
  },
  regras: [
    { id: 1, nome: 'Agenda', curto: 'Agenda', texto: 'Horário só existe se estiver na agenda.' },
    { id: 2, nome: 'Dado que falta', curto: 'Dado', texto: 'Sem porte e tipo de pelo, o serviço e a duração ficam no chute.' },
    { id: 3, nome: 'Sem base, equipe', curto: 'Base', texto: 'Quando a base não responde, o agente chama uma pessoa.' },
    { id: 4, nome: 'Confirma e lembra', curto: 'Lembrete', texto: 'Agendou, confirma e manda lembrete na véspera.' },
  ] satisfies Regra[],
  passos: [
    {
      id: 'd1',
      mensagem: 'Oi! Queria banho e tosa pra Tofu amanhã de manhã. Tem horário?',
      opcoes: [
        {
          id: 'd1-porte', tipo: 'certa', regra: 2,
          rotulo: 'Perguntar o porte e o tipo de pelo.',
          resposta: 'Claro! O Tofu é de que porte e qual o tipo de pelo? Assim eu acerto o serviço e o tempo.',
        },
        {
          id: 'd1-horario', tipo: 'bloqueada', regra: 2,
          rotulo: 'Oferecer 9h, o primeiro horário.',
          nota: 'Sem porte e tipo de pelo, o serviço e a duração não estão definidos. O agente pergunta antes de oferecer horário.',
        },
        {
          id: 'd1-nome', tipo: 'parcial', regra: 2,
          rotulo: 'Confirmar a vaga e pedir o nome.',
          resposta: 'Tem vaga sim. Como posso te chamar?',
          nota: 'A Camila contou o porte depois, sem o agente perguntar. Andou, mas com menos informação.',
        },
      ],
    },
    {
      id: 'd2',
      mensagem: 'Sou a Camila. O Tofu é shih-tzu, 7 kg, e tem a pele sensível. Pode ser antes das 10h?',
      opcoes: [
        {
          id: 'd2-agenda', tipo: 'certa', regra: 1,
          rotulo: 'Consultar a agenda e oferecer 9h.',
          resposta: 'Na agenda do Léo tenho 9h. Reservei e anotei pele sensível, sem secador quente e shampoo neutro.',
        },
        {
          id: 'd2-sem-agenda', tipo: 'bloqueada', regra: 1,
          rotulo: 'Confirmar 9h sem consultar.',
          nota: 'Horário não se confirma de cabeça. O agente consulta a agenda antes de prometer.',
        },
        {
          id: 'd2-sem-lembrete', tipo: 'parcial', regra: 4,
          rotulo: 'Consultar a agenda sem combinar lembrete.',
          resposta: 'Na agenda do Léo tenho 9h. Reservei.',
          nota: 'O horário ficou de pé, mas sem lembrete na véspera.',
        },
      ],
    },
    {
      id: 'd3',
      mensagem: 'Ah, ele está tomando remédio pra otite. Pode?',
      opcoes: [
        {
          id: 'd3-base', tipo: 'certa', regra: 3,
          rotulo: 'Procurar na base e chamar a Ana.',
          resposta: 'Essa eu não decido sozinha. Chamei a Ana, da equipe, com o histórico do Tofu.',
          sistema: 'A base não tinha otite. A Ana assumiu a conversa.',
        },
        {
          id: 'd3-inventa', tipo: 'bloqueada', regra: 3,
          rotulo: 'Dizer que pode trazer, sim.',
          nota: 'A base não tem essa resposta. O agente não inventa e chama a equipe.',
        },
        {
          id: 'd3-sem-base', tipo: 'parcial', regra: 3,
          rotulo: 'Chamar a Ana sem consultar a base.',
          resposta: 'Vou chamar a Ana, da equipe.',
          sistema: 'A Ana assumiu. A base não foi consultada.',
          nota: 'A equipe resolve, mas o agente não tentou a base antes.',
        },
      ],
    },
  ] satisfies Passo[],
  segmentos: [
    { id: 'pet', rotulo: 'Pet e estética', mensagem: 'pet e estética' },
    { id: 'saude', rotulo: 'Saúde', mensagem: 'saúde' },
    { id: 'loja', rotulo: 'Loja', mensagem: 'loja e catálogo' },
    { id: 'servicos', rotulo: 'Serviços', mensagem: 'serviços' },
  ] satisfies Segmento[],
}

/** Link da peça que serve de cenário para o plantão. */
export const PECA_DO_PLANTAO = 'trabalhos/pet-shop-whatsapp-ia-exemplo/'

/** Mensagem inicial da conversa, montada a partir do primeiro passo. */
export const MENSAGEM_INICIAL = PLANTAO.passos[0].mensagem

/**
 * Estado inicial do plantão: a primeira mensagem da Camila já está na tela e nenhuma decisão foi tomada.
 *
 * @returns o estado zerado, com a mensagem de abertura.
 */
export function estadoInicial(): Estado {
  return {
    passo: 0,
    falas: [{ de: 'cliente', texto: MENSAGEM_INICIAL }],
    escolhas: [],
    bloqueios: 0,
    bloqueadas: [],
    fim: false,
  }
}

/**
 * Procura a opção atual pelo id, sem confiar no índice que veio da tela.
 *
 * @param estado estado atual.
 * @param id id da opção escolhida.
 * @returns a opção, ou `undefined` quando o id não existe no passo atual.
 */
export function opcaoDoPasso(estado: Estado, id: string): Opcao | undefined {
  const passo = PLANTAO.passos[estado.passo]
  return passo?.opcoes.find((o) => o.id === id)
}

/**
 * Aplica uma escolha e devolve o próximo estado. Id desconhecido ou passo concluído não mudam nada.
 * Opção bloqueada acrescenta a explicação, conta o bloqueio e mantém o passo.
 *
 * @param estado estado atual.
 * @param id id da opção escolhida.
 * @returns novo estado (o mesmo objeto quando a escolha não vale).
 */
export function escolher(estado: Estado, id: string): Estado {
  if (estado.fim) return estado
  const opcao = opcaoDoPasso(estado, id)
  if (!opcao) return estado
  const falas = [...estado.falas]
  if (opcao.tipo === 'bloqueada') {
    falas.push({ de: 'sistema', texto: opcao.nota ?? 'Regra barrou esta resposta.', regra: opcao.regra })
    return { ...estado, falas, bloqueios: estado.bloqueios + 1, bloqueadas: [...estado.bloqueadas, id] }
  }
  if (opcao.resposta) {
    falas.push({ de: 'agente', texto: opcao.resposta, regra: opcao.tipo === 'certa' ? opcao.regra : undefined })
  }
  if (opcao.sistema) falas.push({ de: 'sistema', texto: opcao.sistema, regra: opcao.regra })
  if (opcao.nota) falas.push({ de: 'sistema', texto: opcao.nota, regra: opcao.regra })
  const proximo = estado.passo + 1
  const passo = PLANTAO.passos[proximo]
  if (passo) falas.push({ de: 'cliente', texto: passo.mensagem })
  return { ...estado, passo: proximo, falas, escolhas: [...estado.escolhas, id], fim: !passo }
}

/**
 * Lê as escolhas e devolve o que o resumo mostra. Determinístico e independente da ordem dos cliques.
 *
 * @param estado estado atual.
 * @returns os fatos do caminho percorrido.
 */
export function resumoDe(estado: Estado): Resumo {
  const tem = (id: string) => estado.escolhas.includes(id)
  return {
    perguntouPorte: tem('d1-porte'),
    consultouAgenda: tem('d2-agenda') || tem('d2-sem-lembrete'),
    combinouLembrete: tem('d2-agenda'),
    consultouBase: tem('d3-base'),
    passouEquipe: tem('d3-base') || tem('d3-sem-base'),
    bloqueios: estado.bloqueios,
  }
}

/**
 * Monta a mensagem do WhatsApp com o caminho inteiro e, quando escolhido, o segmento do negócio.
 *
 * As quatro marcas entram sempre, inclusive as que ficaram de fora ("não combinei o lembrete") e a passagem para a
 * equipe ("chamei a equipe sem consultar a base"). Assim os oito caminhos geram oito mensagens diferentes, e o lead
 * chega com o contexto que o componente existe para provar. Nada digitado pelo visitante entra aqui, porque a
 * simulação não tem campo de texto.
 *
 * @param estado estado atual.
 * @param segmento segmento escolhido no resumo, ou `null`.
 * @returns texto curto, pronto para o `wa.me`.
 */
export function mensagemWhatsapp(estado: Estado, segmento: Segmento | null): string {
  const r = resumoDe(estado)
  const marcas = [
    r.perguntouPorte ? 'perguntei o porte' : 'não perguntei o porte',
    r.consultouAgenda ? 'consultei a agenda' : 'não consultei a agenda',
    r.combinouLembrete ? 'combinei o lembrete' : 'não combinei o lembrete',
    r.consultouBase ? 'consultei a base antes de chamar a equipe' : 'chamei a equipe sem consultar a base',
  ]
  const area = segmento ? ` Meu negócio é do setor de ${segmento.mensagem}.` : ''
  return `Oi, Vinicius! Testei o plantão do atendente no seu site e percorri o caso da Camila e do Tofu. No caminho, ${marcas.join(', ')}.${area} Quero um atendimento assim no meu negócio.`
}
