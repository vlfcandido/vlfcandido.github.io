# portfolio-site

Portfólio de Vinicius Candido: site estático de uma página (Vite + React + TypeScript + Tailwind v4).

## Rodar local

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # testes (inclui a guarda de conteúdo)
npm run build      # gera dist/
npm run preview    # serve dist/ em http://localhost:4173
```

## Onde mexer

- **Texto, cases, números, stack e links:** só em `src/conteudo.ts`.
- **Prints:** `public/prints/<slug>.png` (veja `public/prints/LEIA.md`) e `temPrint: true` no case.
- **Cores e fontes:** `src/index.css` (tokens em `:root`, tema escuro automático).

O teste `src/conteudo.test.ts` barra o deploy se o conteúdo tiver termo proibido, e-mail,
telefone ou link sem https. A lista fica em `src/lib/termos-proibidos.ts`.

## Publicar no GitHub Pages

1. Criar o repositório no GitHub (ex.: `vlfcandido/portfolio-site`) e adicionar como remoto:
   `git remote add origin git@github.com:vlfcandido/portfolio-site.git`
2. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. `git push -u origin main`. O workflow `.github/workflows/deploy.yml` testa, gera e publica.
4. O site sai em `https://vlfcandido.github.io/<repo>/` (a base vem do nome do repo).

Repositório chamado `vlfcandido.github.io` ou domínio próprio: troque `BASE_PATH` no workflow para `/`.
Para testar a base de subpasta local: `BASE_PATH=/portfolio-site/ npm run build && npm run preview`.

## Documentos

- Spec: `docs/superpowers/specs/2026-10-07-portfolio-site-design.md`
- Plano: `docs/plano.md`
