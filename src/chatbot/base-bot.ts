// Base de conhecimento do assistente: SÓ o que o site já publica, montada a partir de conteudo.ts,
// projetos.ts e trajetoria.ts, mais a parte curada à mão abaixo (banco de provas, linhas "site").
// Se o site mudar, o assistente muda junto (estudo de 08/10/2026, "Manutenção"). O teste
// base-bot.test.ts passa a lista de termos proibidos sobre o texto final.
// Regra de ouro (estudo, seção 3): o contexto não contém nada que valha a pena roubar. Por isso nem a lista
// do que é proibido entra aqui: as regras falam de forma genérica ("nada além da matéria pública").
// Nada executa ao importar: a base é montada por função.

import { cases, oferta, passos, perfil, recebe, stack } from '../conteudo'
import { listarProjetos, type StatusProjeto } from '../projetos'
import { empregos } from '../trajetoria'

/** Como o status honesto de cada projeto próprio é dito (banco de provas: o status vai junto). */
const STATUS: Record<StatusProjeto, string> = {
  producao: 'no ar',
  mvp: 'MVP em desenvolvimento, sem cliente pagante',
  prototipo: 'protótipo, sem cliente',
  estudo: 'estudo próprio, sem cliente',
}

/**
 * Linhas da carreira que o assistente diz diferente do card, por cautela:
 * - Serasa: o número de aplicações é relato sem fonte pública (estudo, seção 3: "nunca no site" para o bot).
 * - Sicoob: só o que a matéria pública diz (banco de provas), sem o detalhe da linha da carreira.
 */
const CARREIRA_AJUSTADA: Record<string, string> = {
  'serasa-experian': 'Responsável técnico por um squad que corrigiu vulnerabilidades e padronizou CI/CD em aplicações da empresa.',
  sicoob:
    'Lidera tecnicamente a frente de IA do assistente de investimentos usado pelas equipes das cooperativas: três agentes (um encaminha a pergunta, um responde sobre investimentos, um cuida das perguntas frequentes). Fonte: matéria da MobileTime de 17/07/2026.',
}

/** Clientes citáveis por ramo: 1 a 3 nomes do mesmo ramo do pedido, nunca a lista (banco de provas, 07/10). */
export const CLIENTES_POR_RAMO: ReadonlyArray<readonly [string, string]> = [
  ['clínica, saúde e odontologia', 'Unimed e OdontoPrev'],
  ['jurídico e setor público', 'TJPR e MPRJ'],
  ['varejo e e-commerce', 'Vivara e OLX'],
  ['indústria e agro', 'Yara e Araguaia'],
  ['telecom e serviços', 'TIM e Comgás'],
]

/** O que ele não pega, com a razão genérica (estudo, seção 5, invariante 6). */
export const NAO_PEGA: string[] = [
  'projetos para banco, cooperativa ou investimentos',
  'app de celular grande, publicado nas lojas',
  'loja virtual do zero (integrar uma loja que já existe, ele faz)',
  'design de marca, logotipo e peças gráficas',
]

/** Fatos sobre o próprio assistente, para responder "como você funciona?". */
export const SOBRE_O_ASSISTENTE: string[] = [
  'É um assistente automático do site, não é o Vinicius; fala dele em terceira pessoa.',
  'Usa o modelo Claude Haiku 5.5, da Anthropic, por um servidor intermediário que guarda a chave, limita o uso e confere cada resposta antes de ela aparecer.',
  'Só conhece o que este site publica. Fora disso, diz que não tem a informação.',
  'Não guarda as conversas. O texto passa pela API da Anthropic para gerar a resposta.',
  'Tem teto de gasto mensal. Quando o teto é atingido, o site troca para um roteiro fixo que monta o mesmo escopo sem IA.',
]

/** Junta itens de lista num texto com travessão no começo de cada linha. */
function itens(linhas: string[]): string {
  return linhas.map((l) => `- ${l}`).join('\n')
}

