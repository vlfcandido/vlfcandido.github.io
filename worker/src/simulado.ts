// Modo SIMULADO: respostas determinísticas, sem chave e sem custo, para testar o fluxo inteiro (widget, Worker,
// limites, filtros, assinatura) antes de ligar a IA. Responde no mesmo formato JSON da IA, e passa pelos mesmos
// filtros e validações do núcleo. Não é a IA: as respostas saem de regras simples sobre a base pública.

import { montarBasePublica } from '../../src/chatbot/base-bot'
import { foraDoQuePega, montarEscopo, normalizar, PERGUNTAS_ESCOPO } from '../../src/chatbot/escopo'
import type { Modelo, PedidoModelo, RespostaBruta, SaidaModelo } from './modelo'

/** Resposta da porta Trabalho por assunto: o padrão (texto normalizado) e a resposta, em terceira pessoa. */
const RESPOSTAS_TRABALHO: ReadonlyArray<readonly [RegExp, string]> = [
  [
    /sicoob.*(modelo|llm|gpt|time|equipe|pessoas|vetorial|ferramenta|plataforma|quant|colega|igual|empresa|consultoria|contrat|cnpj|vinculo|salario)|(modelo|llm|time|equipe|vetorial|ferramenta|plataforma|quant|colega|igual|consultoria|contrat).*sicoob/,
    'Sobre o Sicoob, só posso falar o que a matéria pública diz: o Vinicius lidera tecnicamente a frente de IA do assistente de investimentos usado pelas equipes das cooperativas, com três agentes (um encaminha a pergunta, um responde sobre investimentos e um cuida das perguntas frequentes). Fonte: MobileTime, 17/07/2026.',
  ],
  [
    /sicoob|cooperativ|emprego atual|trabalha hoje|onde (ele )?trabalha/,
    'Hoje o Vinicius é engenheiro de IA sênior no Sicoob e lidera tecnicamente a frente de IA do assistente de investimentos usado pelas equipes das cooperativas, com três agentes. Fonte: matéria da MobileTime de 17/07/2026.',
  ],
  [
    /contabilizei|sdr|vendedor de ia|agentes? de vendas/,
    'Na Contabilizei, como Arquiteto Sênior de IA, ele trabalhou num vendedor de IA no WhatsApp: um orquestrador e 8 agentes que qualificam o lead, apresentam planos, simulam taxas e geram a cobrança. A parte dele foi o backend em Python, a passagem automática para o time humano e as integrações com WhatsApp e CRM. Não há matéria pública, por isso o site não traz número.',
  ],
  [
    /franca|prefeitura|saude publica|setor publico/,
    'O chatbot da Saúde da Prefeitura de Franca foi feito na Blip pela Vertigo, no time de projetos Blip que o Vinicius liderava, e automatiza 5 mil atendimentos por mês. Fonte: case publicado pela Vertigo.',
  ],
  [
    /blip|vertigo|chatbot|robos? de atendimento/,
    'Na Vertigo, parceira certificada da Blip, o Vinicius foi tech lead de IA conversacional e liderou os projetos de chatbot Blip, de 2021 a 2025. Fonte: diretório de parceiros da Blip e cases publicados pela Vertigo.',
  ],
  [
    /waizer|\bwiv\b|analise de conversa/,
    'No Waizer, da Wiv, ele construiu o backend da análise de conversas e a camada de IA que classifica intenção, abandono e qualidade do robô. A plataforma passou de 5 milhões de conversas analisadas e monitora mais de 300 robôs. Fonte: MobileTime, 12/06/2026.',
  ],
  [
    /araguaia|captacao de leads|fertilizante/,
    'O chatbot de captação da Araguaia, de fertilizantes, foi entregue pela Vertigo no time que ele liderava e trouxe mais leads ao time comercial, segundo o case publicado.',
  ],
  [
    /aprovaos|saas|plataforma de estudo/,
    'O AprovaOS é um projeto próprio: SaaS de estudos com agente de IA e back-end em FastAPI, com mais de 1.600 testes automáticos e 53 decisões de arquitetura documentadas. É um MVP em desenvolvimento, sem cliente pagante. O código está em github.com/vlfcandido/aprovaos.',
  ],
  [
    /trading|cripto|bitcoin|ordens|corretora|tempo real/,
    'O sistema de ordens em tempo real é um estudo próprio: reconcilia ordens com a corretora, usa filas Redis e tem painel web, com 1.060 testes passando. Roda só em simulação, sem dinheiro de verdade. A vitrine está em github.com/vlfcandido/nexus-quant-showcase.',
  ],
  [
    /voo|passage|amadeus|integracao com api|api de terceiro|cota|rate limit/,
    'A varredura de voos é um projeto próprio de integração com a API da Amadeus, com controle de cota, cache e limite de chamadas, e 109 testes automáticos. É um MVP de uso pessoal. O código está em github.com/vlfcandido/varredura-voos.',
  ],
  [
    /revisor|revisao de codigo|\brag\b|avaliacao de (llm|ia)|llm como juiz/,
    'O revisor de código com IA é um estudo próprio com busca em documentos (RAG), servidores MCP e avaliação automática das respostas. O código está em github.com/vlfcandido/revisor-ia.',
  ],
  [
    /agente|langgraph|adk|multiagente|prompt injection|injecao/,
    'Em agentes de IA, a prova principal é o Sicoob: ele lidera a frente de IA de um assistente com três agentes (segundo a matéria da MobileTime). Como estudo próprio, há o mesmo agente em Pydantic, LangGraph e Google ADK, com defesa contra prompt injection, em github.com/vlfcandido/engenharia-de-agentes.',
  ],
  [
    /ia local|privacidade|ollama|offline|sem nuvem/,
    'A IA local com humano no circuito é um protótipo próprio: roda inteira na máquina, sem nuvem, e nenhuma ação executa sem aprovação, com log de auditoria. O código não é público.',
  ],
  [
    /score|credito|lojista/,
    'O app de score de crédito é uma prova de conceito própria, sem cliente: o lojista vê a nota do cliente e como ela foi calculada, com 41 testes no cálculo. O código não é público.',
  ],
  [
    /(este|esse|o) site|react|frontend|front-end|design system|tailwind/,
    'Este site foi feito do zero pelo Vinicius em React, TypeScript e Tailwind, com tema claro e escuro, diagramas em SVG por um motor próprio e testes que travam o conteúdo publicado. O código está em github.com/vlfcandido/vlfcandido.github.io.',
  ],
  [
    /preco|valor|quanto (custa|cobra|fica)|orcamento|cobra/,
    'Este assistente não dá preço. O preço fechado vem do Vinicius na primeira conversa, depois de ler o escopo. Se quiser, use a aba "Monte o escopo" e cole o resultado na conversa que você já tem com ele.',
  ],
  [
    /prazo|quanto tempo|demora|entrega/,
    'Pelo jeito de trabalhar publicado no site, sai uma versão para testar em 24 a 48 horas, com notícia a cada 12 horas, e a entrega vem com ficha, testes e 7 dias de correção sem custo. O prazo final de cada projeto vem dele, depois do escopo.',
  ],
  [
    /contato|telefone|e-?mail|whatsapp dele|numero dele|linkedin|falar com ele|chamar ele/,
    'Este assistente não passa contato. Se você já conversa com ele, cole o escopo nessa mesma conversa.',
  ],
  [
    /experiencia|quantos anos|carreira|trabalhou|curriculo|senior/,
    'O Vinicius trabalha com software há 13 anos: back-end em Java, Node.js e Python, e IA aplicada em produção desde 2021. Passou por Sicoob (hoje), Contabilizei, Serasa Experian, Vertigo, Sovis, Festval e Linx; a linha do tempo está na seção Carreira do site.',
  ],
  [
    /tecnologia|stack|python|java|node|typescript|banco de dados|nuvem|gcp|aws/,
    'No back-end: Python, FastAPI, Java, Spring Boot, Node.js e TypeScript. Em IA: agentes, multiagente, RAG, LangGraph, Google ADK, Gemini e Claude. Dados em PostgreSQL, Redis e BigQuery; nuvem em GCP e AWS, com Docker e CI/CD.',
  ],
  [
    /(como|voce) (funciona|e uma ia|e um robo|e o vinicius)|assistente|quem (e|esta) (voce|falando)/,
    'Sou o assistente automático do site, não o Vinicius. Só conheço o que o site publica, não guardo a conversa e tenho teto de gasto; o link "Como este assistente funciona" mostra os detalhes.',
  ],
]

