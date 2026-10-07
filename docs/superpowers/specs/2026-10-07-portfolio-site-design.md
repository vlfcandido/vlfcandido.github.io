# Spec — site de portfólio do Vinicius Candido (07/10/2026)

Classificação: **arquitetural** (projeto novo, sem código existente). Brainstorming feito sem
conversa com ele: as perguntas que eu faria estão registradas abaixo com a resposta
**decidida por default**. Ele revisa esta spec e o plano antes de qualquer mudança de rumo.

## 1. Entendimento (o que ele disse × o que eu assumi)

**Ele disse**
- Site de portfólio "pra gente", para vender o trabalho de freela (99Freelas e afora).
- Oferta: chatbots WhatsApp/IA, automações, sites, sistemas e integrações.
- Stack: Vite + React + TypeScript + Tailwind v4. Deploy estático em GitHub Pages, base configurável.
- Seções: quem sou/oferta · cases/projetos (com espaço para print) · como trabalho · stack · links.
- Design sem cara de IA: tipografia séria, paleta sóbria com 1 destaque, layout denso de engenheiro.
- Proibido: Sicoob, empregador atual, e-mail, telefone, qualquer dado pessoal além de nome, LinkedIn e GitHub.

**Eu assumi (decidido por default)**
- O público principal é o cliente pequeno/médio que chegou pelo 99 ou por indicação, não recrutador.
- Sucesso = o cliente entende em 30 segundos o que ele faz, vê prova pública e sabe como o trabalho funciona.

## 2. Perguntas que eu faria (e o default escolhido)

| # | pergunta | default | por quê |
|---|---|---|---|
| 1 | Público: cliente de freela ou recrutador? | **cliente de freela** — decidido por default | a oferta e o "como trabalho" são de venda de projeto |
| 2 | Idioma: só pt-BR ou PT+EN? | **só pt-BR** — decidido por default | YAGNI; EN entra depois se for usar em Upwork |
| 3 | Canal de contato sem e-mail/telefone? | **LinkedIn e GitHub** + texto "me chame no 99Freelas" — decidido por default | regra de privacidade; o 99 é onde ele fecha |
| 4 | Quais cases entram? | **públicos**: Vertigo/Blip (Franca, Araguaia), Waizer/Wiv; **próprios**: nexus-quant, nexus-clips, revisor-ia, AprovaOS, llm-local, credit-bureau, bet-scanner — decidido por default | prova pública primeiro; Sicoob fora |
| 5 | Números do currículo sem fonte pública (80+ chatbots, 1.500 contatos/dia)? | **fora do site** — decidido por default | site é público e permanente; só número com fonte ou do próprio código |
| 6 | Clientes da Vertigo/Wiv (logos)? | **fora** — decidido por default | regra "1 a 3 nomes onde fizer sentido" é para proposta; no site vira lista de logos que ele não fez |
| 7 | Tema escuro? | **segue o sistema** (prefers-color-scheme), sem botão — decidido por default | barato com tokens; botão é YAGNI |
| 8 | Domínio próprio? | **não agora** — GitHub Pages em `vlfcandido.github.io/<repo>` — decidido por default | base configurável deixa trocar depois |
| 9 | Analytics/formulário? | **nenhum** — decidido por default | sem backend, sem coleta de dado |
| 10 | Preço no site? | **não** — só "preço fechado na primeira mensagem" — decidido por default | preço depende do escopo |

## 3. Abordagens consideradas

1. **SPA de uma página, conteúdo em módulo TS tipado** (recomendada) — um arquivo `conteudo.ts` com
   todos os textos e cases, componentes burros por seção. Trocar texto não exige mexer em JSX; um
   teste varre o conteúdo atrás de termos proibidos.
2. Markdown/MDX por case — mais flexível, mas adiciona pipeline (MDX) para 7 cards. YAGNI.
3. HTML estático puro — mais leve, mas foge da stack pedida e perde o teste de conteúdo tipado.

## 4. Design

**Estrutura de página** (uma rota, âncoras):
`cabeçalho fixo (nome + nav)` → `#sobre` (quem sou + oferta em 4 linhas + faixa de números com fonte)
→ `#cases` (grade de cards) → `#como-trabalho` (4 passos) → `#stack` (tabela por camada) →
`#contato` (GitHub, LinkedIn, 99Freelas) → rodapé.

**Card de case**: figura 16:10 (print em `/public/prints/<slug>.png` ou placeholder neutro com o caminho
esperado escrito), rótulo de tipo (`case público` / `projeto próprio`), título, problema → o que foi feito,
métrica com fonte, stack em mono, link da fonte pública quando houver.

**Visual**: IBM Plex Sans (texto) + IBM Plex Mono (números, stack, rótulos) via Google Fonts. Fundo
papel `#f6f5f1`, tinta `#1a1c1e`, cinzas neutros, **um destaque verde-petróleo `#0b6b62`** (AA sobre o
fundo). Sem gradiente, sem sombra difusa, sem blob, sem emoji. Bordas finas de 1 px, grade de 12 colunas,
largura máx. ~72rem, densidade de documentação técnica.

**Unidades e interfaces**
- `src/conteudo.ts` — dados tipados (`Case`, `Passo`, `CamadaStack`, `Link`, `Numero`). Nenhuma lógica.
- `src/lib/assets.ts` — `caminhoPublico(base, relativo)`: junta a base do Vite com o caminho, sem barra dupla.
- `src/lib/termos-proibidos.ts` — `encontrarTermosProibidos(texto)`: devolve os termos vetados achados
  (Sicoob, Mirante, e-mail, telefone, pensão…). Usado por teste sobre todo o conteúdo serializado.
- `src/components/*` — uma seção por arquivo, recebem dados por props.
- `vite.config.ts` — `base` vem de `BASE_PATH` (default `/`).

**Erros**: print ausente não gera 404: o card só pede a imagem quando `temPrint: true`; senão mostra o
placeholder. Fonte do Google indisponível → pilha de fallback do sistema.

**Testes**: Vitest para `caminhoPublico` e `encontrarTermosProibidos` (TDD) e um teste de guarda que
roda o detector sobre `conteudo.ts` inteiro e exige zero achados, além de garantir que todo case tem
`alt` não vazio e slug válido. Verificação final: `npm test` + `npm run build`.

**Deploy**: `.github/workflows/deploy.yml` com `actions/configure-pages`, build com
`BASE_PATH=/${{ github.event.repository.name }}/`, `upload-pages-artifact` e `deploy-pages`.
Sem repositório remoto criado aqui; instruções no README.

## 5. Fora do escopo
Blog, formulário, analytics, EN, domínio próprio, CMS, prints reais (ele tira depois).
