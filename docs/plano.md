# Site de portfólio — Plano de implementação

> **Para agentes:** SUB-SKILL: superpowers:executing-plans (execução inline, escolhida no pedido).
> Passos com checkbox (`- [ ]`).

**Objetivo:** site estático de uma página que vende o trabalho de freela do Vinicius com prova pública.

**Arquitetura:** SPA Vite + React sem roteador. Todo texto vive em `src/conteudo.ts` (dados tipados,
sem lógica); cada seção é um componente que recebe dados. Duas funções puras com TDD
(`caminhoPublico`, `encontrarTermosProibidos`) e um teste de guarda sobre o conteúdo inteiro.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 (`@tailwindcss/vite`) · Vitest · GitHub Pages (Actions).

**Spec:** `docs/superpowers/specs/2026-10-07-portfolio-site-design.md`

## Restrições globais
- pt-BR em tudo: texto, comentários, docstrings (TSDoc), commits.
- Proibido no conteúdo: Sicoob, Mirante, "Staff de IA", e-mail, telefone, pensão, nomes de família.
- Dado pessoal publicado: só nome, GitHub `https://github.com/vlfcandido`, LinkedIn
  `https://www.linkedin.com/in/viniciusf-candido` (+ perfil público do 99Freelas, decidido por default).
- Visual: IBM Plex Sans + IBM Plex Mono; 1 destaque `#0b6b62`; sem gradiente, glass, blob, emoji, sombra difusa.
- Nenhum import com efeito colateral (exceto `main.tsx`, ponto de entrada).
- `base` do Vite = `process.env.BASE_PATH ?? '/'`.
- Sem repositório remoto e sem push.

## Foco de revisão
1. Print ausente: o card mostra o placeholder, nunca imagem quebrada nem 404 (`temPrint: false`) → Task 3 testa via conteúdo.
2. Base com e sem barra final (`/`, `/portfolio-site`, `/portfolio-site/`, `./`) → teste em Task 1.
3. Vazamento de dado proibido ao editar texto no futuro → teste de guarda em Task 3 (roda no CI antes do build).
4. Link externo inseguro ou http → teste "toda URL é https" em Task 3; `rel="noopener noreferrer"` nos componentes.
5. Tela de 360 px com URL longa ou stack longa → `break-all`/`min-w-0`/`flex-wrap`; conferência manual no Task 5.

---

### Task 1: Esqueleto do projeto + `caminhoPublico` (TDD)

**Arquivos:** criar `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`,
`src/main.tsx`, `src/index.css`, `src/App.tsx` (vazio por ora), `src/lib/assets.ts`, `src/lib/assets.test.ts`.

**Interfaces:** produz `caminhoPublico(base: string, relativo: string): string`.

- [ ] **Passo 1: instalar**
```bash
npm init -y
npm i react react-dom
npm i -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @types/node tailwindcss @tailwindcss/vite vitest
```
Scripts: `"dev": "vite"`, `"build": "tsc --noEmit && vite build"`, `"preview": "vite preview"`, `"test": "vitest run"`; `"type": "module"`.

- [ ] **Passo 2: `vite.config.ts`**
```ts
/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// A base vem de BASE_PATH para publicar em subpasta (GitHub Pages: /<repo>/).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  test: { environment: 'node' },
})
```

- [ ] **Passo 3: teste que falha** — `src/lib/assets.test.ts`
```ts
import { describe, expect, it } from 'vitest'
import { caminhoPublico } from './assets'

describe('caminhoPublico', () => {
  it('base raiz', () => expect(caminhoPublico('/', 'prints/a.png')).toBe('/prints/a.png'))
  it('base com barra final', () => expect(caminhoPublico('/site/', 'prints/a.png')).toBe('/site/prints/a.png'))
  it('base sem barra final', () => expect(caminhoPublico('/site', 'prints/a.png')).toBe('/site/prints/a.png'))
  it('relativo com barra inicial', () => expect(caminhoPublico('/site/', '/prints/a.png')).toBe('/site/prints/a.png'))
  it('base relativa', () => expect(caminhoPublico('./', 'prints/a.png')).toBe('./prints/a.png'))
})
```
Rodar `npm test` → FALHA (módulo não existe).

- [ ] **Passo 4: implementação mínima** — `src/lib/assets.ts`
```ts
/**
 * Junta a base pública do site com um caminho relativo de `public/`, sem barra dupla.
 * @param base valor de `import.meta.env.BASE_URL` (ex.: `/`, `/portfolio-site/`).
 * @param relativo caminho dentro de `public/` (ex.: `prints/x.png`).
 * @returns URL pronta para `src`/`href`.
 */
export function caminhoPublico(base: string, relativo: string): string {
  return `${base.replace(/\/+$/, '')}/${relativo.replace(/^\/+/, '')}`
}
```
Rodar `npm test` → PASSA.

