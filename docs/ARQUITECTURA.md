# Arquitectura del repositorio

Este repositorio es un **portal de herramientas** que aloja varias aplicaciones web independientes, cada una en su propia carpeta bajo `apps/`, más una landing page en la raíz que las lista y enlaza.

```
.
├── index.html                      # Landing page del portal (raíz del sitio)
├── assets/                         # Recursos compartidos por la landing y, opcionalmente, por las apps
│   ├── css/
│   │   ├── theme.css               # Tokens de diseño (colores, tipografía, radios) — fuente única de estilo
│   │   └── landing.css             # Estilos exclusivos de la landing page
│   └── js/
│       ├── apps-manifest.js        # Manifiesto: lista de apps publicadas (fuente única de verdad)
│       └── landing.js              # Lógica que renderiza las tarjetas a partir del manifiesto
├── apps/
│   └── <slug-de-la-app>/           # Una carpeta independiente por cada app
│       ├── index.html
│       ├── css/
│       ├── js/
│       ├── docs/
│       └── README.md
├── docs/                           # Documentación del repositorio (no de una app en concreto)
│   ├── ARQUITECTURA.md             # Este documento
│   └── COMO_ANADIR_UNA_APP.md      # Guía paso a paso para publicar una app nueva
└── README.md                       # README principal del portal
```

## Principios de diseño

1. **Cada app es autocontenida.** Su HTML/CSS/JS vive en su propia carpeta bajo `apps/` y funciona con rutas relativas dentro de esa carpeta. Esto permite desarrollar, versionar y — si algún día hace falta — extraer una app a su propio repositorio sin apenas fricción.
2. **La landing page no conoce el contenido de las apps.** Solo lee `assets/js/apps-manifest.js`. Añadir una app nueva no requiere tocar `index.html` ni `landing.js`.
3. **Cero backend, cero build.** Todo el portal (landing + apps) es HTML/CSS/JS estático servido tal cual por GitHub Pages. No hay paso de compilación, ni dependencias de terceros cargadas por CDN.
4. **Ningún dato de paciente sale del navegador.** Ni la landing ni las apps hacen llamadas de red con datos introducidos por el usuario. Cualquier app nueva debe mantener esta propiedad.
5. **`assets/css/theme.css` es opcional pero recomendado.** Las apps nuevas pueden importarlo para heredar la paleta de colores y tipografía del portal, o mantener su propio `:root` si necesitan una identidad visual distinta (como es el caso de `tiroides-tirads`, que conserva su propio set de variables por continuidad con versiones anteriores).

## Rutas en producción (GitHub Pages)

Con el repositorio publicado en la rama `main`, carpeta raíz:

| Página | URL |
|---|---|
| Landing page | `https://TU-USUARIO.github.io/TU-REPOSITORIO/` |
| App de tiroides (TI-RADS) | `https://TU-USUARIO.github.io/TU-REPOSITORIO/apps/tiroides-tirads/` |
| App de Doppler TSA | `https://TU-USUARIO.github.io/TU-REPOSITORIO/apps/doppler-tsa/` |

Cada app es también accesible de forma directa, sin pasar por la landing, por si quieres enlazarla o guardarla en favoritos de forma independiente.

## Por qué un manifiesto en JS y no `apps.json` + `fetch`

Se eligió un array de JavaScript (`apps-manifest.js`) en lugar de un `apps.json` cargado con `fetch()` para que la landing page funcione igual abierta directamente desde el disco (`file://`) que servida por HTTP — `fetch()` de un archivo local falla por CORS en la mayoría de navegadores, mientras que un `<script>` cargado como archivo no tiene esa restricción. Si en el futuro el portal crece y prefieres gestionar el manifiesto desde un backend o un CMS, sustituir esta pieza es un cambio localizado y no afecta a ninguna app.
