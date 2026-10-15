"""Gera public/og.jpg (1200x630) e public/apple-touch-icon.png (180x180) do site novo.

Uso (Chromium do Playwright do venv do projeto, nunca o Chrome do sistema):
    ~/.local/share/patrimonio/pwenv/bin/python scripts/gerar_og_site.py

Pré-requisito: `npm run build` já rodado (a captura da home vem de `vite preview` sobre `dist/`).
Nenhum efeito colateral ao importar: tudo roda dentro de `main()`.
"""
from __future__ import annotations

import subprocess
import time
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PORTA = 4399
URL = f"http://localhost:{PORTA}/"


def _esperar_servidor(timeout: float = 20.0) -> None:
    """Espera o `vite preview` responder, ou levanta TimeoutError.

    Args:
        timeout: segundos máximos de espera.
    """
    fim = time.time() + timeout
    while time.time() < fim:
        try:
            urllib.request.urlopen(URL, timeout=1).read(1)
            return
        except OSError:
            time.sleep(0.3)
    raise TimeoutError("vite preview não subiu")


def main() -> None:
    """Captura a home, monta a og.jpg e o apple-touch-icon e grava em public/."""
    from playwright.sync_api import sync_playwright

    servidor = subprocess.Popen(
        ["npx", "vite", "preview", "--port", str(PORTA), "--strictPort"],
        cwd=RAIZ, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    try:
        _esperar_servidor()
        captura = RAIZ / "scripts" / "_captura_home.png"
        pagina_og = RAIZ / "scripts" / "_og_site.html"
        with sync_playwright() as p:
            nav = p.chromium.launch()  # Chromium do Playwright; nunca channel="chrome"
            pg = nav.new_page(viewport={"width": 1200, "height": 760}, color_scheme="light", device_scale_factor=2)
            pg.goto(URL, wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(1500)
            pg.screenshot(path=str(captura))
            pg.close()

            html = (RAIZ / "scripts" / "og_site.html").read_text(encoding="utf-8")
            pagina_og.write_text(html.replace("__CAPTURA__", captura.as_uri()), encoding="utf-8")
            og = nav.new_page(viewport={"width": 1200, "height": 630})
            og.goto(pagina_og.as_uri(), wait_until="networkidle")
            og.evaluate("document.fonts.ready")
            og.wait_for_timeout(500)
            og.screenshot(path=str(RAIZ / "public" / "og.jpg"), type="jpeg", quality=85)
            og.close()

            icone = nav.new_page(viewport={"width": 180, "height": 180})
            svg = (RAIZ / "public" / "favicon.svg").read_text(encoding="utf-8")
            icone.set_content(
                f'<body style="margin:0;background:#f7f4ee"><div style="width:180px;height:180px">{svg}</div>'
                '<style>svg{width:180px;height:180px;display:block}</style></body>'
            )
            icone.screenshot(path=str(RAIZ / "public" / "apple-touch-icon.png"))
            nav.close()
        captura.unlink(missing_ok=True)
        pagina_og.unlink(missing_ok=True)
    finally:
        servidor.terminate()


if __name__ == "__main__":
    main()
