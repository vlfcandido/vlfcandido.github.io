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

JS_VISIVEIS = """() => {
  const vis = (el) => { const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0'; };
  return [...document.querySelectorAll('a, button')].filter(vis).map((el) => { const r = el.getBoundingClientRect();
    return { t: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '')
      + ':' + (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24),
      x: r.left, y: r.top, w: r.width, h: r.height, fl: el.hasAttribute('data-flutuante') }; });
}"""

JS_FLUTUANTE = """() => { const f = document.querySelector('[data-flutuante]'); if (!f) return null;
  const s = getComputedStyle(f); const q = document.getElementById('quem'); let noQuem = false;
  if (q) { const r = q.getBoundingClientRect(); noQuem = r.top < innerHeight && r.bottom > 0; }
  return { ok: s.display !== 'none' && parseFloat(s.opacity) > 0.5, noQuem }; }"""

JS_QUADROS = """() => new Promise((res) => {
  const alvo = document.documentElement.scrollHeight - innerHeight; let y = 0, ult = 0, max = 0, n = 0;
  const passo = (t) => { if (ult) { n++; if (n > 2) max = Math.max(max, t - ult); } ult = t; y += alvo / 180;
    window.scrollTo(0, y); if (y < alvo) requestAnimationFrame(passo); else res(max); };
  requestAnimationFrame(passo); })"""


