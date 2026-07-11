# Generador de Informe Estructurado · ACR TI-RADS

Herramienta web, 100% en el navegador (sin backend ni almacenamiento de datos), para generar informes estructurados de ecografía tiroidea siguiendo el sistema **ACR TI-RADS (2017)**. Está pensada para el flujo de trabajo diario de un radiólogo: selección **point-and-click** de cada categoría, cálculo automático de la puntuación y la categoría TR, y un texto final listo para **copiar y pegar en el RIS**.

**[➡ Abrir la aplicación](https://andresve19.github.io/)** *(sustituye este enlace una vez publicada en GitHub Pages)*

![Estado](https://img.shields.io/badge/estado-uso%20clínico%20de%20apoyo-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-lightgrey)

---

## ¿Qué hace esta herramienta?

- Evaluación global del tiroides (tamaño, ecoestructura, nódulos totales) o marcado directo de **"tiroides sin nódulos"**.
- Hasta **4 nódulos** por informe, cada uno con:
  - Localización (lado y tercio)
  - Tamaño (diámetro máximo y otras dos dimensiones)
  - Composición, ecogenicidad, forma, márgenes y focos ecogénicos, con la puntuación ACR TI-RADS visible en cada opción
  - Comparación con estudios previos (estable / nuevo / aumentado / disminuido / sin estudio previo)
- Cálculo automático, en tiempo real, de:
  - Puntuación total y categoría TR1–TR5
  - Recomendación de PAAF o seguimiento según tamaño y categoría
- Vista previa del informe completo (técnica, hallazgos e impresión diagnóstica) y **botón de copiar al portapapeles**.
- Todo el procesamiento ocurre en el propio navegador; no se envían ni almacenan datos de pacientes en ningún servidor.

## Estructura del proyecto

```
.
├── index.html          # Estructura de la página
├── css/
│   └── style.css       # Estilos de la interfaz
├── js/
│   └── app.js           # Lógica de la aplicación (cálculo TI-RADS y generación del informe)
├── docs/
│   ├── GUIA_DE_USO.md         # Manual de uso paso a paso
│   ├── METODOLOGIA_TIRADS.md  # Referencia de la puntuación y las recomendaciones ACR TI-RADS
│   └── CHANGELOG.md           # Historial de cambios
└── README.md
"""

## Aviso clínico

Esta herramienta **apoya la redacción del informe** aplicando de forma consistente los criterios ACR TI-RADS, pero **no sustituye el criterio del radiólogo**. Antes de insertar el texto en el RIS, revisa siempre que los hallazgos descritos y la recomendación se correspondan con la exploración realizada.

## Contribuir

Las mejoras, correcciones o sugerencias son bienvenidas mediante *issues* o *pull requests*. Consulta `docs/CHANGELOG.md` para el historial de versiones.

