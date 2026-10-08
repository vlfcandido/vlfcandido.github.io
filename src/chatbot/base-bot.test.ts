import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from '../lib/termos-proibidos'
import { linksPermitidos, montarBasePublica } from './base-bot'

describe('base pública do assistente', () => {
  const base = montarBasePublica()

  it('não tem termo proibido, e-mail nem telefone (a mesma guarda do site)', () =>
    expect(encontrarTermosProibidos(base)).toEqual([]))

  it('não tem o que o banco de provas manda nunca dizer', () => {
    const t = base.toLowerCase()
    // Concierge não foi trabalho dele (08/10/2026); 80+ chatbots, ~300 apps e 1.500 contatos são relatos sem fonte;
    // nexus-clips e bot-pedidos não se citam como entregues.
    for (const termo of ['concierge', '80+', '80 chatbots', '300 aplica', '1.500', 'nexus-clips', 'bot-pedidos', 'angola']) {
      expect(t, termo).not.toContain(termo)
    }
  })

  it('não empurra contato: nem LinkedIn, nem convite para chamar', () => {
    expect(base.toLowerCase()).not.toContain('linkedin')
    expect(base.toLowerCase()).not.toMatch(/me cham|fale comigo/)
  })

  it('só links do site e dos repositórios publicados', () => {
    const permitidos = linksPermitidos()
    const achados = base.match(/(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[\w./-]*)?/gi) ?? []
    const links = achados.filter((l) => /\//.test(l) || /github|\.io/.test(l))
    links.forEach((l) => expect(permitidos.some((p) => l.replace(/^https?:\/\//, '').startsWith(p)), l).toBe(true))
  })

  it('cabe no orçamento de contexto (~8 mil tokens; 1 token ≈ 3 caracteres em português)', () => {
    expect(base.length / 3).toBeLessThan(8000)
    expect(base.length).toBeGreaterThan(4000)
  })

  it('Sicoob só com o que a matéria diz', () => {
    expect(base).toContain('MobileTime')
    expect(base.toLowerCase()).not.toMatch(/simula[cç][aã]o de carteira/)
  })
})
