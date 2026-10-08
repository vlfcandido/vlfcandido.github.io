import { useEffect, useState } from 'react'
import type { PecaProps } from './tipos'

/** Um arquivo de teste do site, com quantas verificações (`it`) ele tem. */
interface ArquivoTeste {
  nome: string
  total: number
}

/**
 * Lê os arquivos de teste do próprio site (carregados só quando esta peça abre) e conta as verificações.
 * O número que aparece na página é contado do código publicado, não escrito à mão.
 *
 * @returns a lista de arquivos, da maior para a menor, ou `null` enquanto carrega.
 */
function useTestesDoSite(): ArquivoTeste[] | null {
  const [lista, setLista] = useState<ArquivoTeste[] | null>(null)
  useEffect(() => {
    let vivo = true
    const modulos = import.meta.glob('/src/**/*.test.ts', { query: '?raw', import: 'default' })
    Promise.all(
      Object.entries(modulos).map(async ([caminho, carregar]) => {
        const texto = String(await carregar())
        return { nome: caminho.replace(/^\/src\//, ''), total: (texto.match(/\bit(?:\.each)?\(/g) ?? []).length }
      }),
    )
      .then((l) => vivo && setLista(l.sort((a, b) => b.total - a.total)))
      .catch(() => vivo && setLista([]))
    return () => {
      vivo = false
    }
  }, [])
  return lista
}

const TECLADO = [
  { tecla: 'Tab', faz: 'anda pelos links e botões, na ordem da leitura' },
  { tecla: 'Enter', faz: 'abre o projeto escolhido na galeria' },
  { tecla: 'Esc', faz: 'fecha a tela ampliada de um print' },
]

/**
 * Peça deste site: um raio-X da própria página. Um botão desenha o contorno de cada caixa do layout,
 * a ficha mostra o caminho de teclado e a lista de testes é lida dos arquivos do repositório.
 */
export function RaioX(_: PecaProps) {
  const [contornos, setContornos] = useState(false)
  const testes = useTestesDoSite()
  const total = testes?.reduce((s, t) => s + t.total, 0) ?? 0

  useEffect(() => {
    document.documentElement.classList.toggle('raio-x', contornos)
    return () => document.documentElement.classList.remove('raio-x')
  }, [contornos])

  return (
    <div className="raiox grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-linha bg-folha p-5">
          <p className="font-display text-[1.15rem] font-semibold">Contornos do layout</p>
          <p className="mt-1 text-[0.95rem] text-grafite">Cada caixa desta página ganha uma borda tracejada. Role a página com eles ligados.</p>
          <button
            type="button"
            role="switch"
            aria-checked={contornos}
            onClick={() => setContornos((c) => !c)}
            className="mt-4 inline-flex items-center gap-3 rounded-full border border-tinta py-1.5 pr-4 pl-1.5 font-semibold"
          >
            <span aria-hidden="true" className={`interruptor ${contornos ? 'interruptor-ligado' : ''}`} />
            {contornos ? 'Contornos ligados' : 'Ligar contornos'}
          </button>
        </div>
        <div className="rounded-lg border border-linha bg-folha p-5">
          <p className="font-display text-[1.15rem] font-semibold">Só com o teclado</p>
          <dl className="mt-3 space-y-2.5">
            {TECLADO.map((t) => (
              <div key={t.tecla} className="flex items-baseline gap-3">
                <dt>
                  <kbd className="tecla">{t.tecla}</kbd>
                </dt>
                <dd className="text-[0.98rem]">{t.faz}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="rounded-lg border border-linha bg-folha p-5">
        <p className="font-display text-[1.15rem] font-semibold" aria-live="polite">
          {testes === null ? 'Contando os testes…' : `${total} verificações em ${testes.length} arquivos de teste`}
        </p>
        <p className="mt-1 text-[0.95rem] text-grafite">Contadas agora, no código desta página. Se uma falhar, o site não vai ao ar.</p>
        {testes && testes.length > 0 && (
          <ul className="mt-4 space-y-1.5 text-[0.9rem]">
            {testes.map((t) => (
              <li key={t.nome} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <span className="truncate font-mono text-[0.84rem]">{t.nome}</span>
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-2 rounded-sm bg-raso" style={{ width: `${Math.max(4, t.total * 3)}px` }} />
                  <span className="w-6 text-right tabular-nums">{t.total}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
