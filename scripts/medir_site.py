#!/usr/bin/env python3
"""Medição de layout do site novo no Chromium real do Playwright.

Uso: ~/.local/share/patrimonio/pwenv/bin/python scripts/medir_site.py <url-base> [pasta-das-capturas]

Mede, em 390x844, 1280x800 e 1440x900 e nos temas claro e escuro: rolagem lateral, colisão com o
WhatsApp flutuante, alvos de toque, marcações animadas, gutter do h1, reduced-motion, orçamento de
rolagem, visibilidade do flutuante, CLS, quadros longos e rotas. Imprime uma linha por verificação
e termina com código 1 se houver qualquer falha. Nenhum efeito colateral na importação.
"""
from __future__ import annotations

import sys
from contextlib import contextmanager
from pathlib import Path

LARGURAS = {"390": (390, 844), "1280": (1280, 800), "1440": (1440, 900)}
TEMAS = ("light", "dark")
ORCAMENTO = {"390": 4220, "1280": 3200}  # altura máxima do documento (plano, check 7)

# Registra o CLS desde o início, antes de qualquer script da página.
INIT_CLS = """
window.__cls = 0;
try {
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
    .observe({ type: 'layout-shift', buffered: true });
} catch (e) {}
"""

JS_ALVOS = """() => [...document.querySelectorAll('a, button')].filter((el) => {
  const r = el.getBoundingClientRect(), s = getComputedStyle(el);
  return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; }).map((el) => {
  const r = el.getBoundingClientRect();
  return { t: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : '')
    + ':' + (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24), w: el.offsetWidth || r.width, h: el.offsetHeight || r.height }; })"""
# Nota: sem filtro de opacidade, para medir também o que ainda não foi revelado pela animação de entrada.

# Regra de colisão do check 2 (flutuante x alvos): há colisão quando o retângulo do flutuante intersecta
# (a) qualquer nó de TEXTO visível dentro de um a/button (Range.getClientRects nos text nodes) ou
# (b) mais de 15% da área do alvo. O canto de um cartão grande clicável, sem texto sob o botão, não conta.
# Exclusão: alvo com menos de 50% da largura dentro do viewport (e do contêiner que o recorta, como o carrossel)
# não está "ativo", é só a dica de rolagem do cartão que espia, e fica fora da colisão. Os excluídos são listados.
JS_POSICAO = """() => { const f = document.querySelector('[data-flutuante]'); if (!f) return null;
  const s = getComputedStyle(f), fr = f.getBoundingClientRect();
  const noVp = (r) => r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  const vis = (el) => { const e = getComputedStyle(el); return e.display !== 'none' && e.visibility !== 'hidden'; };
  const wa = [...document.querySelectorAll('a[href*="wa.me"]')].some((a) => !a.hasAttribute('data-flutuante') && vis(a) && noVp(a.getBoundingClientRect()));
  const ok = s.display !== 'none' && parseFloat(s.opacity) > 0.5;
  const inter = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  const area = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const textoSob = (el) => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) { if (!n.textContent.trim()) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      if ([...rg.getClientRects()].some((q) => q.width > 0 && q.height > 0 && noVp(q) && inter(q, fr))) return true; }
    return false; };
  const fracLargura = (el) => { const r = el.getBoundingClientRect(); let l = Math.max(r.left, 0), rr = Math.min(r.right, innerWidth);
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX; if (o === 'visible') continue;
      const c = p.getBoundingClientRect(); l = Math.max(l, c.left); rr = Math.min(rr, c.right); }
    return Math.max(0, rr - l) / r.width; };
  const bate = [], excluidos = [];
  if (ok) for (const el of document.querySelectorAll('a, button')) {
    if (el === f || !vis(el)) continue; const r = el.getBoundingClientRect();
    if (!noVp(r) || !inter(r, fr)) continue;
    if (!(area(r, fr) > 0.15 * r.width * r.height || textoSob(el))) continue;
    const nome = el.tagName.toLowerCase() + ':' + (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24);
    const fr2 = fracLargura(el);
    if (fr2 < 0.5) excluidos.push(nome + ' (' + Math.round(fr2 * 100) + '% visível)'); else bate.push(nome);
  }
  return { ok, wa, bate, excluidos }; }"""