/** Termos de requisito de vaga que a base comprova, com a prova pública. */
const PROVAS_VAGA: ReadonlyArray<readonly [string, RegExp, string]> = [
  ['Python', /python/, 'cases Contabilizei e Waizer; AprovaOS em github.com/vlfcandido/aprovaos'],
  ['Java', /\bjava\b|spring/, 'carreira: Sovis, Festval e Linx (APIs em Java com Spring Boot)'],
  ['Node.js / TypeScript', /node|typescript/, 'este site, em github.com/vlfcandido/vlfcandido.github.io'],
  ['Agentes de IA / multiagente', /agente|multiagente|multi-agente/, 'Sicoob, segundo a matéria da MobileTime de 17/07/2026'],
  ['RAG', /\brag\b|retrieval/, 'revisor de código em github.com/vlfcandido/revisor-ia'],
  ['LangGraph', /langgraph/, 'github.com/vlfcandido/engenharia-de-agentes'],
  ['Google ADK / Gemini', /adk|gemini|vertex/, 'Contabilizei (8 agentes em Google ADK + Gemini no Vertex AI)'],
  ['Chatbots / WhatsApp', /chatbot|whatsapp|blip/, 'Prefeitura de Franca, case publicado pela Vertigo'],
  ['FastAPI', /fastapi/, 'AprovaOS em github.com/vlfcandido/aprovaos'],
  ['React / front-end', /react|front/, 'este site, em github.com/vlfcandido/vlfcandido.github.io'],
  ['Testes automatizados', /teste|tdd|pytest/, 'AprovaOS (mais de 1.600 testes) e sistema de ordens (1.060 testes)'],
  ['Redis / filas', /redis|fila|stream/, 'sistema de ordens em github.com/vlfcandido/nexus-quant-showcase'],
  ['PostgreSQL', /postgres|sql/, 'stack do AprovaOS e do sistema de ordens'],
  ['Integração com APIs', /integrac|api rest|\bapis?\b/, 'varredura de voos em github.com/vlfcandido/varredura-voos'],
]

