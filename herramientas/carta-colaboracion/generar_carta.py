"""Genera la carta de colaboración en PDF para una asociación.

Uso:
  python3 generar_carta.py --nombre "Asociación ..." --corto "SIGLAS" --socios socios \
      --logo ruta/logo.png --fecha "1 de diciembre de 2026" --salida carta.pdf
"""
import argparse, asyncio, base64, html, mimetypes, os, pathlib
from playwright.async_api import async_playwright

AQUI = pathlib.Path(__file__).resolve().parent


def logo_html(ruta):
    if not ruta:
        return ""
    mime = mimetypes.guess_type(ruta)[0] or "image/png"
    datos = base64.b64encode(pathlib.Path(ruta).read_bytes()).decode()
    return f'<img src="data:{mime};base64,{datos}" alt="" style="height:44px">'


async def render(html_path, salida):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        pg = await b.new_page()
        await pg.goto(html_path.as_uri())
        await pg.wait_for_timeout(600)
        await pg.pdf(path=str(salida), format="A4", print_background=True,
                     margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
        await b.close()


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--nombre", required=True)
    a.add_argument("--corto", required=True)
    a.add_argument("--socios", default="socios")
    a.add_argument("--logo", default="")
    a.add_argument("--fecha", required=True)
    a.add_argument("--salida", required=True)
    o = a.parse_args()
    t = (AQUI / "plantilla.html").read_text(encoding="utf-8")
    for k, v in {"NOMBRE": o.nombre, "CORTO": o.corto, "SOCIOS": o.socios, "FECHA": o.fecha}.items():
        t = t.replace("{{" + k + "}}", html.escape(v))
    t = t.replace("{{LOGO_COLAB}}", logo_html(o.logo))
    tmp = AQUI / "_carta.html"
    tmp.write_text(t, encoding="utf-8")
    asyncio.run(render(tmp, pathlib.Path(o.salida).resolve()))
    os.remove(tmp)
    print("OK", o.salida)


if __name__ == "__main__":
    main()
