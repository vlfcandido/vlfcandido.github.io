import { defineConfig } from 'vitest/config'

// Os testes rodam em Node, sem o runtime da Cloudflare: o Durable Object (src/do.ts) fica fora,
// e a lógica dele (src/controle.ts) é testada com um armazém em memória.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts', 'eval/**/*.test.ts'],
    // O eval contra a API real faz chamadas de rede; o simulado é instantâneo.
    testTimeout: 120_000,
  },
})
