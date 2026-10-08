# Assistente do site: o Worker

O Worker é o servidor intermediário entre o widget do site e a API da Anthropic. Ele guarda a chave, confere o
Turnstile, aplica os limites (8 mensagens por conversa, 20 por IP por dia, 1 conversa por IP), soma o gasto em
reais contra o teto (R$ 3/dia e R$ 50/mês, por padrão), filtra a entrada e a saída e assina o histórico. Não
guarda conversa nenhuma, só contadores.

Hoje ele roda em **modo simulado**: respostas de exemplo, sem chave e sem custo. O widget fica **escondido no
site publicado** até você ligar tudo abaixo.

## Quanto custa (Claude Haiku 5.5, câmbio de R$ 5,50 por dólar)

| | R$ |
|---|---|
| uma mensagem | ~0,01 |
| uma conversa de 6 mensagens | ~0,05 |
| 50 conversas no mês | ~2,50 |
| teto do mês (para tudo e cai no roteiro fixo) | 50,00 |

O câmbio e os tetos ficam em `wrangler.toml` (`CAMBIO_BRL_POR_USD`, `TETO_DIA_BRL`, `TETO_MES_BRL`).

## Ligar a IA de verdade (uma vez, ~30 minutos)

Você vai precisar do computador uma vez (passos 4 a 6 usam o terminal). Os passos 1 a 3 dá para fazer pelo celular.

1. **Conta grátis na Cloudflare.** Entre em dash.cloudflare.com e crie a conta (plano Free). Workers, Durable
   Objects (SQLite) e Turnstile entram no plano gratuito; confira os limites atuais na página de preços da
   Cloudflare antes de ligar.

2. **Turnstile (o anti-robô).** No painel da Cloudflare: Turnstile → Add widget → nome `assistente-site`,
   domínio `vlfcandido.github.io`, modo **Managed**. Anote a **Site key** (pública) e a **Secret key** (secreta).

3. **Chave da Anthropic com limite de gasto.** Em platform.claude.com (Console):
   - crie um **workspace** só para o site, por exemplo `assistente-site` (nunca use a chave da esteira do 99);
   - nesse workspace, defina o **limite de gasto mensal** (o equivalente a R$ 50 em dólar, ~US$ 9). Confira na
     tela onde o limite fica hoje (Settings → Limits ou nas configurações do workspace). É o freio físico: mesmo
     se o Worker errar, a Anthropic para de cobrar ali;
   - crie uma **API key** dentro desse workspace e guarde num lugar seguro. Ela nunca vai para o repositório.

4. **No computador, dentro desta pasta:**
   ```bash
   cd worker
   npm install
   npx wrangler login                       # abre o navegador para entrar na Cloudflare
   ```

5. **Segredos** (cada comando pede o valor; nada fica em arquivo):
   ```bash
   npx wrangler secret put ANTHROPIC_API_KEY    # a chave do passo 3
   npx wrangler secret put TURNSTILE_SECRET     # a Secret key do passo 2
   openssl rand -hex 32                          # gera um valor aleatório; copie
   npx wrangler secret put CHAVE_ASSINATURA     # cole o valor gerado
   npx wrangler secret put METRICAS_TOKEN       # opcional: outro valor aleatório, para ver as métricas
   ```

6. **Modo real e deploy.** Em `wrangler.toml`, troque `MODO = "simulado"` por `MODO = "real"` e preencha
   `TURNSTILE_SITE_KEY` com a Site key do passo 2. Depois:
   ```bash
   npm test                 # 109 testes, incluindo o eval de 30 casos no simulado
   npm run eval:real        # opcional, com ANTHROPIC_API_KEY no terminal: os 30 casos na IA de verdade (centavos)
   npx wrangler deploy
   ```
   O deploy mostra o endereço, algo como `https://assistente-portfolio.<seu-subdominio>.workers.dev`.
   Confira: abrir `<endereço>/estado` no navegador deve responder `{"ok":false,"motivo":"origem"}` (só o site
   pode chamar). Isso é o esperado.

7. **Mostrar o widget no site.** No GitHub, repositório `vlfcandido.github.io` → Settings → Secrets and
   variables → Actions → aba **Variables** → New repository variable:
   - `VITE_ASSISTENTE` = `ligado`
   - `VITE_ASSISTENTE_URL` = o endereço do passo 6
   O próximo deploy do site (push na `main` ou "Run workflow") já sai com o botão "Monte o escopo".
   Para esconder de novo, apague `VITE_ASSISTENTE` e rode o deploy.

## Depois de ligado

- **Ver o gasto e as métricas do dia** (sem conteúdo de conversa):
  `curl -H "Authorization: Bearer <METRICAS_TOKEN>" <endereço>/metricas`
- **Trocar teto ou câmbio:** edite `wrangler.toml` e rode `npx wrangler deploy`. Pelo celular dá para trocar as
  variáveis no painel da Cloudflare (Workers → assistente-portfolio → Settings → Variables and Secrets).
- **Desligar a IA na hora:** troque `MODO` para `simulado` no painel e salve. O site continua com o roteiro fixo.
- **Antes de mudar o prompt** (`src/prompt.ts`): rode `npm test` e `npm run eval:real`.

## Rodar no computador (modo simulado)

```bash
cd worker && npx wrangler dev --port 8799 --var ORIGENS:http://localhost:5173
# em outro terminal, na raiz do site:
VITE_ASSISTENTE_URL=http://localhost:8799 npm run dev
```

## Onde está cada coisa

| arquivo | o que faz |
|---|---|
| `src/index.ts` | entrada do Worker: escolhe simulado ou Claude |
| `src/http.ts` | rotas, CORS, Origin, Turnstile |
| `src/nucleo.ts` | uma mensagem de ponta a ponta |
| `src/filtros.ts` | filtro de entrada e de saída (os invariantes do estudo) |
| `src/controle.ts` e `src/do.ts` | limites e orçamento em reais (Durable Object) |
| `src/prompt.ts` | prompt de sistema e esquema da resposta |
| `src/simulado.ts` | respostas de exemplo sem IA |
| `eval/` | os 30 casos e o eval |
| `../src/chatbot/` | o que o site e o Worker compartilham: base pública, escopo, roteiro fixo, protocolo |
