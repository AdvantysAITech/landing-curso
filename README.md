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
- El vídeo es un MP4 en 1080p preparado para web (se reproduce mientras se descarga). Su enlace está en `data-video-src` del bloque `data-player` de `index.html`.
- Para cambiarlo, sube el MP4 nuevo, copia su enlace y ponlo en `data-video-src`. Actualiza la duración en `hero.duration` (`i18n.js`).
- La portada antes de darle al play es un fotograma del vídeo, `assets/img/hero-poster-mirada.jpg` (1600 × 900 px), oscurecido y con la frase de `player.hook` (`i18n.js`).
- El vídeo no se descarga hasta que el visitante pulsa el play. No se puede pausar ni mover; solo hay sonido y pantalla completa.

## Imágenes
- `assets/img/alex-ruiz.jpg` · foto de Alex con fondo oscuro y luz de marca (1000 × 1250 px)
- `assets/img/hero-poster-mirada.jpg` · fotograma del vídeo que sirve de portada
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
De momento la web y el curso solo están en castellano. El botón CA de la cabecera está atenuado y muestra «Pròximament en català»; `?lang=ca` también abre la web en castellano.
Para activar el catalán cuando esté listo: añade `"ca"` a `CONFIG.idiomasDisponibles` (`main.js`) y a `DISPONIBLES` (`legal.js`), quita `aria-disabled` y `data-soon` del botón CA (`index.html` y páginas legales), activa la opción Catalán del formulario y revisa los textos que dicen «pronto en catalán» en `i18n.js`.

## Origen de la visita
Los enlaces con `?origen=libro` (QR del libro «Vende más y trabaja menos») marcan la inscripción con la etiqueta `origen-libro` y el origen `libro-vende-mas-y-trabaja-menos`. El origen se recuerda durante la sesión. Los orígenes admitidos están en `CONFIG.origenesPorEnlace` (`main.js`) y en `ORIGENES` (`api/inscripcion.js`); cualquier otro valor se ignora.