/** Palavras com maiúscula que não iniciam frase: nomes de empresa, produto ou pessoa. */
function nomesProprios(texto: string): string[] {
  return [...texto.matchAll(/(?<![.!?]\s|^)\b([A-ZÀ-Ú][\wÀ-ú-]{2,})/g)].map((m) => m[1])
}

/** Nomes que o visitante citou e que a base pública não conhece (o simulado diz "não tenho" para eles). */
function nomesForaDaBase(texto: string, base: string): string[] {
  return nomesProprios(texto).filter((n) => !base.includes(normalizar(n)))
}

/** Parece a descrição de uma vaga colada? */
function pareceVaga(texto: string): boolean {
  const n = normalizar(texto)
  return texto.length > 80 && /\b(vaga|requisitos|desejavel|diferencial|responsabilidades|experiencia com|buscamos)\b/.test(n)
}

/** Aderência determinística: o que a base prova, o que não prova e o que perguntar. */
function aderencia(vaga: string): RespostaBruta {
  const n = normalizar(vaga)
  const comProva = PROVAS_VAGA.filter(([, p]) => p.test(n)).map(([requisito, , prova]) => ({ requisito, prova }))
  const linhas = vaga
    .split(/\n|;/)
    .map((l) => l.replace(/^[\s\-•*·]+/, '').trim())
    .filter((l) => l.length > 3 && l.length < 120)
  const semProva = linhas.filter((l) => !PROVAS_VAGA.some(([, p]) => p.test(normalizar(l))) && /experiencia|conhecimento|dominio|vivencia/.test(normalizar(l))).slice(0, 5)
  return {
    tipo: 'aderencia',
    texto: 'Cruzei a vaga com o que o site comprova. "Sem prova" não quer dizer que ele não sabe; quer dizer que o site não mostra.',
    escopo: null,
    aderencia: {
      com_prova: comProva,
      sem_prova: semProva,
      perguntar: [
        'Qual dos projetos citados é mais parecido com o desafio do time?',
        'Como ele mede a qualidade das respostas de IA antes de ir para produção?',
        'Como ele divide um projeto grande em entregas pequenas?',
      ],
    },
  }
}