JS_QUADROS = """() => new Promise((res) => {
  const alvo = document.documentElement.scrollHeight - innerHeight; let y = 0, ult = 0, max = 0, n = 0;
  const passo = (t) => { if (ult) { n++; if (n > 2) max = Math.max(max, t - ult); } ult = t; y += alvo / 180;
    window.scrollTo(0, y); if (y < alvo) requestAnimationFrame(passo); else res(max); };
  requestAnimationFrame(passo); })"""

TERCEIROS = ("cloudflareinsights.com", "clarity.ms")


def erro_proprio(msg) -> bool:
    """Diz se a mensagem de console é um erro do próprio site (ignora só a telemetria do Cloudflare e do Clarity, pelo host)."""
    if msg.type != "error":
        return False
    url = (msg.location or {}).get("url", "") or ""
    # Erros de CORS/rede da telemetria vêm com a página como origem, então o host também é procurado no texto.
    return not any(t in url or t in msg.text for t in TERCEIROS)


def contexto(nav, nome_l: str, tema: str, **extra):
    """Cria um contexto na largura e no tema pedidos; o 390 é sempre celular com toque."""
    w, h = LARGURAS[nome_l]
    return nav.new_context(viewport={"width": w, "height": h}, color_scheme=tema, device_scale_factor=1,
                           is_mobile=(w < 768), has_touch=(w < 768), **extra)


