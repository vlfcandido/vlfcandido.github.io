// Pacotes "a partir de" (08/10/2026). Preços e contas: patrimonio/config/privado/carreira/site-reorg/07-pacotes.md,
// derivados de scripts/estimador99.py (piso R$ 150, tarifa por hora, fator de entrada) e do estudo de manutenção.
// Regra do site: todo valor em reais aparece como "a partir de R$ X" (o fechado sai do escopo de uma página).
// Sem contato direto: a ação é o 99Freelas e o LinkedIn, como no resto do site.

/** Um pacote de projeto ou de manutenção mensal. */
export interface Pacote {
  id: string
  nome: string
  /** Para que tipo de pedido serve. */
  para: string
  /** Valor inicial em reais (inteiro); o texto sempre sai de `precoInicial`. */
  valor: number
  /** O que normalmente entra, em linguagem de negócio. */
  inclui: string[]
  /** Custo mensal de terceiros, quando há, com a fonte. */
  terceiros?: { texto: string; fonte: { texto: string; url: string } }
}

/** Texto padrão de preço: sempre com "a partir de". */
export function precoInicial(valor: number, por?: 'mês'): string {
  return `a partir de R$ ${valor.toLocaleString('pt-BR')}${por ? ` por ${por}` : ''}`
}

const META = {
  texto:
    'Cobrado pela Meta, na conta de quem contrata, por mensagem de modelo entregue (não mais por conversa), conforme a tabela oficial em reais. Respostas dentro da janela de atendimento não são modelo e não são cobradas.',
  fonte: { texto: 'Preços da API do WhatsApp (Meta)', url: 'https://developers.facebook.com/docs/whatsapp/pricing/' },
}

/** Pacotes de projeto, do menor ao maior esforço. */
export const pacotesProjeto: Pacote[] = [
  { id: 'ajuste', nome: 'Ajuste ou correção', para: 'Algo que já existe e precisa funcionar direito.', valor: 150, inclui: ['Diagnóstico do problema', 'Correção testada', 'Aviso do que foi mexido'] },
  { id: 'site', nome: 'Site ou landing page', para: 'Uma página clara que apresenta o negócio e recebe contatos.', valor: 210, inclui: ['Página responsiva, no celular e no computador', 'Formulário de contato', 'Publicação no ar'] },
  { id: 'integracao', nome: 'Integração por API', para: 'Dois sistemas que hoje não se falam.', valor: 250, inclui: ['Ligação entre os sistemas', 'Tratamento de erro e nova tentativa', 'Registro do que foi enviado'] },
  { id: 'agente', nome: 'Agente de IA', para: 'Um assistente que responde ou executa tarefas com as regras da empresa.', valor: 290, inclui: ['Regras e limites combinados por escrito', 'Testes dos cenários principais', 'Passagem para uma pessoa quando não sabe'] },
  { id: 'whatsapp', nome: 'Chatbot de WhatsApp', para: 'Atendimento que tira as dúvidas repetidas e passa o resto para a equipe.', valor: 360, inclui: ['Fluxo de atendimento combinado', 'Passagem para a equipe', 'Testes dos cenários de conversa'], terceiros: META },
  { id: 'sistema', nome: 'Sistema com painel', para: 'Um painel ou sistema web para trabalhar no dia a dia.', valor: 440, inclui: ['Cadastro, consulta e relatório do essencial', 'Acesso por login', 'Testes automáticos'] },
]

/** Manutenção mensal, opcional, depois dos 7 dias de correção. */
export const pacotesManutencao: Pacote[] = [
  { id: 'essencial', nome: 'Essencial', para: 'Landing page e site estático.', valor: 150, inclui: ['Monitor de disponibilidade', 'Backup mensal', 'Atualização de dependências', '1 h de ajustes'] },
  { id: 'padrao', nome: 'Padrão', para: 'Site com formulário, agendamento ou WordPress.', valor: 260, inclui: ['Tudo do Essencial', '2,5 h de ajustes', 'Relatório mensal de 5 linhas'] },
  { id: 'sistema-mensal', nome: 'Sistema', para: 'Chatbot, painel ou integração.', valor: 520, inclui: ['Tudo do Padrão', 'Correção de problemas médios sem limite de quantidade, dentro das horas', 'Revisão de segurança mensal'] },
]
