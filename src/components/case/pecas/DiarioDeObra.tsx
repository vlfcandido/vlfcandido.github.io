import type { PecaProps } from './tipos'

/** Uma camada da reforma, com o antes, o depois e a prova medida no dia. */
interface Etapa {
  data: string
  frente: string
  titulo: string
  antes: string
  depois: string
  prova: string
}

/** As cinco camadas, na ordem em que a loja foi destravada. Tudo saiu do dossiê do projeto. */
const ETAPAS: Etapa[] = [
  {
    data: '26/10',
    frente: 'Segurança',
    titulo: 'A porta fechada antes de tocar na loja',
    antes: '5 plugins de risco e 2 clones piratas abertos no site',
    depois: '27 plugins atualizados com backup, lista de administradores fechada e um plugin de segurança feito para a loja',
    prova: 'backup completo antes de cada atualização',
  },
  {
    data: '29/10',
    frente: 'Estoque',
    titulo: 'A baixa voltou a acontecer nos dois sites',
    antes: 'a integração do Woo apontava para a empresa antiga depois da troca de CNPJ',
    depois: 'integração refeita na empresa certa, sem tocar no outro site, com sincronização automática ligada',
    prova:
      'compra de teste de 3 pacotes: 17 → 14 no site, 14 no outro site em menos de um minuto; cancelada, os dois voltaram a 17',
  },
  {
    data: '29/10',
    frente: 'Catálogo',
    titulo: 'De 11 para 1.033 produtos à venda',
    antes: '11 produtos na vitrine e categorias vazias',
    depois: '1.033 produtos com foto, nome, categoria e preço de pacote, em uma árvore única de categorias',
    prova: '77 categorias vazias apagadas e 72 pedidos em aberto de 2022 a janeiro de 2025 cancelados',
  },
  {
    data: '04/11 a 05/11',
    frente: 'Protótipo e tema',
    titulo: 'O desenho do cliente, medido bloco a bloco',
    antes: 'a primeira versão saiu por estimativa e foi rejeitada',
    depois:
      'protótipo replicado a partir do PDF e do HTML de origem, medido âncora por âncora, e publicado em Cloudflare Workers para abrir no celular; sobre ele, o tema próprio, sem page builder',
    prova: 'diferença média de 47,9% para 31%; home do tema a 4 px do protótipo no PC e a 19 px no celular',
  },
  {
    data: '06/11 a 09/11',
    frente: 'Vitrine e checkout',
    titulo: 'Filtro na vitrine, frete no carrinho',
    antes: 'vitrine sem os filtros do desenho e frete calculado só no fim do fechamento',
    depois:
      'Tamanho, Cor, Grupo e Mais filtros em gaveta, carregamento em levas de 16, e frete cotado no carrinho com Correios, Jadlog, Azul e JeT, mais a TDS pela tabela e a excursão',
    prova: 'seis opções de frete no primeiro teste; fechamento em quatro passos, com endereço obrigatório e Pix ou cartão',
  },
]

/**
 * Peça da Limey: o diário da reforma, em cinco camadas. Cada uma mostra o antes, o depois e a prova
 * medida no dia, sem dado de exemplo e sem botão. O conteúdo é fixo e sai montado no servidor.
 *
 * @param _props projeto e case do item (a peça não lê os dois: o conteúdo é o do dossiê).
 */
export function DiarioDeObra(_props: PecaProps) {
  return (
    <section aria-label="Diário da reforma da loja" className="obra">
      <ol className="obra-lista">
        {ETAPAS.map((e) => (
          <li key={`${e.data}-${e.frente}`} data-etapa={e.frente} className="obra-passo">
            <div className="obra-data">
              <span className="font-display text-[0.95rem] font-semibold tabular-nums">{e.data}</span>
            </div>
            <div className="obra-cartao">
              <p className="text-[0.82rem] font-semibold tracking-[0.12em] text-grafite uppercase">{e.frente}</p>
              <h3 className="mt-1 font-display text-[1.18rem] leading-snug font-semibold">{e.titulo}</h3>
              <dl className="mt-3 space-y-2.5">
                <div className="obra-linha">
                  <dt className="text-[0.86rem] font-semibold text-grafite">Antes</dt>
                  <dd className="prosa text-[0.98rem] leading-relaxed text-grafite">{e.antes}</dd>
                </div>
                <div className="obra-linha">
                  <dt className="text-[0.86rem] font-semibold text-tinta">Depois</dt>
                  <dd className="prosa text-[1rem] leading-relaxed">{e.depois}</dd>
                </div>
              </dl>
              <p className="obra-prova mt-3 text-[0.92rem] leading-relaxed">
                <span className="font-semibold">Prova: </span>
                {e.prova}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