- [ ] **Passo 5: `index.html`, `src/main.tsx`, `src/index.css`** (fontes IBM Plex via Google Fonts,
tokens de cor em `:root` + `prefers-color-scheme: dark`, mapeados em `@theme inline` como
`papel/superficie/tinta/suave/linha/destaque`). Código final está nos arquivos.

- [ ] **Passo 6: commit** `feat: esqueleto Vite + Tailwind e caminhoPublico`

### Task 2: `encontrarTermosProibidos` (TDD)

**Arquivos:** `src/lib/termos-proibidos.ts`, `src/lib/termos-proibidos.test.ts`.

**Interfaces:** produz `encontrarTermosProibidos(texto: string): string[]` — rótulos achados, sem repetição,
na ordem da lista (`sicoob`, `mirante`, `staff de ia`, `pensao`, `beatriz`, `e-mail`, `telefone`).

- [ ] **Passo 1: teste que falha**
```ts
import { describe, expect, it } from 'vitest'
import { encontrarTermosProibidos } from './termos-proibidos'

describe('encontrarTermosProibidos', () => {
  it('texto limpo', () => expect(encontrarTermosProibidos('5 mil atendimentos de 2021 a 2025')).toEqual([]))
  it('ignora caixa e acento', () => expect(encontrarTermosProibidos('SICOOB e Pensão')).toEqual(['sicoob', 'pensao']))
  it('acha e-mail', () => expect(encontrarTermosProibidos('fale em a.b@x.com.br')).toEqual(['e-mail']))
  it('acha telefone', () => expect(encontrarTermosProibidos('ligue (45) 99999-1234')).toEqual(['telefone']))
  it('não confunde URL com data', () =>
    expect(encontrarTermosProibidos('https://site.com/noticias/12/06/2026/wiv-5-milhoes/')).toEqual([]))
  it('sem repetição', () => expect(encontrarTermosProibidos('sicoob sicoob')).toEqual(['sicoob']))
})
```
- [ ] **Passo 2:** `npm test` → FALHA.
- [ ] **Passo 3: implementação**
```ts
const PALAVRAS = ['sicoob', 'mirante', 'staff de ia', 'pensao', 'beatriz'] as const
const PADROES: ReadonlyArray<[string, RegExp]> = [
  ['e-mail', /[\w.+-]+@[\w-]+\.[\w.]+/],
  ['telefone', /(?:\+?55\s?)?\(?\b\d{2}\)?[\s-]?9?\d{4}[\s-]\d{4}\b/],
]

/** Minúsculas e sem acento, para comparar termos de forma estável. */
function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Procura no texto termos e padrões que nunca podem ir ao ar (empregador atual, assuntos
 * privados, e-mail, telefone).
 * @returns rótulos encontrados, sem repetição; vazio quando o texto está limpo.
 */
export function encontrarTermosProibidos(texto: string): string[] {
  const t = normalizar(texto)
  const achados: string[] = PALAVRAS.filter((p) => t.includes(p))
  for (const [rotulo, re] of PADROES) if (re.test(texto)) achados.push(rotulo)
  return achados
}
```
- [ ] **Passo 4:** `npm test` → PASSA. **Passo 5:** commit `feat: detector de termos proibidos`.

### Task 3: Conteúdo tipado + teste de guarda

**Arquivos:** `src/conteudo.ts`, `src/conteudo.test.ts`.

**Interfaces:** produz os tipos `Fonte`, `Numero`, `Oferta`, `Case`, `Passo`, `CamadaStack`, `LinkExterno`
e as constantes `perfil`, `oferta`, `numeros`, `cases`, `passos`, `stack`, `links`.
```ts
export interface Fonte { texto: string; url?: string }
export interface Case {
  slug: string; tipo: 'publico' | 'proprio'; titulo: string; contexto: string; feito: string
  metrica: string; fonte: Fonte; stack: string[]; temPrint: boolean; alt: string
}
```

