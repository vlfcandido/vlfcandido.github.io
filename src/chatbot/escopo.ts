// Escopo de 1 página do assistente do site: o questionário fixo, a montagem do escopo sem IA e o texto
// que o visitante copia. Este módulo é compartilhado entre o widget (fallback sem IA) e o Worker (modo
// simulado e montagem final do texto), para os dois caminhos entregarem o mesmo formato.
// Regras do estudo de 08/10/2026 (seção 5): nunca preço, nunca data de entrega; tamanho P/M/G e faixa de
// prazo de referência; todo escopo sai rotulado "rascunho, não proposta"; a saída é copiar e colar no 99.
// Nada aqui executa ao importar: só constantes e funções puras.

import { oferta, type Oferta } from '../conteudo'

/** Tamanho do projeto, sem preço: P (pequeno), M (médio), G (grande). */
export type Tamanho = 'P' | 'M' | 'G'

/** Identificador de uma das 6 ofertas publicadas no site. */
export type IdOferta = Oferta['id']

/** Os campos do escopo, como a IA (ou o questionário) devolve antes de virar texto. */
export interface Escopo {
  /** O problema, numa frase, nas palavras do visitante. */
  problema: string
  /** O que entra no projeto. */
  entra: string[]
  /** O que fica fora, dito com todas as letras. */
  fora: string[]
  /** O que precisa ser respondido antes do preço fechado. */
  perguntas: string[]
  tamanho: Tamanho
  /** A oferta do site que é a porta de entrada. */
  oferta: IdOferta
}

/** Escopo pronto para a tela: os campos, a faixa de prazo e o texto para copiar. */
export interface EscopoPronto extends Escopo {
  prazo: string
  textoCopiavel: string
}

/** Uma pergunta do questionário fixo. */
export interface PerguntaEscopo {
  id: 'hoje' | 'sistemas' | 'sucesso' | 'quem' | 'nao-pode'
  texto: string
  /** Exemplo curto que vai no campo de resposta. */
  exemplo: string
}

/** Rótulo de cada tamanho, por extenso. */
export const ROTULO_TAMANHO: Record<Tamanho, string> = {
  P: 'P (pequeno)',
  M: 'M (médio)',
  G: 'G (grande)',
}

/**
 * Faixa de prazo de referência por tamanho. Nunca uma data.
 * P usa só o que o site e o estudo já publicam ("versão para testar em 24 a 48 horas", "projetos pequenos
 * costumam levar de 1 a 7 dias"). M e G são premissas a confirmar com ele (registradas no relatório de
 * 08/10/2026); G não leva número: vira etapas.
 */
export const PRAZOS: Record<Tamanho, string> = {
  P: 'versão para testar em 24 a 48 horas; projetos pequenos costumam levar de 1 a 7 dias',
  M: 'versão para testar em 24 a 48 horas; projetos médios costumam levar de 1 a 3 semanas',
  G: 'grande para um prazo só: o trabalho é dividido em etapas, e cada etapa segue a faixa de um projeto médio',
}

/** As 5 perguntas do questionário fixo. A primeira é o diagnóstico do trabalho repetido (conceito C do estudo). */
export const PERGUNTAS_ESCOPO: PerguntaEscopo[] = [
  {
    id: 'hoje',
    texto: 'O que acontece hoje? Conte o trabalho que trava, demora ou se repete.',
    exemplo: 'Ex.: copio cada pedido do WhatsApp para uma planilha no fim do dia.',
  },
  {
    id: 'sistemas',
    texto: 'Quais sistemas ou ferramentas entram nisso?',
    exemplo: 'Ex.: WhatsApp, planilha do Google, Bling, site, CRM.',
  },
  {
    id: 'sucesso',
    texto: 'O que seria sucesso? Como você vai saber que funcionou?',
    exemplo: 'Ex.: o pedido entra na planilha sozinho, sem ninguém digitar.',
  },
  {
    id: 'quem',
    texto: 'Quem vai usar e por onde?',
    exemplo: 'Ex.: duas pessoas da equipe, no computador; clientes pelo celular.',
  },
  {
    id: 'nao-pode',
    texto: 'Tem algo que já existe e não pode parar ou mudar?',
    exemplo: 'Ex.: o número de WhatsApp atual e a planilha que o financeiro usa.',
  },
]

/** O que nunca entra em escopo nenhum, dito sempre. */
export const FORA_SEMPRE: string[] = [
  'Custos de ferramentas e serviços de terceiros (licenças, hospedagem, API do WhatsApp)',
  'Mudanças além do que está escrito aqui, que viram um novo escopo',
]

