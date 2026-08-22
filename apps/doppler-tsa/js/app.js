/* ============================================================
   Doppler TSA — lógica principal de la aplicación
   ============================================================ */

function num(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const v = el.value.trim();
  return v === "" ? null : parseFloat(v);
}
function chk(id) {
  const el = document.getElementById(id);
  return el ? el.checked : false;
}
function str(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function readSide(p) {
  return {
    cca: {
      psv: num(`${p}-cca-psv`),
      edv: num(`${p}-cca-edv`),
      imt: num(`${p}-cca-imt`),
      plaque: chk(`${p}-cca-plaque`),
      plaqueDesc: str(`${p}-cca-plaque-desc`)
    },
    ica: {
      psv: num(`${p}-ica-psv`),
      edv: num(`${p}-ica-edv`),
      ccaPsv: num(`${p}-cca-psv`),
      plaqueGrade: str(`${p}-ica-plaque-grade`),
      morphology: str(`${p}-ica-morphology`),
      echogenicity: str(`${p}-ica-echogenicity`),
      spectralBroadening: str(`${p}-nascet-broadening`),
      nearOcclusion: chk(`${p}-ica-nearocclusion`),
      occlusion: chk(`${p}-ica-occlusion`)
    },
    eca: {
      psv: num(`${p}-eca-psv`),
      patternNormal: chk(`${p}-eca-pattern-normal`)
    },
    va: {
      direction: str(`${p}-va-direction`),
      psv: num(`${p}-va-psv`),
      edv: num(`${p}-va-edv`),
      caliber: str(`${p}-va-caliber`)
    }
  };
}

function readState() {
  return {
    otrosHallazgos: str("otros-hallazgos"),
    limitaciones: str("limitaciones"),
    r: readSide("r"),
    l: readSide("l")
  };
}

function renderBanner(id, title, note, colorClass, prefix) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = "classification-banner" + (colorClass ? " " + colorClass : "");
  el.innerHTML = "";
  const main = document.createElement("div");
  main.textContent = (prefix ? prefix + " — " : "") + title;
  el.appendChild(main);
  if (note) {
    const small = document.createElement("div");
    small.className = "cb-note";
    small.textContent = note;
    el.appendChild(small);
  }
}

function renderPill(id, label, value, colorClass) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = "consensus-pill" + (colorClass ? " " + colorClass : "");
  el.innerHTML = "";
  const nameEl = document.createElement("span");
  nameEl.className = "consensus-name";
  nameEl.textContent = label;
  const valEl = document.createElement("span");
  valEl.className = "consensus-value";
  valEl.textContent = value;
  el.appendChild(nameEl);
  el.appendChild(valEl);
}

function toggleVisibility(checkboxId, wrapId) {
  const cb = document.getElementById(checkboxId);
  const wrap = document.getElementById(wrapId);
  if (!cb || !wrap) return;
  wrap.style.display = cb.checked ? "flex" : "none";
}

function classifyICA(icaData) {
  const base = {
    psv: icaData.psv, ccaPsv: icaData.ccaPsv, edv: icaData.edv,
    plaqueGrade: icaData.plaqueGrade, nearOcclusion: icaData.nearOcclusion, occlusion: icaData.occlusion
  };
  const ratio = icaData.ccaPsv ? icaData.psv / icaData.ccaPsv : null;
  const sru = classifyICAStenosis(base);
  const nascet = classifyNASCETIndex({
    psv: icaData.psv, edv: icaData.edv, ratio, occlusion: icaData.occlusion,
    spectralBroadening: icaData.spectralBroadening
  });
  const asum = classifyASUM({
    psv: icaData.psv, edv: icaData.edv, ratio, plaqueGrade: icaData.plaqueGrade,
    nearOcclusion: icaData.nearOcclusion, occlusion: icaData.occlusion
  });
  return { sru, nascet, asum };
}

let painter = null;

function update() {
  const state = readState();

  const rIca = classifyICA(state.r.ica);
  const lIca = classifyICA(state.l.ica);
  const rVa = classifyVertebralFlow(state.r.va.direction);
  const lVa = classifyVertebralFlow(state.l.va.direction);

  renderBanner("r-ica-banner", rIca.sru.category, rIca.sru.note, rIca.sru.colorClass, "SRU/Grant 2003");
  renderBanner("l-ica-banner", lIca.sru.category, lIca.sru.note, lIca.sru.colorClass, "SRU/Grant 2003");
  renderPill("r-ica-nascet-pill", "NASCET (sonográfico)", rIca.nascet.category, rIca.nascet.colorClass);
  renderPill("l-ica-nascet-pill", "NASCET (sonográfico)", lIca.nascet.category, lIca.nascet.colorClass);
  renderPill("r-ica-asum-pill", "ASUM 2021", rIca.asum.category, rIca.asum.colorClass);
  renderPill("l-ica-asum-pill", "ASUM 2021", lIca.asum.category, lIca.asum.colorClass);

  renderBanner("r-va-banner", rVa.label, rVa.note, rVa.colorClass);
  renderBanner("l-va-banner", lVa.label, lVa.note, lVa.colorClass);

  toggleVisibility("r-cca-plaque", "r-cca-plaque-desc-wrap");
  toggleVisibility("l-cca-plaque", "l-cca-plaque-desc-wrap");

  const diagramHasContent = painter ? painter.hasContent() : false;
  const reportText = buildReportText(state, { rIca, lIca, rVa, lVa, diagramHasContent });
  document.getElementById("report-text").textContent = reportText;
}

function initCopyButton() {
  const btn = document.getElementById("btn-copy");
  btn.addEventListener("click", async () => {
    const text = document.getElementById("report-text").textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    btn.classList.add("copied");
    const original = btn.textContent;
    btn.textContent = "Copiado ✓";
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.textContent = original;
    }, 1600);
  });
}

function initResetButton() {
  document.getElementById("btn-reset").addEventListener("click", () => {
    if (!confirm("¿Reiniciar todos los campos del informe y el esquema de placas?")) return;
    document.getElementById("tsa-form").reset();
    if (painter) document.getElementById("btn-clear-diagram").click();
    update();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  painter = initPlaquePainter();
  initCopyButton();
  initResetButton();

  const form = document.getElementById("tsa-form");
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  document.addEventListener("tsa:diagram-changed", update);

  update();
});
