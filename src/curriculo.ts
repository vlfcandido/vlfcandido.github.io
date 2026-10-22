// Currículo de uma página (21/10/2026, pedido dele: "usar mais o nosso currículo"). Função pura que monta o HTML a
// partir da trajetoria.ts, a mesma fonte do bloco "Trajetória" da home; scripts/gerar-curriculo.ts grava o HTML em
// public/curriculo/ e imprime o PDF com o Chrome. Sem telefone e sem e-mail escritos: o contato é o WhatsApp do site.
import { SITE } from './lib/site'
import { linkWhatsapp } from './lib/whatsapp'
import { empregos, freelance, type Emprego } from './trajetoria'

/** Marcas que levam o marca-texto no resumo, na ordem em que aparecem. */
const MARCAS = ['Sicoob', 'Serasa Experian', 'Contabilizei'] as const

/** Competências agrupadas, com os termos que o currículo e o perfil do 99 já usam. */
const COMPETENCIAS: ReadonlyArray<{ grupo: string; itens: string }> = [
  { grupo: 'IA e agentes', itens: 'Agentes e sistemas multiagente, RAG, LangGraph, Google ADK, Vertex AI, Claude Code, avaliação com Ragas e DeepEval' },
  { grupo: 'Back-end', itens: 'Python e FastAPI, Java e Spring, Node.js, PostgreSQL, Redis, Docker, Google Cloud' },
  { grupo: 'Front-end e apps', itens: 'React, Vue.js, Flutter' },
  { grupo: 'Atendimento', itens: 'Chatbots na Blip, WhatsApp pela API oficial, integração com CRM e ERP' },
]

/**
 * Escapa o texto para entrar no HTML.
 *
 * @param texto texto puro.
 * @returns o texto com `&`, `<`, `>` e `"` escapados.
 */
function esc(texto: string): string {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Passa o marca-texto nas marcas do resumo.
 *
 * @param texto texto já escapado.
 * @returns o texto com cada marca dentro de `<mark>`.
 */
function marcar(texto: string): string {
  return MARCAS.reduce((t, m) => t.replace(m, `<mark>${m}</mark>`), texto)
}

/**
 * Um emprego na lista de experiência.
 *
 * @param e emprego da trajetória.
 * @returns o bloco `<article>` do emprego.
 */
function blocoEmprego(e: Emprego): string {
  const nome = e.local ? `${e.empresa} <span class="local">${esc(e.local)}</span>` : esc(e.empresa)
  const paralelo = e.paralelo ? ` <span class="paralelo">${esc(e.paralelo)}</span>` : ''
  return `<article${e.atual ? ' class="atual"' : ''}>
      <header><h3>${nome}</h3><p class="periodo">${esc(e.periodo)}${paralelo}</p></header>
      <p class="cargo">${esc(e.cargo)}</p>
      <p>${esc(e.resultado)}</p>
    </article>`
}

/**
 * Monta o currículo inteiro como documento HTML, pronto para abrir no navegador ou imprimir em A4.
 *
 * @returns o HTML completo, com `<!doctype html>`.
 */
export function montarCurriculoHtml(): string {
  const resumo = esc(
    'Sou engenheiro de IA sênior no Sicoob, onde lidero tecnicamente a frente de IA de investimentos. Antes, fui arquiteto sênior de IA na Contabilizei e líder técnico de um squad na Serasa Experian, pela NTT DATA. São 13 anos de software, de ERP de varejo em Java a sistemas com agentes de IA em produção.',
  )
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Vinicius Candido, currículo</title>
<meta name="description" content="Currículo de Vinicius Candido, engenheiro de IA sênior no Sicoob." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@400..700&display=swap" />
<style>
  :root { --papel:#f7f4ee; --folha:#fffdf9; --tinta:#17150f; --grafite:#4a463e; --linha:#ddd5c6; --sol:#f6b90a; }
  * { box-sizing: border-box; margin: 0; }
  body { background: var(--papel); color: var(--tinta); font: 400 15px/1.55 'Inter', Arial, sans-serif; padding: 32px 16px; }
  main { max-width: 720px; margin: 0 auto; background: var(--folha); padding: 48px 56px; border: 1px solid var(--linha); }
  h1, h2, h3 { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; letter-spacing: -0.01em; font-weight: 600; }
  h1 { font-size: 2.4rem; line-height: 1.05; }
  .cargo-topo { margin-top: 6px; font-size: 1.05rem; color: var(--grafite); }
  .contato { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 4px 18px; font-size: 0.9rem; }
  .contato a { color: var(--tinta); text-underline-offset: 3px; }
  .resumo { margin-top: 24px; font-size: 1.02rem; max-width: 62ch; }
  mark { background: linear-gradient(transparent 45%, var(--sol) 45%, var(--sol) 88%, transparent 88%); color: inherit; padding: 0 2px; }
  h2 { margin-top: 36px; padding-bottom: 6px; border-bottom: 1px solid var(--linha); font-size: 1.3rem; }
  article { padding: 14px 0; border-bottom: 1px solid var(--linha); break-inside: avoid; }
  article:last-child { border-bottom: 0; }
  article header { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; flex-wrap: wrap; }
  h3 { font-size: 1.1rem; }
  .local { font-family: 'Inter', Arial, sans-serif; font-weight: 400; font-size: 0.9rem; color: var(--grafite); }
  .periodo { font-size: 0.88rem; color: var(--grafite); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .paralelo { font-style: italic; }
  .cargo { font-weight: 600; margin-top: 2px; }
  .atual h3 { box-shadow: inset 0 -0.35em 0 var(--sol); display: inline; }
  dl { margin-top: 12px; display: grid; grid-template-columns: 9.5rem 1fr; gap: 8px 16px; }
  dt { font-weight: 600; }
  dd { margin: 0; }
  @media (max-width: 600px) { main { padding: 28px 20px; } dl { grid-template-columns: 1fr; gap: 2px; } dd { margin-bottom: 8px; } }
  @page { size: A4; margin: 12mm 0; }
  @media print {
    body { background: #fff; padding: 0; font-size: 9.4pt; line-height: 1.42; }
    main { border: 0; padding: 0 16mm; max-width: none; background: #fff; }
    h1 { font-size: 22pt; } .resumo { margin-top: 14px; } h2 { margin-top: 14px; font-size: 12pt; } article { padding: 6px 0; }
    dl { margin-top: 8px; gap: 4px 16px; }
    .contato a { text-decoration: none; }
    .contato a[href^="http"]::after { content: none; }
  }
</style>
</head>
<body>
<main>
  <h1>Vinicius Candido</h1>
  <p class="cargo-topo">Engenheiro de IA sênior, 13 anos de software</p>
  <p class="contato"><a href="https://${SITE}/">${SITE}</a><a href="${esc(linkWhatsapp())}">Conversar no WhatsApp</a></p>
  <p class="resumo">${marcar(resumo)}</p>
  <h2>Experiência</h2>
  ${empregos.map(blocoEmprego).join('\n  ')}
  <h2>Projetos freelance</h2>
  <article>
      <header><h3>${esc(freelance.empresa)}</h3></header>
      <p>${esc(freelance.resultado)}</p>
    </article>
  <h2>Competências</h2>
  <dl>
    ${COMPETENCIAS.map((c) => `<dt>${esc(c.grupo)}</dt><dd>${esc(c.itens)}</dd>`).join('\n    ')}
  </dl>
</main>
</body>
</html>
`
}
