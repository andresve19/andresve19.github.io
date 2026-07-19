# Cómo añadir una app nueva al portal

Esta guía asume que quieres publicar una herramienta nueva (por ejemplo, un generador BI-RADS para mamografía) siguiendo el mismo patrón que `apps/tiroides-tirads/`.

## 1. Crea la carpeta de la app

Usa un `slug` corto, en minúsculas y con guiones:

```
apps/<slug-de-la-app>/
├── index.html
├── css/style.css
├── js/app.js
└── docs/
    ├── GUIA_DE_USO.md
    └── CHANGELOG.md
```

Puedes copiar la estructura de `apps/tiroides-tirads/` como punto de partida.

## 2. Mantén las rutas relativas dentro de la app

Dentro de `apps/<slug>/index.html`, referencia siempre tus propios `css/` y `js/` con rutas relativas (`css/style.css`, `js/app.js`), nunca con `/css/...` en absoluto — así la app funciona igual si algún día se mueve o se extrae a otro repositorio.

Si quieres heredar la paleta de colores del portal en vez de definir la tuya propia, importa el tema compartido desde tu `css/style.css`:

```css
@import url("../../../assets/css/theme.css");
```

## 3. Añade el enlace de vuelta al portal

En la cabecera de tu `index.html`, añade un enlace hacia la landing:

```html
<a href="../../index.html" class="breadcrumb">← Portal de herramientas</a>
```

## 4. Da de alta la app en el manifiesto

Edita `assets/js/apps-manifest.js` en la raíz del repositorio y añade un objeto nuevo al array `APPS_MANIFEST`:

```js
{
  slug: "mamografia-birads",
  title: "Informe Estructurado · Mamografía (BI-RADS)",
  description: "Generador point-and-click de informes de mamografía según BI-RADS.",
  path: "apps/mamografia-birads/index.html",
  status: "disponible",     // o "beta" / "proximamente"
  tags: ["Radiología", "Mama", "BI-RADS"]
}
```

No hace falta tocar `index.html` ni `landing.js`: la tarjeta aparecerá automáticamente en la landing page.

## 5. Documenta la app

Añade al menos:

- `apps/<slug>/README.md` — descripción breve y enlace a la documentación
- `apps/<slug>/docs/GUIA_DE_USO.md` — manual de uso
- `apps/<slug>/docs/CHANGELOG.md` — historial de versiones de esa app

## 6. Comprueba en local antes de publicar

```bash
python3 -m http.server 8000
# abre http://localhost:8000/          → landing page
# abre http://localhost:8000/apps/<slug>/  → tu app nueva
```

Verifica que la tarjeta aparece en la landing, que el enlace abre la app correctamente, y que el enlace "← Portal de herramientas" de vuelta funciona.

## 7. Publica

Haz commit y push a `main`. GitHub Pages actualizará el sitio automáticamente en uno o dos minutos; no requiere ninguna acción adicional en la configuración del repositorio.

## Checklist rápida

- [ ] Carpeta `apps/<slug>/` con `index.html`, `css/`, `js/` y `docs/`
- [ ] Rutas relativas dentro de la app (nada de rutas absolutas `/...`)
- [ ] Enlace "← Portal de herramientas" en la cabecera
- [ ] Entrada añadida en `assets/js/apps-manifest.js`
- [ ] README y changelog propios de la app
- [ ] Ningún dato de usuario/paciente sale del navegador (sin `fetch`/`XMLHttpRequest` con datos introducidos)
- [ ] Probado en local sirviendo por HTTP antes de publicar
