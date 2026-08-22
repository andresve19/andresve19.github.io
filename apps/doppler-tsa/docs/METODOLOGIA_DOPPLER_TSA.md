# Metodología de clasificación implementada

Esta app calcula el grado de estenosis de la arteria carótida interna (ACI) según **tres criterios de consenso independientes**, mostrados en paralelo para que el radiólogo pueda compararlos. La lógica completa está en [`js/classification.js`](../js/classification.js).

## 1. SRU / Grant et al. (Radiology 2003;229(2):340-6)

Criterio principal, basado sobre todo en la PSV de la ACI, con verificación mediante el ratio ACI/ACC y la VDF:

| Grado | PSV-ACI | Ratio ACI/ACC | VDF-ACI |
|---|---|---|---|
| Normal | &lt;125 cm/s | &lt;2.0 | &lt;40 cm/s |
| &lt;50% | &lt;125 cm/s | &lt;2.0 | &lt;40 cm/s (+ placa &lt;50% en escala de grises) |
| 50-69% | 125-230 cm/s | 2.0-4.0 | 40-100 cm/s |
| ≥70% (no próxima a oclusión) | &gt;230 cm/s | &gt;4.0 | &gt;100 cm/s |
| Casi-oclusión | velocidades variables, luz residual mínima visible | — | — |
| Oclusión total | sin flujo detectable | — | — |

Si el ratio o la VDF no son concordantes con la categoría asignada por PSV, la app añade una nota de discordancia sugiriendo revisar el estado hemodinámico contralateral o el gasto cardíaco.

## 2. Índice sonográfico NASCET (Sonographic NASCET Index)

Incorpora el patrón de ensanchamiento espectral y umbrales más altos de PSV/VDF/ratio:

| Grado | Criterios |
|---|---|
| &lt;15% | Ensanchamiento espectral decelerativo, PSV &lt;125 cm/s |
| 16-49% | Ensanchamiento espectral pansistólico, PSV &lt;125 cm/s |
| 50-69% | Ensanchamiento pansistólico, PSV &gt;125 cm/s, y (VDF &lt;110 cm/s o ratio 2-4) |
| 70-79% | PSV &gt;270 cm/s, o VDF &gt;110 cm/s, o ratio &gt;4 (cualquiera) |
| 80-99% | VDF &gt;140 cm/s |
| Oclusión completa | sin flujo; "terminal thump" |

## 3. Australasian Society for Ultrasound in Medicine (ASUM, 2021)

| Grado | Criterios |
|---|---|
| 0 (normal) | onda e imagen normales |
| &lt;50% | PSV &lt;125 cm/s y ratio ACI/ACC &lt;2 |
| 50-69% | ratio ACI/ACC &gt;2 (con o sin PSV &gt;125 cm/s) |
| 70-79% | PSV &gt;270, o VDF &gt;110, o ratio &gt;4 (cualquiera de los tres) |
| &gt;80% | PSV &gt;270 **y** VDF &gt;140 **y** ratio &gt;4 (los tres a la vez) |
| 95-99% (casi-oclusión) | velocidades variables; correlacionar con modo B / Doppler color (signo de la cuerda) |
| Oclusión | sin flujo; "terminal thump" |

## Casi-oclusión y oclusión

En cualquiera de los tres criterios, marcar **"Oclusión total"** u **"Casi-oclusión"** en el formulario tiene prioridad absoluta sobre los umbrales de velocidad: en la casi-oclusión las velocidades pueden ser altas, bajas o indetectables y no son fiables para graduar el porcentaje exacto de estenosis.

## Arterias vertebrales

El sentido de flujo se interpreta de forma independiente de las clasificaciones anteriores:

- **Anterógrado**: normal.
- **Retrógrado**: sugestivo de fenómeno de robo de la subclavia ("subclavian steal"); se recomienda correlacionar con presiones braquiales bilaterales.
- **Alternante / bidireccional**: sugestivo de robo de la subclavia incompleto o latente, que puede acentuarse con hiperemia reactiva tras isquemia del brazo.

## Aviso

Estos tres sistemas de clasificación pueden discrepar entre sí en casos límite (por eso se muestran en paralelo, no reconciliados en una única categoría). La app no sustituye el criterio del radiólogo: use las tres estimaciones como apoyo y correlacione siempre con la imagen en modo B y el Doppler color.
