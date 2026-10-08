import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/** Lê um arquivo do projeto como texto (guarda de texto fixo que vive fora de `conteudo.ts`). */
const ler = (caminho: string) => readFileSync(resolve(__dirname, '..', caminho), 'utf8')

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
