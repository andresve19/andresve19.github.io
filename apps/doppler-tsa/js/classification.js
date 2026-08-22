/* ============================================================
   Clasificación automática de estenosis de ACI
   Criterios de consenso SRU (Society of Radiologists in
   Ultrasound) / Grant et al. Radiology 2003;229(2):340-6.
   ============================================================
   Grado            | PSV-ACI      | Ratio ACI/ACC | VDF-ACI
   Normal            <125 cm/s      <2.0            <40 cm/s
   <50%              <125 cm/s      <2.0            <40 cm/s   (+ placa <50% en escala de grises)
   50-69%            125-230 cm/s   2.0-4.0         40-100 cm/s
   >=70% (no casi-oclusión) >230 cm/s   >4.0        >100 cm/s
   Casi-oclusión     variable / indetectable (luz residual mínima visible)
   Oclusión total    sin flujo detectable
   ============================================================ */

/**
 * Clasifica el grado de estenosis de la ACI según PSV, ratio ACI/ACC,
 * VDF y el grado de placa estimado por escala de grises.
 *
 * @param {Object} p
 * @param {number|null} p.psv          PSV de la ACI en cm/s
 * @param {number|null} p.ccaPsv       PSV de la ACC ipsilateral en cm/s (para el ratio)
 * @param {number|null} p.edv          VDF de la ACI en cm/s
 * @param {string} p.plaqueGrade       'none' | 'lt50' | 'ge50'
 * @param {boolean} p.nearOcclusion    marcado manualmente por el explorador
 * @param {boolean} p.occlusion        marcado manualmente por el explorador
 * @returns {{category:string, colorClass:string, note:string}}
 */
function classifyICAStenosis(p) {
  const { psv, ccaPsv, edv, plaqueGrade, nearOcclusion, occlusion } = p;

  if (occlusion) {
    return {
      category: "Oclusión total",
      colorClass: "cat-occlusion",
      note: "Ausencia de flujo Doppler color y espectral detectable en la luz de la ACI."
    };
  }

  if (nearOcclusion) {
    return {
      category: "Casi-oclusión (suboclusión)",
      colorClass: "cat-critical",
      note: "Luz residual mínima con flujo preoclusivo; las velocidades pueden ser altas, bajas o indetectables y no son fiables para graduar el grado exacto."
    };
  }

  if (psv == null) {
    return {
      category: "Pendiente de datos",
      colorClass: "",
      note: "Introduzca la PSV de la ACI para calcular la categoría."
    };
  }

  const ratio = ccaPsv ? psv / ccaPsv : null;

  // Categoría primaria por PSV (criterio principal SRU/Grant 2003)
  let category, colorClass;
  if (psv < 125) {
    if (plaqueGrade === "ge50") {
      category = "Estenosis 50-69% (discordancia velocidad/placa)";
      colorClass = "cat-moderate";
    } else if (plaqueGrade === "lt50") {
      category = "Estenosis <50%";
      colorClass = "cat-mild";
    } else {
      category = "Normal / sin estenosis significativa";
      colorClass = "cat-normal";
    }
  } else if (psv <= 230) {
    category = "Estenosis 50-69%";
    colorClass = "cat-moderate";
  } else {
    category = "Estenosis ≥70% (no próxima a oclusión)";
    colorClass = "cat-severe";
  }

  // Verificación con criterios secundarios (ratio ACI/ACC y VDF)
  const notes = [];
  if (ratio != null) {
    let ratioBucket;
    if (ratio < 2.0) ratioBucket = 0;
    else if (ratio <= 4.0) ratioBucket = 1;
    else ratioBucket = 2;
    const psvBucket = psv < 125 ? 0 : (psv <= 230 ? 1 : 2);
    notes.push(`Ratio ACI/ACC: ${ratio.toFixed(1)}`);
    if (ratioBucket !== psvBucket) {
      notes.push("el ratio ACI/ACC sugiere una categoría distinta a la PSV; valorar estado hemodinámico contralateral o gasto cardíaco.");
    }
  }
  if (edv != null) {
    let edvBucket;
    if (edv < 40) edvBucket = 0;
    else if (edv <= 100) edvBucket = 1;
    else edvBucket = 2;
    const psvBucket = psv < 125 ? 0 : (psv <= 230 ? 1 : 2);
    if (edvBucket !== psvBucket) {
      notes.push("la VDF no es concordante con la PSV; revisar la categoría.");
    }
  }

  return { category, colorClass, note: notes.join(" · ") };
}

