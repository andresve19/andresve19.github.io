# Guía de uso · Metástasis Vertebrales (SINS / ESCC-Bilsky)

## 1. Datos del estudio

Rellena, si procede, la **indicación clínica** y la **comparación con estudio previo**. Ambos campos son opcionales y de texto libre; aparecen al inicio del informe si se completan.

## 2. Registrar una lesión vertebral

Cada lesión se documenta en su propia tarjeta:

1. Elige el **cuerpo vertebral** afectado (agrupado por región: cervical, torácica, lumbar, sacra).
2. Al seleccionarlo, la **localización** de SINS se rellena automáticamente según la tabla original (charnela / columna móvil / semirrígida / rígida). Puedes cambiarla manualmente si el caso lo requiere.
3. Completa el resto de componentes de **SINS** y el **grado ESCC/Bilsky** para esa lesión.

Usa **"+ Añadir otra lesión vertebral"** para documentar más niveles afectados. Cada tarjeta puede eliminarse con **"✕ Eliminar lesión"** (se mantiene siempre al menos una).

## 3. Puntuación SINS (0-18)

| Componente | Opciones | Puntos |
|---|---|---|
| Localización | Charnela / Columna móvil / Semirrígida / Rígida | 3 / 2 / 1 / 0 |
| Dolor | Mecánico / Ocasional no mecánico / Asintomático | 3 / 1 / 0 |
| Tipo de lesión ósea | Lítica / Mixta / Blástica | 2 / 1 / 0 |
| Alineación radiográfica | Subluxación-traslación / Deformidad de novo / Normal | 4 / 2 / 0 |
| Colapso vertebral | >50% / <50% / Sin colapso con >50% afectado / Ninguna | 3 / 2 / 1 / 0 |
| Afectación posterolateral | Bilateral / Unilateral / Ninguna | 3 / 1 / 0 |

La puntuación total (0-18) se muestra en tiempo real en la banda superior de cada tarjeta, junto con su categoría: **estable** (0-6), **indeterminada/potencialmente inestable** (7-12) o **inestable** (13-18).

## 4. Grado ESCC/Bilsky

Escala de 0 a 3 que valora la compresión epidural del canal por la propia lesión:

| Grado | Significado |
|---|---|
| 0 | Tumor confinado al hueso |
| 1a | Impronta epidural, sin deformidad del saco tecal |
| 1b | Deformidad del saco tecal, sin contacto con la médula |
| 1c | Deformidad del saco tecal con contacto medular, sin compresión |
| 2 | Compresión medular, con LCR perimedular visible |
| 3 | Compresión medular, sin LCR perimedular visible |

Para niveles por debajo del cono medular (aproximadamente L2 y distales), la herramienta muestra un aviso indicando que la escala se aplica de forma descriptiva a la afectación del saco tecal y las raíces de la cola de caballo, ya que no existe médula espinal a ese nivel.

## 5. Resumen global e informe

El panel de resultados muestra en todo momento:

- El número de lesiones registradas y la puntuación SINS más alta con su categoría.
- Los niveles con compresión medular relevante (ESCC 1c-3).

La **vista previa del informe** ordena automáticamente las lesiones de craneal a caudal e incluye el detalle por nivel, el resumen global y una impresión diagnóstica con recomendaciones orientativas (valoración por cirugía de columna si SINS ≥7, valoración conjunta con oncología radioterápica/neurocirugía si hay compresión medular relevante).

## 6. Copiar el informe

Pulsa **"Copiar informe al portapapeles"** y pégalo directamente en el RIS.

## 7. Empezar un informe nuevo

El botón **"↺ Nuevo informe"** de la cabecera restablece todos los campos y lesiones a sus valores por defecto, tras confirmación.
