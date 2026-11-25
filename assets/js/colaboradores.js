/*
  Entidades colaboradoras (asociaciones de empresarios, federaciones, gremios...).

  Cada entidad que firma el acuerdo de colaboración tiene su propia landing:
  la misma página del curso, con su logo y su nombre, en su propio subdominio
  (por ejemplo, nombre-asociacion.advantys.ai).

  Para dar de alta una entidad nueva:
    1. Sube su logo a assets/img/colaboradores/ (PNG o SVG, fondo transparente,
       unos 400 px de ancho). Usa el logo que nos haya enviado la entidad.
    2. Añade su ficha abajo, copiando la de "demo".
    3. En Vercel → Settings → Domains, añade el subdominio (ej. nombre-asociacion.advantys.ai)
       y crea en el DNS de advantys.ai un CNAME de ese subdominio a cname.vercel-dns.com.
    4. Mientras el subdominio no esté listo, la landing se puede ver con
       https://ccandorra.advantys.ai/?colaborador=CLAVE

  Campos:
    clave   → identificador corto, solo minúsculas, números y guiones (va en la etiqueta del CRM)
    nombre  → nombre completo de la entidad, tal como lo escriben ellos
    corto   → siglas o nombre corto (se usa en frases como «Gratis para socios de ...»)
    socios  → cómo llaman a sus miembros: "socios", "asociados", "empresas asociadas"...
    logo    → ruta del logo
    alto    → alto del logo en la franja de colaboradores, en px (36 por defecto)
    hosts   → subdominios que activan esta landing
    web     → web de la entidad (opcional, el logo enlaza ahí)
    activo  → false para desactivarla sin borrarla

  ccandorra.advantys.ai NO está en ninguna ficha: sigue siendo la landing general
  (es la URL impresa en el libro y no se cambia).

  Este archivo lo usan la web (main.js) y el envío de inscripciones (api/inscripcion.js).
*/
(function (root) {
  var COLABORADORES = {
    // Ficha de ejemplo para enseñar la landing. No tiene subdominio: solo se ve con ?colaborador=demo
    demo: {
      clave: "demo",
      nombre: "Asociación de Empresarios del Polígono Industrial Ejemplo",
      corto: "AEPI Ejemplo",
      socios: "socios",
      logo: "assets/img/colaboradores/demo.svg",
      alto: 40,
      hosts: [],
      web: "",
      activo: true
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = COLABORADORES;
  } else {
    root.COLABORADORES = COLABORADORES;
  }
})(typeof window !== "undefined" ? window : this);
