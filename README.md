# Curso oficial de IA · Landing (ccandorra.advantys.ai)

Web estática (HTML, CSS y JS sin dependencias). Ábrela con Live Server en VS Code o sube la carpeta a Vercel tal cual.

## Archivos
- `index.html` · estructura de la página
- `assets/js/i18n.js` · **todos los textos** en castellano (`es`) y catalán (`ca`), temario y preguntas frecuentes incluidos
- `assets/js/main.js` · idioma, temario, preguntas, animaciones y formulario (arriba del todo, `CONFIG.endpoint`)
- `assets/css/styles.css` · estilos (colores de marca en `:root`)
- `assets/fonts/` · Poppins autoalojada · `assets/img/` · logos, favicon e iconos de herramientas
- `vercel.json` y `robots.txt` · la página no se indexa (es interna)

## Pendiente de completar
| Qué | Dónde | Tamaño |
| --- | --- | --- |
| Fotograma del tráiler | `index.html`, comentario «HUECO» de la portada | 1600 × 900 px |
| Logo Cambra de Comerç | `index.html`, sección organizadores | SVG, 40 px de alto |
| Foto de Alex grabando | `index.html`, «Cómo funciona» | 1200 × 800 px |
| Foto de Alex | `index.html`, «Quién te acompaña» | 800 × 1000 px |
| Imagen para redes | `assets/img/og-image.jpg` | 1200 × 630 px |
| URL del webhook de inscripciones | Vercel → Settings → Environment Variables → `INSCRIPCION_WEBHOOK_URL` | · |
| Enlaces legales | pie de página y casilla de privacidad | · |

Cada hueco tiene un comentario en el HTML con la etiqueta `<img>` exacta que hay que pegar.
El formulario envía a `/api/inscripcion` (archivo `api/inscripcion.js`), que reenvía los datos al webhook guardado en `INSCRIPCION_WEBHOOK_URL`. En local (Live Server) el envío se simula y se ve en la consola.

## Datos que envía el formulario (POST JSON)
`nombre, email, empresa, perfil, sector, idioma_curso, acepta_privacidad, acepta_novedades, idioma_web, origen, fecha`

## Idioma
Selector ES/CA en la cabecera. También por enlace: `?lang=ca`.
