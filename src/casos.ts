// Página de case de cada projeto (redesenho de 08/10/2026, auditoria site-reorg/02-telas-projetos.md).
// A moldura é a mesma para todos (cabeçalho, faixa de status, régua de números, papel, história, fonte);
// o que muda é a peça principal: cada projeto tem a sua, feita para o que ele precisa provar, e nenhuma
// se repete (o teste em casos.test.ts trava isso).
// Regra de conteúdo: só o que está no banco de provas. Dado de exemplo dentro de uma peça leva rótulo
// (`ficticio`). Nada de valor de operação de mercado, nome interno de empresa ou do repositório da IA local.

/** Peça principal de um case. Cada id é usado por um projeto só. */
export type IdPeca =
  | 'caderno-decisoes'
  | 'sala-de-controle'
  | 'terminal-cota'
  | 'balcao-extrato'
  | 'envelope-injecao'
  | 'diff-com-nota'
  | 'modal-aprovacao'
  | 'raio-x'
  | 'folha-especime'
  | 'ficha-laboratorio'
  | 'recorte-imprensa'
  | 'ficha-lead'
  | 'conversa-whatsapp'
  | 'arvore-conversa'
  | 'funil-qualificacao'
  | 'relogio-lead'
  | 'barras-status'

/** Número da régua: sem origem não existe (a origem é obrigatória no tipo e conferida no teste). */
export interface NumeroCase {
  valor: string
  rotulo: string
  /** De onde o número vem: "rodado em 07/10/2026", "MobileTime, 12/06/2026"... */
  origem: string
  url?: string
}

/** Tom da faixa de status: `vivo` (no ar, em uso), `atencao` (MVP, simulação) ou `neutro`. */
export type TomStatus = 'vivo' | 'atencao' | 'neutro'

/** Bloco de texto corrido do case. */
export interface TrechoCase {
  titulo: string
  texto: string
}

/** Tudo o que a página de case precisa além do que a galeria já tem em `projetos.ts`. */
export interface CaseDetalhe {
  slug: string
  peca: IdPeca
  /** Título da seção da peça principal: diz o que a peça mostra, não o nome do componente. */
  tituloPeca: string
  /** Uma frase de leitura da peça, embaixo dela. */
  legendaPeca: string
  /** Texto do rótulo quando a peça usa dado de exemplo. Peça com dado inventado sem rótulo não passa no teste. */
  ficticio?: string
  status: { texto: string; tom: TomStatus }
  /** Período, quando há (casos de empresa). */
  periodo?: string
  /** De 0 a 3 números, cada um com a origem. */
  regua: NumeroCase[]
  /** O que foi meu e, separado, o que não foi (ou o que não posso contar). */
  papel: { meu: string; resto?: string }
  historia: TrechoCase[]
  /** "O que deu errado" ou "o que falta": obrigatório em projeto próprio que não está no ar. */
  falta?: string[]
  /** Mostra o diagrama "Como as peças conversam" no fim, quando ele acrescenta algo à peça. */
  comDiagrama?: boolean
  /** Mostra os prints reais em bloco próprio (ampliáveis), quando a peça não os usa. */
  comPrints?: boolean
}

const VERTIGO_BLIP = 'https://www.blip.ai/partners/en/experts/vertigo-tecnologia/'
const CASE_FRANCA = 'https://materiais.vertigo.com.br/case-chatbot-prefeitura-de-franca-estado-de-sao-paulo'
const MATERIA_WIV = 'https://www.mobiletime.com.br/noticias/12/06/2026/wiv-5-milhoes/'

/**
 * Detalhe de todos os cases, na mesma ordem da galeria. É função para nada rodar ao importar o módulo.
 *
 * @returns um `CaseDetalhe` por projeto da galeria.
 */
