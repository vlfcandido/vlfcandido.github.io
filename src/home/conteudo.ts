// Texto da home nova (14/10/2026): prova na frente, protótipo antes de fechar como diferencial e
// o detalhe como assinatura. Funções em vez de constantes montadas, para nada rodar ao importar.
// Sem preço (decisão dele, 14/10/2026). Garantia de 30 dias de correção (decisão dele, 14/10/2026).

import { ONDE_TRABALHEI } from '../clientes'
import { listarProjetos } from '../projetos'

/** Um trabalho em destaque, com a dor do cliente e o detalhe marcado à mão. */
export interface Destaque { slug: string; nome: string; dor: string; detalhe: string; href: string; imagem: string; alt: string }
/** Um passo de "Como funciona". */
export interface Passo { titulo: string; texto: string }
/** Uma frente de trabalho (vira chip de filtro da galeria). */
export interface Frente { titulo: string; resultado: string; exemplo: string }
/** Uma frente da seção "IA e agentes", com o que é feito em uma linha. */
export interface FrenteIa { titulo: string; texto: string }
/** Uma prova real da seção "IA e agentes" (banco-provas.md). */
export interface ProvaIa { nome: string; texto: string }
/** O exemplo principal da seção "IA e agentes": a peça que a pessoa abre e testa. */
export interface ExemploIa {
  rotulo: string; nome: string; titulo: string; texto: string; cta: string
  href: string; imagem: string; alt: string
}
/** Um atalho de categoria da vitrine de projetos, com o filtro da galeria. */
export interface CategoriaTrabalho { rotulo: string; filtro: string }

/**
 * Nome único das peças navegáveis, igual no menu, na home, em /trabalhos/ e nos cartões (18/10/2026).
 * Os casos de trabalho real continuam com outro nome, "Projetos". Nada de chamar a mesma coisa de dois jeitos.
 */
export const NOME_PECAS = 'Experimente ao vivo'

