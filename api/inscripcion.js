/*
  Recibe la inscripción de la landing y la reenvía al Sistema Advantys.

  - La URL del webhook de entrada NO está en el código: se lee de la variable
    de entorno INSCRIPCION_WEBHOOK_URL (Vercel → Settings → Environment Variables).
  - Traduce los valores del formulario a los textos exactos de los desplegables
    del contacto (si no coinciden letra por letra, el sistema los descarta).
  - Valida los datos también aquí, por si alguien llama al endpoint sin pasar por la web.
*/

const PERFIL = {
  empresario: "Empresario o directivo",
  trabajador: "Trabajador por cuenta ajena",
  autonomo: "Autónomo"
};

const SECTOR = {
  comercio: "Comercio",
  hosteleria: "Hostelería y turismo",
  servicios: "Administración y servicios",
  logistica: "Logística y transporte",
  construccion: "Construcción e inmobiliaria",
  finanzas: "Banca y seguros",
  otro: "Otro"
};

const IDIOMA = { ca: "Catalán", es: "Castellano" };

// Mientras solo exista la versión en catalán, todas las inscripciones reciben ese curso
const CURSO_DISPONIBLE = "ca";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v, max) {
  return String(v == null ? "" : v).trim().slice(0, max || 200);
}

function splitName(full) {
  const parts = full.split(/\s+/).filter(Boolean);
  return {
    first: parts.shift() || "",
    last: parts.join(" ")
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const webhook = process.env.INSCRIPCION_WEBHOOK_URL;
  if (!webhook) {
    return res.status(500).json({ ok: false, error: "not_configured" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ ok: false, error: "bad_request" });
  }

  // Campo trampa: si viene relleno es un bot. Respondemos OK y no enviamos nada.
  if (clean(body.web)) {
    return res.status(200).json({ ok: true });
  }

  const nombre = clean(body.nombre, 120);
  const email = clean(body.email, 160).toLowerCase();
  const empresa = clean(body.empresa, 160);
  const perfil = PERFIL[clean(body.perfil)];
  const sector = SECTOR[clean(body.sector)];
  const idiomaElegido = IDIOMA[clean(body.idioma_curso)] ? clean(body.idioma_curso) : "ca";

  if (!nombre || !EMAIL_RE.test(email) || !perfil || !sector || body.acepta_privacidad !== true) {
    return res.status(422).json({ ok: false, error: "invalid" });
  }

  const name = splitName(nombre);
  const hoy = new Date().toISOString().slice(0, 10);
  const novedades = body.acepta_novedades === true;

  const tags = ["curso-ia-inscrito", "curso-ia-" + CURSO_DISPONIBLE, "origen-landing-curso"];
  if (novedades) tags.push("curso-ia-novedades");

  const payload = {
    first_name: name.first,
    last_name: name.last,
    full_name: nombre,
    email: email,
    company_name: empresa,
    perfil: perfil,
    sector: sector,
    idioma_curso: IDIOMA[CURSO_DISPONIBLE],
    idioma_elegido: IDIOMA[idiomaElegido],
    fecha_consentimiento: hoy,
    acepta_novedades: novedades ? "Sí" : "No",
    tags: tags.join(","),
    idioma_web: clean(body.idioma_web, 5),
    origen: "landing-curso-ia-ccandorra"
  };

  try {
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      console.error("Webhook respondió", r.status);
      return res.status(502).json({ ok: false, error: "upstream" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error enviando al webhook", err);
    return res.status(502).json({ ok: false, error: "upstream" });
  }
};
