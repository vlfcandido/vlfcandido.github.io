import { describe, expect, it } from 'vitest'
import { scriptPrincipal } from './versao'

describe('scriptPrincipal', () => {
  it('acha o script com hash do build', () =>
    expect(scriptPrincipal('<script type="module" crossorigin src="/assets/index-DnKEuInJ.js"></script>')).toBe(
      '/assets/index-DnKEuInJ.js',
    ))
  it('aceita base em subpasta', () =>
    expect(scriptPrincipal('<script type="module" src="/site/assets/index-a1.js"></script>')).toBe('/site/assets/index-a1.js'))
  it('ignora o script do servidor de desenvolvimento', () =>
    expect(scriptPrincipal('<script type="module" src="/src/main.tsx"></script>')).toBeNull())
})
