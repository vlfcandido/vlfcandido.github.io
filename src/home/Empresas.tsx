// Bloco 3: onde já trabalhei. Só as empresas de SLUGS_EMPRESAS (logos liberados por ele). No celular, uma
// faixa de logos; no PC, logo, nome e o papel real de clientes.ts (nunca um papel inventado), ou a LINHA_EMPRESA
// de conteudo.ts quando o papel não diz nada ao cliente (Prefeitura de Franca, Task 10).
import { useEffect, useId, useState } from 'react'
import { empresasDiretas, type EmpresaDireta } from '../clientes'
import { logoClara } from '../components/Logo'
import { caminhoPublico } from '../lib/assets'
import { EVENTO_ABRIR_EMPRESA, LINHA_EMPRESA, SLUGS_EMPRESAS, conteudoHome, periodoDe } from './conteudo'

// 21/10/2026 (pedido dele): o bloco vira "Trajetória", com o período de cada empresa (trajetoria.ts) e o link do
// currículo em PDF. Antes: "Onde já trabalhei", só logo, nome e papel.

// 22/10/2026 (pedido dele: "mais interativo e inteligente"): cada empresa abre o que foi feito lá. No PC, passar o
// mouse (ou focar) abre a linha dela, a logo ganha cor e as outras apagam; no celular, tocar na logo abre um painel
// embaixo com nome, período, papel e o que foi feito. Antes: lista parada, com o papel numa linha.

/** Terceiro bloco da home: a trajetória, empresa por empresa, na ordem de `SLUGS_EMPRESAS`, e o currículo. */
export function Empresas() {
  const base = import.meta.env.BASE_URL
  const { empresas: textos } = conteudoHome()
  const empresas = SLUGS_EMPRESAS.map((slug) => empresasDiretas.find((e) => e.slug === slug)).filter(
    (e): e is EmpresaDireta => Boolean(e),
  )
  const [aberta, setAberta] = useState<string | null>(null)
  const idBase = useId()
  const escolhida = empresas.find((e) => e.slug === aberta)
  // A faixa de logos do topo pede para abrir uma empresa (clique numa logo leva até aqui já aberta).
  useEffect(() => {
    const abrir = (ev: Event) => setAberta((ev as CustomEvent<string>).detail)
    window.addEventListener(EVENTO_ABRIR_EMPRESA, abrir)
    return () => window.removeEventListener(EVENTO_ABRIR_EMPRESA, abrir)
  }, [])
  return (
    <section id="empresas" className="secao">
      <h2 className="titulo-bloco alvo-secao"><span className="titulo-texto">{textos.titulo}</span></h2>
      {/* 21/10/2026: sem subtítulo; com o período ao lado de cada empresa ele só repetia o título e estourava o
          orçamento de rolagem a 1280 px (3257 > 3200). Antes: <p hidden lg:block>{textos.subtitulo}</p>. */}
      {/* Celular: 3 + 2 logos numa coluna de até 296 px, alinhada à esquerda: agora as logos são botões e o canto de
          baixo à direita fica livre para o WhatsApp flutuante (antes, centradas na largura toda). */}
      <ul
        className="trajetoria mt-4 flex max-w-[296px] flex-wrap gap-x-4 gap-y-4 sm:grid sm:max-w-none sm:grid-cols-5 lg:mt-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0"
        data-foco={aberta ?? undefined}
        onPointerLeave={(ev) => ev.pointerType === 'mouse' && setAberta(null)}
      >
        {empresas.map((e) => (
          <li key={e.slug} className="empresa w-[calc((100%-2rem)/3)] sm:w-auto lg:border-t lg:border-linha" data-aberta={aberta === e.slug || undefined}>
            <button
              type="button"
              className="empresa-botao toque flex w-full flex-col items-center sm:items-start lg:flex-row lg:items-center lg:gap-4 lg:py-4"
              aria-expanded={aberta === e.slug}
              aria-controls={`${idBase}-${e.slug}`}
              onClick={() => setAberta((a) => (a === e.slug && !window.matchMedia('(hover: hover)').matches ? null : e.slug))}
              // Só mouse de verdade e foco por teclado abrem sozinhos: no toque, o celular dispara os dois antes do clique
              // e o clique fechava o que tinha acabado de abrir.
              onPointerEnter={(ev) => ev.pointerType === 'mouse' && setAberta(e.slug)}
              onFocus={(ev) => ev.currentTarget.matches(':focus-visible') && setAberta(e.slug)}
            >
              <span className="flex h-10 w-full flex-none items-center justify-center sm:justify-start lg:w-24">
                {e.logo ? (
                  // O nome está no texto ao lado (visível no PC, para leitor de tela no celular): a logo não repete.
                  <img className="logo-empresa" data-slug={e.slug} data-clara={logoClara(e.slug)} src={caminhoPublico(base, e.logo)} alt="" height={32} loading="lazy" decoding="async" />
                ) : null}
              </span>
              {/* No celular só há a logo: o "pela NTT DATA" vai embaixo dela (no PC já está no papel ao lado). */}
              {e.via && <span aria-hidden="true" className="mt-1 block text-center text-[0.7rem] leading-tight text-grafite sm:text-left lg:hidden">pela {e.via}</span>}
              <span className={e.logo ? 'sr-only lg:not-sr-only lg:min-w-0 lg:text-left' : 'min-w-0 text-left'}>
                <span className="block text-sm font-semibold">{e.nome}</span>
                {/* No celular o período fica para leitor de tela (orçamento de rolagem); a lista completa está no PDF. */}
                <span className="block text-xs tabular-nums text-grafite">{periodoDe(e.slug)}</span>
                <span className="block text-sm leading-snug text-grafite">{LINHA_EMPRESA[e.slug as keyof typeof LINHA_EMPRESA] ?? e.papel}</span>
              </span>
            </button>
            {/* PC: o que foi feito abre embaixo da linha, com a altura animada (grid 0fr para 1fr). */}
            <div id={`${idBase}-${e.slug}`} className="empresa-detalhe hidden lg:grid">
              <p className="min-h-0 overflow-hidden text-sm leading-relaxed">{e.feito}</p>
            </div>
          </li>
        ))}
      </ul>
      {/* Celular: o painel da empresa tocada. */}
      <div className="empresa-painel lg:hidden" aria-live="polite">
        {escolhida && (
          <div key={escolhida.slug} className="empresa-painel-conteudo">
            <p className="text-sm font-semibold">
              {escolhida.nome} <span className="font-normal tabular-nums text-grafite">{periodoDe(escolhida.slug)}</span>
            </p>
            <p className="text-sm text-grafite">{escolhida.papel}</p>
            <p className="mt-1 text-sm leading-relaxed">{escolhida.feito}</p>
          </div>
        )}
      </div>
      <a className="link-secundario toque mt-4" href={caminhoPublico(base, textos.curriculo.href)} download>
        {textos.curriculo.texto}
      </a>
    </section>
  )
}
