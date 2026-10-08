// Linha do tempo de uma entrega (08/10/2026), do Método Entrega Acompanhada
// (patrimonio/config/privado/carreira/metodo-entrega-acompanhada.md e ficha-entrega-modelo.md).
// Regra de ouro do método: só prometer o que cabe na rotina (notícia a cada 12 h, não a cada 6 h).

/** Uma etapa da entrega, com a peça de exemplo que a mostra. */
export interface EtapaEntrega {
  id: string
  titulo: string
  /** Quando acontece, em poucas palavras (a "cota" da etapa). */
  quando: string
  resumo: string
  /** Peça de exemplo: linhas de um papel fictício (rótulo, texto). Sempre dado inventado. */
  peca: { titulo: string; linhas: [string, string][] }
}

/** As oito etapas, na ordem. */
export const etapasEntrega: EtapaEntrega[] = [
  {
    id: 'escopo',
    titulo: 'Escopo de uma página',
    quando: 'Antes de começar',
    resumo: 'Você aprova por escrito o que entra, o que não entra, como vai testar, o prazo e o valor fechado. Mudança depois do aceite vira uma linha nova, com prazo e valor.',
    peca: { titulo: 'Escopo (exemplo)', linhas: [['Entra', 'cadastro, agenda e aviso por mensagem'], ['Não entra', 'pagamento (fase 2)'], ['Como testar', 'marcar e cancelar uma consulta'], ['Valor e prazo', 'fechados antes de começar']] },
  },
  {
    id: 'primeira-versao',
    titulo: 'Primeira versão para testar',
    quando: 'Em 24 a 48 horas',
    resumo: 'Um link de teste no ar logo no começo, mesmo que simples, para você ver o caminho em vez de esperar o fim.',
    peca: { titulo: 'Link de teste (exemplo)', linhas: [['Endereço', 'teste.exemplo.com.br'], ['O que já funciona', 'cadastro e lista'], ['O que falta', 'aviso por mensagem']] },
  },
  {
    id: 'noticia',
    titulo: 'Notícia a cada 12 horas',
    quando: 'Todo dia, de manhã e à noite',
    resumo: 'Uma mensagem curta no chat: o que foi feito, o que vem agora e o que eu preciso de você, com prazo. Se algo travar, aviso na hora, com o efeito no prazo.',
    peca: { titulo: 'Atualização 08h (exemplo)', linhas: [['Feito', 'cadastro de clientes'], ['Próximo', 'agenda com horários livres'], ['Preciso de você', 'nada por enquanto'], ['Link de teste', 'o mesmo, já atualizado']] },
  },
  {
    id: 'demo',
    titulo: 'Demonstração com dados fictícios',
    quando: 'Antes de usar de verdade',
    resumo: 'Você testa o sistema com clientes e pedidos inventados, sem arriscar dado real, e vê cada caminho funcionando.',
    peca: { titulo: 'Demonstração (exemplo)', linhas: [['Dados', 'fictícios: Cliente Exemplo, Pedido 0001'], ['Caminhos testados', 'marcar, remarcar, cancelar'], ['Dado real', 'só entra depois do seu ok']] },
  },
  {
    id: 'validacao',
    titulo: 'Validação',
    quando: '1 a 2 dias',
    resumo: 'Você recebe a lista dos critérios de aceite e confere item por item. Defeito achado aqui é corrigido dentro do escopo e não conta como pedido novo.',
    peca: { titulo: 'Critérios de aceite (exemplo)', linhas: [['1', 'marcar uma consulta: ok'], ['2', 'cancelar e liberar o horário: ok'], ['3', 'aviso por mensagem: ajustar o texto']] },
  },
  {
    id: 'entrega',
    titulo: 'Entrega com a Ficha',
    quando: 'No dia combinado',
    resumo: 'Publicado, com acessos e contas no seu nome. A Ficha de Entrega, em linguagem de dono do negócio, diz o que foi feito, como testar e o resultado dos testes, junto do manual e da documentação técnica.',
    peca: { titulo: 'Ficha de Entrega (exemplo)', linhas: [['O que foi feito', 'agenda com aviso por mensagem'], ['Como testar', 'passo a passo em 3 itens'], ['Resultado dos testes', 'todos os cenários passando'], ['Próximo passo', 'pagamento, em fase 2']] },
  },
  {
    id: 'garantia',
    titulo: '7 dias de correção sem custo',
    quando: 'Depois da entrega',
    resumo: 'Se algo do que foi entregue não funcionar como combinado, eu corrijo sem custo. Dúvidas de uso por mensagem por 30 dias. Não cobre item novo nem mudança de escopo.',
    peca: { titulo: 'Garantia (exemplo)', linhas: [['Cobre', 'defeito do que foi entregue'], ['Não cobre', 'funcionalidade nova'], ['Prazo', '7 dias de correção, 30 de dúvidas']] },
  },
  {
    id: 'manutencao',
    titulo: 'Manutenção, se você quiser',
    quando: 'Opcional, no mês seguinte',
    resumo: 'Se fizer sentido, um pacote mensal mantém tudo no ar, atualizado e com horas para ajustes. Não é obrigatório e você decide depois de ver a entrega funcionando.',
    peca: { titulo: 'Manutenção (exemplo)', linhas: [['Mantém', 'no ar, atualizado e com backup'], ['Horas', 'ajustes dentro da franquia do mês'], ['Cancelar', 'quando quiser']] },
  },
]
