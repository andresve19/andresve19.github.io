# Metodología ACR TI-RADS implementada

Esta aplicación implementa el sistema **ACR TI-RADS (2017)** de estratificación de riesgo de nódulos tiroideos mediante ecografía. La puntuación se calcula sumando los puntos de cinco categorías; la suma total determina el nivel TR y, junto al tamaño del nódulo, la recomendación de PAAF o seguimiento.

## Categorías y puntuación

| Categoría | Opciones | Puntos |
|---|---|---|
| **Composición** | Quístico / casi completamente quístico | 0 |
| | Espongiforme | 0 |
| | Mixto quístico y sólido | 1 |
| | Sólido / casi completamente sólido | 2 |
| | No determinable | 2 |
| **Ecogenicidad** | Anecoico | 0 |
| | Hiperecoico o isoecoico | 1 |
| | Hipoecoico | 2 |
| | Muy hipoecoico | 3 |
| | No determinable | 1 |
| **Forma** | No más alto que ancho | 0 |
| | Más alto que ancho | 3 |
| **Márgenes** | Liso | 0 |
| | Mal definido | 0 |
| | Lobulado / irregular | 2 |
| | Extensión extratiroidea | 3 |
| | No determinable | 0 |
| **Focos ecogénicos** *(selección múltiple, se suman)* | Ninguno / cola de cometa grande | 0 |
| | Macrocalcificaciones | +1 |
| | Calcificaciones periféricas / en anillo | +2 |
| | Focos ecogénicos puntiformes (PEF) | +3 |

## Niveles TR y recomendación según tamaño

| Puntuación | Categoría | Umbral PAAF | Umbral seguimiento |
|---|---|---|---|
| 0 | **TR1** — Benigno | No aplica | No aplica |
| 2 | **TR2** — No sospechoso | No aplica | No aplica |
| 3 | **TR3** — Levemente sospechoso | ≥ 2.5 cm | ≥ 1.5 cm (control a 1, 3 y 5 años) |
| 4–6 | **TR4** — Moderadamente sospechoso | ≥ 1.5 cm | ≥ 1.0 cm (control a 1, 2, 3 y 5 años) |
| ≥7 | **TR5** — Altamente sospechoso | ≥ 1.0 cm | ≥ 0.5 cm (control anual durante 5 años) |

## Notas de implementación

- Los nódulos **espongiformes** ≥2 cm y los **mixtos quístico/sólido** ≥1.5 cm que no se describen individualmente pueden contabilizarse de forma agregada en la evaluación global (campos "no descritos abajo"), conforme a la práctica habitual de limitar el informe a un máximo de nódulos relevantes.
- El máximo de nódulos descritos individualmente en el informe es **4**, priorizando los de mayor puntuación.
- El campo de **comparación con estudios previos** es informativo y no participa en el cálculo de la puntuación TI-RADS.
- Cuando el diámetro máximo (D1) no se ha introducido, la aplicación no puede determinar el umbral de tamaño y lo indica explícitamente en la recomendación.

## Referencia

Tessler FN, Middleton WD, Grant EG, et al. *ACR Thyroid Imaging, Reporting and Data System (TI-RADS): White Paper of the ACR TI-RADS Committee*. J Am Coll Radiol. 2017.

> Esta tabla resume la lógica implementada en `js/app.js` (funciones `getMappingText` y `scoreNodule`). Ante cualquier duda, prevalece siempre el criterio clínico del radiólogo y el documento original del ACR.
