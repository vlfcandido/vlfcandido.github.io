# Assistente do site: o Worker

O Worker é o servidor intermediário entre o widget do site e a API de IA (Groq por padrão; Anthropic como alternativa, `PROVEDOR`). Ele guarda a chave, confere o
Turnstile, aplica os limites (8 mensagens por conversa, 20 por IP por dia, 1 conversa por IP), soma o gasto em
reais contra o teto (R$ 3/dia e R$ 50/mês, por padrão), filtra a entrada e a saída e assina o histórico. Não
guarda conversa nenhuma, só contadores.

Hoje ele roda em **modo simulado**: respostas de exemplo, sem chave e sem custo. O widget fica **escondido no
site publicado** até você ligar tudo abaixo.

## Provedor e modelo

`PROVEDOR` em `wrangler.toml`: `groq` (padrão) ou `anthropic`. Tudo o mais (filtros, invariantes, rate limit, teto em
R$, fallback sem IA, formato JSON fixo) é igual nos dois.

**Groq: `openai/gpt-oss-120b`** (modelo de produção, conferido em console.groq.com/docs em 08/10/2026).
Por que ele: (1) está na lista de produção, os de preview "podem ser descontinuados em curto prazo";
(2) aceita `json_schema` com decodificação restrita; (3) a página do modelo declara bom desempenho em 81+ idiomas
(MMMLU 81,3%), o que cobre o pt-BR; (4) custa US$ 0,15 / 0,60 por milhão de tokens (entrada / saída; cache de
entrada US$ 0,075). Descartados: `llama-3.1-8b-instant` (pequeno demais para o escopo e a aderência),
`llama-3.3-70b-versatile` (só `json_object`, sem esquema) e `qwen/qwen3.8-27b` (preview, 5x mais caro).
Saída: pedimos `json_schema` em modo `strict: false` (o esquema usa `anyOf` com `null`, que o modo estrito não
garante); se o Groq responder HTTP 400, o adaptador tenta uma vez em `json_object` com o esquema no prompt, e o
núcleo valida o JSON de qualquer jeito. Qualquer falha (429, 5xx, JSON quebrado, corte) cai no roteiro fixo.

**Limite do plano gratuito (atenção).** A documentação pública de limites (console.groq.com/docs/rate-limits) mostra
para o `gpt-oss-120b` 30 req/min, 1 mil req/dia, 8 mil tokens/min e 200 mil tokens/dia, mas rotula a tabela como
limites base do plano Developer; os limites exatos do plano gratuito da sua conta aparecem em
console.groq.com/settings/limits. O prompt fixo tem ~16 mil caracteres (~5 mil tokens), então **8 mil tokens/min
comporta cerca de 1 mensagem por minuto**: serve para o eval e para visitas esparsas, mas o Worker devolve o roteiro
fixo quando o Groq responde 429. Se o site tiver mais movimento, passe a conta para o plano Developer (pago por uso,
limites maiores) e o teto em R$ do Worker continua valendo. Confira os dois números na tela antes de ligar.

## Quanto custa (GPT-OSS 120B no Groq, câmbio de R$ 5,50 por dólar)

| | R$ |
|---|---|
| uma mensagem (~6 mil tokens de entrada, ~600 de saída) | ~0,007 |
| uma conversa de 6 mensagens | ~0,04 |
| 50 conversas no mês | ~2,00 |
| teto do mês (para tudo e cai no roteiro fixo) | 50,00 |

Com `PROVEDOR=anthropic` (Claude Haiku 5.5) a conta é parecida: ~R$ 0,05 por conversa.
O câmbio e os tetos ficam em `wrangler.toml` (`CAMBIO_BRL_POR_USD`, `TETO_DIA_BRL`, `TETO_MES_BRL`). A reserva
por turno usa o pior caso (14 mil tokens de entrada e o teto de saída do provedor).

## Ligar a IA de verdade, passo a passo (Groq)

Os passos de 1 a 3 do bloco seguinte (Cloudflare e Turnstile) continuam valendo. Para a IA:

