import { useState } from 'react'
import tokens from '../../../design/mare.tokens.json'
import { contraste } from '../../../lib/contraste'
import type { PecaProps } from './tipos'

type Tema = 'light' | 'dark'

/** Token de cor com valor próprio nos dois temas (os apelidos, como `foco`, ficam fora). */
interface Cor {
  name: string
  value: { light: string; dark: string }
  usage: string
}

/** Cores que o design system permite como texto: para elas o contraste sobre `papel` importa. */
const DE_TEXTO = new Set(['fundo', 'fundo-suave', 'mar', 'mata', 'coral-texto'])

/** Selo do contraste: AA a partir de 4,5; "só traço" a partir de 3; abaixo disso, decorativo. */
function selo(r: number): string {
  if (r >= 4.5) return 'AA para texto'
  if (r >= 3) return '3:1, traço e ícone'
  return 'só fundo'
}

/** Tira o markdown simples (`crase`) do texto de uso do JSON. */
const limpar = (t: string) => t.replaceAll('`', '')

/**
 * Peça do design system Maré: a folha de espécime lida do arquivo de tokens, com cada cor nos dois
 * temas, o uso escrito e o contraste sobre o papel calculado na hora.
 */
export function FolhaEspecime(_: PecaProps) {
  const [tema, setTema] = useState<Tema>('light')
  const cores = (tokens.color.tokens as Cor[]).filter((c) => !c.value.light.startsWith('{'))
  const papel = cores.find((c) => c.name === 'papel')!.value
  return (
    <div className="especime">
      <div role="group" aria-label="Tema da folha" className="inline-flex rounded-full border border-linha bg-folha p-1">
        {(
          [
            ['light', 'Tema claro'],
            ['dark', 'Tema escuro'],
          ] as const
        ).map(([t, r]) => (
          <button
            key={t}
            type="button"
            aria-pressed={tema === t}
            onClick={() => setTema(t)}
            className={`rounded-full px-4 py-2 text-[0.95rem] font-semibold ${tema === t ? 'bg-cobalto text-nevoa' : 'text-grafite hover:text-tinta'}`}
          >
            {r}
          </button>
        ))}
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
        {cores.map((c, i) => {
          const r = contraste(c.value[tema], papel[tema])
          const texto = DE_TEXTO.has(c.name)
          return (
            <li key={c.name} className="especime-chip min-w-0">
              <div className="overflow-hidden rounded-md border border-linha shadow-[3px_3px_0_var(--linha)]">
                <div className="h-20 sm:h-24" style={{ background: c.value[tema] }} />
                <div className="flex h-7">
                  <span className="flex-1" style={{ background: c.value.light }} title={`claro ${c.value.light}`} />
                  <span className="flex-1" style={{ background: c.value.dark }} title={`escuro ${c.value.dark}`} />
                </div>
              </div>
              <p className="mt-2.5 flex items-baseline justify-between gap-2">
                <span className="font-display text-[1.05rem] font-semibold">{c.name}</span>
                <span className="text-[0.78rem] text-grafite tabular-nums">nº {String(i + 1).padStart(2, '0')}</span>
              </p>
              <p className="font-mono text-[0.8rem] text-grafite">{c.value[tema]}</p>
              <p className="mt-1.5 text-[0.86rem] leading-snug">{limpar(c.usage).split('.')[0]}.</p>
              {c.name !== 'papel' && (
                <p className={`mt-1.5 text-[0.82rem] ${texto ? 'font-semibold' : 'text-grafite'}`}>
                  {r.toFixed(1).replace('.', ',')}:1 sobre papel, {selo(r)}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <figure className="mt-8 rounded-lg border border-linha bg-folha p-4">
        <figcaption className="text-[0.92rem] text-grafite">O teste que trava a folha, resumido (src/design/mare.test.ts)</figcaption>
        <pre className="folha-codigo mt-2 text-[0.8rem] leading-[1.7]">
          <code>{`it.each(cores)('%s', (nome, claro, escuro) => {
  expect(variaveis(cssClaro)[nome]).toBe(claro)
  expect(variaveis(cssEscuro)[nome]).toBe(escuro)
})`}</code>
        </pre>
      </figure>
    </div>
  )
}
