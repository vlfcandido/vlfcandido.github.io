// Linha do tempo de uma entrega (08/10/2026), do Método Entrega Acompanhada
// (patrimonio/config/privado/carreira/metodo-entrega-acompanhada.md e ficha-entrega-modelo.md).
// Regra de ouro do método: só prometer o que cabe na rotina (notícia a cada 12 h, não a cada 6 h).

/** Uma etapa da entrega: rótulo curto, quando acontece e uma única frase de detalhe. */
export interface EtapaEntrega {
  id: string
  /** Rótulo de 1 a 4 palavras (a faixa do computador e a lista do celular). */
  rotulo: string
  /** Quando acontece, em poucas palavras. */
  quando: string
  /** Uma frase só, mostrada no popover (computador) ou sob a linha (celular). */
  frase: string
}

/** As oito etapas, na ordem. */
export const etapasEntrega: EtapaEntrega[] = [
  { id: 'escopo', rotulo: 'Escopo', quando: 'Antes', frase: 'Você aprova por escrito o que entra, o que não entra, como testar, o prazo e o valor fechado.' },
  { id: 'primeira-versao', rotulo: '1ª versão', quando: '24–48 h', frase: 'Um link de teste no ar em 24 a 48 horas, mesmo simples, para você ver o caminho cedo.' },
  { id: 'noticia', rotulo: 'Notícias', quando: 'A cada 12 h', frase: 'Uma mensagem curta a cada 12 horas: o que foi feito, o que vem e o que preciso de você.' },
  { id: 'demo', rotulo: 'Demo', quando: 'Dados fictícios', frase: 'Você testa com clientes e pedidos inventados, sem arriscar dado real.' },
  { id: 'validacao', rotulo: 'Validação', quando: '1–2 dias', frase: 'Você confere os critérios de aceite item por item; defeito achado aqui é corrigido dentro do escopo.' },
  { id: 'entrega', rotulo: 'Entrega', quando: 'Com Ficha', frase: 'Publicado, com acessos no seu nome e a Ficha de Entrega em linguagem de dono do negócio.' },
  { id: 'garantia', rotulo: 'Correção', quando: '7 dias', frase: 'Defeito do que foi entregue é corrigido em 7 dias de correção sem custo, mais 30 dias de dúvidas.' },
  { id: 'manutencao', rotulo: 'Manutenção', quando: 'Opcional', frase: 'Pacote mensal opcional para manter tudo no ar e fazer ajustes; você decide depois de ver funcionando.' },
]
