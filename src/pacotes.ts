// Pacotes de sustentação e evolução por banco de horas mensal (decisão do dono, 08/10/2026).
// Versão anterior (pacotes de projeto com preço inicial e manutenção 150/260/520) retirada:
// ver patrimonio/config/privado/carreira/site-reorg/07-pacotes.md. Projeto sai com preço fechado pelo escopo de 1 página.
// Sem contato direto: a ação é o 99Freelas e o LinkedIn, como no resto do site.

/** Um pacote mensal de horas. */
export interface Pacote {
  id: string
  nome: string
  /** Horas por mês no banco. */
  horas: number
  /** Valor mensal em reais (inteiro). */
  valor: number
  /** O que cabe nele, em uma linha. */
  cabe: string
}

/** Hora extra, avisada antes de ser feita. */
export const HORA_EXTRA = 70

/** Valor da hora dentro do pacote (inteiro, por construção dos preços). */
export function valorHora(p: Pacote): number {
  return p.valor / p.horas
}

/** Formata um valor em reais: "R$ 260". */
export function reais(valor: number): string {
  return `R$ ${valor.toLocaleString('pt-BR')}`
}

/** Custo de terceiros (ex.: API do WhatsApp), sem valor: só a fonte oficial. */
export const terceiros = {
  texto: 'Serviços de terceiros, como a API do WhatsApp, são cobrados por eles, na sua conta. Os valores estão na tabela oficial:',
  fonte: { texto: 'Preços da API do WhatsApp (Meta)', url: 'https://developers.facebook.com/docs/whatsapp/pricing/' },
}

/** Pacotes mensais, do menor ao maior banco de horas. */
export const pacotes: Pacote[] = [
  { id: 'sustentacao', nome: 'Sustentação', horas: 4, valor: 260, cabe: 'Correções, monitoramento e pequenos ajustes.' },
  { id: 'evolucao', nome: 'Evolução', horas: 8, valor: 480, cabe: 'Melhorias e funcionalidades novas, além da sustentação.' },
  { id: 'evolucao-mais', nome: 'Evolução+', horas: 16, valor: 880, cabe: 'Evolução em ritmo maior, para sistema em crescimento.' },
]
