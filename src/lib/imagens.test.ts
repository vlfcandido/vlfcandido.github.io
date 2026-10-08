import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const PASTA = join(__dirname, '..', '..', 'public', 'img')

describe('ilustrações em public/img', () => {
  it('nenhum arquivo passa de 150 KB', () =>
    readdirSync(PASTA).forEach((f) => expect(statSync(join(PASTA, f)).size, f).toBeLessThanOrEqual(150 * 1024)))
  it('toda largura tem AVIF, WebP e JPEG', () => {
    const arquivos = new Set(readdirSync(PASTA))
    const bases = new Set([...arquivos].map((f) => f.replace(/\.(avif|webp|jpg)$/, '')))
    bases.forEach((b) => ['avif', 'webp', 'jpg'].forEach((e) => expect(arquivos.has(`${b}.${e}`), `${b}.${e}`).toBe(true)))
  })
})
