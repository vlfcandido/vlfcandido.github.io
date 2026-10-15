# Revisão de detalhes, rodada 2 (15/10/2026)

Revisor separado. Base: `vite preview` em http://127.0.0.1:4174/ (build de 15/10 11:20, commit 25e4a7e).
Varredura: home, #/projetos, os 17 cases, /trabalhos/ e as 2 peças, em 1440x900, 1280x800 e 390x844, tema claro e escuro
(88 capturas), além do menu do celular, das paradas de rolagem no celular, dos 91 links (internos e externos, todos 200),
do og e do favicon. Ignorados: o HTTPS, o beacon do Cloudflare (`cloudflareinsights.com/cdn-cgi/rum` ERR_FAILED) e o 400
do Clarity, que acontecem por ser localhost.

## Nota: 8,0 / 10. NÃO SAI (régua ≥ 9)

### Orientação principal
- **Dor:** o pequeno negócio tem medo de pagar e receber outra coisa, e quer alguém sério. A home responde com a prova no
  topo (13 anos, Sicoob, Serasa), o protótipo antes de fechar, a garantia escrita e o "Me conte o que está travando o seu
  negócio". ✅
- **Detalhe que ninguém vê:** a marcação de caneta em volta do detalhe de cada trabalho e a tela do painel com o círculo
  no valor que espera conferência. Isso é único e aparece logo na primeira dobra. ✅
- **Único:** com outro nome, a página não serviria para outro dev. ✅

### Achados da rodada 1, conferidos
1. Título enganoso → "13 anos de software. Hoje no Sicoob, antes na Serasa Experian." no h1, no title, na description e
   no og. ✅
2. Projetos falando do site antigo como atual → o texto está corrigido ("Este site", "Design system do site anterior"),
   **mas o print do cartão "Este site" ainda é velho e mostra "20 projetos"** (ver B1). ⚠️
3. Tema antigo em #/projetos e nos cases → a página de projetos está limpa, mas o case do design system ainda descreve as
   cores com "carta náutica" e "isóbatas", e a capa da Roleta de corretores segue na tinta azul-petróleo do Maré (ver I4). ⚠️
4. As empresas da home são as mesmas de #/projetos (fonte única ONDE_TRABALHEI, 5 = 5). ✅
- A Vertigo aparece com logo, na home e na faixa. ✅
- A foto é um avatar redondo de 80 px CSS no PC e 96 px no celular, servido pelo srcset de 105 e 210 px, sem ampliar. ✅
- O exemplo de arquitetura não aparece na tela nem no bundle JS, **mas segue citado no código-fonte público de
  /trabalhos/** (ver B2). ⚠️

## BLOQUEIAM

**B1. "20 projetos" no print do cartão e do case "Este site" (o site diz 19).**
Onde: em `#/projetos`, no cartão "Este site", e em `public/prints/este-site.webp` (1600x1000). O print foi tirado quando
o Atelier Linha contava, e ainda traz a faixa antiga "Exemplo de Vinicius Candido" na tela embutida.
Correção: recapturar `prints/este-site.webp` (e a versão escura, se houver) da home atual em 1440, com "19", e conferir os
números do print contra `numerosDeProva()`. Para não repetir: um teste que leia o número no nome do arquivo ou uma
captura gerada no build.

**B2. O exemplo de arquitetura está citado no HTML público de /trabalhos/.**
Onde: `public/trabalhos/index.html`, comentário das linhas 6 a 10, que vai para `dist/trabalhos/index.html`. Quem usa
"Exibir código-fonte" lê: *"o 3º exemplo (Atelier Linha) entrou e saiu no mesmo dia (regra do dono: projeto não fechado só
entra ~3 dias depois do envio, sem nome do cliente; volta em 18/10)"*. Isso expõe o nome do protótipo de um lead em
aberto e a regra de espera, o que fere a regra "coincidência, não algoritmo".
Correção: tirar o comentário do HTML publicado e levar o histórico para o git ou para `docs/`. O mesmo vale para os 6
comentários de `index.html` ("revisor de detalhes", "frase que enganava", os títulos antigos). Comentário de processo não
vai para arquivo servido.

## IMPORTANTES

**I1. "Participei… no time da Minu" e "…na Ecovita" dão a entender que ele trabalhou lá, e isso contradiz as "5 empresas".**
Onde: no case `#/projetos/minu` ("Projeto de que participei na Minu", "Participei do projeto no time da Minu") e no case
`#/projetos/ecovita` ("Projeto de que participei na Ecovita", "Participei do projeto no time da Ecovita"). A Minu é cliente
da Wiv (`clientes.ts`, grupo wiv).
Correção: usar o mesmo rótulo da Prefeitura e da Araguaia, "Cliente da Wiv", no cartão e no case, e o texto "Participei,
pela Wiv, do projeto da Minu, sem liderar." Para a Ecovita, confirmar com o dono de qual empresa ela era cliente (Wiv ou
Vertigo) e aplicar o mesmo padrão.

**I2. No celular, o subtítulo de "Onde já trabalhei" promete "o que fiz em cada uma", e só aparecem logos.**
Onde: na home em 390 px, onde o papel fica em `sr-only` abaixo de lg (`Empresas.tsx`, linha 29).
Correção: esconder o subtítulo abaixo de lg, ou trocá-lo no celular por "As empresas onde trabalhei", ou mostrar o papel
em 1 linha curta embaixo de cada logo.

**I3. A lista de termos proibidos e os testes vão crus para o site público.**
Onde: `RaioX.tsx`, com `import.meta.glob('/src/**/*.test.ts', { query: '?raw' })`, gera 22 chunks
`dist/assets/*.test-*.js` com o código-fonte inteiro. Ali dá para ler os termos privados da lista
(termos-proibidos.test.ts e conteudo.test.ts). O repositório já é público, mas a página destaca esses arquivos.
Correção: contar os `it(` na hora do build (um plugin do Vite ou um JSON gerado) e publicar só `{arquivo, total}`. A
lista de palavras sensíveis pode ficar em hash, ou fora do repositório. **Decisão do dono** (SIGILO).