def erro_proprio(msg) -> bool:
    """Diz se a mensagem de console é um erro do próprio site (ignora telemetria de terceiros que recusa localhost)."""
    if msg.type != "error":
        return False
    terceiros = ("cloudflareinsights", "clarity.ms", "ERR_FAILED")
    return not any(t in msg.text or t in str(msg.location) for t in terceiros)


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

    with sync_playwright() as p:
        nav = p.chromium.launch()
        try:
            for nome_l, (w, h) in LARGURAS.items():
                for tema in TEMAS:
                    ctx = nav.new_context(viewport={"width": w, "height": h}, color_scheme=tema, device_scale_factor=1,
                                          has_touch=(w < 768), is_mobile=(w < 768))
                    ctx.add_init_script(INIT_CLS)
                    pg = ctx.new_page()
                    erros: list[str] = []
                    pg.on("console", lambda m: erros.append(m.text) if erro_proprio(m) else None)
                    pg.on("pageerror", lambda e: erros.append(str(e)))
                    pg.goto(base, wait_until="networkidle")
                    pg.wait_for_timeout(1200)
                    medida = lambda nome, ok, det: rel(ok, nome, nome_l, tema, det)  # noqa: E731

                    # 9. CLS na carga
                    cls = pg.evaluate("window.__cls")
                    medida("9 CLS<=0.05", cls <= 0.05, f"CLS={cls:.4f}")

                    # 1. rolagem lateral
                    sw, iw = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
                    medida("1 sem rolagem lateral", sw <= iw, f"scrollWidth={sw} innerWidth={iw}")

                    # 7. orçamento de rolagem
                    if nome_l in ORCAMENTO:
                        alt = pg.evaluate("document.documentElement.scrollHeight")
                        medida(f"7 altura<={ORCAMENTO[nome_l]}", alt <= ORCAMENTO[nome_l], f"scrollHeight={alt}")

                    # 5. gutter do h1 (390)
                    if nome_l == "390":
                        g = pg.evaluate("""() => { const h = document.querySelector('h1'); if (!h) return null;
                          const r = document.createRange(); r.selectNodeContents(h);
                          const rs = [...r.getClientRects()]; return Math.min(...rs.map(x => x.left), innerWidth - Math.max(...rs.map(x => x.right))); }""")
                        medida("5 gutter h1>=16", g is not None and g >= 16, f"menor margem={g}")

                    # 2 e 3. toque e flutuante (celular)
                    if nome_l == "390":
                        pg.evaluate("window.scrollTo(0, 600)")
                        pg.wait_for_timeout(700)
                    els = pg.evaluate(JS_VISIVEIS)
                    if nome_l == "390":
                        fl = [e for e in els if e["fl"]]
                        if fl:
                            f = fl[0]
                            bate = [e["t"] for e in els if not e["fl"] and e["x"] < f["x"] + f["w"] and e["x"] + e["w"] > f["x"]
                                    and e["y"] < f["y"] + f["h"] and e["y"] + e["h"] > f["y"]]
                            medida("2 nada sob o flutuante", not bate, f"colisões={bate[:5]}")
                        else:
                            medida("2 nada sob o flutuante", False, "flutuante não visível em y=600")
                        pequenos = [f"{e['t']}({e['w']:.0f}x{e['h']:.0f})" for e in els if e["h"] < 43.5]
                        medida("3 alvos>=44px de altura", not pequenos, f"{len(pequenos)} abaixo: {pequenos[:6]}")
                    else:
                        medida("2 flutuante oculto no desktop", pg.evaluate(JS_FLUTUANTE) in (None,) or not pg.evaluate(JS_FLUTUANTE)["ok"], "n/a (display:none >=768)")

                    # 4. marcações de #trabalhos
                    pg.evaluate("document.getElementById('trabalhos')?.scrollIntoView()")
                    alt_sec = pg.evaluate("document.getElementById('trabalhos')?.offsetHeight || 0")
                    for _ in range(int(alt_sec // (h * 0.4)) + 2):
                        pg.evaluate(f"window.scrollBy(0, {int(h * 0.4)})")
                        pg.wait_for_timeout(250)
                    # No celular as marcações ficam em cartões de um carrossel horizontal: cada uma desenha ao entrar na tela.
                    pg.evaluate("document.getElementById('trabalhos')?.scrollIntoView({block:'center'})")
                    for _ in range(8):
                        pg.evaluate("""() => { const c = document.querySelector('#trabalhos .carrossel');
                          if (c) c.scrollBy({ left: c.clientWidth * 0.5, behavior: 'instant' }); }""")
                        pg.wait_for_timeout(400)
                    pg.wait_for_timeout(1200)
                    tot, ok_n = pg.evaluate("""() => { const m = [...document.querySelectorAll('#trabalhos .marcacao')];
                      return [m.length, m.filter(x => x.classList.contains('desenhada')).length]; }""")
                    medida("4 marcações desenhadas", tot > 0 and tot == ok_n, f"{ok_n}/{tot}")

                    # 8 e 10. só no celular
                    if nome_l == "390":
                        pg.evaluate("window.scrollTo(0,0)")
                        pg.wait_for_timeout(500)
                        total = pg.evaluate("document.documentElement.scrollHeight")
                        cont = bons = 0
                        ruins: list[int] = []
                        for y in range(0, total - 844 + 1, 100):
                            pg.evaluate(f"window.scrollTo(0,{y})")
                            pg.wait_for_timeout(350)
                            r = pg.evaluate(JS_FLUTUANTE)
                            if r is None or r["noQuem"]:
                                continue
                            cont += 1
                            if r["ok"]:
                                bons += 1
                            else:
                                ruins.append(y)
                        pct = 100 * bons / cont if cont else 0
                        medida("8 flutuante visível>=90%", cont > 0 and pct >= 90, f"{bons}/{cont} = {pct:.0f}% (ocultos em y={ruins[:8]})")

                        pg.evaluate("window.scrollTo(0,0)")
                        pg.wait_for_timeout(400)
                        mx = pg.evaluate(JS_QUADROS)
                        medida("10 quadro<=50ms", mx <= 50, f"maior quadro={mx:.1f}ms")

                    # captura
                    pg.evaluate("window.scrollTo(0,0)")
                    pg.wait_for_timeout(500)
                    pg.screenshot(path=str(pasta / f"home-{nome_l}-{tema}.png"))
                    medida("0 sem erros de console na home", not erros, f"{erros[:3]}")
                    ctx.close()

                    # 6. reduced-motion (390 e demais, por tema)
                    ctx = nav.new_context(viewport={"width": w, "height": h}, color_scheme=tema, reduced_motion="reduce")
                    pg = ctx.new_page()
                    pg.goto(base, wait_until="load")
                    ds = pg.evaluate("""() => [...document.querySelectorAll('.marcacao-traco path')].map(p => getComputedStyle(p).strokeDashoffset)""")
                    medida("6 reduced-motion offset 0px", bool(ds) and all(d == "0px" for d in ds), f"{len(ds)} traços, valores={sorted(set(ds))}")
                    ctx.close()

                    # 11. rotas
                    for rota, alvo in (("#/projetos", "projetos"), ("#/projetos/aprovaos", "case aprovaos"), ("trabalhos/", "índice /trabalhos/")):
                        ctx = nav.new_context(viewport={"width": w, "height": h}, color_scheme=tema)
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
                        if nome_l == "390" and tema == "light" and "aprovaos" in rota:
                            pg.screenshot(path=str(pasta / "rota-case-390-light.png"))
                        ctx.close()
        finally:
            nav.close()
    print(f"\n{'TUDO ✅' if not falhas else f'{falhas} ❌'}")
    return 1 if falhas else 0


if __name__ == "__main__":
    sys.exit(main())