/** Peças navegáveis de /trabalhos/ (HTML estático em public/trabalhos/). */
// 14/10/2026 (fix da Task 5): ganharam imagem e alt, porque entram no topo da página de projetos.
// 18/10/2026: o Pelo Solto abre a vitrine (decisão do dono: é o exemplo principal de IA e agentes). A ordem de
// /trabalhos/ espelha esta; o teste confere os dois lados. Cada peça ganhou `categoria`, o rótulo curto que
// separa site, sistema, loja e atendimento com IA sem apagar nenhuma peça.
export const PECAS = [
  {
    slug: 'pet-shop-whatsapp-ia-exemplo', nome: 'Pelo Solto', href: 'trabalhos/pet-shop-whatsapp-ia-exemplo/',
    imagem: 'trabalhos/img/pet-shop-whatsapp-ia-exemplo.jpg', alt: 'Pelo Solto com a conversa no WhatsApp e o agendamento do Tofu confirmado',
    categoria: 'Atendimento com IA',
    resumo: 'Atendimento no WhatsApp que consulta a agenda e chama a equipe quando precisa.',
  },
  {
    // Fix final (14/10/2026): um nome só para cada peça, igual em /trabalhos/ e na faixa. Antes 'Liga Várzea FC (exemplo)'
    // aqui e 'Portal de dados de futebol' em /trabalhos/; o "exemplo" vai no selo de dados fictícios do cartão.
    slug: 'liga-varzea', nome: 'Liga Várzea FC', href: 'trabalhos/liga-varzea/',
    imagem: 'trabalhos/img/liga-varzea.jpg', alt: 'Tela inicial da Liga Várzea FC, com o painel de dados',
    categoria: 'Portal de dados',
    // 14/10/2026 (Task 10): linha própria no cartão de #/projetos. Antes as duas peças diziam
    // 'Exemplo navegável: dá para clicar e testar.', a mesma frase lado a lado.
    resumo: 'Portal de futebol em que a correção feita à mão não some na atualização.',
  },
  {
    slug: 'consultorio-exemplo', nome: 'Consultório Exemplo', href: 'trabalhos/consultorio-exemplo/',
    imagem: 'trabalhos/img/consultorio-exemplo.jpg', alt: 'Página inicial do Consultório Exemplo, com a busca de psicólogos',
    categoria: 'Plataforma de saúde',
    resumo: 'Terapia online em que perfil com CRP irregular sai da busca.',
  },
  {
    slug: 'escritorio-arquitetura-exemplo', nome: 'Atelier Linha', href: 'trabalhos/escritorio-arquitetura-exemplo/',
    imagem: 'trabalhos/img/escritorio-arquitetura-exemplo.jpg', alt: 'Painel do Atelier Linha com os projetos por etapa e a margem de cada um',
    categoria: 'Sistema de gestão',
    resumo: 'Revisão fora do contrato vira hora sem cobrança, e aqui ela fica registrada.',
  },
  {
    slug: 'plataforma-astrologia-exemplo', nome: 'Céu Interior', href: 'trabalhos/plataforma-astrologia-exemplo/',
    imagem: 'trabalhos/img/plataforma-astrologia-exemplo.jpg', alt: 'Capa do parecer Céu Interior, com o mapa astral de exemplo e a nota da jornada',
    categoria: 'Produto e UX',
    resumo: 'Parecer de produto que mostra onde a venda de uma plataforma de astrologia trava.',
  },
  {
    slug: 'catalogo-whatsapp-exemplo', nome: 'Novelo', href: 'trabalhos/catalogo-whatsapp-exemplo/',
    imagem: 'trabalhos/img/catalogo-whatsapp-exemplo.jpg', alt: 'Vitrine do Novelo com o carrinho e a prévia do pedido no WhatsApp',
    categoria: 'Catálogo no WhatsApp',
    resumo: 'Catálogo em que o pedido chega montado no WhatsApp e o estoque baixa no Bling.',
  },
  {
    slug: 'loja-woocommerce-exemplo', nome: 'Trama Atacado', href: 'trabalhos/loja-woocommerce-exemplo/',
    imagem: 'trabalhos/img/loja-woocommerce-exemplo.jpg', alt: 'Loja Trama Atacado com a grade de tamanhos no celular e o checkout de uma página',
    categoria: 'Loja e-commerce',
    resumo: 'Loja de atacado com grade numa tela e cada pedido rastreado do Pix ao ERP.',
  },
  {
    slug: 'consignacao-veiculos-exemplo', nome: 'Pátio Aberto', href: 'trabalhos/consignacao-veiculos-exemplo/',
    imagem: 'trabalhos/img/consignacao-veiculos-exemplo.jpg', alt: 'Pátio Aberto com a busca de carros e a ficha clara de um anúncio',
    categoria: 'Site de veículos',
    resumo: 'Consignação de carros em que cada anúncio separa conferido, declarado e atenção.',
  },
  {
    slug: 'atletica-associados-exemplo', nome: 'Atlética Maré Alta', href: 'trabalhos/atletica-associados-exemplo/',
    imagem: 'trabalhos/img/atletica-associados-exemplo.jpg', alt: 'Carteirinha digital da Atlética Maré Alta com QR code e validade',
    categoria: 'Carteirinha digital',
    resumo: 'Carteirinha com QR que muda sozinho e Pix que renova a validade do associado.',
  },
  // Para acrescentar uma peça: a entrada aqui e o cartão em public/trabalhos/index.html (o teste confere os dois lados).
] as const

/**
 * Trechos que levam a marcação à mão, um por bloco. O componente parte o texto neles; o teste garante que
 * cada trecho existe no texto (senão a marcação some sem aviso).
 */
export const FRASES_MARCADAS = {
  // 18/10/2026: o título da prova deixou de ser o currículo (Sicoob e Serasa) e passou a vender a especialidade.
  // O grifo fica no diferencial que a seção de IA sustenta, a resposta que não é inventada.
  promessa: ['não inventam resposta'],
  prototipo: 'antes de fechar',
  garantia: '30 dias de correção',
} as const

