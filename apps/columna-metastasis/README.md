# Generador de Informe Estructurado · Metástasis Vertebrales (SINS / ESCC-Bilsky)

Herramienta web, 100% en el navegador (sin backend ni almacenamiento de datos), para generar informes estructurados de metástasis vertebrales. Selección **point-and-click** del cuerpo vertebral afectado por cada lesión, cálculo automático de la **puntuación SINS** (Spinal Instability Neoplastic Score, Fisher et al. 2010) y clasificación de la **compresión epidural ESCC/Bilsky** (Bilsky et al. 2010), con un texto final listo para **copiar y pegar en el RIS**.

Esta app forma parte de un [portal de herramientas de radiología](../../README.md). Consulta el README de la raíz del repositorio para instrucciones de despliegue en GitHub Pages y la arquitectura general.

![Estado](https://img.shields.io/badge/estado-uso%20clínico%20de%20apoyo-blue)

---

## ¿Qué hace esta herramienta?

- Permite registrar **una o varias lesiones vertebrales**, cada una con su propio cuerpo vertebral (C1-C7, T1-T12, L1-L5, S1-S5).
- Al elegir el nivel, sugiere automáticamente la puntuación de **localización** de SINS (charnela / columna móvil / semirrígida / rígida), editable si el caso lo requiere.
- Formulario point-and-click de los 6 componentes de **SINS** (localización, dolor, tipo de lesión ósea, alineación radiográfica, colapso vertebral, afectación posterolateral), con cálculo automático de la puntuación (0-18) y su categoría (estable / indeterminada / inestable).
- Formulario point-and-click del grado **ESCC/Bilsky** (0 a 3) por lesión, con aviso automático cuando el nivel corresponde a cola de caballo (por debajo del cono medular).
- Resumen global con la puntuación SINS más alta y los niveles con compresión medular relevante (ESCC 1c-3).
- Campos libres para indicación clínica, comparación con estudio previo y otros hallazgos.
- Vista previa del informe completo, ordenado craneocaudalmente, y **botón de copiar al portapapeles**.
- Todo el procesamiento ocurre en el propio navegador; no se envían ni almacenan datos de pacientes en ningún servidor.

## Estructura de esta app

```
apps/columna-metastasis/
├── index.html            # Estructura de la página
├── css/style.css         # Estilos propios de la interfaz
├── js/app.js             # Niveles, SINS, ESCC/Bilsky, renderizado y generación del informe
├── docs/
│   ├── GUIA_DE_USO.md    # Manual de uso paso a paso
│   └── CHANGELOG.md      # Historial de cambios de esta app
└── README.md             # Este archivo
```

## Documentación

- [Guía de uso](docs/GUIA_DE_USO.md)
- [Changelog de esta app](docs/CHANGELOG.md)

## Referencias

- Fisher CG, DiPaola CP, Ryken TC, et al. *A novel classification system for spinal instability in neoplastic disease: an evidence-based approach and expert consensus from the Spine Oncology Study Group*. Spine. 2010;35(22):E1221-9.
- Bilsky MH, Laufer I, Fourney DR, et al. *Reliability analysis of the epidural spinal cord compression scale*. J Neurosurg Spine. 2010;13(3):324-8.

## Aviso clínico

Esta herramienta **apoya la redacción del informe** aplicando de forma consistente los sistemas SINS y ESCC/Bilsky, pero **no sustituye el criterio del radiólogo** ni la valoración clínica multidisciplinar. La puntuación SINS no determina por sí sola la necesidad de cirugía: las puntuaciones ≥7 deben motivar valoración por cirugía de columna, y los grados ESCC 1c-3 deben correlacionarse con oncología radioterápica y/o neurocirugía. Revise siempre el texto generado antes de insertarlo en el RIS.
