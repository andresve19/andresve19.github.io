# Changelog del portal

Historial de cambios en la arquitectura general del repositorio. Los cambios propios de cada app se documentan en su propio `apps/<slug>/docs/CHANGELOG.md`.

## v2.1.0 — Añadida app Doppler TSA

- Nueva app **Doppler de troncos supraaórticos** en `apps/doppler-tsa/`: informe estructurado con clasificación automática de estenosis de ACI (SRU/Grant 2003, NASCET y ASUM 2021) y anotación de placas sobre esquema anatómico.
- Estética de la app homogeneizada con el resto del portal: paleta de colores compartida (`--primary`, `--accent`, `--ink`...), cabecera tipo *masthead* con degradado y enlace "← Portal de herramientas".
- Añadida entrada en `assets/js/apps-manifest.js`; la tarjeta aparece automáticamente en la landing.

## v2.0.0 — Portal multi-app

- Reestructuración completa del repositorio: de proyecto de una sola app a **portal de herramientas**.
- Nueva landing page en la raíz (`index.html`) que lista todas las apps disponibles.
- Añadido `assets/js/apps-manifest.js` como fuente única de verdad de qué apps existen; la landing se genera automáticamente a partir de este archivo.
- Añadido `assets/css/theme.css` con los tokens de diseño compartidos, disponibles para futuras apps.
- La app de ecografía tiroidea (ACR TI-RADS) se traslada a `apps/tiroides-tirads/`, sin cambios funcionales, y añade un enlace de vuelta al portal.
- Añadida documentación de arquitectura (`docs/ARQUITECTURA.md`) y una guía paso a paso para publicar nuevas apps (`docs/COMO_ANADIR_UNA_APP.md`).
- Añadido `.nojekyll` para servir el sitio sin el procesado Jekyll por defecto de GitHub Pages.

## v1.0.0

- Versión inicial de la app de ecografía tiroidea (ACR TI-RADS) como proyecto único, sin estructura de portal. Ver historial detallado en `apps/tiroides-tirads/docs/CHANGELOG.md`.