- [ ] **Passo 1: teste de guarda que falha**
```ts
import { describe, expect, it } from 'vitest'
import * as conteudo from './conteudo'
import { encontrarTermosProibidos } from './lib/termos-proibidos'

const urls = (): string[] => {
  const todas: string[] = []
  JSON.stringify(conteudo, (_k, v) => { if (typeof v === 'string' && v.startsWith('http')) todas.push(v); return v })
  return todas
}

describe('conteúdo publicado', () => {
  it('não tem termo proibido', () => expect(encontrarTermosProibidos(JSON.stringify(conteudo))).toEqual([]))
  it('toda URL é https', () => urls().forEach((u) => expect(u).toMatch(/^https:\/\//)))
  it('slugs válidos e únicos', () => {
    const slugs = conteudo.cases.map((c) => c.slug)
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/))
    expect(new Set(slugs).size).toBe(slugs.length)
  })
  it('todo case tem alt descritivo', () => conteudo.cases.forEach((c) => expect(c.alt.length).toBeGreaterThan(15)))
  it('cases públicos citam fonte com link', () =>
    conteudo.cases.filter((c) => c.tipo === 'publico').forEach((c) => expect(c.fonte.url).toBeTruthy()))
  it('quatro passos de trabalho', () => expect(conteudo.passos).toHaveLength(4))
})
```
- [ ] **Passo 2:** `npm test` → FALHA (sem `conteudo.ts`).
- [ ] **Passo 3:** escrever `src/conteudo.ts` com: perfil (nome, título, chamada da v4 FINAL, resumo,
nota e convite), 4 ofertas da v4 FINAL, 4 números com fonte (13 anos; 4,6 no diretório Blip; 5 mil
atendimentos/mês Franca; 355 testes no bot próprio), 9 cases (Franca, Araguaia, Waizer/Wiv, nexus-quant,
nexus-clips, revisor-ia, AprovaOS, credit-bureau, llm-local — todos `temPrint: false`), 4 passos
(preço fechado · versão de teste em 24–48 h · Ficha de Entrega · 7 dias de correção), stack em 6 camadas,
3 links. Números sem fonte pública (80+ chatbots, 1.500 contatos/dia) **ficam fora**.
- [ ] **Passo 4:** `npm test` → PASSA. **Passo 5:** commit `feat: conteúdo tipado com teste de guarda`.

### Task 4: Componentes e página

**Arquivos:** `src/components/{Secao,FonteLink,Cabecalho,Sobre,CardCase,Cases,ComoTrabalho,Stack,Contato,Rodape}.tsx`, `src/App.tsx`.

**Interfaces:** consome tudo de `conteudo.ts` e `caminhoPublico`. Cada componente exporta uma função nomeada com TSDoc.

- [ ] **Passo 1:** `Secao({id, numero, titulo, children})` — `<section aria-labelledby>` com rótulo mono `01`…`05` e grade 3/9.
- [ ] **Passo 2:** `FonteLink({fonte})` — link `target=_blank rel="noopener noreferrer"` com "(abre em nova aba)" em `sr-only`; sem URL vira texto.
- [ ] **Passo 3:** `CardCase({item})` — se `temPrint`, `<img src={caminhoPublico(import.meta.env.BASE_URL, 'prints/<slug>.png')} alt loading="lazy" width=1280 height=800>`; senão `<div role="img" aria-label="Espaço reservado…">` com "print em breve" e o caminho esperado em mono.
- [ ] **Passo 4:** `Sobre` (h1, chamada, oferta em `dl` 2 colunas, faixa de números com fonte), `Cases`, `ComoTrabalho` (`ol`), `Stack` (`table` com `th scope=row`), `Contato` (lista de links), `Cabecalho` (sticky, nav por âncora), `Rodape`.
- [ ] **Passo 5:** `App` com link "Pular para o conteúdo", `<main id="conteudo">`.
- [ ] **Passo 6:** `npm test && npm run build` → ambos passam. Commit `feat: página do portfólio`.

### Task 5: Deploy, README e verificação

**Arquivos:** `.github/workflows/deploy.yml`, `README.md`, `public/favicon.svg`, `public/prints/LEIA.md`.

- [ ] **Passo 1: workflow**
```yaml
name: Deploy no GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: false }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
        env: { BASE_PATH: "/${{ github.event.repository.name }}/" }
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
- [ ] **Passo 2:** README com: rodar local, onde pôr prints (`public/prints/<slug>.png`, 1280×800, depois `temPrint: true`), publicar (criar repo, Settings → Pages → Source: GitHub Actions, push em `main`), domínio próprio (`BASE_PATH=/`).
- [ ] **Passo 3:** `BASE_PATH=/portfolio-site/ npm run build` e conferir que `dist/index.html` referencia `/portfolio-site/assets/…`.
- [ ] **Passo 4:** `npm run preview` e conferir a 360 px e a 1280 px (sem rolagem horizontal, foco visível, placeholder no lugar do print).
- [ ] **Passo 5:** commit `chore: workflow do Pages e README`.
