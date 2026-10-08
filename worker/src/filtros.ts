// Filtros de entrada e de saída do assistente (estudo de 08/10/2026, seções 3 e 5).
// Entrada: tamanho, dado pessoal apagado antes de ir para a API (LGPD, minimização), tentativa de injeção de
// prompt e uso como "IA grátis" recusados sem gastar chamada.
// Saída: os invariantes conferidos em código, porque prompt não é garantia. Se a IA escrever algo proibido,
// a resposta é trocada inteira por uma resposta segura; nunca se "conserta" metade do texto.

import { normalizar } from '../../src/chatbot/escopo'
import { LIMITES } from '../../src/chatbot/protocolo'
import { encontrarTermosProibidos } from '../../src/lib/termos-proibidos'
import { linksPermitidos } from '../../src/chatbot/base-bot'

/** Resultado do filtro de entrada. */
export type EntradaFiltrada =
  | { ok: true; texto: string; removidos: string[] }
  | { ok: false; motivo: 'vazia' | 'longa' | 'injecao' | 'fora_do_tema'; resposta: string }

/** Dado pessoal que é apagado da entrada antes de ir para a API. */
const DADOS_PESSOAIS: ReadonlyArray<readonly [string, RegExp]> = [
  ['e-mail', /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g],
  ['CPF', /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g],
  ['CNPJ', /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g],
  ['telefone', /(?:\+?55\s?)?\(?\b\d{2}\)?[\s.-]?9?\d{4}[\s.-]?\d{4}\b/g],
]

/** Tentativas de mudar as regras do assistente ou de tirar o prompt dele (texto já normalizado). */
const INJECAO: RegExp[] = [
  /\b(ignore|ignora|ignorar|esqueca|esquece|desconsidere|desconsidera)\b.{0,40}\b(instruc|regra|prompt|orientac|anterior|acima|tudo)/,
  /\bignore (all|previous|the above|your)\b/,
  /\b(system prompt|prompt do sistema|prompt de sistema|instrucoes (do sistema|iniciais|originais|internas))\b/,
  /\b(repita|mostre|revele|imprima|liste|copie|cole|traduza)\b.{0,40}\b(suas instruc|seu prompt|o prompt|as regras|suas regras|o contexto|sua base|texto acima)/,
  /\ba partir de agora\b.{0,30}\b(voce|vc)\b/,
  /\b(finja|aja como|faca de conta|act as|pretend|roleplay|interprete o papel)\b/,
  /\b(modo desenvolvedor|developer mode|jailbreak|dan mode|sem restric|sem filtro)\b/,
  /<\/?\s*(system|sistema|instruc|mensagem_do_visitante|assistant)/,
  /\b(voce e|vc e|seja) o (proprio )?vinicius\b|\bresponda como (se fosse )?o vinicius\b|\bfale em primeira pessoa\b/,
]

/** Pedidos que usam o assistente como IA de uso geral (texto já normalizado). */
const FORA_DO_TEMA: RegExp[] = [
  /\b(escreva|escreve|gere|gera|crie|cria|faca|faz|me de|programe)\b.{0,40}\b(codigo|script|funcao em|programa em|redacao|poema|musica|historia|tcc|artigo|trabalho da faculdade|post para)/,
  /\b(traduza|traduz|traducao de|translate)\b/,
  /\b(resolva|resolve|responda) (essa|esta|a) (questao|equacao|prova|lista|atividade)\b/,
  /\b(qual a capital|quem ganhou|receita de|previsao do tempo|horoscopo)\b/,
  /\b(resuma|resume) (esse|este|o) (livro|texto|artigo|video)\b/,
]

/** Resposta fixa para tentativa de injeção: curta, sem explicar o filtro. */
export const RESPOSTA_INJECAO =
  'Não consigo seguir esse tipo de pedido. Este assistente só ajuda a montar o escopo de um projeto e responde sobre o trabalho do Vinicius que está no site.'

/** Resposta fixa para uso como IA de uso geral. */
export const RESPOSTA_FORA_DO_TEMA =
  'Isso foge do que este assistente faz: ele só ajuda a montar o escopo de um projeto de software e responde sobre o trabalho do Vinicius que está no site.'

/**
 * Filtra a mensagem do visitante antes de qualquer chamada à API.
 *
 * @param bruto texto como chegou do navegador.
 * @returns o texto limpo (com os dados pessoais trocados por um marcador), ou a recusa com a resposta fixa.
 */