def main() -> int:
    """Executa todas as verificações e devolve o código de saída (0 = tudo ✅)."""
    from playwright.sync_api import sync_playwright

    base = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173/").rstrip("/") + "/"
    pasta = Path(sys.argv[2] if len(sys.argv) > 2 else "capturas-medicao")
    pasta.mkdir(parents=True, exist_ok=True)
    falhas = 0

    def rel(ok: bool, nome: str, larg: str, tema: str, detalhe: str) -> None:
        nonlocal falhas
        falhas += 0 if ok else 1
        print(f"{'✅' if ok else '❌'} {nome} | {larg} | {tema} | {detalhe}", flush=True)

    @contextmanager
    def bloco(nome: str, larg: str, tema: str):
        """Executa um bloco de medição; se levantar exceção, reporta ❌ em vez de derrubar o script."""
        try:
            yield
        except Exception as exc:  # noqa: BLE001 - qualquer falha de medição vira ❌ legível
            rel(False, nome, larg, tema, f"erro na medição: {type(exc).__name__}: {str(exc).splitlines()[0][:160]}")

    with sync_playwright() as p:
        nav = p.chromium.launch()
        try:
            for nome_l, (w, h) in LARGURAS.items():
                cel = nome_l == "390"
                for tema in TEMAS:
                    medida = lambda nome, ok, det, l=nome_l, t=tema: rel(ok, nome, l, t, det)  # noqa: E731
                    ctx = contexto(nav, nome_l, tema)
                    ctx.add_init_script(INIT_CLS)
                    pg = ctx.new_page()
                    erros: list[str] = []
                    pg.on("console", lambda m, erros=erros: erros.append(m.text) if erro_proprio(m) else None)
                    pg.on("pageerror", lambda e, erros=erros: erros.append(str(e)))
                    with bloco("0 carregar a home", nome_l, tema):
                        pg.goto(base, wait_until="load")
                        pg.wait_for_timeout(3000)

                    with bloco("9 CLS na carga", nome_l, tema):
                        cls = pg.evaluate("window.__cls")
                        medida("9 CLS<=0.05 na carga", cls <= 0.05, f"CLS={cls:.4f}")

                    with bloco("1 rolagem lateral", nome_l, tema):
                        sw, iw = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
                        medida("1 sem rolagem lateral", sw <= iw, f"scrollWidth={sw} innerWidth={iw}")

                    with bloco("7 orçamento", nome_l, tema):
                        if nome_l in ORCAMENTO:
                            alt = pg.evaluate("document.documentElement.scrollHeight")
                            medida(f"7 altura<={ORCAMENTO[nome_l]}", alt <= ORCAMENTO[nome_l], f"scrollHeight={alt}")

                    with bloco("5 gutter", nome_l, tema):
                        if cel:
                            g = pg.evaluate("""() => { const h = document.querySelector('h1'); if (!h) return null;
                              const r = document.createRange(); r.selectNodeContents(h);
                              const rs = [...r.getClientRects()]; return Math.min(...rs.map(x => x.left), innerWidth - Math.max(...rs.map(x => x.right))); }""")
                            medida("5 gutter h1>=16", g is not None and g >= 16, f"menor margem={g}")

                    # Passada completa de rolagem (100 px, até maxScroll): checks 2 e 8 e revela as seções para o check 3.
                    with bloco("2/8 passada de rolagem", nome_l, tema):
                        if cel:
                            pg.evaluate("window.scrollTo(0,0)")
                            pg.wait_for_timeout(500)
                            vh = pg.evaluate("innerHeight")
                            maxs = pg.evaluate("document.documentElement.scrollHeight - innerHeight")
                            posicoes = list(range(0, maxs, 100)) + [maxs]
                            cont = alcance = proprio = 0
                            sem: list[int] = []
                            colisoes: list[str] = []
                            excluidos: list[str] = []
                            for y in posicoes:
                                pg.evaluate(f"window.scrollTo(0,{y})")
                                pg.wait_for_timeout(350)
                                r = pg.evaluate(JS_POSICAO)
                                if r is None:
                                    continue
                                cont += 1
                                proprio += 1 if r["ok"] else 0
                                if r["ok"] or r["wa"]:
                                    alcance += 1
                                else:
                                    sem.append(y)
                                colisoes += [f"y={y}:{b}" for b in r["bate"]]
                                excluidos += [f"y={y}:{b}" for b in r["excluidos"]]
                            medida("2 nada sob o flutuante (todas as posições em que ele aparece)", cont > 0 and proprio > 0 and not colisoes,
                                   f"{proprio} posições com flutuante, colisões={colisoes[:5]}")
                            print(f"ℹ️  2i alvos excluídos da colisão (<50% visíveis, cartão que espia) | 390 | {tema} | {excluidos or 'nenhum'}", flush=True)
                            medida("8 contato sempre ao alcance (flutuante OU link wa.me)", cont > 0 and alcance == cont,
                                   f"{alcance}/{cont} posições (viewport {vh}px); sem contato em y={sem[:8]}")
                            print(f"ℹ️  8i flutuante visível sozinho | 390 | {tema} | {proprio}/{cont} = {100 * proprio / max(cont, 1):.0f}%", flush=True)
                        else:
                            f = pg.evaluate(JS_POSICAO)
                            medida("2 flutuante oculto no desktop", f is None or not f["ok"], "n/a (display:none >=768)")

                    # 3. alvos de toque, depois de a página inteira ter sido percorrida (tudo revelado), sem filtro de opacidade.
                    with bloco("3 alvos de toque", nome_l, tema):
                        if cel:
                            els = pg.evaluate(JS_ALVOS)
                            pequenos = [f"{e['t']}({e['w']:.0f}x{e['h']:.0f})" for e in els if e["h"] < 43.5]
                            medida("3 alvos>=44px de altura", not pequenos, f"{len(els)} alvos, {len(pequenos)} abaixo: {pequenos[:6]}")

                    # 4. marcações de #trabalhos (no celular, cartões de um carrossel horizontal: cada uma desenha ao entrar na tela)
                    with bloco("4 marcações", nome_l, tema):
                        pg.evaluate("document.getElementById('trabalhos')?.scrollIntoView()")
                        alt_sec = pg.evaluate("document.getElementById('trabalhos')?.offsetHeight || 0")
                        for _ in range(int(alt_sec // (h * 0.4)) + 2):
                            pg.evaluate(f"window.scrollBy(0, {int(h * 0.4)})")
                            pg.wait_for_timeout(250)
                        pg.evaluate("document.getElementById('trabalhos')?.scrollIntoView({block:'center'})")
                        for _ in range(8):
                            pg.evaluate("""() => { const c = document.querySelector('#trabalhos .carrossel');
                              if (c) c.scrollBy({ left: c.clientWidth * 0.5, behavior: 'instant' }); }""")
                            pg.wait_for_timeout(400)
                        pg.wait_for_timeout(1200)
                        tot, ok_n = pg.evaluate("""() => { const m = [...document.querySelectorAll('#trabalhos .marcacao')];
                          return [m.length, m.filter(x => x.classList.contains('desenhada')).length]; }""")
                        medida("4 marcações desenhadas", tot > 0 and tot == ok_n, f"{ok_n}/{tot}")

                    with bloco("10 quadros", nome_l, tema):
                        if cel:
                            pg.evaluate("window.scrollTo(0,0)")
                            pg.wait_for_timeout(400)
                            mx = pg.evaluate(JS_QUADROS)
                            medida("10 quadro<=50ms", mx <= 50, f"maior quadro={mx:.1f}ms")

                    with bloco("9 CLS fim", nome_l, tema):
                        cls2 = pg.evaluate("window.__cls")
                        medida("9 CLS<=0.05 no fim da sessão de rolagem", cls2 <= 0.05, f"CLS={cls2:.4f}")

                    with bloco("captura", nome_l, tema):
                        pg.evaluate("window.scrollTo(0,0)")
                        pg.wait_for_timeout(500)
                        pg.screenshot(path=str(pasta / f"home-{nome_l}-{tema}.png"))
                        medida("0 sem erros de console na home", not erros, f"{erros[:3]}")
                    ctx.close()

                    # 6. reduced-motion
                    with bloco("6 reduced-motion", nome_l, tema):
                        ctx = contexto(nav, nome_l, tema, reduced_motion="reduce")
                        pg = ctx.new_page()
                        pg.goto(base, wait_until="load")
                        ds = pg.evaluate("""() => [...document.querySelectorAll('.marcacao-traco path')].map(p => getComputedStyle(p).strokeDashoffset)""")
                        medida("6 reduced-motion offset 0px", bool(ds) and all(d == "0px" for d in ds), f"{len(ds)} traços, valores={sorted(set(ds))}")
                        ctx.close()

                    # 11. rotas
                    for rota, alvo in (("#/projetos", "projetos"), ("#/projetos/aprovaos", "case aprovaos"), ("trabalhos/", "índice /trabalhos/")):
                        with bloco(f"11 rota {alvo}", nome_l, tema):
                            ctx = contexto(nav, nome_l, tema)
                            pg = ctx.new_page()
                            er: list[str] = []
                            pg.on("console", lambda m, er=er: er.append(m.text) if erro_proprio(m) else None)
                            pg.on("pageerror", lambda e, er=er: er.append(str(e)))
                            resp = pg.goto(base + rota, wait_until="load")
                            pg.wait_for_timeout(2500)
                            sw, iw = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
                            corpo = pg.evaluate("document.body.innerText.length")
                            ok = sw <= iw and not er and corpo > 100 and (resp is None or resp.status < 400)
                            medida(f"11 rota {alvo}", ok, f"scrollWidth={sw}/{iw} erros={er[:2]} texto={corpo}")
                            if cel and tema == "light" and "aprovaos" in rota:
                                pg.screenshot(path=str(pasta / "rota-case-390-light.png"))
                            ctx.close()
        finally:
            nav.close()
    print(f"\n{'TUDO ✅' if not falhas else f'{falhas} ❌'}")
    return 1 if falhas else 0


if __name__ == "__main__":
    sys.exit(main())
