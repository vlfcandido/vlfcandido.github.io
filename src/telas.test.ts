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
  it('meta description sem "Chatbots de WhatsApp" e com o posicionamento amplo (M19)', () => {
    const html = ler('index.html')
    const meta = html.match(/name="description"\s+content="([^"]+)"/)?.[1]
    expect(meta).toBe(
      'Integro sistemas e CRM, crio APIs, automatizo o trabalho repetido e conserto o que travou. Preço fechado antes de começar. Engenheiro de software sênior, 13 anos.',
    )
  })
  it('subtítulo das provas fala de órgãos públicos a grandes marcas (M9)', () => {
    const prova = ler('src/components/Prova.tsx')
    expect(prova).toContain(', de órgãos públicos a grandes marcas.')
    expect(prova).not.toMatch(/^\s*, com chatbots e análise de conversas\./m)
  })
})
