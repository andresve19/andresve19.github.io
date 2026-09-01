/* ============================================================
   Construcción del informe estructurado en texto plano,
   listo para copiar al portapapeles.
   ============================================================ */

function fmtNum(v, unit) {
  return (v === null || v === undefined || v === "") ? null : `${v} ${unit}`;
}

const PLAQUE_GRADE_LABEL = {
  none: null,
  lt50: "reducción luminal estimada <50% por escala de grises",
  ge50: "reducción luminal estimada ≥50% por escala de grises"
};

const MORPHOLOGY_LABEL = {
  "": null,
  regular: "de superficie regular",
  irregular: "de superficie irregular",
  ulcerada: "de superficie ulcerada"
};

const ECHOGENICITY_LABEL = {
  "": null,
  calcificada: "calcificada",
  hipoecoica: "hipoecoica (blanda)",
  heterogenea: "heterogénea (mixta)",
  isoecoica: "isoecoica"
};

const CALIBER_LABEL = {
  normal: "calibre normal",
  hipoplasica: "hipoplásica",
  asimetrica: "asimétrica respecto a la contralateral"
};

function lineCCA(label, d) {
  const bits = [];
  if (d.imt) bits.push(`grosor íntima-media ${d.imt} mm`);
  if (d.plaque) {
    bits.push(`presencia de placa de ateroma${d.plaqueDesc ? " (" + d.plaqueDesc + ")" : ""}`);
  } else {
    bits.push("sin placas de ateroma");
  }
  return `Carótida común ${label}: calibre y morfología conservados; ${bits.join("; ")}.`;
}

function lineICA(label, d, cls) {
  const lines = [];
  if (d.occlusion) {
    lines.push(`Carótida interna ${label}: ausencia de flujo Doppler color y espectral detectable.`);
  } else if (d.nearOcclusion) {
    const psvTxt = fmtNum(d.psv, "cm/s");
    lines.push(`Carótida interna ${label}: luz residual mínima con flujo preoclusivo${psvTxt ? " (PSV " + psvTxt + ")" : ""}.`);
  } else if (d.psv == null) {
    return `Carótida interna ${label}: sin datos de velocimetría registrados.`;
  } else {
    const bits = [`PSV ${d.psv} cm/s`];
    if (d.edv != null) bits.push(`VDF ${d.edv} cm/s`);
    if (d.ccaPsv) bits.push(`ratio ACI/ACC ${(d.psv / d.ccaPsv).toFixed(1)}`);
    const plaqueTxt = PLAQUE_GRADE_LABEL[d.plaqueGrade];
    const morphTxt = MORPHOLOGY_LABEL[d.morphology];
    const echoTxt = ECHOGENICITY_LABEL[d.echogenicity];
    let plaqueLine;
    if (plaqueTxt || morphTxt || echoTxt) {
      const descBits = [plaqueTxt, morphTxt, echoTxt].filter(Boolean);
      plaqueLine = ` Placa ${descBits.join(", ")}.`;
    } else {
      plaqueLine = " Sin placas de ateroma significativas.";
    }
    lines.push(`Carótida interna ${label}: ${bits.join(", ")}.${plaqueLine}`);
  }
  lines.push(`  · Estenosis (SRU/Grant 2003): ${cls.sru.category}.`);
  lines.push(`  · Estenosis (índice sonográfico NASCET): ${cls.nascet.category}.`);
  lines.push(`  · Estenosis (ASUM 2021): ${cls.asum.category}.`);
  return lines.join("\n");
}

function lineECA(label, d) {
  const bits = [];
  if (d.psv != null) bits.push(`PSV ${d.psv} cm/s`);
  const patternTxt = d.patternNormal
    ? "patrón de alta resistencia conservado, lo que permite su diferenciación de la ACI"
    : "no se objetiva claramente el patrón de alta resistencia habitual; valorar diferenciación con la ACI (maniobra de percusión temporal)";
  if (bits.length === 0) {
    return `Carótida externa ${label}: ${patternTxt}.`;
  }
  return `Carótida externa ${label}: ${bits.join(", ")}; ${patternTxt}.`;
}

