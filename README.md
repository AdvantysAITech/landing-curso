# Curso oficial de IA · Landing (ccandorra.advantys.ai)

Web estática (HTML, CSS y JS sin dependencias). Ábrela con Live Server en VS Code o sube la carpeta a Vercel tal cual.

## Archivos
- `index.html` · estructura de la página
- `assets/js/i18n.js` · **todos los textos** en castellano (`es`) y catalán (`ca`), temario y preguntas frecuentes incluidos
- `assets/js/main.js` · idioma, temario, preguntas, animaciones y formulario (arriba del todo, `CONFIG.endpoint`)
- `assets/css/styles.css` · estilos (colores de marca en `:root`)
- `assets/fonts/` · Poppins autoalojada · `assets/img/` · logos, favicon e iconos de herramientas
- `vercel.json` y `robots.txt` · la página no se indexa (es interna)

## Vídeo de presentación (portada)
- El vídeo está en YouTube: https://youtu.be/9ukXJ55jGDc
- Para cambiarlo, pon el ID del vídeo nuevo (lo que va después de `youtu.be/`) en `data-youtube-id` del bloque `data-player` de `index.html`.
- La imagen que se ve antes de darle al play es `assets/img/hero-poster.jpg` (1600 × 900 px).
- YouTube no se carga hasta que el visitante pulsa el play (modo de privacidad mejorada, `youtube-nocookie.com`). Está explicado en `cookies.html`.

## Imágenes
- `assets/img/alex-ruiz.jpg` · foto de Alex con fondo oscuro y luz de marca (1000 × 1250 px)
- `assets/img/hero-poster.jpg` · portada del vídeo
- `assets/img/og-image.jpg` · imagen para compartir en redes (1200 × 630 px)

## Pendiente de completar
| Qué | Dónde |
| --- | --- |
| URL del webhook de inscripciones | Vercel → Settings → Environment Variables → `INSCRIPCION_WEBHOOK_URL` |
| NRT de Advantys Ai | `aviso-legal.html` y `privacidad.html` |

El formulario envía a `/api/inscripcion` (archivo `api/inscripcion.js`), que reenvía los datos al webhook guardado en `INSCRIPCION_WEBHOOK_URL`. En local (Live Server) el envío se simula y se ve en la consola.

## Datos que envía el formulario (POST JSON)
`nombre, email, empresa, perfil, sector, idioma_curso, acepta_privacidad, acepta_novedades, idioma_web, origen, fecha`

## Idioma
Selector ES/CA en la cabecera. También por enlace: `?lang=ca`.

## Origen de la visita
Los enlaces con `?origen=libro` (QR del libro «Vende más y trabaja menos») marcan la inscripción con la etiqueta `origen-libro` y el origen `libro-vende-mas-y-trabaja-menos`. El origen se recuerda durante la sesión. Los orígenes admitidos están en `CONFIG.origenesPorEnlace` (`main.js`) y en `ORIGENES` (`api/inscripcion.js`); cualquier otro valor se ignora.