1. **Chave do Groq só para o site.** Em console.groq.com → API Keys → Create API Key, nome `site-assistente`.
   Copie a chave (aparece uma vez). Nunca use a chave de outro projeto.
2. **Guardar fora do repositório**, em `~/.config/patrimonio/groq.env`, uma linha:
   ```
   GROQ_API_KEY=gsk_...
   ```
   e `chmod 600 ~/.config/patrimonio/groq.env`.
3. **Rodar o eval de 30 casos na IA de verdade** (centavos; o relatório imprime o gasto, nunca a chave):
   ```bash
   cd worker && npm install && npm run eval:real
   ```
   O comando lê `GROQ_API_KEY` do ambiente ou do `groq.env`. Em 429 ele espera e tenta de novo (até 5 vezes), então no
   plano gratuito pode levar vários minutos. Invariantes têm de ficar em 100% e a qualidade em 80% ou mais.
   Para o Claude: `ASSISTENTE_EVAL_PROVEDOR=anthropic ANTHROPIC_API_KEY=... npm run eval:real`.
4. **Segredo no Worker e deploy** (feito por você): `npx wrangler secret put GROQ_API_KEY` (cole a chave), depois
   `MODO = "real"` em `wrangler.toml` e `npx wrangler deploy`.

## Ligar a IA de verdade (uma vez, ~30 minutos)

Você vai precisar do computador uma vez (passos 4 a 6 usam o terminal). Os passos 1 a 3 dá para fazer pelo celular.

1. **Conta grátis na Cloudflare.** Entre em dash.cloudflare.com e crie a conta (plano Free). Workers, Durable
   Objects (SQLite) e Turnstile entram no plano gratuito; confira os limites atuais na página de preços da
   Cloudflare antes de ligar.

2. **Turnstile (o anti-robô).** No painel da Cloudflare: Turnstile → Add widget → nome `assistente-site`,
   domínio `vlfcandido.github.io`, modo **Managed**. Anote a **Site key** (pública) e a **Secret key** (secreta).

3. **Só se for usar `PROVEDOR=anthropic`: chave da Anthropic com limite de gasto.** Em platform.claude.com (Console):
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
   npx wrangler secret put GROQ_API_KEY         # a chave do Groq (ou ANTHROPIC_API_KEY, com PROVEDOR=anthropic)
   npx wrangler secret put TURNSTILE_SECRET     # a Secret key do passo 2
   openssl rand -hex 32                          # gera um valor aleatório; copie
   npx wrangler secret put CHAVE_ASSINATURA     # cole o valor gerado
   npx wrangler secret put METRICAS_TOKEN       # opcional: outro valor aleatório, para ver as métricas
   ```

6. **Modo real e deploy.** Em `wrangler.toml`, troque `MODO = "simulado"` por `MODO = "real"` e preencha
   `TURNSTILE_SITE_KEY` com a Site key do passo 2. Depois:
   ```bash
   npm test                 # 123 testes nos dois provedores (mock), incluindo o eval de 30 casos no simulado
   npm run eval:real        # os 30 casos na IA de verdade, com a chave do groq.env (centavos)
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
| `src/index.ts` | entrada do Worker: escolhe simulado, Groq ou Claude |
| `src/http.ts` | rotas, CORS, Origin, Turnstile |
| `src/nucleo.ts` | uma mensagem de ponta a ponta |
| `src/filtros.ts` | filtro de entrada e de saída (os invariantes do estudo) |
| `src/controle.ts` e `src/do.ts` | limites e orçamento em reais (Durable Object) |
| `src/modelo.ts` | adaptadores `ModeloGroq` e `ModeloClaude` |
| `src/prompt.ts` | prompt de sistema e esquema da resposta |
| `src/simulado.ts` | respostas de exemplo sem IA |
| `eval/` | os 30 casos e o eval |
| `../src/chatbot/` | o que o site e o Worker compartilham: base pública, escopo, roteiro fixo, protocolo |
