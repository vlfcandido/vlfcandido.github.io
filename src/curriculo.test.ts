import { describe, expect, it } from 'vitest'
import { montarCurriculoHtml } from './curriculo'
import { encontrarTermosProibidos } from './lib/termos-proibidos'
import { empregos, freelance } from './trajetoria'

const html = montarCurriculoHtml()

describe('currículo (página e PDF)', () => {
  it('traz todos os empregos, com cargo e período', () => {
    for (const e of empregos) {
      expect(html).toContain(e.empresa)
      expect(html).toContain(e.cargo)
      expect(html).toContain(e.periodo)
    }
    expect(html).toContain(freelance.empresa)
  })
  it('abre com as três marcas no resumo', () => {
    const resumo = html.slice(html.indexOf('<main'), html.indexOf('<h2'))
    for (const m of ['Sicoob', 'Serasa Experian', 'Contabilizei']) expect(resumo).toContain(m)
  })
  it('sem telefone nem e-mail escritos', () => {
    const texto = html.replace(/<[^>]+>/g, ' ')
    expect(texto).not.toMatch(/@[a-z0-9-]+\./i)
    expect(texto).not.toMatch(/\d{4,5}-?\d{4}/)
  })
  // O link da fonte (Fraunces:…wght@9..144) parece e-mail para o padrão; a checagem vale para o corpo do documento.
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(html.slice(html.indexOf('<body')))).toEqual([]))
  it('é um documento completo em pt-BR', () => {
    expect(html).toMatch(/^<!doctype html>/i)
    expect(html).toContain('<html lang="pt-BR">')
  })
})