/** Modelo simulado: determinístico, sem rede, sem custo. */
export class ModeloSimulado implements Modelo {
  readonly tipo = 'simulado' as const
  private readonly base = normalizar(montarBasePublica())

  /**
   * Responde pelas regras: na porta Escopo, segue o questionário e monta o escopo na 5ª resposta (ou antes, se
   * o visitante pedir); na porta Trabalho, responde por assunto ou monta a aderência a uma vaga colada.
   *
   * @param pedido porta, histórico conferido e mensagem nova.
   * @returns a resposta no formato da IA, sem uso (custo zero).
   */
  async responder(pedido: PedidoModelo): Promise<SaidaModelo> {
    return { ok: true, resposta: this.regra(pedido), uso: null }
  }

  private regra(pedido: PedidoModelo): RespostaBruta {
    const vazio = { escopo: null, aderencia: null }
    if (pedido.porta === 'trabalho') {
      if (pareceVaga(pedido.texto)) return aderencia(pedido.texto)
      const n = normalizar(pedido.texto)
      // Pergunta sobre um nome que o site não cita (empresa, cliente, produto): nada de improvisar.
      const desconhecidos = nomesForaDaBase(pedido.texto, this.base)
      const achada = desconhecidos.length ? undefined : RESPOSTAS_TRABALHO.find(([p]) => p.test(n))
      return {
        tipo: 'resposta',
        texto: achada?.[1] ?? 'Não tenho essa informação. Posso falar dos cases, dos projetos próprios, da carreira e do jeito de trabalhar que estão no site.',
        ...vazio,
      }
    }

    // Pedido de contato ou de preço no meio do escopo: responde a regra e segue o roteiro.
    const pedidoN = normalizar(pedido.texto)
    const desvio = /\b(contato|whatsapp dele|e-?mail dele|telefone dele|fora do 99|direto com ele|fechar direto)\b/.test(pedidoN)
      ? 'Este assistente não passa contato: a saída é copiar o escopo e colar na conversa que você já tem com ele.'
      : /\b(quanto (vai )?custa|preco|valor|em reais|orcamento)\b/.test(pedidoN)
        ? 'Este assistente não dá preço: o preço fechado vem do Vinicius, depois de ler o escopo.'
        : null

    const respostas = [...pedido.historico.filter((f) => f.papel === 'visitante').map((f) => f.texto), pedido.texto]
    const razao = foraDoQuePega(respostas.join('\n'))
    if (razao) return { tipo: 'recusa', texto: razao, ...vazio }
    const pediuParaMontar = /\b(pode montar|monta (o )?escopo|ja (e|da) isso|so isso|fecha o escopo|gera (o )?escopo)\b/.test(normalizar(pedido.texto))
    if (respostas.length < PERGUNTAS_ESCOPO.length && !(pediuParaMontar && respostas.length >= 2)) {
      return { tipo: 'pergunta', texto: `${desvio ?? 'Anotado.'} ${PERGUNTAS_ESCOPO[respostas.length].texto}`, ...vazio }
    }
    const r = montarEscopo(respostas)
    if (r.tipo === 'recusa') return { tipo: 'recusa', texto: r.texto, ...vazio }
    return { tipo: 'escopo', texto: 'Aqui está o rascunho do escopo, para conversar; não é uma proposta.', escopo: r.escopo, aderencia: null }
  }
}