function lineVA(label, d, cls) {
  if (!d.direction && d.psv == null) {
    return `Arteria vertebral ${label}: sin datos registrados.`;
  }
  const bits = [];
  bits.push(cls.label.toLowerCase());
  if (d.psv != null) bits.push(`PSV ${d.psv} cm/s`);
  if (d.edv != null) bits.push(`VDF ${d.edv} cm/s`);
  bits.push(CALIBER_LABEL[d.caliber] || "calibre normal");
  return `Arteria vertebral ${label}: ${bits.join(", ")}.`;
}

/**
 * Construye el texto completo del informe a partir del estado.
 * @param {Object} state  ver app.js:readState()
 * @param {Object} computed  clasificaciones ya calculadas { rIca:{sru,nascet,asum}, lIca:{...}, rVa, lVa, diagramHasContent }
 */
function buildReportText(state, computed) {
  const L = [];
  L.push("ECOGRAFÍA-DOPPLER DE TRONCOS SUPRAAÓRTICOS (TSA)");
  L.push("");

  L.push("HALLAZGOS:");
  L.push("");
  L.push(lineCCA("derecha", state.r.cca));
  L.push(lineICA("derecha", state.r.ica, computed.rIca));
  L.push(lineECA("derecha", state.r.eca));
  L.push(lineVA("derecha", state.r.va, computed.rVa));
  L.push("");
  L.push(lineCCA("izquierda", state.l.cca));
  L.push(lineICA("izquierda", state.l.ica, computed.lIca));
  L.push(lineECA("izquierda", state.l.eca));
  L.push(lineVA("izquierda", state.l.va, computed.lVa));

  if (computed.diagramHasContent) {
    L.push("");
    L.push("Se adjunta esquema anotado con la localización de las placas identificadas.");
  }

  if (state.otrosHallazgos && state.otrosHallazgos.trim()) {
    L.push("");
    L.push("OTROS HALLAZGOS:");
    L.push(state.otrosHallazgos.trim());
  }

  if (state.limitaciones && state.limitaciones.trim()) {
    L.push("");
    L.push("LIMITACIONES TÉCNICAS:");
    L.push(state.limitaciones.trim());
  }

  L.push("");
  L.push("CONCLUSIÓN:");
  const concl = buildConclusion(state, computed);
  concl.forEach(line => L.push(`- ${line}`));

  return L.join("\n");
}

function buildConclusion(state, computed) {
  const out = [];

  function icaConclusion(label, d, cls) {
    if (d.occlusion || d.nearOcclusion) {
      out.push(`ACI ${label}: ${cls.sru.category.toLowerCase()} (SRU/Grant 2003).`);
    } else if (d.psv != null && cls.sru.colorClass && cls.sru.colorClass !== "cat-normal") {
      out.push(`ACI ${label}: ${cls.sru.category.toLowerCase()} (SRU/Grant 2003); índice NASCET ${cls.nascet.category}; ASUM 2021 ${cls.asum.category}.`);
    }
  }
  icaConclusion("derecha", state.r.ica, computed.rIca);
  icaConclusion("izquierda", state.l.ica, computed.lIca);

  function plaqueNonStenoticNote(label, d) {
    const icaNormalOrPending = !d.ica.occlusion && !d.ica.nearOcclusion &&
      (d.ica.psv == null || d.ica.psv < 125) && d.ica.plaqueGrade !== "ge50";
    if (d.cca.plaque && icaNormalOrPending) {
      out.push(`Placa de ateroma no estenosante en carótida común ${label}.`);
    }
  }
  plaqueNonStenoticNote("derecha", state.r);
  plaqueNonStenoticNote("izquierda", state.l);

  function vaConclusion(label, d, cls) {
    if (d.direction === "retro" || d.direction === "alternante") {
      out.push(`Arteria vertebral ${label}: ${cls.label.toLowerCase()}, ${cls.note}`);
    }
  }
  vaConclusion("derecha", state.r.va, computed.rVa);
  vaConclusion("izquierda", state.l.va, computed.lVa);

  if (out.length === 0) {
    out.push("Estudio Doppler de troncos supraaórticos sin hallazgos significativos.");
    out.push("No se objetiva estenosis carotídea ni vertebral significativa de forma bilateral.");
  } else {
    out.push("Resto del estudio Doppler de troncos supraaórticos sin otros hallazgos significativos.");
  }

  return out;
}
