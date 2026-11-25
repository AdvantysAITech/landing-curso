# Carta de colaboración para asociaciones

Genera en PDF la carta de colaboración formativa con el diseño de las propuestas de Advantys (portada, logo oficial, Poppins).

    pip install playwright && playwright install chromium   # si no hay Chrome
    python3 generar_carta.py --nombre "Asociación de Empresarios de ..." --corto "SIGLAS" \
        --socios socios --logo ruta/logo-asociacion.png --fecha "1 de diciembre de 2026" \
        --salida "Carta de colaboracion - SIGLAS.pdf"

- `--socios`: cómo llama la asociación a sus miembros (socios, asociados, empresas asociadas).
- `--logo`: el logo que nos envíe la asociación (PNG o SVG). Sin él, la página 2 solo muestra el de Advantys.
- El script usa `/usr/bin/google-chrome`; cambia `executable_path` si Chrome está en otro sitio.

Esta carpeta no se publica en la web (ver `.vercelignore`).