/** Minúsculas e sem acento, para comparar palavras-chave de forma estável. */
export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

/** Tipo de pedido que o Vinicius não pega (invariante 6), com a razão genérica que o assistente diz. */
const FORA_DO_QUE_PEGA: ReadonlyArray<readonly [RegExp, string]> = [
  [
    /\b(cooperativa|corretora|fintech de credito|carteira de (investimentos?|acoes)|home ?broker|investimentos? (financeiro|em acoes|em renda)|plataforma de investimentos?|app de investimentos?)\b|\bbancos?\b(?! de (dados|horas|imagens|talentos))/,
    'Projetos para banco, cooperativa ou investimentos ficam de fora: é um ramo em que ele não pega trabalho.',
  ],
  [
    /\b(app|aplicativo)s?\b.{0,60}\b(android e ios|ios e android|play store|app store|lojas de apps?|tipo uber|tipo ifood|rede social|completo para celular)\b/,
    'App de celular grande, publicado nas lojas, fica de fora: não é o tipo de projeto que ele pega como freela.',
  ],
  [
    /\b(loja virtual|e-?commerce|marketplace)\b.{0,40}\b(do zero|completa|completo)\b|\b(criar|montar|fazer) (uma )?(loja virtual|e-?commerce|marketplace)\b/,
    'Loja virtual do zero fica de fora: para isso uma plataforma pronta costuma servir melhor. Integrar uma loja que já existe com outros sistemas, ele faz.',
  ],
  [
    /\b(logo|logotipo|logomarca|identidade visual|design de marca|artes? para (instagram|redes)|posts? para (instagram|redes)|design de interface do zero)\b/,
    'Design de marca e peças gráficas ficam de fora: o trabalho dele é software.',
  ],
]

/**
 * Diz se o pedido é de um tipo que ele não pega (banco, cooperativa, investimentos, app grande, loja do
 * zero, design).
 *
 * @param texto o que o visitante escreveu.
 * @returns a razão genérica para dizer ao visitante, ou `null` quando o pedido está dentro do que ele faz.
 */
export function foraDoQuePega(texto: string): string | null {
  const t = normalizar(texto)
  for (const [padrao, razao] of FORA_DO_QUE_PEGA) if (padrao.test(t)) return razao
  return null
}

/** Palavras que puxam cada oferta, da mais específica para a mais geral. */
const SINAIS_OFERTA: ReadonlyArray<readonly [IdOferta, RegExp]> = [
  ['resgate', /\b(travou|trava|caiu|fora do ar|bug|erro|quebrad|parou de funcionar|ninguem entende|legado|lento|brecha|invadid)/],
  ['integracao', /\b(crm|erp|integr|bling|tiny|omie|hubspot|pipedrive|rd station|conta azul|webhook|sincroniz|api\b)|\bentr\w* (nele|no sistema|direto)/],
  ['whatsapp', /\b(whatsapp|atendimento|agendar|agendamento|marcar horario|duvidas? dos? clientes|chatbot|robo de atendimento)/],
  // Construir um sistema vem antes de painel e planilha: "um sistema onde o líder marca a presença" é sob medida.
  ['sob-medida', /\b(sistema|plataforma|saas|login|cadastro de usuarios|controle de)/],
  ['site', /\b(painel|dashboard|relatorio|indicador|site|landing|pagina)/],
  ['repetido', /\b(planilha|excel|manual|na mao|copi|repetid|todo dia|cobranca|aviso|lembrete|cadastro|automat)/],
]

/**
 * Escolhe a oferta do site que é a melhor porta de entrada para o pedido.
 *
 * @param texto tudo o que o visitante respondeu, junto.
 * @returns o id da oferta; `sob-medida` quando nenhuma palavra-chave decide.
 */
export function sugerirOferta(texto: string): IdOferta {
  const t = normalizar(texto)
  for (const [id, padrao] of SINAIS_OFERTA) if (padrao.test(t)) return id
  return 'sob-medida'
}