/**
 * Interpreta el sentido de flujo en la arteria vertebral.
 * @param {string} direction 'antero' | 'retro' | 'alternante' | ''
 * @returns {{label:string, colorClass:string, note:string}}
 */
function classifyVertebralFlow(direction) {
  switch (direction) {
    case "retro":
      return {
        label: "Flujo retrógrado",
        colorClass: "cat-severe",
        note: "Hallazgo sugestivo de fenómeno de robo de la subclavia (\"subclavian steal\"); correlacionar con presiones braquiales bilaterales."
      };
    case "alternante":
      return {
        label: "Flujo alternante / bidireccional",
        colorClass: "cat-moderate",
        note: "Patrón sugestivo de robo de la subclavia incompleto o latente (se acentúa con hiperemia reactiva tras isquemia del brazo)."
      };
    case "antero":
      return { label: "Flujo anterógrado (normal)", colorClass: "cat-normal", note: "" };
    default:
      return { label: "Pendiente de datos", colorClass: "", note: "" };
  }
}

/* ============================================================
   Índice sonográfico NASCET (Sonographic NASCET Index)
   Incorpora la velocidad de flujo distal de la ACI al estudio
   Doppler convencional para mejorar la precisión diagnóstica de
   la PSV.
   ============================================================
   Grado        | Criterios
   <15%          Ensanchamiento espectral decelerativo, PSV <125 cm/s
   16-49%        Ensanchamiento espectral pansistólico, PSV <125 cm/s
   50-69%        Ensanch. pansistólico, PSV >125 cm/s, y (VDF <110 cm/s o ratio 2-4)
   70-79%        PSV >270 cm/s, o VDF >110 cm/s, o ratio >4
   80-99%        VDF >140 cm/s
   Oclusión completa   sin flujo; "terminal thump"
   ============================================================ */

/**
 * @param {Object} p
 * @param {number|null} p.psv
 * @param {number|null} p.edv
 * @param {number|null} p.ratio
 * @param {boolean} p.occlusion
 * @param {string} p.spectralBroadening 'decelerativo' | 'pansistolico' | ''
 */
function classifyNASCETIndex(p) {
  const { psv, edv, ratio, occlusion, spectralBroadening } = p;

  if (occlusion) {
    return { category: "Oclusión completa", colorClass: "cat-occlusion", note: "Ausencia de flujo; \"terminal thump\"." };
  }
  if (psv == null) {
    return { category: "Pendiente de datos", colorClass: "", note: "" };
  }

  if (edv != null && edv > 140) {
    return { category: "80-99%", colorClass: "cat-severe", note: "VDF >140 cm/s." };
  }

  const reasons79 = [];
  if (psv > 270) reasons79.push("PSV >270 cm/s");
  if (edv != null && edv > 110) reasons79.push("VDF >110 cm/s");
  if (ratio != null && ratio > 4) reasons79.push("ratio ACI/ACC >4");
  if (reasons79.length) {
    return { category: "70-79%", colorClass: "cat-severe", note: reasons79.join(", ") + "." };
  }

  if (psv > 125 && ((edv != null && edv < 110) || (ratio != null && ratio > 2 && ratio < 4))) {
    return { category: "50-69%", colorClass: "cat-moderate", note: "PSV >125 cm/s con VDF <110 cm/s o ratio ACI/ACC 2-4, con ensanchamiento espectral pansistólico." };
  }

  if (psv > 125) {
    return {
      category: "≥50% (estimación por PSV)",
      colorClass: "cat-moderate",
      note: "PSV >125 cm/s; registre VDF o ratio ACI/ACC para precisar el grado."
    };
  }

  // psv <= 125
  if (spectralBroadening === "decelerativo") {
    return { category: "<15%", colorClass: "cat-normal", note: "Ensanchamiento espectral decelerativo con PSV <125 cm/s." };
  }
  if (spectralBroadening === "pansistolico") {
    return { category: "16-49%", colorClass: "cat-mild", note: "Ensanchamiento espectral pansistólico con PSV <125 cm/s." };
  }
  return {
    category: "<50% (patrón de ensanchamiento espectral no valorado)",
    colorClass: "cat-mild",
    note: "Indique el patrón de ensanchamiento espectral para diferenciar <15% de 16-49%."
  };
}