export function listarCasos(): CaseDetalhe[] {
  return [
    {
      slug: 'sicoob',
      peca: 'recorte-imprensa',
      tituloPeca: 'O que a matéria publicou',
      legendaPeca: 'As anotações a lápis são minhas; o texto entre aspas é da matéria.',
      status: { texto: 'Em uso pelas equipes das cooperativas, segundo a matéria.', tom: 'vivo' },
      regua: [],
      papel: {
        meu: 'Sou engenheiro de IA sênior no Sicoob e lidero tecnicamente a frente de IA do assistente de investimentos.',
        resto: 'Modelo, dados, plataforma e time ficam dentro da empresa. Aqui vai só o que a matéria publicou.',
      },
      historia: [
        {
          titulo: 'O problema',
          texto: 'As equipes das cooperativas precisavam de apoio rápido e confiável no atendimento consultivo de investimentos.',
        },
        {
          titulo: 'O que existe hoje',
          texto:
            'Um assistente com três agentes, cada um com uma tarefa: um encaminha a pergunta, um responde sobre investimentos e um cuida das perguntas frequentes. Quem usa são as equipes das cooperativas, no atendimento.',
        },
      ],
    },
    {
      slug: 'contabilizei',
      peca: 'ficha-lead',
      tituloPeca: 'Um lead, do primeiro oi à cobrança',
      legendaPeca: 'O orquestrador passa a conversa para o agente certo a cada etapa; quando é hora de gente, entrega ao time humano.',
      ficticio: 'Exemplo ilustrativo: não é a tela, o texto nem o dado da Contabilizei.',
      status: { texto: 'Trabalho de 2025 a mar/2026. Sem matéria pública, então sem número aqui.', tom: 'neutro' },
      periodo: '2025 a mar/2026',
      regua: [],
      papel: {
        meu: 'Trabalhei no backend em Python, no handoff automático para o time humano e nas integrações com WhatsApp e CRM.',
        resto: 'Volume, prompts, telas e dados de clientes são da empresa e não saem daqui.',
      },
      historia: [
        {
          titulo: 'O problema',
          texto: 'O time de vendas precisava de ajuda no primeiro contato e na qualificação de quem chegava interessado.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Um vendedor de IA no WhatsApp para uma contabilidade digital: um orquestrador e 8 agentes especializados, feitos com Google ADK e Gemini no Vertex AI, que qualificam o lead, apresentam planos, simulam taxas e geram a cobrança.',
        },
      ],
    },
    {
      slug: 'prefeitura-franca',
      peca: 'conversa-whatsapp',
      tituloPeca: 'A dúvida resolvida no WhatsApp, sem fila',
      legendaPeca: 'A pessoa pergunta, escolhe no menu e recebe a resposta; se precisar, vai para um atendente.',
      ficticio: 'Conversa ilustrativa: o fluxo é do tipo publicado no case, o texto é exemplo.',
      status: { texto: 'Case publicado pela Vertigo.', tom: 'vivo' },
      regua: [
        { valor: '5 mil', rotulo: 'atendimentos por mês automatizados', origem: 'case publicado pela Vertigo', url: CASE_FRANCA },
        { valor: '4,6 / 5', rotulo: 'nota da Vertigo no diretório oficial de parceiros Blip', origem: 'blip.ai', url: VERTIGO_BLIP },
      ],
      papel: {
        meu: 'Liderava o time de projetos Blip da Vertigo, que entregou este chatbot.',
        resto: 'A Vertigo é parceira certificada Blip; a Secretaria de Saúde de Franca é a cliente.',
      },
      historia: [
        {
          titulo: 'O problema',
          texto: 'A Secretaria de Saúde respondia à mão um volume alto de dúvidas repetidas da população.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Um chatbot de WhatsApp na plataforma Blip que responde as dúvidas repetidas da Saúde e deixa a equipe com o que precisa de gente.',
        },
      ],
    },
    {
      slug: 'wiv',
      peca: 'arvore-conversa',
      tituloPeca: 'Onde a conversa trava',
      legendaPeca: 'A espessura do galho é o volume que passa; o vermelho é onde as pessoas desistem.',
      ficticio: 'Árvore e percentuais ilustrativos; os totais da régua são os da plataforma.',
      status: { texto: 'Números da plataforma, segundo a MobileTime.', tom: 'neutro' },
      regua: [
        { valor: '5 milhões', rotulo: 'de conversas analisadas pelo Waizer', origem: 'MobileTime, 12/06/2026', url: MATERIA_WIV },
        { valor: '300+', rotulo: 'robôs de atendimento monitorados', origem: 'MobileTime, 12/06/2026', url: MATERIA_WIV },
      ],
      papel: {
        meu: 'Trabalhei no Waizer, a ferramenta de análise de conversas da Wiv, e liderei projetos de chatbot para clientes da plataforma.',
        resto: 'A plataforma e os números são da Wiv.',
      },
      historia: [
        {
          titulo: 'O problema',
          texto: 'Empresas com vários robôs de atendimento não sabiam onde as conversas travavam.',
        },
        {
          titulo: 'O que o Waizer faz',
          texto:
            'Lê as conversas dos robôs e aponta o que melhorar: o passo em que as pessoas desistem, a pergunta que o robô não entende, o caminho que ninguém usa.',
        },
      ],
    },
    {
      slug: 'araguaia',
      peca: 'funil-qualificacao',
      tituloPeca: 'Do contato ao time comercial',
      legendaPeca: 'Cada degrau é uma pergunta do robô; quem chega ao fim vai para o comercial já com contexto.',
      ficticio: 'Perguntas ilustrativas: o case público não traz o roteiro.',
      status: { texto: 'Case publicado pela Vertigo.', tom: 'vivo' },
      regua: [{ valor: '4,6 / 5', rotulo: 'nota da Vertigo no diretório oficial de parceiros Blip', origem: 'blip.ai', url: VERTIGO_BLIP }],
      papel: {
        meu: 'Liderava o time de projetos Blip da Vertigo, que entregou este chatbot.',
        resto: 'A Araguaia, de fertilizantes, é a cliente.',
      },
      historia: [
        {
          titulo: 'O problema',
          texto: 'O time comercial precisava de mais contatos qualificados chegando pelo atendimento digital.',
        },
        {
          titulo: 'O que foi feito',
          texto: 'Um chatbot de atendimento e captação na Blip que conversa com quem chega e passa o contato qualificado para o CRM. O case publicado fala em mais leads com o chatbot, sem dar o percentual; por isso, aqui, sem número.',
        },
      ],
    },
    {
      slug: 'aprovaos',
      peca: 'caderno-decisoes',
      tituloPeca: 'Caderno de decisões',
      legendaPeca: 'Toque numa decisão para ver a tela em que ela aparece.',
      status: { texto: 'MVP em desenvolvimento, sem usuário pagante.', tom: 'atencao' },
      regua: [
        { valor: '1.603', rotulo: 'testes automáticos passando, com CI verde', origem: 'rodados em 07/10/2026', url: 'https://github.com/vlfcandido/aprovaos' },
        { valor: '53', rotulo: 'decisões de arquitetura registradas', origem: 'repositório público', url: 'https://github.com/vlfcandido/aprovaos' },
      ],
      papel: { meu: 'Projeto meu, do zero: produto, arquitetura, código e testes.' },
      historia: [
        {
          titulo: 'O problema',
          texto: 'Concurseiro precisa de plano de estudo que se ajusta ao desempenho, não de lista fixa.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Um SaaS de estudos com login, agentes feitos com Google ADK e Gemini e revisão espaçada. O ponto mais delicado é a IA: nada do que ela gera chega ao aluno sem passar por validação antes.',
        },
      ],
      falta: [
        'Ainda não tem aluno pagante: o pagamento existe só como interface.',
        'É MVP. Falta uso real para saber se o plano ajustado ajuda mais que a lista fixa.',
      ],
      comDiagrama: true,
    },
    {
      slug: 'nexus-quant',
      peca: 'sala-de-controle',
      tituloPeca: 'Os riscos, um por um',
      legendaPeca: 'Cada cartão é um jeito de um sistema de ordens dar errado e o que eu fiz com ele.',
      status: { texto: 'Só em simulação, sem dinheiro de verdade e sem lucro.', tom: 'atencao' },
      regua: [
        {
          valor: '1.060',
          rotulo: 'testes automáticos passando',
          origem: 'vitrine no GitHub, contados em 07/10/2026',
          url: 'https://github.com/vlfcandido/nexus-quant-showcase',
        },
      ],
      papel: { meu: 'Projeto meu, do zero: arquitetura, código, infraestrutura e painel.' },
      historia: [
        {
          titulo: 'O problema',
          texto:
            'Um sistema que manda ordem 24 horas não pode acreditar na própria memória: a ordem pode sair e a resposta não voltar, o serviço pode reiniciar no meio de um envio.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Serviço em Python em arquitetura hexagonal, com filas Redis Streams, reconciliação com a corretora, ordens idempotentes, métricas no Prometheus e no Grafana, infraestrutura em Terraform no Google Cloud e um painel próprio em Next.js.',
        },
      ],
      comDiagrama: true,
      comPrints: true,
    },
    {
      slug: 'varredura-voos',
      peca: 'terminal-cota',
      tituloPeca: 'Uma busca, da cota ao resultado',
      legendaPeca: 'Antes de chamar a API, o programa sabe quanto a busca custa e o que já está no cache.',
      ficticio: 'Saída ilustrativa: comando, rotas, cota e horários são exemplo.',
      status: { texto: 'MVP de uso pessoal.', tom: 'atencao' },
      regua: [
        { valor: '109', rotulo: 'testes automáticos', origem: 'repositório público, contados em 07/10/2026', url: 'https://github.com/vlfcandido/varredura-voos' },
      ],
      papel: { meu: 'Projeto meu, do zero.' },
      historia: [
        {
          titulo: 'O problema',
          texto: 'API de terceiro cobra por chamada e tem limite por segundo. Uma busca larga, feita sem cuidado, estoura a cota no primeiro dia.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Uma busca de passagens integrada à API da Amadeus, com controle de cota, cache e limite de chamadas, que ordena o resultado pela duração da viagem e não só pelo preço.',
        },
      ],
      falta: ['É de uso pessoal: não virou produto nem tem usuário além de mim.'],
      comDiagrama: true,
    },
    {
      slug: 'app-score',
      peca: 'balcao-extrato',
      tituloPeca: 'A nota e a conta que a explica',
      legendaPeca: 'O lojista não recebe só um número: recebe a soma linha por linha.',
      ficticio: 'Dados fictícios: cliente, pagamentos e pesos são exemplo.',
      status: { texto: 'Prova de conceito, sem cliente. Código privado.', tom: 'atencao' },
      regua: [{ valor: '41', rotulo: 'testes no cálculo da nota', origem: 'código privado, contados em 07/10/2026' }],
      papel: { meu: 'Projeto meu: regra de cálculo, app e deploy.' },
      historia: [
        {
          titulo: 'O problema',
          texto: 'Quem vende a prazo precisa decidir na hora, no balcão, se aquele cliente costuma pagar em dia.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Um app web que abre no celular como aplicativo: o lojista consulta o cliente, vê a nota num medidor e abre como ela foi calculada. A regra é auditável, sem caixa-preta, e o deploy no Google Cloud é automático.',
        },
      ],
      falta: ['Sem cliente: é prova de conceito, feita para mostrar a regra explicável.'],
    },
    {
      slug: 'engenharia-de-agentes',
      peca: 'envelope-injecao',
      tituloPeca: 'Texto de fora é dado, não ordem',
      legendaPeca: 'Troque a defesa e veja o que o agente faz com a mesma mensagem.',
      ficticio: 'Mensagem e respostas ilustrativas.',
      status: { texto: 'Estudo, com código aberto.', tom: 'neutro' },
      regua: [
        { valor: '24', rotulo: 'testes de fumaça', origem: 'declarados no repositório', url: 'https://github.com/vlfcandido/engenharia-de-agentes' },
      ],
      papel: { meu: 'Estudo meu.' },
      historia: [
        {
          titulo: 'Por que fiz',
          texto:
            'Para escolher framework com base, e não por moda: o mesmo agente em Pydantic puro, em LangGraph e no Google ADK, lado a lado, e versões com vários agentes que se defendem de prompt injection.',
        },
      ],
      falta: ['Os 24 testes são de fumaça: confirmam que tudo roda, não medem a qualidade das respostas.'],
      comDiagrama: true,
      comPrints: true,
    },
    {
      slug: 'revisor-ia',
      peca: 'diff-com-nota',
      tituloPeca: 'O comentário da IA e a nota do comentário',
      legendaPeca: 'A revisão só vale se dá para medir se ela está certa.',
      ficticio: 'Código e comentário ilustrativos.',
      status: { texto: 'Estudo, com código aberto.', tom: 'neutro' },
      regua: [],
      papel: { meu: 'Estudo meu.' },
      historia: [
        {
          titulo: 'O problema',
          texto: 'Revisão automática só vale se a resposta da IA for medida, não apenas gerada.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Um revisor de código que busca o contexto em documentos (RAG com pgvector), conversa por um servidor MCP e tem as próprias respostas avaliadas com Ragas e DeepEval.',
        },
      ],
      falta: ['É estudo: as métricas ainda não foram publicadas com valores, por isso a régua fica vazia.'],
      comDiagrama: true,
    },
    {
      slug: 'ia-local',
      peca: 'modal-aprovacao',
      tituloPeca: 'Nada roda antes do seu ok',
      legendaPeca: 'Aprove, edite ou negue o comando e veja a linha entrar no log de auditoria.',
      ficticio: 'Comando, pasta e horários são exemplo.',
      status: { texto: 'Laboratório pessoal, sem cliente. Código não publicado.', tom: 'atencao' },
      regua: [
        { valor: '8 GB', rotulo: 'de memória: roda num MacBook Air M1, sem nuvem', origem: 'a máquina do laboratório' },
        { valor: '3B a 4B', rotulo: 'parâmetros, em Q4, um modelo por vez', origem: 'o que coube nos 8 GB' },
      ],
      papel: { meu: 'Laboratório meu: o modo agente, a aprovação, o log e a interface.' },
      historia: [
        {
          titulo: 'O problema',
          texto:
            'Quem não pode mandar dado para fora da empresa fica sem IA na nuvem. E um agente que executa sozinho não deixa claro quem decidiu o quê.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Um laboratório de IA que roda inteiro na máquina: o conteúdo da conversa e dos arquivos não sai do aparelho. O modelo nunca age sozinho. Ele propõe um comando ou a gravação de um arquivo, e um modal mostra o texto completo para aprovar, editar ou negar. O que é aprovado executa e vai para um log de auditoria com horário, comando e código de saída. A gravação fica restrita a pastas de trabalho e o backend exige token.',
        },
      ],
      falta: ['Com 8 GB, só cabem modelos pequenos, um de cada vez.', 'O código não está publicado.'],
      comDiagrama: true,
    },
    {
      slug: 'este-site',
      peca: 'raio-x',
      tituloPeca: 'Esta página, por dentro',
      legendaPeca: 'Ligue os contornos para ver o esqueleto do layout. A lista de testes é lida do próprio código.',
      status: { texto: 'No ar: é a página que você está lendo.', tom: 'vivo' },
      regua: [],
      papel: { meu: 'Feito por mim, do zero, sem tema pronto.' },
      historia: [
        {
          titulo: 'O que foi feito',
          texto:
            'A galeria com link compartilhável, a demonstração de atendimento, os diagramas desenhados por um motor próprio em SVG e o tema claro e escuro. Funciona no teclado e com leitor de tela, e respeita quem pede menos movimento no sistema.',
        },
        {
          titulo: 'Por que tanto teste num site',
          texto:
            'Porque o texto aqui é prova: um teste barra termo proibido, outro confere que cada print existe, outro que o projeto próprio nunca diz "em produção" sem estar. Se alguém errar, o build quebra antes de ir ao ar.',
        },
      ],
    },
    {
      slug: 'design-system-mare',
      peca: 'folha-especime',
      tituloPeca: 'Folha de cores',
      legendaPeca: 'Lida do arquivo de tokens. O contraste é calculado aqui, na hora.',
      status: { texto: 'No ar neste site.', tom: 'vivo' },
      regua: [],
      papel: { meu: 'Desenhado e escrito por mim.' },
      historia: [
        {
          titulo: 'O problema',
          texto: 'Sem regra escrita, cada tela nova escolhe a cor e o espaço de novo, e o produto perde a cara.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'A identidade deste site virou um design system: cada cor existe no tema claro e no escuro, com o uso escrito ao lado, e um teste confere que o CSS e o arquivo de tokens não divergem. No AprovaOS, fiz o mesmo com regras de componente e uma página de estilo viva.',
        },
      ],
    },
    {
      slug: 'benchmark-litellm',
      peca: 'ficha-laboratorio',
      tituloPeca: 'Ficha do experimento',
      legendaPeca: 'Pergunta, montagem e medida escritas antes de rodar.',
      status: { texto: 'Estudo. Resultado ainda não publicado.', tom: 'neutro' },
      regua: [],
      papel: { meu: 'Estudo meu.' },
      historia: [
        {
          titulo: 'Por que medir antes',
          texto:
            'Gateway de IA muda latência, erro e conta no fim do mês. Antes de escolher entre chamar o modelo direto pelo SDK ou passar por um proxy, vale medir os dois com a mesma carga.',
        },
      ],
      falta: ['O resultado não foi versionado: sem número publicado, não há conclusão aqui.'],
      comPrints: true,
    },
    {
      slug: 'ecovita',
      peca: 'relogio-lead',
      tituloPeca: 'Uma hora na vida de um lead',
      legendaPeca: 'Ninguém mexe em nada: o job agendado confere e passa a vez.',
      ficticio: 'Horários, nomes e lead são exemplo.',
      status: { texto: 'Participação, sem liderar. Situação de hoje não conferida.', tom: 'neutro' },
      regua: [],
      papel: { meu: 'Participei do projeto no time da Ecovita, sem liderar.' },
      historia: [
        {
          titulo: 'O problema',
          texto: 'Lead de imóvel sem resposta de um corretor precisava mudar de mãos sem ninguém fazer isso à mão.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Um job agendado lê a fila, confere no CRM e no Blip Desk onde cada lead está e, se ninguém respondeu em uma hora, passa o atendimento para o próximo corretor da mesma fila, atualizando o ticket no Blip, o responsável no CRM e o analytics.',
        },
      ],
      comDiagrama: true,
    },
    {
      slug: 'minu',
      peca: 'barras-status',
      tituloPeca: 'O que aconteceu com cada mensagem',
      legendaPeca: 'A cada minuto a função lê o status no Blip e registra um evento por status no analytics.',
      ficticio: 'Campanhas e quantidades ilustrativas.',
      status: { texto: 'Participação, sem liderar. Situação de hoje não conferida.', tom: 'neutro' },
      regua: [],
      papel: { meu: 'Participei do projeto no time da Minu, sem liderar.' },
      historia: [
        {
          titulo: 'O problema',
          texto: 'A Minu precisava saber o que acontecia com cada mensagem das campanhas de WhatsApp depois do envio.',
        },
        {
          titulo: 'O que foi feito',
          texto:
            'Uma função agendada a cada minuto busca as campanhas e a audiência no Blip, lê o status de cada mensagem, junta o perfil do usuário no Braze e registra um evento por status no analytics.',
        },
      ],
      comDiagrama: true,
    },
  ]
}

/**
 * Busca o detalhe de um case.
 *
 * @param slug slug do projeto em `projetos.ts`.
 * @returns o detalhe, ou `undefined` quando o projeto não tem página de case.
 */
export function casoDe(slug: string): CaseDetalhe | undefined {
  return listarCasos().find((c) => c.slug === slug)
}