/** Sistemas e ferramentas reconhecidos nas respostas, com o nome como o visitante costuma escrever. */
const SISTEMAS: ReadonlyArray<readonly [string, RegExp]> = [
  ['WhatsApp', /whatsapp|zap\b/],
  ['planilha', /planilha|excel|sheets/],
  ['CRM', /\bcrm\b|hubspot|pipedrive|rd station|salesforce/],
  ['ERP', /\berp\b|bling|tiny|omie|totvs|sap\b/],
  ['site', /\bsite\b|landing|wordpress/],
  ['e-mail', /\be-?mail\b/],
  ['sistema de pagamento', /pagamento|boleto|pix|cobranca|gateway/],
  ['agenda', /agenda|calendario/],
  ['banco de dados', /banco de dados|postgres|mysql|sql\b/],
  ['Telegram', /telegram/],
  ['Instagram', /instagram/],
  ['API de outro sistema', /\bapi\b/],
]

/**
 * Lista os sistemas citados nas respostas.
 *
 * @param texto as respostas juntas.
 * @returns nomes únicos, na ordem da tabela.
 */
export function sistemasCitados(texto: string): string[] {
  const t = normalizar(texto)
  return SISTEMAS.filter(([, p]) => p.test(t)).map(([nome]) => nome)
}

/**
 * Estima o tamanho pelo número de sistemas e por sinais de complexidade (login, pagamento, IA, várias
 * equipes). É régua grosseira de propósito: o tamanho final vem dele.
 *
 * @param texto as respostas juntas.
 * @returns P, M ou G.
 */
export function estimarTamanho(texto: string): Tamanho {
  const t = normalizar(texto)
  let pontos = sistemasCitados(texto).length
  if (/login|usuarios|perfis de acesso|permiss/.test(t)) pontos += 1
  if (/pagamento|cobranca|boleto|pix/.test(t)) pontos += 1
  if (/\bia\b|inteligencia artificial|agente|chatgpt|gpt|claude|gemini/.test(t)) pontos += 1
  if (/varias (lojas|filiais|equipes|unidades)|multi|marketplace|centenas|milhares/.test(t)) pontos += 1
  if (/aplicativo|\bapp\b/.test(t)) pontos += 1
  // Construir um sistema (e não só ligar os que existem) já pesa um ponto.
  if (/\b(sistema|plataforma|saas)\b/.test(t)) pontos += 1
  if (pontos <= 1) return 'P'
  if (pontos <= 3) return 'M'
  return 'G'
}

/** O que entra, por oferta, escrito como resultado. */
const ENTRA_POR_OFERTA: Record<IdOferta, (sistemas: string) => string[]> = {
  integracao: (s) => [
    `Ligar ${s || 'os sistemas citados'} para os dados passarem de um para o outro sem digitação`,
    'Aviso quando uma passagem falhar, para nada se perder em silêncio',
  ],
  repetido: (s) => [
    `Automatizar a tarefa descrita${s ? `, usando ${s}` : ''}`,
    'Registro do que rodou e aviso quando algo falhar',
  ],
  resgate: () => [
    'Achar a causa do problema e corrigir sem quebrar o que já funciona',
    'Um mapa curto do código e da causa, para ninguém ficar refém de novo',
  ],
  'sob-medida': () => [
    'Sistema com as regras do negócio descritas, com login quando precisar',
    'Testes automáticos nas regras principais',
  ],
  site: (s) => [
    `Painel ou página com os números e as informações descritas${s ? `, puxando de ${s}` : ''}`,
    'Funciona no computador e no celular',
  ],
  whatsapp: () => [
    'Atendimento automático no WhatsApp para as dúvidas e os pedidos descritos',
    'Passagem para alguém da equipe quando o assistente não resolver',
  ],
}

/** O que fica fora, por oferta. */
const FORA_POR_OFERTA: Record<IdOferta, string[]> = {
  integracao: ['Trocar algum dos sistemas atuais por outro'],
  repetido: ['Mudar o processo da equipe além da tarefa descrita'],
  resgate: ['Reescrever o sistema inteiro do zero'],
  'sob-medida': ['App de celular publicado nas lojas'],
  site: ['Identidade visual e criação de marca'],
  whatsapp: ['Contratação e custo da API oficial do WhatsApp', 'Atender assuntos fora dos combinados no escopo'],
}

/** O que sempre entra, venha da IA ou do questionário (os passos publicados no site). */
export const ENTRA_SEMPRE: string[] = [
  'Versão para testar por um link antes da entrega',
  'Ficha de entrega com o que foi feito, como usar e os testes, e 7 dias de correção sem custo',
]

/** Corta espaços e limita o tamanho de uma resposta para caber no escopo. */
function resumir(texto: string, max = 220): string {
  const limpo = texto.replace(/\s+/g, ' ').trim()
  return limpo.length > max ? `${limpo.slice(0, max - 1).trimEnd()}…` : limpo
}

