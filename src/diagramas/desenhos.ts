// Os desenhos do site, como dado. Só arquitetura real: cada um saiu do código ou do README do
// projeto (estudo de 07/10/2026 e leitura de 08/10/2026), e o do Sicoob só do que a matéria pública
// diz. Nada de nome interno, modelo, banco vetorial ou plataforma de empresa. Lucro de trading nunca.
// Este arquivo só exporta funções e tipos: nada roda no import.

import type { Desenho } from './motor'

/** Identificador de cada desenho. */
export type IdDesenho =
  | 'como-eu-integro'
  | 'sicoob'
  | 'nexus-quant'
  | 'aprovaos'
  | 'nexus-clips'
  | 'varredura-voos'
  | 'ecovita'
  | 'minu'
  | 'agente-roteador'
  | 'agente-grafo'
  | 'agente-ferramentas'
  | 'agente-rag'
  | 'ia-local'

/**
 * Todos os desenhos, pelo id.
 *
 * @returns um objeto novo a cada chamada.
 */
export function listarDesenhos(): Record<IdDesenho, Desenho> {
  return {
    'como-eu-integro': {
      id: 'como-eu-integro',
      titulo: 'Como eu ligo um agente ao que a sua empresa já usa',
      descricao:
        'O cliente escreve no WhatsApp; o agente entende o pedido e decide o próximo passo, passando a conversa para uma pessoa da equipe quando não resolve; consulta e grava na agenda, no ERP ou no CRM; tudo fica registrado num painel; e a confirmação volta para o cliente no WhatsApp.',
      etapas: [
        { legenda: 'o cliente escreve', nos: [{ titulo: 'WhatsApp', sub: 'mensagem do seu cliente, a qualquer hora', forma: 'pilula' }] },
        {
          legenda: 'entende e decide',
          nos: [{ titulo: 'Agente', sub: 'entende o pedido e escolhe o próximo passo', destaque: true }],
          lateral: { no: { titulo: 'Pessoa da equipe', sub: 'assume quando o robô não resolve', forma: 'pilula' }, rotulo: 'passa a conversa', duplo: true },
        },
        {
          legenda: 'consulta e grava',
          grupo: 'o que você já usa',
          nos: [{ titulo: 'Agenda' }, { titulo: 'ERP' }, { titulo: 'CRM' }],
          lateral: { no: { titulo: 'Painel', sub: 'conversas e atendimentos num lugar só' }, rotulo: 'tudo fica registrado' },
        },
      ],
      retorno: { de: 2, para: 0, rotulo: 'a confirmação volta no WhatsApp' },
      porLinha: 3,
    },

    sicoob: {
      id: 'sicoob',
      titulo: 'Assistente de investimentos com três agentes de IA',
      descricao:
        'A pergunta da equipe da cooperativa, no atendimento consultivo, chega a um agente que encaminha: ele entende o assunto e passa para o agente de investimentos ou para o agente de perguntas frequentes. Conforme a matéria pública da MobileTime.',
      etapas: [
        { legenda: 'a equipe pergunta', nos: [{ titulo: 'Pergunta da equipe', sub: 'no atendimento consultivo das cooperativas', forma: 'pilula' }] },
        { legenda: 'decide quem responde', nos: [{ titulo: 'Agente que encaminha', sub: 'entende o assunto da pergunta', destaque: true }] },
        {
          legenda: 'responde',
          grupo: 'o agente certo',
          nos: [
            { titulo: 'Agente de investimentos', sub: 'dúvidas sobre investimentos' },
            { titulo: 'Agente de perguntas frequentes', sub: 'as dúvidas do dia a dia' },
          ],
        },
      ],
      porLinha: 3,
    },

    'nexus-quant': {
      id: 'nexus-quant',
      titulo: 'Bot de trading que confere tudo com a corretora',
      descricao:
        'A corretora, hoje em simulação, manda o preço; um coletor publica cada leitura numa fila Redis Streams; o cérebro ativo decide enquanto um cérebro em teste decide em paralelo sem operar; guardas de risco filtram a decisão; e a ordem volta à corretora com identificador único, para que um reinício nunca duplique ordem. Uma reconciliação compara a corretora com o banco a cada minuto e a corretora sempre vence. Cada decisão vira evento, que alimenta o painel e os alertas.',
      etapas: [
        {
          legenda: 'o preço chega',
          nos: [{ titulo: 'Corretora', sub: 'Bybit, hoje em simulação', forma: 'pilula' }],
          lateral: { no: { titulo: 'Reconciliação', sub: 'a cada minuto' }, rotulo: 'a corretora sempre vence', duplo: true },
        },
        {
          legenda: 'entra na fila',
          grupo: 'a cada 5 segundos',
          nos: [{ titulo: 'Coletor', sub: 'preço e indicadores' }, { titulo: 'Redis Streams', sub: 'fila de leituras', forma: 'cilindro' }],
        },
        {
          legenda: 'decide',
          grupo: 'cérebro trocável',
          nos: [
            { titulo: 'Cérebro ativo', sub: 'função pura, troca sem reiniciar', destaque: true },
            { titulo: 'Cérebro em teste', sub: 'decide em paralelo, sem operar' },
          ],
        },
        {
          legenda: 'protege',
          nos: [{ titulo: 'Guardas de risco', sub: 'teto de perda, pausa e botão de parada' }],
          lateral: { no: { titulo: 'Painel e alertas', sub: 'Next.js, Grafana e Telegram' }, rotulo: 'cada decisão vira evento' },
        },
      ],
      retorno: { de: 3, para: 0, rotulo: 'ordem com identificador único: reiniciar nunca duplica' },
      porLinha: 4,
      etiquetas: ['Python', 'FastAPI', 'Redis Streams', 'PostgreSQL', 'Next.js', 'Prometheus'],
    },

    aprovaos: {
      id: 'aprovaos',
      titulo: 'Do edital ao plano do dia, com o porquê de cada escolha',
      descricao:
        'O agente analista lê o edital e as provas e monta o DNA do concurso, com uma regra fixa de reserva se a IA falhar. Regras geram as opções de estudo e a IA escolhe e escreve o porquê de cada bloco do plano do dia. Questão e aula só chegam ao aluno depois de validadas, com a fonte. A previsão de nota sai com margem de erro por matéria, e cada resposta reagenda a revisão.',
      etapas: [
        { legenda: 'lê', nos: [{ titulo: 'Edital e provas', sub: 'o PDF da banca', forma: 'pilula' }] },
        { legenda: 'entende a prova', nos: [{ titulo: 'DNA do concurso', sub: 'agente analista; se a IA falha, regra fixa', destaque: true }] },
        { legenda: 'monta o dia', nos: [{ titulo: 'Plano do dia', sub: 'regras dão as opções; a IA escolhe e diz o porquê' }] },
        { legenda: 'confere antes', nos: [{ titulo: 'Validação', sub: 'questão só chega ao aluno com fonte; a inédita passa por um validador' }] },
        {
          legenda: 'mede',
          nos: [{ titulo: 'Previsão com intervalo', sub: 'nota provável com margem de erro, por matéria' }],
          lateral: { no: { titulo: 'Revisão no dia certo', sub: 'repetição espaçada' }, rotulo: 'cada resposta reagenda' },
        },
      ],
      porLinha: 3,
      etiquetas: ['FastAPI', 'Google ADK', 'Gemini', 'PostgreSQL'],
    },

    'nexus-clips': {
      id: 'nexus-clips',
      titulo: 'Da notícia do momento ao vídeo curto',
      descricao:
        'Fontes como X, YouTube e RSS entram por uma fila. Um grafo LangGraph classifica o conteúdo e, numa aresta condicional, descarta o que é pouco relevante ou repetido. O que passa ganha uma estratégia; legenda, crescimento e escolha de canais rodam em paralelo; depois o vídeo é gerado e salvo. O upload no YouTube já funciona; o fluxo de ponta a ponta ainda está em construção.',
      etapas: [
        { legenda: 'acompanha', nos: [{ titulo: 'Fontes', sub: 'X, YouTube e RSS, numa fila', forma: 'pilula' }] },
        {
          legenda: 'classifica',
          nos: [{ titulo: 'Classificar', sub: 'tema, relevância e confiança', destaque: true }],
          lateral: { no: { titulo: 'Descarta', sub: 'pouco relevante ou repetido' }, rotulo: 'aresta condicional' },
        },
        { legenda: 'planeja', nos: [{ titulo: 'Estratégia', sub: 'o ângulo do corte' }] },
        { legenda: 'em paralelo', grupo: 'três nós ao mesmo tempo', nos: [{ titulo: 'Legenda' }, { titulo: 'Crescimento' }, { titulo: 'Canais' }] },
        { legenda: 'gera', nos: [{ titulo: 'Vídeo', sub: 'narração, FFmpeg e Whisper' }] },
        { legenda: 'guarda', nos: [{ titulo: 'Fila de publicação', sub: 'upload no YouTube já funciona', forma: 'cilindro' }] },
      ],
      porLinha: 3,
      etiquetas: ['LangGraph', 'LangChain', 'Claude API', 'FFmpeg'],
    },

    'varredura-voos': {
      id: 'varredura-voos',
      titulo: 'Busca de passagens que protege a cota da API',
      descricao:
        'As janelas de feriado definem as datas. Antes de cada chamada, um orçamento de cota mensal e um cache de 12 horas evitam gasto; a API da Amadeus é chamada respeitando o limite de chamadas. Ofertas com ida ou volta acima do teto de duração saem antes do preço, e o resultado é um ranking em CSV.',
      etapas: [
        { legenda: 'escolhe as datas', nos: [{ titulo: 'Janelas de feriado', sub: 'calendário de feriados nacionais' }] },
        {
          legenda: 'antes de chamar',
          grupo: 'protege a conta',
          nos: [
            { titulo: 'Cota do mês', sub: 'para e diz o que ficou de fora' },
            { titulo: 'Cache de 12 h', forma: 'cilindro' },
          ],
        },
        { legenda: 'consulta', nos: [{ titulo: 'API Amadeus', sub: 'OAuth e limite de chamadas', forma: 'pilula', destaque: true }] },
        { legenda: 'filtra', nos: [{ titulo: 'Filtro de duração', sub: 'ida ou volta acima de 6 h sai antes do preço' }] },
        { legenda: 'entrega', nos: [{ titulo: 'Ofertas', sub: 'ranking por preço, em CSV' }] },
      ],
      porLinha: 3,
      etiquetas: ['Python 3.13', 'API Amadeus', 'cache', '109 testes'],
    },

    ecovita: {
      id: 'ecovita',
      titulo: 'Roleta de corretores: nenhum lead fica parado',
      descricao:
        'O lead chega pelo WhatsApp no Blip ou pelo site e entra numa fila no SQL Server. Um job agendado no Hangfire confere a situação no CRM e a última conversa no Blip Desk. Se o lead está parado há mais de uma hora, a roleta passa para o próximo corretor da mesma fila: o ticket é transferido no Blip, o responsável é atualizado no CRM e tudo vira evento no analytics.',
      etapas: [
        { legenda: 'o lead chega', nos: [{ titulo: 'Lead', sub: 'WhatsApp pelo Blip ou formulário do site', forma: 'pilula' }] },
        { legenda: 'entra na fila', nos: [{ titulo: 'Fila de roletagem', sub: 'SQL Server, lida por um job agendado', forma: 'cilindro' }] },
        { legenda: 'confere', grupo: 'onde o lead está', nos: [{ titulo: 'CRM', sub: 'situação do lead' }, { titulo: 'Blip Desk', sub: 'última conversa' }] },
        { legenda: 'decide', nos: [{ titulo: 'Roleta', sub: 'parado há mais de 1 hora: vai para o próximo corretor da fila', destaque: true }] },
        { legenda: 'transfere', grupo: 'atualiza os dois lados', nos: [{ titulo: 'Ticket no Blip' }, { titulo: 'Responsável no CRM' }] },
        { legenda: 'registra', nos: [{ titulo: 'Analytics', sub: 'evento e log de cada rodada' }] },
      ],
      porLinha: 3,
      etiquetas: ['.NET', 'Hangfire', 'SQL Server', 'API do Blip', 'API do CRM'],
    },

    minu: {
      id: 'minu',
      titulo: 'Rastreio de campanhas no WhatsApp',
      descricao:
        'A cada minuto um agendador do Google Cloud dispara uma função no Firebase. Ela busca as campanhas recentes e a audiência no Blip, lê o status de cada mensagem (enviada, entregue, lida ou falha), junta o perfil do usuário no Braze e no contato do Blip e registra um evento por status no analytics, para o funil da campanha.',
      etapas: [
        { legenda: 'a cada minuto', nos: [{ titulo: 'Agendador', sub: 'Cloud Scheduler', forma: 'pilula' }] },
        { legenda: 'busca', nos: [{ titulo: 'Campanhas no Blip', sub: 'as recentes e a audiência', destaque: true }] },
        { legenda: 'lê o status', nos: [{ titulo: 'Cada mensagem', sub: 'enviada, entregue, lida ou falha' }] },
        { legenda: 'junta o perfil', grupo: 'de quem recebeu', nos: [{ titulo: 'Braze', sub: 'perfil do usuário' }, { titulo: 'Contato no Blip' }] },
        { legenda: 'registra', nos: [{ titulo: 'Analytics', sub: 'um evento por status, para o funil' }] },
      ],
      porLinha: 3,
      etiquetas: ['Firebase Functions', 'Hono', 'TypeScript', 'Zod', 'API do Blip'],
    },

    'agente-roteador': {
      id: 'agente-roteador',
      titulo: 'Uma pergunta, o especialista certo',
      descricao:
        'Padrão de roteador com especialistas: a pergunta chega a um agente roteador, que entende a intenção e passa para o especialista daquele assunto (produtos, dúvidas frequentes ou atendimento). A resposta volta numa voz só para quem perguntou.',
      etapas: [
        { legenda: 'chega', nos: [{ titulo: 'Pergunta', sub: 'do cliente ou da equipe', forma: 'pilula' }] },
        { legenda: 'entende a intenção', nos: [{ titulo: 'Roteador', sub: 'escolhe quem responde', destaque: true }] },
        {
          legenda: 'responde',
          grupo: 'especialistas',
          nos: [
            { titulo: 'Produtos', sub: 'consulta o catálogo' },
            { titulo: 'Dúvidas frequentes', sub: 'busca na base de conhecimento' },
            { titulo: 'Atendimento', sub: 'abre chamado' },
          ],
        },
        { legenda: 'devolve', nos: [{ titulo: 'Resposta', sub: 'uma voz só para quem perguntou', forma: 'pilula' }] },
      ],
      porLinha: 4,
      etiquetas: ['Google ADK', 'LangGraph', 'multiagente'],
    },

    'agente-grafo': {
      id: 'agente-grafo',
      titulo: 'Fluxo que decide sozinho e trabalha em paralelo',
      descricao:
        'Grafo com estado em LangGraph, como no agente de vídeo: a entrada é classificada; uma aresta condicional encerra o que não vale a pena; o resto ganha um plano, três nós rodam em paralelo e se juntam de novo antes de gerar e salvar o resultado.',
      etapas: [
        { legenda: 'entra', nos: [{ titulo: 'Entrada', sub: 'notícia, vídeo ou post', forma: 'pilula' }] },
        {
          legenda: 'classifica',
          nos: [{ titulo: 'Classificar', sub: 'relevância e confiança', destaque: true }],
          lateral: { no: { titulo: 'Fim', sub: 'não vale a pena', forma: 'pilula' }, rotulo: 'aresta condicional' },
        },
        { legenda: 'planeja', nos: [{ titulo: 'Estratégia' }] },
        { legenda: 'em paralelo', grupo: 'ramos ao mesmo tempo', nos: [{ titulo: 'Legenda' }, { titulo: 'Crescimento' }, { titulo: 'Canais' }] },
        { legenda: 'junta e gera', nos: [{ titulo: 'Gerar', sub: 'espera os três ramos' }] },
        { legenda: 'guarda', nos: [{ titulo: 'Salvar', sub: 'estado de cada passo', forma: 'cilindro' }] },
      ],
      porLinha: 3,
      etiquetas: ['LangGraph', 'LangChain', 'estado tipado'],
    },

    'agente-ferramentas': {
      id: 'agente-ferramentas',
      titulo: 'Agente que usa ferramentas sem sair da linha',
      descricao:
        'O pedido passa por uma barreira que trata texto de fora como dado, nunca como instrução. O agente pensa, usa só as ferramentas liberadas e observa o resultado, num laço com limite de voltas. A saída é conferida contra um modelo tipado em Pydantic antes de virar resposta.',
      etapas: [
        { legenda: 'chega', nos: [{ titulo: 'Pedido', sub: 'do usuário ou de outro sistema', forma: 'pilula' }] },
        { legenda: 'separa dado de ordem', nos: [{ titulo: 'Barreira de entrada', sub: 'texto de fora é dado, nunca instrução' }] },
        { legenda: 'pensa', nos: [{ titulo: 'Agente', sub: 'decide o próximo passo', destaque: true }] },
        { legenda: 'age', grupo: 'só as liberadas', nos: [{ titulo: 'Ferramenta de consulta' }, { titulo: 'Ferramenta de ação' }] },
        { legenda: 'confere', nos: [{ titulo: 'Validação', sub: 'saída tipada em Pydantic' }] },
        { legenda: 'responde', nos: [{ titulo: 'Resposta', forma: 'pilula' }] },
      ],
      retorno: { de: 3, para: 2, rotulo: 'observa e decide de novo, com limite de voltas' },
      porLinha: 4,
      etiquetas: ['Google ADK', 'Pydantic', 'LangGraph'],
    },

    'agente-rag': {
      id: 'agente-rag',
      titulo: 'Resposta com fonte e com nota',
      descricao:
        'Como no revisor de código: o código chega pela API ou por MCP, passa por uma análise, busca boas práticas parecidas no pgvector e gera a revisão com esses trechos. Um juiz dá nota; abaixo de 7, a revisão é escrita de novo. Ragas e DeepEval medem a busca e a resposta em lote.',
      etapas: [
        { legenda: 'chega', nos: [{ titulo: 'Código', sub: 'pela API ou por MCP', forma: 'pilula' }] },
        { legenda: 'analisa', nos: [{ titulo: 'Análise', sub: 'sintaxe e estrutura' }] },
        {
          legenda: 'busca',
          nos: [{ titulo: 'Boas práticas', sub: 'trechos parecidos no pgvector', forma: 'cilindro' }],
          lateral: { no: { titulo: 'Avaliação em lote', sub: 'Ragas e DeepEval' }, rotulo: 'mede busca e resposta' },
        },
        { legenda: 'escreve', nos: [{ titulo: 'Revisão', sub: 'o modelo usa os trechos achados', destaque: true }] },
        { legenda: 'julga', nos: [{ titulo: 'Juiz', sub: 'outra chamada dá a nota' }] },
        { legenda: 'entrega', nos: [{ titulo: 'Revisão aprovada', forma: 'pilula' }] },
      ],
      retorno: { de: 4, para: 3, rotulo: 'nota abaixo de 7: escreve de novo' },
      porLinha: 3,
      etiquetas: ['LangGraph', 'RAG', 'pgvector', 'MCP', 'LLM-as-judge'],
    },
    // Fluxo do agente da IA local (case de 08/10/2026): a trava real é a aprovação humana, e só ela é prometida.
    'ia-local': {
      id: 'ia-local',
      titulo: 'Nada roda sem o seu ok',
      descricao:
        'Você pede em linguagem natural. O modelo, rodando na própria máquina, propõe um comando ou a gravação de um arquivo. Um modal mostra o texto completo para aprovar, editar ou negar; negado, o modelo tenta outro caminho. Aprovado, executa na máquina, a saída volta para a conversa e tudo fica num log de auditoria.',
      etapas: [
        { legenda: 'você pede', nos: [{ titulo: 'Pedido', sub: 'em linguagem natural', forma: 'pilula' }] },
        { legenda: 'propõe', nos: [{ titulo: 'Modelo local', sub: 'propõe um comando ou um arquivo' }] },
        { legenda: 'você decide', nos: [{ titulo: 'Aprovação humana', sub: 'aprovar, editar ou negar', destaque: true }] },
        {
          legenda: 'executa',
          nos: [{ titulo: 'Execução local', sub: 'a saída volta para a conversa' }],
          lateral: { no: { titulo: 'Log de auditoria', sub: 'horário, comando e saída', forma: 'cilindro' }, rotulo: 'tudo fica registrado' },
        },
      ],
      retorno: { de: 2, para: 1, rotulo: 'negado: o modelo tenta outro caminho' },
      porLinha: 4,
      etiquetas: ['Ollama', 'llama.cpp', 'Python', 'GGUF Q4'],
    },
  }
}

/** Padrões de agente da seção "Como eu monto agentes", com o título e a linha do que resolve. */
export interface PadraoAgente {
  id: IdDesenho
  titulo: string
  resolve: string
}

/**
 * Os quatro padrões, na ordem da seção.
 *
 * @returns lista nova a cada chamada.
 */
export function listarPadroes(): PadraoAgente[] {
  return [
    { id: 'agente-roteador', titulo: 'Uma pergunta, o especialista certo', resolve: 'Cada assunto vai para o agente que sabe responder, sem um prompt gigante.' },
    { id: 'agente-grafo', titulo: 'Fluxo que decide e trabalha em paralelo', resolve: 'O que não vale a pena para cedo; o resto anda em paralelo.' },
    { id: 'agente-ferramentas', titulo: 'Ferramentas sem sair da linha', resolve: 'Texto de fora nunca vira ordem, e a saída é conferida antes de valer.' },
    { id: 'agente-rag', titulo: 'Resposta com fonte e com nota', resolve: 'A IA busca antes de responder, e outra etapa dá nota antes de entregar.' },
  ]
}
