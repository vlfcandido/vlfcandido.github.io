import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from './lib/termos-proibidos'
import * as visuais from './visuais'

const PUBLICO = join(__dirname, '..', 'public')

describe('imagens do site', () => {
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(JSON.stringify(visuais))).toEqual([]))
  it('todo print referenciado existe', () => {
    const prints = [...Object.values(visuais.printsDosCasos).flat(), ...visuais.repositorios.map((r) => r.print)]
    prints.forEach((p) => expect(existsSync(join(PUBLICO, p.arquivo)), p.arquivo).toBe(true))
  })
  it('todo print tem alt descritivo', () =>
    Object.values(visuais.printsDosCasos)
      .flat()
      .forEach((p) => expect(p.alt.length).toBeGreaterThan(20)))
  it('toda foto existe e tem crédito com link https', () =>
    Object.values(visuais.fotos).forEach((f) => {
      expect(existsSync(join(PUBLICO, f.arquivo))).toBe(true)
      expect(f.autor).toBeTruthy()
      expect(f.url).toMatch(/^https:\/\//)
    }))
})