**I4. Restos do tema Maré no case e na capa.**
Onde: no case `#/projetos/design-system-mare`, as descrições dos tokens no presente ("Fundo da página: o branco frio da
carta náutica…", "Terra da carta náutica…", "isóbatas do motivo", "número de sondagem") e o print "Maré". Na capa da
"Roleta de corretores" (`#/projetos`, "Outros projetos em empresas"), a ilustração isométrica azul-petróleo é da linguagem
do Maré.
Correção: no case, deixar uma linha de contexto ("tokens do site anterior, mantidos como estavam") antes da folha, ou
encurtar a folha para 6 cores sem o jargão náutico. Na Roleta, trocar a capa pelo cartão de logo neutro, como na Minu, ou
por uma capa na identidade nova.

**I5. O WhatsApp da peça Liga Várzea encolhe para 26x26 px no celular.**
Onde: em `/trabalhos/liga-varzea/` a 390 px, no `A.wa.recua` fixo em 356,744. Fica abaixo dos 44 px de alvo de toque.
Correção: manter pelo menos 44x44 no estado recuado (pode encolher o rótulo, não o alvo), ou esconder de vez enquanto
recua.

**I6. O WhatsApp flutuante da home cobre texto numa parada da rolagem no celular.**
Onde: na home a 390 px, na parada em y≈2302 ("Quem vai fazer o seu sistema"), onde o botão cobre "…escala d[e]".
Correção: dar `padding-bottom` de 72 px à seção de baixo no celular, ou recolher o botão quando ele cruzar um bloco de
texto.

## POLIMENTO

1. **Buraco na coluna esquerda da home (1440 e 1280, nos dois temas):** "Veja o seu sistema…" começa ~180 px abaixo de
   "Onde já trabalhei", à direita. Alinhar pelo topo (`align-self: start`) ou subir o bloco.
2. **Sicoob repetido:** no case, "Assistente de IA em uso pelas equipes das cooperativas." e logo abaixo "Situação: Em uso
   pelas equipes das cooperativas, segundo a matéria."; mais adiante, "Quem usa: as equipes das cooperativas" duas vezes.
   Trocar a Situação por "Situação: em uso, segundo a MobileTime (17/07/2026)."
3. **CTA de #/projetos:** "Conte o que você precisa." e logo abaixo "…conte o que você precisa." Usar a mesma frase da
   home ("Me conte o que está travando o seu negócio.") e encurtar o texto de baixo.
4. **Links duplicados em #/projetos:** a linha "LinkedIn · 99Freelas · GitHub" vem logo antes do rodapé, que repete
   LinkedIn e GitHub. Levar o 99Freelas para o rodapé e tirar a linha.
5. **"Exemplos navegáveis" em #/projetos:** 2 cartões numa grade de 3 deixam a 3ª coluna vazia. Usar 2 colunas nessa
   faixa, como em /trabalhos/.
6. **Cartões de empresa com logo pequeno num quadro vazio** (Contabilizei, Prefeitura, Wiv, Araguaia, Minu): parecem
   capa que não carregou, sobretudo no escuro. Aumentar o logo para ~50% da largura ou usar um fundo de marca suave.
7. **O logo da Serasa é menor e mais claro que os outros** na faixa e na home. Ajustar a altura óptica (≈ +25%) ou trocar
   por SVG.
8. **Grifo amarelo no tema escuro** (h1, destaques, assinatura) fica oliva e sem brilho. Usar uma opacidade/cor própria
   para o escuro (amarelo a ~45% com texto claro, ou sublinhado grosso).
9. **Logos da home no celular:** a grade 3+2 deixa a Contabilizei sozinha à direita, com um vão grande. Usar uma grade
   de 2 colunas centralizada, ou 3+2 centrada.
10. **/trabalhos/:** o fio acima da nota final vai de x=78 a 1322 e passa da coluna do conteúdo (109–1291). Alinhar.
11. **O círculo de caneta em "antes de fechar."** corta a parte de baixo de "funcionando" (PC e celular) e, a 390 px, chega
    a 4 px da borda da tela. Baixar ~4 px e reduzir o raio horizontal.
12. **og.jpg:** a moldura da tela sai cortada na borda direita. Pôr margem dos dois lados.
13. **Serasa:** pelo perfil, o trabalho foi pela NTT DATA. "Onde já trabalhei: Serasa Experian, Engenheiro de IA sênior"
    está alinhado com o pedido do dono de nomear a Serasa. Fica o registro do risco, caso um recrutador compare com o
    LinkedIn. **Decisão do dono**, sem mudança obrigatória.

## Conferido e ok
Números (13 · 5 · 19) iguais na home, no og, no title e nos chips (Todos 19 = 17 + 2 peças), exceto no print de B1.
Vertigo "mais de 80 chatbots" e "parceira Blip", Sicoob atual e Contabilizei "2025 a mar/2026" batem com o perfil. Sem
rolagem lateral em nenhuma rota/largura (os carrosséis têm rolagem interna). Menu do celular com 5 itens de 44 px, e
"Projetos" leva a #/projetos no topo. O encaixe da rolagem no celular para em seções inteiras. Favicon, apple-touch-icon,
theme-color, canonical e og completos nas 4 páginas estáticas e na home. Linha de medição anônima no rodapé. Nenhum
travessão nem "faz sentido" no texto visível. Todos os links externos respondem 200.
