# Referências do redesenho (07/10/2026)

O que tirei de cada referência e o que fiz diferente. Nada foi copiado: a ideia é entender por que a
página funciona e resolver o mesmo problema para este assunto (engenheiro que entrega chatbots,
automações, sistemas e trading quantitativo para quem contrata pelo LinkedIn).

## Sites e portfólios

| referência | o que funciona | o que levei | o que fiz diferente |
|---|---|---|---|
| Awwwards, categoria Portfolio e Developer Award (Lama Lama, Pacôme Pertant, Bruno Simon) | uma ideia forte por página, tipografia grande usada como imagem | a abertura com tipo grande e uma única ideia | sem WebGL nem animação de entrada: quem contrata quer ver o produto em 5 segundos |
| SiteInspire, filtro "editorial" | serifada de texto bem composta, medidas curtas, muito branco | a serifada (Newsreader) para a narrativa dos casos, linhas abaixo de 70 caracteres | sem filetes de jornal nem colunas densas, que já viraram cara de página gerada |
| Linear | o produto real em tela cheia, com dados de verdade, ocupando o espaço todo | o print grande do produto real como prova principal de cada caso | casos alternam lado e tamanho, e cada produto tem a sua identidade (não um tema único) |
| Stripe (docs e páginas de produto) | diagramas desenhados à mão que explicam o fluxo de dinheiro | diagramas de arquitetura em SVG escritos à mão para os projetos com mais peças | traço de caneta, sem gradiente, cores do próprio site e versão escura |
| Raycast e Vercel | modo escuro tratado como tema de primeira classe, não inversão | tokens com par claro e escuro escolhidos um a um | escuro em azul-noite, não preto tingido |
| Land-book e Godly | ritmo: blocos de tamanhos diferentes, nada de grade de cards iguais | grade assimétrica de 12 colunas, 7+5 e 8+4 alternando | logos agrupadas por segmento com densidade controlada, sem "parede" cinza centralizada |

## Painéis e SaaS

- **Linear, Height e os painéis mais salvos no Mobbin e no Dribbble**: hierarquia por peso e espaço,
  não por caixas. Nos prints, o front real vem primeiro (nexus-clips, nexus-quant, bureau, AprovaOS);
  onde não há front, cada repositório ganhou identidade própria (terminal macOS, WhatsApp, painel de
  benchmark, console de API) para que os prints não pareçam saídos do mesmo molde.

## Perfis do GitHub

- **github.com/topics/awesome-github-profiles e listas "best GitHub profile README" (readmedesign.com,
  abhisheknaiidu/awesome-github-profile-readme)**: os melhores respondem em segundos "quem é, o que faz,
  em que nível". Os piores empilham badges e estatísticas.
- Levei: cabeçalho em SVG com versão clara e escura (`<picture>` com `prefers-color-scheme`), projetos
  com print pequeno e uma linha de por que importa.
- Deixei de fora: contadores, troféus, badges de linguagem, GIF de "digitando".

## Plano de design

**Cor** (claro / escuro)
- névoa `#EEF1F5` / `#0F1B2D` — fundo frio, longe do creme
- folha `#FFFFFF` / `#16263D` — superfícies de print e diagrama
- tinta `#13233F` / `#E6ECF5` — azul-marinho em vez de preto tingido
- cobalto `#2448C8` / `#8DA6FF` — links e a chamada do LinkedIn
- marca-texto `#FFD34D` / `#E9B949` — só para sublinhar números com fonte (como quem grifa um relatório)
- grafite `#56627A` / `#9AA7BD` — texto de apoio

**Tipo**: Bricolage Grotesque para títulos e interface (larga, com personalidade de oficina);
Newsreader para os textos dos casos (serifada de leitura, entrelinha 1,6). Sem monoespaçada decorativa.

**Layout**
```
┌ nome ─────────────────────────────── [Falar comigo no LinkedIn] GitHub ┐
│ CHAMADA EM TIPO GRANDE (7 col)      │  prints reais empilhados (5 col) │
│ resumo em serifada                  │  com deslocamento, não inclinados│
├─────────────────────────────────────┴───────────────────────────────────┤
│ onde trabalhei: logo + papel + link da história (linhas, não cards)     │
├─────────────────────────────────────────────────────────────────────────┤
│ caso A: print 8 col          │ texto 4 col                              │
│ texto 4 col │ diagrama SVG 8 col (caso B)                               │
├─────────────────────────────────────────────────────────────────────────┤
│ clientes por segmento (Vertigo | Wiv), logos em tons de tinta           │
│ notícias com capa em SVG própria   │ como trabalho: 4 passos reais      │
│ LinkedIn grande no fim                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```
Alinhamento à esquerda em tudo; nada centralizado além de rótulos de logo.

**Princípios**
1. O produto real é a imagem principal; ilustração só onde não há produto.
2. Um único gesto memorável: os prints empilhados na abertura.
3. Grifo amarelo só em número com fonte.
4. Sem eyebrow em caixa alta, sem "·" em metadados, sem "→" em links, sem fade-in por seção.
5. LinkedIn é a porta de entrada: no cabeçalho, no fim e num botão fixo no celular.

**Revisão contra o briefing**: a primeira versão do plano tinha fundo creme com serifada de título;
troquei por névoa fria e Bricolage nos títulos, deixando a serifada só no texto corrido. Também tinha
"números em cards" na abertura: virou uma frase com grifo, que lê como relatório e não como template.
