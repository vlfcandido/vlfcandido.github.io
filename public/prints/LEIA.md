# Prints dos projetos

Gerados na vitrine (`~/PycharmProjects/vitrine-portfolio/prints/*.png`, 2880×1800) e convertidos para
WebP com 1600 px de largura (`cwebp -q 82 -resize 1600 0`). O mapa de qual print vai em qual caso fica em
`src/visuais.ts`. Sem dado real de cliente, nome de pessoa, e-mail ou telefone na tela.

## Telas recriadas (08/10/2026)

As telas dos projetos próprios vêm de `vitrine-portfolio/prints-v2/` e são geradas por
`scripts/otimizar-imagens.sh` (AVIF e WebP em 960/1600 no desktop e 390/780 no celular; capas em `public/img/capa-*`).
Todas mostram dado fictício e levam o selo "dados fictícios". `este-site.webp` e `design-system-mare.webp` seguem como eram.