export function filtrarEntrada(bruto: string): EntradaFiltrada {
  const texto = String(bruto ?? '')
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/g, '')
    .trim()
  if (!texto) return { ok: false, motivo: 'vazia', resposta: 'Escreva uma mensagem para começar.' }
  if (texto.length > LIMITES.entradaMax) {
    return { ok: false, motivo: 'longa', resposta: `A mensagem passou de ${LIMITES.entradaMax} caracteres. Resuma e envie de novo.` }
  }
  const n = normalizar(texto)
  if (INJECAO.some((p) => p.test(n))) return { ok: false, motivo: 'injecao', resposta: RESPOSTA_INJECAO }
  if (FORA_DO_TEMA.some((p) => p.test(n))) return { ok: false, motivo: 'fora_do_tema', resposta: RESPOSTA_FORA_DO_TEMA }

  let limpo = texto
  const removidos: string[] = []
  for (const [rotulo, padrao] of DADOS_PESSOAIS) {
    if (padrao.test(limpo)) removidos.push(rotulo)
    padrao.lastIndex = 0
    limpo = limpo.replace(padrao, `[${rotulo} removido]`)
  }
  return { ok: true, texto: limpo, removidos }
}

/** Termos que nunca podem sair, além dos de `termos-proibidos.ts` (estudo, seção 3, "O que nunca pode sair"). */
const SAIDA_PROIBIDA: ReadonlyArray<readonly [string, RegExp]> = [
  ['concierge', /concierge/],
  ['nexus-clips', /nexus[- ]?clips/],
  ['bot-pedidos', /bot[- ]?pedidos/],
  ['relato sem fonte (80+ chatbots)', /\b80\s*\+|\b80 chatbots|\boitenta chatbots/],
  ['relato sem fonte (300 aplicações)', /\b300 (aplicac|apps|sistemas)/],
  ['relato sem fonte (1.500 contatos)', /\b1[.,]?500 contatos/],
  ['lucro de trading', /(?<!sem )\blucr(o|ou|ativ|ar)\b|\brendimento\b|\bganhos? (com|no|na) (trading|cripto|mercado)/],
  ['detalhe interno do Sicoob', /\b(keycloak|weaviate|opensearch|kubernetes eks|keda|pydantic-ai no sicoob|bff)\b/],
  ['valor em reais', /r\$\s?\d|\b\d+[.,]?\d*\s?(reais|mil reais)\b|\bpreco (e|fica|sai|seria) de\b/],
  ['contato', /\b(whats(app)?|zap|telefone|celular|e-?mail|linkedin|instagram)\b.{0,25}\b(dele|do vinicius|para contato|pra contato)\b|\b(me chama|me chame|fale comigo|chame no|chama no|manda (um )?(e-?mail|mensagem) para|wa\.me)\b/],
  ['sair do 99', /\b(fora do 99|fora da plataforma|direto com ele|sem o 99)\b/],
  ['primeira pessoa como o Vinicius', /\b(eu sou o vinicius|sou o vinicius|aqui e o vinicius|meu nome e vinicius|eu (fiz|construi|liderei|entrego|cobro)\b)/],
  ['data de entrega', /\b(entrego|entrega|fica pronto|termino)\b.{0,20}\b(ate|no dia|em) \d{1,2}(\/| de )/],
]

/** Resultado do filtro de saída. */
export type SaidaFiltrada = { ok: true } | { ok: false; motivos: string[] }

/**
 * Confere um texto que a IA escreveu contra os invariantes.
 *
 * @param texto todo o texto que vai aparecer na tela (resposta, escopo, aderência, juntos).
 * @returns `ok`, ou os motivos do bloqueio.
 */
export function filtrarSaida(texto: string): SaidaFiltrada {
  const motivos = [...encontrarTermosProibidos(texto)]
  const n = normalizar(texto)
  for (const [rotulo, padrao] of SAIDA_PROIBIDA) if (padrao.test(n)) motivos.push(rotulo)
  const permitidos = linksPermitidos()
  const links = texto.match(/(?:https?:\/\/)?(?:[a-z0-9-]+\.)+(?:com|br|io|ai|net|org|me|ly|gl|app|dev)(?:\.br)?(?:\/[^\s)]*)?/gi) ?? []
  for (const link of links) {
    const sem = link.replace(/^https?:\/\//i, '').replace(/[.,;:]+$/, '').toLowerCase()
    if (!permitidos.some((p) => sem === p || sem.startsWith(`${p}/`))) motivos.push(`link fora da lista (${sem})`)
  }
  return motivos.length ? { ok: false, motivos: [...new Set(motivos)] } : { ok: true }
}

/** Resposta segura que substitui uma saída bloqueada. */
export const RESPOSTA_SEGURA =
  'Não tenho uma resposta segura para isso. Posso ajudar a montar o escopo do seu projeto ou falar do trabalho do Vinicius que está publicado no site.'
