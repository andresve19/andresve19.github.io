# Generador de Informe Estructurado · Doppler TSA

Herramienta web, 100% en el navegador (sin backend ni almacenamiento de datos), para generar informes estructurados de ecografía-Doppler de troncos supraaórticos (TSA). Selección **point-and-click** de cada hallazgo, clasificación automática del grado de estenosis de la arteria carótida interna (ACI) según tres criterios de consenso, anotación de placas sobre un esquema anatómico, y un texto final listo para **copiar y pegar en el RIS**.

Esta app forma parte de un [portal de herramientas de radiología](../../README.md). Consulta el README de la raíz del repositorio para instrucciones de despliegue en GitHub Pages y la arquitectura general.

![Estado](https://img.shields.io/badge/estado-uso%20clínico%20de%20apoyo-blue)

---

## ¿Qué hace esta herramienta?

- Formulario completo para **ambos ejes carotídeos** (ACC, ACI, ACE) y **ambas arterias vertebrales**: velocidades (PSV/VDF), grosor íntima-media, placas de ateroma (localización, morfología, ecogenicidad, grado por escala de grises), ensanchamiento espectral, casi-oclusión y oclusión.
- Clasificación automática, en tiempo real, del grado de estenosis de la ACI según **tres criterios de consenso**, mostrados en paralelo para comparar:
  - **SRU / Grant et al.** (Radiology 2003;229(2):340-6)
  - **Índice sonográfico NASCET**
  - **ASUM 2021** (Australasian Society for Ultrasound in Medicine)
- Interpretación automática del sentido de flujo en las arterias vertebrales (patrón normal, robo de la subclavia completo o incompleto).
- **Esquema anatómico interactivo**: dibuje directamente sobre la imagen para anotar la localización de las placas, con control de tamaño de trazo y botón para copiar la imagen anotada al portapapeles.
- Campos libres para otros hallazgos y limitaciones técnicas del estudio.
- Vista previa del informe completo y **botón de copiar al portapapeles**.
- Todo el procesamiento ocurre en el propio navegador; no se envían ni almacenan datos de pacientes en ningún servidor.

## Estructura de esta app

```
apps/doppler-tsa/
├── index.html                 # Estructura de la página
├── css/style.css              # Estilos propios de la interfaz
├── js/
│   ├── app.js                 # Orquestación: lectura del formulario y actualización de la UI
│   ├── classification.js      # Clasificación de estenosis (SRU/Grant, NASCET, ASUM) y flujo vertebral
│   ├── painter.js             # Lienzo de anotación de placas sobre el esquema
│   ├── report.js              # Construcción del texto final del informe
│   └── diagram-image.js       # Imagen base del esquema anatómico (embebida en base64)
├── docs/
│   ├── GUIA_DE_USO.md         # Manual de uso paso a paso
│   ├── METODOLOGIA_DOPPLER_TSA.md  # Referencia de los criterios de clasificación implementados
│   └── CHANGELOG.md           # Historial de cambios de esta app
└── README.md                  # Este archivo
```

## Documentación

- [Guía de uso](docs/GUIA_DE_USO.md)
- [Metodología de clasificación implementada](docs/METODOLOGIA_DOPPLER_TSA.md)
- [Changelog de esta app](docs/CHANGELOG.md)

## Aviso clínico

Esta herramienta **apoya la redacción del informe** aplicando de forma consistente criterios de consenso publicados, pero **no sustituye el criterio del radiólogo**. Las tres clasificaciones (SRU/Grant, NASCET, ASUM) pueden discrepar entre sí en casos límite; correlacione siempre con la imagen en modo B, el Doppler color y el contexto clínico antes de insertar el texto en el RIS.
