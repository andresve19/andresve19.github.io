/**
 * Manifiesto central de aplicaciones del portal.
 *
 * Para publicar una app nueva en la landing page, añade un objeto a este
 * array. No hace falta tocar landing.js ni index.html.
 *
 * Campos:
 *  - slug         identificador corto, sin espacios (usado como referencia interna)
 *  - title        nombre visible de la app
 *  - description  1-2 frases explicando qué hace
 *  - path         ruta relativa desde la raíz del repo hasta su index.html
 *  - status       "disponible" | "beta" | "proximamente"
 *  - tags         etiquetas cortas mostradas como chips (ej. especialidad, tipo)
 */
const APPS_MANIFEST = [
  {
    slug: "tiroides-tirads",
    title: "Informe Estructurado · Ecografía Tiroidea (ACR TI-RADS)",
    description:
      "Generador point-and-click de informes de ecografía tiroidea según ACR TI-RADS, con cálculo automático de categoría TR y recomendación, listo para copiar al RIS.",
    path: "apps/tiroides-tirads/index.html",
    status: "disponible",
    tags: ["Radiología", "Ecografía", "TI-RADS"]
  }

  // Ejemplo de próxima app (descomenta y adapta cuando la crees):
  // {
  //   slug: "mamografia-birads",
  //   title: "Informe Estructurado · Mamografía (BI-RADS)",
  //   description: "Generador de informes de mamografía siguiendo el sistema BI-RADS.",
  //   path: "apps/mamografia-birads/index.html",
  //   status: "proximamente",
  //   tags: ["Radiología", "Mama", "BI-RADS"]
  // }
];