/**
 * Monta a base pública inteira, em texto, para ir no prompt de sistema (cabe em ~8 mil tokens).
 *
 * @returns o texto da base, em seções com título.
 */
export function montarBasePublica(): string {
  const projetos = listarProjetos()
  const proprios = projetos.filter((p) => p.origem === 'proprio')
  const empresas = projetos.filter((p) => p.origem === 'empresa' && !p.participacao)
  const participacoes = projetos.filter((p) => p.origem === 'empresa' && p.participacao)

  const secoes: Array<[string, string]> = [
    [
      'Quem é',
      [
        `${perfil.nome}. ${perfil.titulo.replace(' · ', ', ')}.`,
        perfil.chamada,
        perfil.linha,
        perfil.resumo,
        perfil.notaTrabalho,
      ].join('\n'),
    ],
    [
      'O que ele resolve (as 6 ofertas do site; o id vai entre colchetes)',
      oferta
        .map((o) => `- [${o.id}] ${o.titulo}: ${o.descricao} Exemplo ilustrativo: antes, "${o.antes}"; depois, "${o.depois}"`)
        .join('\n'),
    ],
    [
      'Como ele trabalha (passos publicados)',
      passos.map((p, i) => `- ${p.titulo}: ${p.descricao} O cliente recebe: ${recebe[i]}`).join('\n'),
    ],
    [
      'Cases em empresas (só o que está publicado; cite a fonte pelo nome, sem link)',
      [
        ...cases
          .filter((c) => c.tipo !== 'proprio')
          .map((c) => `- ${c.titulo}: ${c.contexto} ${c.feito} ${c.metrica} Fonte: ${c.fonte.url ? c.fonte.texto : 'sem matéria pública, por isso sem número'}.`),
        ...empresas
          .filter((e) => e.papel)
          .map((e) => `- Papel em ${e.nome}: ${e.papel}.`),
      ].join('\n'),
    ],
    [
      'Projetos em empresas de que ele só participou (não liderou)',
      participacoes.map((p) => `- ${p.nome}: ${p.feito}`).join('\n'),
    ],
    [
      'Projetos próprios (status honesto; nunca dizer que foram para cliente)',
      proprios
        .map((p) => {
          const numeros = p.numeros.length ? ` Números: ${p.numeros.join('; ')}.` : ''
          const repo = p.repositorio ? ` Código: ${p.repositorio.replace('https://', '')}` : ' Código não é público.'
          return `- ${p.nome} (${STATUS[p.status]}): ${p.feito}${numeros}${repo}`
        })
        .join('\n'),
    ],
    [
      'Carreira',
      empregos
        .map((e) => `- ${e.empresa}${e.local ? ` ${e.local}` : ''}, ${e.cargo}, ${e.periodo}: ${CARREIRA_AJUSTADA[e.slug] ?? e.resultado}`)
        .join('\n'),
    ],
    ['Tecnologias', stack.map((c) => `- ${c.camada}: ${c.itens.join(', ')}`).join('\n')],
    [
      'Clientes de projetos que ele liderou, por ramo (citar no máximo 1 a 3 do mesmo ramo, nunca a lista)',
      CLIENTES_POR_RAMO.map(([ramo, nomes]) => `- ${ramo}: ${nomes}`).join('\n'),
    ],
    ['O que ele não pega', itens(NAO_PEGA)],
    ['Sobre este assistente', itens(SOBRE_O_ASSISTENTE)],
  ]
  return secoes.map(([titulo, corpo]) => `## ${titulo}\n${corpo}`).join('\n\n')
}

/**
 * Links que o assistente pode escrever: o site e os repositórios publicados na página de projetos.
 *
 * @returns endereços sem `https://`, prontos para comparar com o que a IA escreveu.
 */
export function linksPermitidos(): string[] {
  const repos = listarProjetos()
    .map((p) => p.repositorio)
    .filter((r): r is string => Boolean(r))
    .map((r) => r.replace('https://', ''))
  return ['vlfcandido.github.io', ...repos]
}
