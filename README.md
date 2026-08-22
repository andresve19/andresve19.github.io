# Portal de Herramientas · Informes Estructurados de Radiología

Portal de aplicaciones web, 100% en el navegador (sin backend), para generar informes estructurados de radiología de forma **point-and-click**, listos para copiar y pegar en el RIS. Cada herramienta vive en su propia carpeta bajo `apps/` y aparece automáticamente en la landing page de la raíz.

**[➡ Abrir el portal](https://andresve19.github.io/)** *(sustituye este enlace una vez publicado en GitHub Pages)*

![Licencia](https://img.shields.io/badge/licencia-MIT-lightgrey)

---

## Herramientas disponibles

| Herramienta | Descripción | Enlace directo |
|---|---|---|
| Ecografía tiroidea (ACR TI-RADS) | Generador de informes con cálculo automático de categoría TR y recomendación de PAAF/seguimiento | [`apps/tiroides-tirads/`](apps/tiroides-tirads/) |
| Doppler de troncos supraaórticos (TSA) | Generador de informes con clasificación automática de estenosis de ACI (SRU/Grant 2003, NASCET y ASUM 2021) y anotación de placas sobre esquema | [`apps/doppler-tsa/`](apps/doppler-tsa/) |

*(Esta tabla es orientativa; la lista siempre actualizada se genera desde [`assets/js/apps-manifest.js`](assets/js/apps-manifest.js) y se muestra en la landing page.)*

## Estructura del repositorio

```
.
├── index.html                      # Landing page del portal
├── assets/
│   ├── css/
│   │   ├── theme.css               # Tokens de diseño compartidos (colores, tipografía)
│   │   └── landing.css             # Estilos de la landing page
│   └── js/
│       ├── apps-manifest.js        # Lista de apps publicadas — fuente única de verdad
│       └── landing.js              # Renderiza las tarjetas de apps a partir del manifiesto
├── apps/
│   ├── tiroides-tirads/             # Ecografía tiroidea (ACR TI-RADS)
│   │   ├── index.html
│   │   ├── css/style.css
│   │   ├── js/app.js
│   │   ├── docs/
│   │   └── README.md
│   └── doppler-tsa/                 # Doppler de troncos supraaórticos
│       ├── index.html
│       ├── css/style.css
│       ├── js/                      # app.js, classification.js, painter.js, report.js, diagram-image.js
│       ├── docs/
│       └── README.md
├── docs/
│   ├── ARQUITECTURA.md             # Cómo está organizado el repositorio y por qué
│   └── COMO_ANADIR_UNA_APP.md      # Guía paso a paso para publicar una app nueva
└── README.md                       # Este archivo
```

Consulta [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) para el detalle de cada pieza, y [`docs/COMO_ANADIR_UNA_APP.md`](docs/COMO_ANADIR_UNA_APP.md) cuando quieras publicar tu próxima herramienta.

## Publicar en GitHub Pages

1. Sube el contenido de este repositorio a la rama `main`.
2. En GitHub: **Settings → Pages**.
3. En **Build and deployment → Source**, elige **Deploy from a branch**.
4. En **Branch**, selecciona `main` y la carpeta `/ (root)`. Guarda.
5. En uno o dos minutos, el portal estará publicado en:
   - Landing: `https://TU-USUARIO.github.io/TU-REPOSITORIO/`
   - Cada app: `https://TU-USUARIO.github.io/TU-REPOSITORIO/apps/<slug>/`

No requiere ningún proceso de compilación: es HTML, CSS y JavaScript planos, servidos tal cual.

## Ejecutar en local

```bash
python3 -m http.server 8000
# Landing:  http://localhost:8000/
# Una app:  http://localhost:8000/apps/tiroides-tirads/
```

Se recomienda servir el proyecto por HTTP (en vez de abrir `index.html` con doble clic) para evitar restricciones de algunos navegadores con el protocolo `file://`.

## Añadir una app nueva

Resumen rápido (detalle completo en [`docs/COMO_ANADIR_UNA_APP.md`](docs/COMO_ANADIR_UNA_APP.md)):

1. Crea `apps/<slug>/` con tu `index.html`, `css/`, `js/` y `docs/`.
2. Añade un enlace "← Portal de herramientas" en la cabecera de tu app.
3. Da de alta la app en `assets/js/apps-manifest.js`.
4. Pruébala en local y haz push a `main`.

La landing page se actualiza sola: no hace falta tocar `index.html` ni `landing.js` de la raíz.

## Principios del portal

- **Sin backend, sin build.** HTML/CSS/JS estático, sin dependencias externas por CDN.
- **Ningún dato de paciente sale del navegador.** Ni la landing ni las apps hacen llamadas de red con datos introducidos por el usuario; todo el procesamiento es local.
- **Cada app es autocontenida** dentro de su carpeta, con rutas relativas, para poder desarrollarla, versionarla o extraerla de forma independiente.

## Aviso clínico

Las herramientas de este portal **apoyan la redacción de informes** aplicando de forma consistente los criterios de cada sistema de clasificación (TI-RADS, y los que se añadan en el futuro), pero **no sustituyen el criterio del profesional**. Revisa siempre el texto generado antes de insertarlo en el RIS.

## Contribuir

Mejoras, correcciones o nuevas apps son bienvenidas mediante *issues* o *pull requests*.

## Licencia

MIT. Consulta el archivo `LICENSE` si lo añades al repositorio.