/**
 * Empresas do bloco "Onde já trabalhei", na ordem de exibição. 15/10/2026: lidas da fonte única `ONDE_TRABALHEI`
 * (clientes.ts), a mesma de #/projetos. Antes: ['sicoob', 'serasa-experian', 'contabilizei', 'prefeitura-franca', 'wiv']
 * escrito aqui; a Prefeitura de Franca (cliente da Vertigo) saiu e a Vertigo entrou (decisão dele).
 */
export const SLUGS_EMPRESAS = ONDE_TRABALHEI

/**
 * Linha de cada empresa no bloco "Onde já trabalhei" quando o papel de clientes.ts não serve ao cliente de freela.
 * 14/10/2026 (Task 10): a Prefeitura de Franca mostrava 'Case Vertigo', que não diz o que foi feito. O texto novo
 * junta o `feito` ("Chatbot da Saúde…") e o papel do projeto em projetos.ts ("Líder técnico dos projetos Blip na Vertigo").
 */
export const LINHA_EMPRESA: Partial<Record<(typeof SLUGS_EMPRESAS)[number], string>> = {
  // 15/10/2026: a linha da Prefeitura de Franca ('Chatbot da Saúde, como líder técnico na Vertigo'; antes 'Chatbot da
  // Saúde, como tech lead da Vertigo') saiu com ela; o chatbot da Saúde virou exemplo na linha da Vertigo.
  vertigo: 'Líder técnico do time que entregou mais de 80 chatbots na Blip',
}

/**
 * Liga a foto do "Quem sou" (15/10/2026). A foto é a do LinkedIn dele, quadrada de 210 px, em
 * public/img/foto-210.{avif,webp,jpg} e public/img/foto-105.{avif,webp,jpg}, mostrada como avatar redondo de no máximo
 * 96 px CSS (210 px cobre tela 2x sem ampliar). Com `false`, o quadro volta ao monograma "VC" (o teste confere os
 * arquivos quando ligada). Ligada em 15/10/2026, quando a foto chegou; antes previa 4:5 em 320 e 640 px.
 */
export const FOTO_PRONTA = true

/** Larguras geradas da foto, em px (a original tem 210; nunca ampliar). */
export const FOTO_LARGURAS = [105, 210] as const

/** Caminho da foto sem largura nem extensão (relativo a public/). */
export const FOTO_BASE = 'img/foto'

/** Anos de software, de config/privado/carreira/respostas-padrao.md ("Software total = 13"). */
const ANOS_DE_SOFTWARE = 13

/**
 * Números da prova, contados na fonte e nunca arredondados para cima.
 *
 * @returns anos de software, empresas do bloco de logos e projetos (galeria + peças).
 */
export function numerosDeProva(): { anos: number; empresas: number; projetos: number } {
  return { anos: ANOS_DE_SOFTWARE, empresas: SLUGS_EMPRESAS.length, projetos: listarProjetos().length + PECAS.length }
}

/**
 * Monta todo o texto da home. Os componentes não têm texto fixo: tudo sai daqui.
 *
 * @returns os textos dos blocos da home.
 */