/** Resultado do questionário: o escopo, ou a recusa quando o pedido é de um tipo que ele não pega. */
export type ResultadoQuestionario = { tipo: 'escopo'; escopo: Escopo } | { tipo: 'recusa'; texto: string }

/**
 * Monta o escopo de 1 página a partir das respostas do questionário fixo, sem IA.
 *
 * @param respostas respostas na ordem de `PERGUNTAS_ESCOPO` (as vazias são ignoradas).
 * @returns o escopo, ou a recusa com a razão genérica (invariante 6).
 */
export function montarEscopo(respostas: string[]): ResultadoQuestionario {
  const tudo = respostas.join('\n')
  const razao = foraDoQuePega(tudo)
  if (razao) return { tipo: 'recusa', texto: razao }

  const [hoje = '', sistemas = '', sucesso = '', quem = '', naoPode = ''] = respostas.map((r) => r.trim())
  const id = sugerirOferta(tudo)
  const citados = sistemasCitados(`${hoje}\n${sistemas}`)
  const listaSistemas = citados.length > 1 ? `${citados.slice(0, -1).join(', ')} e ${citados.at(-1)}` : citados[0] ?? ''

  const entra = [...ENTRA_POR_OFERTA[id](listaSistemas)]
  if (sucesso) entra.push(`Critério de pronto: ${resumir(sucesso, 160)}`)
  if (naoPode) entra.push(`Sem mexer no que não pode mudar: ${resumir(naoPode, 140)}`)

  const perguntas = ['Quais acessos já existem (logins, chaves de API, planilhas) e quem vai passar?']
  if (citados.length === 0) perguntas.push('Quais sistemas exatamente estão envolvidos, com o nome de cada um?')
  if (!quem) perguntas.push('Quem vai usar no dia a dia, e quantas pessoas são?')
  if (!sucesso) perguntas.push('Como vai ficar claro que funcionou?')
  perguntas.push('Quem testa a versão do link e aprova a entrega?')

  return {
    tipo: 'escopo',
    escopo: {
      problema: resumir(hoje || sucesso || 'Projeto descrito nas respostas acima.'),
      entra,
      fora: [...FORA_POR_OFERTA[id]],
      perguntas,
      tamanho: estimarTamanho(tudo),
      oferta: id,
    },
  }
}

/**
 * Junta os itens fixos (o que sempre entra e sempre fica fora) aos do escopo, sem repetir.
 *
 * @param escopo escopo vindo da IA ou do questionário.
 * @returns o escopo completo, com a faixa de prazo do tamanho e o texto para copiar.
 */
export function finalizarEscopo(escopo: Escopo): EscopoPronto {
  const unir = (a: string[], b: string[]) => [...new Set([...a, ...b])]
  const completo: Escopo = {
    ...escopo,
    entra: unir(escopo.entra, ENTRA_SEMPRE),
    fora: unir(escopo.fora, FORA_SEMPRE),
  }
  const prazo = PRAZOS[completo.tamanho]
  return { ...completo, prazo, textoCopiavel: escopoEmTexto(completo, prazo) }
}

/**
 * Escreve o escopo no texto que o visitante copia e cola no chat do 99 (ou onde quiser).
 *
 * @param escopo escopo completo.
 * @param prazo faixa de prazo de referência do tamanho.
 * @returns texto simples, com o rótulo "rascunho, não é proposta" no topo e a nota do preço no fim.
 */
export function escopoEmTexto(escopo: Escopo, prazo: string): string {
  const titulo = oferta.find((o) => o.id === escopo.oferta)?.titulo ?? ''
  const lista = (itens: string[]) => itens.map((i) => `- ${i}`).join('\n')
  return [
    'ESCOPO DO PROJETO (rascunho para conversar, não é proposta)',
    'Montado com o assistente do site vlfcandido.github.io',
    '',
    `Problema: ${escopo.problema}`,
    '',
    'O que entra:',
    lista(escopo.entra),
    '',
    'O que fica fora:',
    lista(escopo.fora),
    '',
    'Perguntas em aberto:',
    lista(escopo.perguntas),
    '',
    `Tamanho: ${ROTULO_TAMANHO[escopo.tamanho]}`,
    `Prazo de referência: ${prazo}`,
    titulo ? `Por onde começar: ${titulo}` : '',
    '',
    'O preço fechado e o prazo final vêm do Vinicius, depois que ele ler este rascunho.',
  ]
    .filter((linha, i, todas) => linha !== '' || todas[i - 1] !== '')
    .join('\n')
}
