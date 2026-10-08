import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from './lib/termos-proibidos'
import * as visuais from './visuais'

const PUBLICO = join(__dirname, '..', 'public')

describe('imagens do site', () => {
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(JSON.stringify(visuais))).toEqual([]))
  it('todo print referenciado existe', () => {
    const prints = Object.values(visuais.printsDosCasos).flat()
    prints.forEach((p) => expect(existsSync(join(PUBLICO, p.arquivo)), p.arquivo).toBe(true))
  })
  it('todo print tem alt descritivo', () =>
    Object.values(visuais.printsDosCasos)
      .flat()
      .forEach((p) => expect(p.alt.length).toBeGreaterThan(20)))
  it('toda capa tem os três formatos em cada largura, até 150 KB, e alt descritivo', () =>
    Object.values(visuais.capasDosProjetos).forEach((c) => {
      expect(c.alt.length).toBeGreaterThan(40)
      c.larguras.forEach((w) =>
        ['avif', 'webp', 'jpg'].forEach((ext) => {
          const arq = join(PUBLICO, 'img', `${c.nome}-${w}.${ext}`)
          expect(existsSync(arq), arq).toBe(true)
          expect(statSync(arq).size, arq).toBeLessThanOrEqual(150 * 1024)
        }),
      )
    }))
})