/* ============================================================
   Australasian Society for Ultrasound in Medicine (ASUM), 2021
   ============================================================
   Grado                | Criterios
   0 (normal)             onda e imagen normales
   <50%                   PSV <125 cm/s y ratio ACI/ACC <2
   50-69%                 ratio ACI/ACC >2 (con o sin PSV >125 cm/s)
   70-79%                 PSV >270, o VDF >110, o ratio >4 (cualquiera)
   >80%                   PSV >270 Y VDF >140 Y ratio >4 (los tres)
   95-99% (casi-oclusión) velocidades variables; correlacionar con
                          modo B / Doppler color (signo de la cuerda)
   Oclusión               sin flujo; "terminal thump"
   ============================================================ */

/**
 * @param {Object} p
 * @param {number|null} p.psv
 * @param {number|null} p.edv
 * @param {number|null} p.ratio
 * @param {string} p.plaqueGrade 'none' | 'lt50' | 'ge50'
 * @param {boolean} p.nearOcclusion
 * @param {boolean} p.occlusion
 */
function classifyASUM(p) {
  const { psv, edv, ratio, plaqueGrade, nearOcclusion, occlusion } = p;

  if (occlusion) {
    return { category: "Ocluida", colorClass: "cat-occlusion", note: "Ausencia de flujo; \"terminal thump\"." };
  }
  if (nearOcclusion) {
    return {
      category: "Casi-oclusión (95-99%)",
      colorClass: "cat-critical",
      note: "Velocidades variables (altas, bajas o indetectables); correlacionar con modo B y Doppler color (signo de la cuerda / \"string sign\")."
    };
  }
  if (psv == null) {
    return { category: "Pendiente de datos", colorClass: "", note: "" };
  }

  if (psv > 270 && edv != null && edv > 140 && ratio != null && ratio > 4) {
    return { category: ">80%", colorClass: "cat-severe", note: "PSV >270 cm/s, VDF >140 cm/s y ratio ACI/ACC >4 (los tres criterios)." };
  }

  const reasons79 = [];
  if (psv > 270) reasons79.push("PSV >270 cm/s");
  if (edv != null && edv > 110) reasons79.push("VDF >110 cm/s");
  if (ratio != null && ratio > 4) reasons79.push("ratio ACI/ACC >4");
  if (reasons79.length) {
    return { category: "70-79%", colorClass: "cat-severe", note: reasons79.join(", ") + "." };
  }

  if ((ratio != null && ratio > 2) || psv > 125) {
    const reasons = [];
    if (ratio != null && ratio > 2) reasons.push("ratio ACI/ACC >2");
    if (psv > 125) reasons.push("PSV >125 cm/s");
    return { category: "50-69%", colorClass: "cat-moderate", note: reasons.join(", ") + "." };
  }

  // psv <= 125 y (ratio null o <2)
  if (plaqueGrade && plaqueGrade !== "none") {
    return { category: "<50%", colorClass: "cat-mild", note: "PSV <125 cm/s y ratio ACI/ACC <2, con placa/engrosamiento visible." };
  }
  return { category: "Normal (grado 0)", colorClass: "cat-normal", note: "Onda e imagen normales." };
}
