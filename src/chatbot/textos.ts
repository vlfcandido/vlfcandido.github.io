// Textos do widget do assistente. Ficam aqui para o teste de termos proibidos cobrir o que aparece na tela.

import { LIMITES } from './protocolo'
import { PERGUNTAS_ESCOPO } from './escopo'

export const TEXTOS = {
  botao: 'Monte o escopo',
  titulo: 'Monte o escopo do seu projeto',
  portas: { escopo: 'Monte o escopo', trabalho: 'Pergunte sobre o trabalho' },
  aviso: 'Assistente automático. Não coloque dados pessoais: o texto vai para a API da Anthropic e não fica guardado.',
  avisoSimulado: 'Modo de demonstração: respostas de exemplo, sem IA.',
  avisoRoteiro: 'Roteiro fixo, sem IA: as mesmas perguntas montam o mesmo resumo.',
  boasVindas: {
    escopo: `Em cinco perguntas curtas sai um rascunho de escopo de 1 página, para você colar na conversa com o Vinicius. ${PERGUNTAS_ESCOPO[0].texto}`,
    trabalho:
      'Pergunte sobre os projetos, a carreira ou o jeito de trabalhar do Vinicius. Respondo só com o que o site publica. Recrutador: cole a descrição da vaga e eu cruzo com o que o site comprova.',
  },
  colarVaga: 'Colar uma vaga',
  placeholderVaga: 'Cole aqui a descrição da vaga',
  placeholderTrabalho: 'Ex.: ele já fez integração com CRM?',
  enviar: 'Enviar',
  enviando: 'Pensando',
  copiar: 'Copiar escopo',
  copiado: 'Copiado',
  depoisDeCopiar: 'Cole no chat do 99 ou na sua mensagem para o Vinicius.',
  recomecar: 'Recomeçar',
  comoFunciona: 'Como este assistente funciona',
  voltar: 'Voltar à conversa',
  fechar: 'Fechar o assistente',
  roteiroTrabalho:
    'Sem IA agora, não consigo responder perguntas livres. Os projetos estão na página Projetos e a carreira na seção Carreira da página principal. O roteiro de escopo continua funcionando na outra aba.',
  limiteRestante: (n: number) => (n === 1 ? 'Resta 1 mensagem nesta conversa.' : `Restam ${n} mensagens nesta conversa.`),
  contador: (n: number) => `${n} de ${LIMITES.entradaMax} caracteres`,
} as const

/** O painel "como este assistente funciona": os limites, para o cliente ver engenharia e não só um bot falante. */
export const COMO_FUNCIONA: Array<{ titulo: string; texto: string }> = [
  {
    titulo: 'Só sabe o que o site publica',
    texto: 'A base do assistente é gerada a partir do próprio conteúdo do site. O que não está aqui, ele diz que não sabe, em vez de inventar.',
  },
  {
    titulo: 'Não dá preço nem data',
    texto: 'O escopo sai com tamanho e uma faixa de prazo de referência, sempre como rascunho. O preço fechado vem do Vinicius, depois de ler o escopo.',
  },
  {
    titulo: 'Confere cada resposta antes de mostrar',
    texto: 'Um filtro no servidor barra preço, pedido de contato, link fora do site e assuntos que não são públicos. Se algo escapar da IA, a resposta é trocada por uma segura.',
  },
  {
    titulo: 'Trata o seu texto como dado',
    texto: 'Mensagens que tentam mudar as regras do assistente são recusadas antes de chegar à IA, e o histórico da conversa é assinado para não poder ser forjado.',
  },
  {
    titulo: 'Tem teto de gasto',
    texto: `Cada conversa tem até ${LIMITES.turnosPorConversa} mensagens, e há limite por dia e um teto mensal de gasto. Se o teto chega, o site troca para um roteiro fixo que monta o mesmo escopo, sem IA.`,
  },
  {
    titulo: 'Não guarda a conversa',
    texto: 'Nada do que você escreve fica salvo no servidor. E-mail, telefone e CPF são apagados antes de o texto seguir para a API da Anthropic.',
  },
  {
    titulo: 'Modelo',
    texto: 'Claude Haiku 5.5, da Anthropic, por um servidor intermediário que guarda a chave e aplica os limites. Antes de cada mudança, 30 conversas de teste conferem as regras.',
  },
]
