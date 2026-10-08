# Diagnóstico de UX e plano "Sondagem" da página principal (08/10/2026)

Medido no Chromium do Playwright, site publicado: 10.777 px no celular (390 px, 12,8 telas de 844) e
6.843 px no PC (1440 px, 7,6 telas de 900).

## Diagnóstico

1. **O que cansa:** tudo está empilhado e aberto. Cada seção mostra a profundidade inteira de uma vez
   (ofertas com texto, fluxo do agente, 4 passos com miniatura cada, 12 logos com filtros, 3 cases,
   4 empregos, 5 matérias). Quem quer só a história rola 13 telas no celular.
2. **O que é redundante:** o fluxo do agente repete a conversa da abertura; as miniaturas do "Como
   funciona" aparecem passo a passo no celular; o convite ao LinkedIn aparece em quatro lugares; os
   filtros das logos ficam à vista para quem não vai filtrar; a abertura só mostra chatbot, e o site
   lê "chatbot" mesmo com a oferta ampla.
3. **Hierarquia certa (30 segundos):** oferta (abertura e o que eu resolvo), como funciona, provas
   (resultados, logos, interfaces), carreira (onde trabalho e imprensa), contato.

## Conceito: Sondagem

Profundidade é detalhe. A superfície (o que se vê sem clicar) é rasa e objetiva; cada item pode ser
sondado para descer um nível, e as isóbatas mostram o quanto se desceu. A divulgação progressiva é a
própria linguagem visual da carta náutica, não um accordion genérico.

**O gesto ousado (só um):** a carta das ofertas e a régua de profundidade.
- **Carta das ofertas:** as 6 ofertas são boias numa linha de costa com isóbatas. Sondar uma boia
  abre ali a cena dela (antes e depois) e leva a demonstração do topo para a cena que combina.
- **Régua de profundidade:** 0 m Abertura, 10 m O que eu resolvo, 20 m Como funciona, 30 m Provas,
  40 m Carreira. No PC, fixa na margem esquerda; no celular, a fileira fina sob o cabeçalho. Mostra
  onde a pessoa está e deixa saltar.
- **"Ver mais" vira "Descer":** abrir um bloco desenha uma isóbata até o conteúdo (uma transição só,
  desligada com movimento reduzido); "Subir" fecha.

Todo o resto fica quieto: sem cartões iguais com sombra, sem rótulo em caixa-alta, sem entrada
animada por seção.

## Tokens

| papel | token | claro | escuro |
|---|---|---|---|
| fundo da página | papel | #f2f5f3 | #0b1e25 |
| superfície | papel-alto | #ffffff | #112a33 |
| água rasa (seleção calma) | raso | #dcebec | #163843 |
| isóbata, borda | linha | #bccdce | #2c4b55 |
| tinta | fundo | #0f2a33 | #e3eeec |
| mar (ação) | mar | #0d5f73 | #6cc6d6 |
| boia e marca (acento único) | coral | #e8445f | #ff7a90 |

Tipografia: Brygada 1918 (serifada de guia de campo) nos títulos e na prosa; Hanken Grotesk na
interface. Escala: 2,05 / 1,75 / 1,25 / 1,05 rem no celular; 3,6 / 2,4 / 1,45 / 1,05 rem no PC.
Profundidades da régua em Brygada itálica, como as cotas das cartas.

## Wireframes

Celular (390):
```
[Nome            tema]
[0m Abertura|10m Ofertas|20m ...]  <- régua fina, rolável, marca a seção
Frase (4 linhas)
Apoio (3 linhas)
[Falar no LinkedIn]
Qual é o seu negócio? (chips)
[Venda no CRM|Painel|Atendimento]
[ janela da cena, 16rem ]
---- 10 m O que eu resolvo
(o)--(o)--(o)--(o)--(o)--(o)  <- boias numa régua deslizável
[ painel: título, antes / depois ]
---- 20 m Como funciona   [Passos|Agente]
(1)--(2)--(3)--(4)
[ painel do passo ]
---- 30 m Provas
logos numa faixa rolável; linha do que foi feito
cases: carrossel com pontos
interfaces: abas + 1 peça
---- 40 m Carreira
emprego atual  [Descer: carreira toda]
2 matérias     [Descer: mais matérias]
[ contato ]
```

PC (1440):
```
|0m |  Frase grande + apoio + CTA        | Demo (chips, abas, janela) |
|10m|  carta: costa + isóbatas + 6 boias (largura toda) | painel da boia |
|20m|  passos em linha (4)  +  painel do passo com miniatura         |
|30m|  logos em 2 linhas de 6 | cases em 3 colunas | interfaces: lista + peça |
|40m|  emprego atual + Descer            | imprensa: 2 + Descer       |
|   |  contato em uma faixa                                          |
```
Alinhamento: tudo à esquerda; só a régua e os números de passo são centrados nos seus marcos.

## Princípios

1. Superfície rasa: cada seção cabe numa tela e diz uma coisa.
2. Sondar é tocar, nunca passar o mouse: tudo que abre no hover também abre no toque e no teclado.
3. Profundidade tem cota: o que desce mostra que desceu (isóbata, régua).
4. Uma composição por tela, o mesmo HTML: o componente muda de forma no breakpoint.
5. Texto do corpo nunca abaixo de 16 px; foco visível em todo controle.

## Autocrítica: o que aqui é genérico e o que troquei

- **Grade de 6 cartões com ícone e sombra** (o kit SaaS) era o primeiro rascunho das ofertas no PC.
  Troquei pela carta com boias: as ofertas viram pontos de um mapa, que é a identidade, e o painel
  ao lado mostra uma de cada vez.
- **Chips de seção no topo** são navegação comum de app. Troquei por uma régua de profundidade com
  cotas (0 m a 40 m), que marca onde a pessoa está e tem a cara da carta náutica.
- **"Ver mais" com seta** é accordion de template. Virou "Descer" e "Subir", com a isóbata que se
  desenha uma vez.
- **Tooltip só no hover** das logos escondia a informação de quem usa celular. Virou a "linha de
  sondagem" embaixo da faixa, que aparece ao tocar, clicar ou focar.
- Mantido de propósito, porque é conteúdo e não enfeite: o carrossel dos cases com pontos (no
  celular é o padrão que a pessoa já sabe usar) e os chips do "Qual é o seu negócio?", aprovados.

## Resultado medido (08/10/2026, Chromium do Playwright, build de produção)

| largura | antes | depois |
|---|---|---|
| 390 (celular) | 10.777 px (12,8 telas) | 4.452 px (5,3 telas) |
| 360 (celular) | 11.025 px (13,1 telas) | 4.602 px (5,5 telas) |
| 1440 (PC) | 6.843 px (7,6 telas de 900) | 3.645 px (4,0 telas) |

Crítica com as capturas: no escuro, a terra da carta virava um bloco oliva (ficou mais rala); a aba
"Interfaces que eu construo" quebrava em duas linhas no celular (virou "Interfaces", com o nome
inteiro para o leitor de tela); a conversa da demonstração cortava a última mensagem (agora a
conversa cresce de baixo para cima, como num chat); a faixa de logos mostrava só três (agora quatro e
meia, para indicar que rola).