export function conteudoHome() {
  const n = numerosDeProva()
  return {
    promessa: {
      // 18/10/2026 (brief do dono): a home abre pela especialidade que ele quer vender, IA aplicada e agentes,
      // com a prova na linha de apoio. Saiu "13 anos de software. Hoje no Sicoob, antes na Serasa Experian.",
      titulo: 'IA aplicada e agentes que não inventam resposta.',
      // A prova é a mesma do perfil v3 (banco-provas.md, acréscimos de 18/10): cargo no Sicoob, 80+ chatbots
      // entregues antes (Vertigo/Wiv, sem nomear as consultorias) e sistemas multiagente com Claude. A última
      // frase mantém site e sistema à vista.
      subtitulo:
        'Responsável pelo setor de IA do Sicoob. Antes, entreguei mais de 80 chatbots como líder técnico, e construo sistemas multiagente com Claude. Site e sistema também saem daqui.',
      cta: 'Conversar no WhatsApp',
      // Rótulos dos números ('empresas de grande porte' virou 'empresas onde trabalhei' em 14/10/2026).
      rotulos: { anos: 'anos de software', empresas: 'empresas onde trabalhei', projetos: 'projetos e sites no portfólio' },
    },
    // A antiga captura do painel no hero saiu em 18/10/2026: o espaço é do agente trabalhando sozinho (Agente.tsx).
    // A mesma tela continua na seção de IA e na vitrine, e nada saiu do ar.
    // Seção "IA e agentes" (18/10/2026, brief do dono): a especialidade no centro, com o Pelo Solto como exemplo
    // principal e quatro provas reais do banco-provas.md. Tudo aqui é afirmação com linha no banco, sem superlativo.
    ia: {
      rotulo: 'IA aplicada',
      titulo: 'IA e agentes',
      lede: 'Agentes com Claude, chatbots no WhatsApp e IA com os documentos do seu negócio. O que a IA não resolve cai para uma regra fixa ou para uma pessoa.',
      exemplo: {
        rotulo: 'Exemplo principal',
        nome: 'Pelo Solto',
        titulo: 'Atendimento no WhatsApp que consulta a agenda e chama a equipe.',
        texto:
          'A IA entende o pedido, consulta a agenda do banho e tosa, marca o horário, manda lembrete e passa para a equipe o que precisa de gente. O painel do dono mostra o que ela resolveu sozinha.',
        cta: 'Ver o exemplo funcionando',
        href: 'trabalhos/pet-shop-whatsapp-ia-exemplo/',
        imagem: 'trabalhos/img/pet-shop-whatsapp-ia-exemplo-detalhe.jpg',
        alt: 'Painel do Pelo Solto com 78% das conversas resolvidas pela IA e a fila do que passou para a equipe',
      } satisfies ExemploIa,
      frentes: [
        { titulo: 'Agentes com Claude', texto: 'Skills, workflows e subagentes, com um revisor que confere o que a IA produz.' },
        { titulo: 'Chatbots e atendimento com IA', texto: 'WhatsApp pela API oficial, com passagem para o time humano.' },
        { titulo: 'Base de conhecimento e RAG', texto: 'A resposta sai dos documentos do cliente, validada antes de aparecer na tela.' },
        { titulo: 'Automação com revisão humana', texto: 'Quando a IA não tem resposta, o sistema cai para uma regra fixa ou para uma pessoa.' },
      ] satisfies FrenteIa[],
      provas: [
        { nome: 'Sicoob', texto: 'Responsável pelo setor de IA do Sicoob e pela frente do assistente de investimentos usado pelas equipes das cooperativas.' },
        { nome: 'Contabilizei', texto: 'Um orquestrador e 8 agentes de vendas no WhatsApp, com passagem automática para o time humano.' },
        { nome: '80+ chatbots', texto: 'Entregues como líder técnico, entre eles o da Saúde de Franca, com 5 mil atendimentos por mês.' },
        { nome: 'Meus projetos', texto: 'AprovaOS, em desenvolvimento, com agente de IA e mais de 1.600 testes, e um revisor de código com RAG, em estudo.' },
      ] satisfies ProvaIa[],
    },
    // Vitrine das nove peças (18/10/2026): ocupa o lugar do antigo bloco de protótipo, que mostrava uma peça só.
    // O argumento "veja antes de fechar" continua na primeira frase, agora sustentado pelas nove telas de exemplo.
    experimente: {
      titulo: NOME_PECAS,
      // 18/10/2026: a linha diz o que há na vitrine (site, sistema, loja e IA), não só "sites". A ordem começa no
      // Pelo Solto, o exemplo principal.
      lede: 'Nove projetos de exemplo para abrir e mexer. Sites, sistemas, lojas e atendimento com IA, com dados inventados.',
      cta: 'Abrir e testar',
      verTodas: 'Abrir e testar as nove',
    },
    prototipo: {
      titulo: 'Veja o seu sistema funcionando antes de fechar.',
      // Task 10: antes terminava em 'Dá para clicar, testar e decidir com o sistema na mão.' (tríade).
      texto:
        'Em vez de uma proposta em texto, você recebe um protótipo com a cara do seu negócio. Dá para clicar nas telas e decidir com o sistema na mão.',
      exemploHref: 'trabalhos/consultorio-exemplo/',
      exemploRotulo: 'Abrir um exemplo navegável',
      // 14/10/2026: a página inicial do consultório (a "cara do negócio"); o cartão do consultório passou a
      // mostrar a tela do CRP, que é a do detalhe dele. Antes os dois usavam consultorio-exemplo.jpg.
      imagem: 'trabalhos/img/consultorio-exemplo.jpg',
    },
    // 18/10/2026: os destaques passaram a ser só casos de trabalho real. As peças navegáveis saíram daqui para a
    // vitrine "Experimente ao vivo", e a seção ganhou o nome "Projetos" (o mesmo do menu e de #/projetos).
    destaques: [
      {
        slug: 'aprovaos', nome: 'AprovaOS',
        // 14/10/2026 (Task 10): CORRIGIDO, o texto anterior era falso. O AprovaOS é plano de estudo para concurso
        // (casos.ts e projetos.ts), não aprovação de ordem de serviço. Antes: dor 'Ordem de serviço aprovada no papel
        // some, e o cliente diz que não aprovou.', detalhe 'Cada aprovação fica registrada com quem, quando e o que foi
        // aprovado.' e alt 'Tela do AprovaOS com o histórico de aprovação de uma ordem de serviço'.
        dor: 'Lista fixa de estudo não acompanha o que o concurseiro erra e acerta.',
        detalhe: 'Nada do que a IA gera chega ao aluno sem passar por validação.',
        href: '#/projetos/aprovaos', imagem: 'img/capa-aprovaos-1040.jpg',
        alt: 'Tela do AprovaOS com o plano de estudo do dia dividido em blocos',
      },
      {
        slug: 'nexus-quant', nome: 'Sistema de ordens em tempo real',
        dor: 'Operar 24 horas exige conferir cada ordem com a corretora sem erro.',
        detalhe: 'A tela mostra também o que deu errado, inclusive as taxas. Nada fica escondido.',
        href: '#/projetos/nexus-quant', imagem: 'img/capa-nexus-quant-1040.jpg',
        alt: 'Capa do sistema de ordens em tempo real, com a sala de controle em simulação',
      },
      {
        slug: 'app-score', nome: 'App de score de crédito',
        dor: 'Quem vende a prazo decide no balcão sem saber se o cliente paga em dia.',
        detalhe: 'A nota abre o cálculo, com o peso de cada pagamento, atraso e quitação.',
        href: '#/projetos/app-score', imagem: 'img/capa-app-score-1040.jpg',
        alt: 'Capa do app de score de crédito no celular, com a nota do cliente',
      },
    ] satisfies Destaque[],
    // Fix final (14/10/2026): subtítulo para separar este bloco (empregos) dos "Casos em empresas" de #/projetos.
    empresas: { titulo: 'Onde já trabalhei', subtitulo: 'As empresas onde trabalhei e o que fiz em cada uma.' },
    // 18/10/2026: o nome da seção é "Projetos", o mesmo do menu e da página #/projetos (antes "Destaques", um terceiro
    // nome para a mesma coisa). As peças navegáveis deixaram de aparecer aqui: elas têm a vitrine própria.
    // A linha e os atalhos mostram que os outros trabalhos continuam no ar, por tipo, sem apagar peça nenhuma.
    trabalhos: {
      titulo: 'Projetos, com o detalhe marcado',
      lede: 'SaaS, sistemas, agentes, chatbots, sites e integrações. Os casos completos estão na página de projetos, com filtro por tipo.',
      categorias: [
        { rotulo: 'SaaS e sistemas', filtro: 'sistemas' },
        { rotulo: 'Agentes de IA', filtro: 'agentes' },
        { rotulo: 'Chatbot e atendimento', filtro: 'chatbot' },
        { rotulo: 'Sites e painéis', filtro: 'frontend' },
        { rotulo: 'Integrações e automação', filtro: 'integracoes' },
        { rotulo: 'Dados e tempo real', filtro: 'dados' },
      ] satisfies CategoriaTrabalho[],
      verTodos: 'Ver todos os projetos',
    },
    // 15/10/2026: botão do WhatsApp no fim do bloco, com a mensagem do passo 1.
    como: { titulo: 'Como funciona', cta: 'Pedir o meu protótipo', mensagem: 'Oi, Vinicius! Vi seu site e queria pedir um protótipo do meu sistema.' },
    // Task 10 (humanizer): antes, passo 4 'Manual, documentação técnica e testes automatizados.' (tríade) e passo 5
    // '30 dias de correção depois da entrega.', que repetia a caixa da garantia logo abaixo. Textos do Método
    // Entrega Acompanhada (fase 4: publicação, acessos no nome do cliente, manual, testes; fase 5: defeito corrigido).
    passos: [
      { titulo: 'Protótipo antes de fechar', texto: 'Você clica no seu sistema antes de decidir.' },
      { titulo: 'Escopo de 1 página', texto: 'O que entra, o que fica de fora e o prazo, por escrito.' },
      { titulo: 'Atualização a cada 12 h', texto: 'Você acompanha o andamento sem precisar cobrar.' },
      { titulo: 'Entrega documentada', texto: 'Sistema no ar, acessos no seu nome, manual de uso e testes.' },
      { titulo: 'Garantia', texto: 'Defeito no que foi entregue, eu corrijo.' },
    ] satisfies Passo[],
    // Decisão do controlador (Task 10): a garantia não promete retenção de pagamento a quem chega pelo WhatsApp.
    // Antes: '30 dias de correção depois da entrega, por escrito. E o pagamento fica retido pela plataforma até você
    // receber.' Agora são duas frases, e a da plataforma diz qual plataforma.
    garantia: '30 dias de correção depois da entrega, por escrito.',
    garantiaPlataforma: 'No 99Freelas, o pagamento fica retido pela plataforma até a entrega.',
    frentes: [
      { titulo: 'IA e WhatsApp', resultado: 'Atendimento que responde sozinho e passa para você o que precisa de gente.', exemplo: 'Chatbot de agendamento' },
      { titulo: 'Sistemas e painéis', resultado: 'O controle do seu negócio numa tela, sem planilha perdida.', exemplo: 'Painel de gestão' },
      { titulo: 'Integrações e APIs', resultado: 'Os sistemas que você já usa conversando entre si.', exemplo: 'CRM ligado ao financeiro' },
    ] satisfies Frente[],
    quemSou: {
      titulo: 'Quem vai fazer o seu sistema',
      texto: [
        `Sou o Vinicius Candido, engenheiro de software há ${n.anos} anos.`,
        'Construí sistemas que aguentam escala de banco e de birô de crédito.',
        // Task 10: antes 'Hoje levo esse cuidado para negócios que precisam de um sistema que funcione de verdade.'
        'Hoje levo o mesmo cuidado para o sistema do seu negócio.',
      ],
      // 15/10/2026: a foto vem de FOTO_BASE/FOTO_PRONTA. Antes: foto 'img/vinicius-640.jpg' (arquivo nunca criado).
      // 15/10/2026: antes 'Foto de Vinicius Candido'.
      alt: 'Vinicius Candido',
    },
    chamada: { titulo: 'Me conte o que está travando o seu negócio.', cta: 'Conversar no WhatsApp' },
  }
}
