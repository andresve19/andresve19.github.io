# Generador de Informe Estructurado · TC Senos Paranasales (Lund-Mackay)

Herramienta web, 100% en el navegador (sin backend ni almacenamiento de datos), para generar informes estructurados de TC de senos paranasales. Selección **point-and-click** de cada seno y del complejo osteomeatal (CDM) por lado, cálculo automático del **score de Lund-Mackay** (0-24), registro opcional de variantes anatómicas de relevancia quirúrgica, y un texto final listo para **copiar y pegar en el RIS**.

Esta app forma parte de un [portal de herramientas de radiología](../../README.md). Consulta el README de la raíz del repositorio para instrucciones de despliegue en GitHub Pages y la arquitectura general.

![Estado](https://img.shields.io/badge/estado-uso%20clínico%20de%20apoyo-blue)

---

## ¿Qué hace esta herramienta?

- Formulario point-and-click para **ambos lados**: 5 senos (maxilar, etmoides anterior, etmoides posterior, esfenoidal, frontal) puntuados 0/1/2, y complejo osteomeatal puntuado 0/2.
- Cálculo automático, en tiempo real, del **subtotal por lado** (0-12) y de la **puntuación total de Lund-Mackay** (0-24).
- Registro opcional de **variantes anatómicas** relevantes para cirugía endoscópica nasosinusal (concha bullosa, celda de Haller, célula de Onodi, dehiscencia de la lámina papirácea, trayecto del canal óptico, arteria etmoidal anterior procidente, desviación septal).
- Campos libres para indicación clínica, comparación con estudio previo y otros hallazgos.
- Vista previa del informe completo y **botón de copiar al portapapeles**.
- Todo el procesamiento ocurre en el propio navegador; no se envían ni almacenan datos de pacientes en ningún servidor.

## Estructura de esta app

```
apps/lund-mackay/
├── index.html            # Estructura de la página
├── css/style.css         # Estilos propios de la interfaz
├── js/app.js             # Configuración del score, renderizado y generación del informe
├── docs/
│   ├── GUIA_DE_USO.md    # Manual de uso paso a paso
│   └── CHANGELOG.md      # Historial de cambios de esta app
└── README.md             # Este archivo
```

## Documentación

- [Guía de uso](docs/GUIA_DE_USO.md)
- [Changelog de esta app](docs/CHANGELOG.md)

## Referencia

Lund VJ, Mackay IS. *Staging in rhinosinusitis*. Rhinology. 1993;31(4):183-4.

## Aviso clínico

Esta herramienta **apoya la redacción del informe** aplicando de forma consistente el sistema de puntuación de Lund-Mackay, pero **no sustituye el criterio del radiólogo**. El score no tiene un punto de corte diagnóstico único validado universalmente: correlacione siempre con la clínica y, si procede, con la exploración endoscópica (score de Lund-Kennedy) antes de insertar el texto en el RIS.
