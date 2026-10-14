import { readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/** Lê um arquivo do projeto como texto (guarda de texto fixo que vive fora de `conteudo.ts`). */
const ler = (caminho: string) => readFileSync(resolve(__dirname, '..', caminho), 'utf8')

/** Lista os arquivos de código e texto do site (sem os testes, que citam o termo para barrá-lo). */
function arquivosDoSite(pasta: string): string[] {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = resolve(pasta, nome)
    if (statSync(caminho).isDirectory()) return arquivosDoSite(caminho)
    return /\.(ts|tsx|css|html)$/.test(nome) && !/\.test\.ts$/.test(nome) ? [caminho] : []
  })
}

describe('o que não pode aparecer no site', () => {
  // Correção dele, 08/10/2026: o atendimento com IA da Contabilizei citado pelo Google Cloud não foi trabalho dele.
  it('nenhuma menção ao Concierge, nem à matéria do Google Cloud sobre ele', () => {
    const raiz = resolve(__dirname, '..')
    const arquivos = [...arquivosDoSite(resolve(raiz, 'src')), resolve(raiz, 'index.html')]
    expect(arquivos.length).toBeGreaterThan(20)
    arquivos.forEach((a) => {
      const texto = readFileSync(a, 'utf8')
      expect(texto, a).not.toMatch(/concierge/i)
      expect(texto, a).not.toContain('google-cloud-90-casos-de-ia')
    })
  })
  // Pedido dele, 08/10/2026: o sistema de ordens não se chama mais "bot de trading" em lugar nenhum.
  it('nenhum "bot de trading" nem "trading" no texto do site', () => {
    const raiz = resolve(__dirname, '..')
    arquivosDoSite(resolve(raiz, 'src')).forEach((a) => expect(readFileSync(a, 'utf8'), a).not.toMatch(/trading/i))
  })
})

// Reorganização de 08/10/2026 (plano do juiz, site-reorg/04-juiz.md).
describe('textos fixos das telas', () => {
  // Texto trocado em 14/10/2026 (site novo). Antes: "Integro sistemas e CRM, crio APIs, automatizo o trabalho repetido e conserto o que travou. Preço fechado antes de começar. Engenheiro de software sênior, 13 anos."
  it('meta description sem "Chatbots de WhatsApp" e com a prova (13 anos, Sicoob e Serasa) do site novo', () => {
    const html = ler('index.html')
    const meta = html.match(/name="description"\s+content="([^"]+)"/)?.[1]
    expect(meta).toBe(
      '13 anos construindo sistemas para Sicoob e Serasa Experian. Veja o seu sistema funcionando antes de fechar.',
    )
  })
  // 14/10/2026: saiu o caso "subtítulo das provas (M9)", que lia src/components/Prova.tsx; o bloco de provas da home
  // antiga foi apagado com o site novo (o texto da prova agora vive em src/home/conteudo.ts, com teste próprio).
})
