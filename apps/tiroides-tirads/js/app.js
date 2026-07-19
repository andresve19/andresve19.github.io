    const TR_META = {
        1: { label: "TR1 · Benigno",              color: "var(--tr1)", short: "TR1" },
        2: { label: "TR2 · No sospechoso",         color: "var(--tr2)", short: "TR2" },
        3: { label: "TR3 · Levemente sospechoso",  color: "var(--tr3)", short: "TR3" },
        4: { label: "TR4 · Moderadamente sospechoso", color: "var(--tr4)", short: "TR4" },
        5: { label: "TR5 · Altamente sospechoso",  color: "var(--tr5)", short: "TR5" }
    };

    let noNodulesMode = false;

    let globalEval = {
        size: "Normal",
        texture: "Homogénea",
        totalNodules: "1",
        spongiform: "0",
        mixed: "0"
    };

    let nodules = [ freshNodule() ];
    let currentTabId = 1;
    let nextInternalId = 2;

    function freshNodule() {
        return {
            internalId: 1,
            locSide: "Derecho",
            locZone: "Medio",
            sizeD1: "",
            sizeOther: "",
            compVal: "", echoVal: "", shapeVal: "", marginVal: "",
            fociNone: true,
            fociCbs: [false, false, false],
            comparisonVal: "none",
            comparisonNote: ""
        };
    }

    window.onload = function () {
        renderTabs();
        loadNoduleToForm(currentTabId);
        generateReportText();
    };

    // ---------- GLOBAL ----------
    function updateGlobalData() {
        globalEval.size = document.getElementById('glSize').value;
        globalEval.texture = document.getElementById('glTexture').value;
        globalEval.totalNodules = document.getElementById('glTotalNodules').value;
        globalEval.spongiform = document.getElementById('glSpongiform').value || "0";
        globalEval.mixed = document.getElementById('glMixed').value || "0";
        generateReportText();
    }

    function toggleNoNodules() {
        noNodulesMode = document.getElementById('glNoNodules').checked;

        document.getElementById('noduleColumn').style.display = noNodulesMode ? 'none' : '';
        document.getElementById('gridLayout').classList.toggle('single-col', noNodulesMode);

        ['glTotalNodules', 'glSpongiform', 'glMixed'].forEach(id => {
            document.getElementById(id).disabled = noNodulesMode;
        });

        if (noNodulesMode) {
            document.getElementById('glTotalNodules').value = "0";
            document.getElementById('glSpongiform').value = "0";
            document.getElementById('glMixed').value = "0";
        }

        updateGlobalData();
    }

    // ---------- TABS ----------
    function renderTabs() {
        const container = document.getElementById('tabsContainer');
        container.innerHTML = '';
        nodules.forEach((nod, idx) => {
            const scored = scoreNodule(nod);
            const meta = TR_META[scored.trLevel];
            const btn = document.createElement('button');
            btn.className = `tab-btn ${nod.internalId === currentTabId ? 'active' : ''}`;
            btn.innerHTML = `<span class="dot" style="background:${nod.internalId === currentTabId ? '#fff' : meta.color}"></span> Nódulo ${idx + 1} <span style="opacity:.75; font-weight:600;">· ${meta.short}</span>`;
            btn.onclick = () => switchNoduleTab(nod.internalId);
            container.appendChild(btn);
        });
        document.getElementById('btnAdd').disabled = nodules.length >= 4;
    }

    function addNodule() {
        if (nodules.length >= 4) return;
        const nod = freshNodule();
        nod.internalId = nextInternalId++;
        nod.locSide = "Izquierdo";
        nodules.push(nod);
        currentTabId = nod.internalId;
        renderTabs();
        loadNoduleToForm(currentTabId);
        generateReportText();
    }

    function deleteCurrentNodule() {
        if (nodules.length <= 1) {
            alert("Debe mantener al menos un nódulo en el informe.");
            return;
        }
        nodules = nodules.filter(n => n.internalId !== currentTabId);
        currentTabId = nodules[0].internalId;
        renderTabs();
        loadNoduleToForm(currentTabId);
        generateReportText();
    }

    function switchNoduleTab(id) {
        currentTabId = id;
        renderTabs();
        loadNoduleToForm(currentTabId);
    }

    function resetAll() {
        if (!confirm("Esto borrará todos los datos introducidos y comenzará un informe nuevo. ¿Continuar?")) return;
        document.getElementById('glSize').value = 'Normal';
        document.getElementById('glTexture').value = 'Homogénea';
        document.getElementById('glNoNodules').checked = false;
        document.getElementById('glTotalNodules').disabled = false;
        document.getElementById('glSpongiform').disabled = false;
        document.getElementById('glMixed').disabled = false;
        document.getElementById('glTotalNodules').value = '1';
        document.getElementById('glSpongiform').value = '0';
        document.getElementById('glMixed').value = '0';
        document.getElementById('noduleColumn').style.display = '';
        document.getElementById('gridLayout').classList.remove('single-col');
        noNodulesMode = false;
        globalEval = { size: "Normal", texture: "Homogénea", totalNodules: "1", spongiform: "0", mixed: "0" };
        nodules = [ freshNodule() ];
        currentTabId = 1;
        nextInternalId = 2;
        renderTabs();
        loadNoduleToForm(currentTabId);
        generateReportText();
    }

    // ---------- FORM <-> DATA ----------
    function setRadioByValue(name, val) {
        document.getElementsByName(name).forEach(r => { r.checked = (r.value === val); });
    }

    function getRadioValue(name) {
        for (const r of document.getElementsByName(name)) if (r.checked) return r.value;
        return "";
    }

    function handleSideChange() {
        const side = document.getElementById('locSide').value;
        if (side === "Istmo") {
            document.getElementById('locZone').value = "No aplica";
        }
        updateCurrentNoduleData();
    }

    function loadNoduleToForm(id) {
        const nod = nodules.find(n => n.internalId === id);
        if (!nod) return;
        const idx = nodules.findIndex(n => n.internalId === id) + 1;

        document.getElementById('formPanelTitle').textContent = `Configuración: Nódulo ${idx}`;
        document.getElementById('locSide').value = nod.locSide;
        document.getElementById('locZone').value = nod.locZone;
        document.getElementById('inputSizeD1').value = nod.sizeD1;
        document.getElementById('inputSizeOther').value = nod.sizeOther;

        setRadioByValue('comp', nod.compVal);
        setRadioByValue('echo', nod.echoVal);
        setRadioByValue('shape', nod.shapeVal);
        setRadioByValue('margin', nod.marginVal);

        document.getElementById('fociNone').checked = nod.fociNone;
        document.querySelectorAll('.foci-cb').forEach((cb, i) => { cb.checked = nod.fociCbs[i]; });

        setRadioByValue('comparison', nod.comparisonVal);
        document.getElementById('inputComparisonNote').value = nod.comparisonNote;

        document.getElementById('btnDelete').style.display = nodules.length <= 1 ? 'none' : 'block';
        renderScoreBanner(nod);
    }

    function handleFociNoneChange() {
        if (document.getElementById('fociNone').checked) {
            document.querySelectorAll('.foci-cb').forEach(cb => cb.checked = false);
        }
        updateCurrentNoduleData();
    }

    function handleFociCalcChange() {
        let any = false;
        document.querySelectorAll('.foci-cb').forEach(cb => { if (cb.checked) any = true; });
        document.getElementById('fociNone').checked = !any;
        updateCurrentNoduleData();
    }

    function updateCurrentNoduleData() {
        const nod = nodules.find(n => n.internalId === currentTabId);
        if (!nod) return;

        nod.locSide = document.getElementById('locSide').value;
        nod.locZone = document.getElementById('locZone').value;
        nod.sizeD1 = document.getElementById('inputSizeD1').value;
        nod.sizeOther = document.getElementById('inputSizeOther').value;

        nod.compVal = getRadioValue('comp');
        nod.echoVal = getRadioValue('echo');
        nod.shapeVal = getRadioValue('shape');
        nod.marginVal = getRadioValue('margin');

        nod.fociNone = document.getElementById('fociNone').checked;
        document.querySelectorAll('.foci-cb').forEach((cb, i) => { nod.fociCbs[i] = cb.checked; });

        nod.comparisonVal = getRadioValue('comparison') || "none";
        nod.comparisonNote = document.getElementById('inputComparisonNote').value;

        renderTabs();
        renderScoreBanner(nod);
        generateReportText();
    }

    // ---------- SCORING ----------
    function getMappingText(type, val) {
        const maps = {
            comp: {
                "0": { txt: "Quístico / casi completamente quístico", pts: 0 },
                "0_spong": { txt: "Espongiforme", pts: 0 },
                "1": { txt: "Mixto quístico y sólido", pts: 1 },
                "2": { txt: "Sólido / casi completamente sólido", pts: 2 },
                "2_und": { txt: "No determinable", pts: 2 }
            },
            echo: {
                "0": { txt: "Anecoico", pts: 0 },
                "1": { txt: "Hiperecoico o isoecoico", pts: 1 },
                "2": { txt: "Hipoecoico", pts: 2 },
                "3": { txt: "Muy hipoecoico", pts: 3 },
                "1_und": { txt: "No determinable", pts: 1 }
            },
            shape: {
                "0": { txt: "No más alto que ancho", pts: 0 },
                "3": { txt: "Más alto que ancho", pts: 3 }
            },
            margin: {
                "0": { txt: "Liso", pts: 0 },
                "0_ill": { txt: "Mal definido", pts: 0 },
                "2": { txt: "Lobulado / irregular", pts: 2 },
                "3": { txt: "Extensión extratiroidea", pts: 3 },
                "0_und": { txt: "No determinable", pts: 0 }
            }
        };
        return (maps[type] && maps[type][val]) || { txt: "Pendiente de selección", pts: 0 };
    }

    function getComparisonText(val) {
        const map = {
            none: "No hay estudio previo disponible para comparar.",
            stable: "Estable respecto a estudio previo.",
            new: "Nuevo, no descrito en estudio previo.",
            increased: "Aumentado de tamaño respecto a estudio previo.",
            decreased: "Disminuido de tamaño respecto a estudio previo."
        };
        return map[val] || map.none;
    }

    function scoreNodule(nod) {
        const comp = getMappingText('comp', nod.compVal);
        const echo = getMappingText('echo', nod.echoVal);
        const shape = getMappingText('shape', nod.shapeVal);
        const margin = getMappingText('margin', nod.marginVal);

        let fociPts = 0;
        const fociDescs = [];
        if (nod.fociNone) {
            fociDescs.push("Ninguno / cola de cometa grande (0)");
        } else {
            if (nod.fociCbs[0]) { fociPts += 1; fociDescs.push("Macrocalcificaciones (+1)"); }
            if (nod.fociCbs[1]) { fociPts += 2; fociDescs.push("Calcificaciones periféricas (+2)"); }
            if (nod.fociCbs[2]) { fociPts += 3; fociDescs.push("Focos ecogénicos puntiformes (+3)"); }
            if (fociDescs.length === 0) fociDescs.push("Pendiente de selección");
        }

        const totalPts = comp.pts + echo.pts + shape.pts + margin.pts + fociPts;

        let trLevel, tier;
        if (totalPts === 0) { trLevel = 1; tier = "TR1 (Benigno, 0 puntos)"; }
        else if (totalPts <= 2) { trLevel = 2; tier = "TR2 (No sospechoso, 2 puntos)"; }
        else if (totalPts === 3) { trLevel = 3; tier = "TR3 (Levemente sospechoso, 3 puntos)"; }
        else if (totalPts <= 6) { trLevel = 4; tier = "TR4 (Moderadamente sospechoso, 4-6 puntos)"; }
        else { trLevel = 5; tier = "TR5 (Altamente sospechoso, ≥7 puntos)"; }

        const d1 = parseFloat(nod.sizeD1);
        let rec = "";
        if (isNaN(d1)) {
            rec = "Introduzca el diámetro máximo para calcular la recomendación de seguimiento.";
        } else if (trLevel <= 2) {
            rec = "No requiere PAAF ni seguimiento.";
        } else if (trLevel === 3) {
            if (d1 >= 2.5) rec = "PAAF recomendada (diámetro ≥ 2.5 cm).";
            else if (d1 >= 1.5) rec = "Seguimiento recomendado a 1, 3 y 5 años (diámetro ≥ 1.5 cm).";
            else rec = "No requiere seguimiento (por debajo del umbral).";
        } else if (trLevel === 4) {
            if (d1 >= 1.5) rec = "PAAF recomendada (diámetro ≥ 1.5 cm).";
            else if (d1 >= 1.0) rec = "Seguimiento recomendado a 1, 2, 3 y 5 años (diámetro ≥ 1.0 cm).";
            else rec = "No requiere seguimiento (por debajo del umbral).";
        } else {
            if (d1 >= 1.0) rec = "PAAF recomendada (diámetro ≥ 1.0 cm).";
            else if (d1 >= 0.5) rec = "Seguimiento recomendado anualmente durante 5 años (diámetro ≥ 0.5 cm).";
            else rec = "Observación (por debajo del umbral).";
        }

        return { comp, echo, shape, margin, fociPts, fociDescs, totalPts, trLevel, tier, rec, d1 };
    }

    function renderScoreBanner(nod) {
        const s = scoreNodule(nod);
        const m = TR_META[s.trLevel];
        document.getElementById('scoreBanner').innerHTML = `
            <span class="pts-total">Puntuación acumulada: <b>${s.totalPts}</b> pts</span>
            <span class="tr-pill" style="background:${m.color}">${m.label}</span>
            <span class="rec-text">${s.rec}</span>
        `;
    }

    // ---------- REPORT TEXT ----------
    function generateReportText() {
        let text = "";

        text += "TÉCNICA\n";
        text += "-------\n";
        text += "Ecografía de tiroides en modo B y Doppler color, con transductor de alta frecuencia.\n\n";

        text += "HALLAZGOS ECOGRÁFICOS\n";
        text += "======================\n\n";

        text += "Evaluación global del tiroides\n";
        text += "-------------------------------\n";
        text += `Tamaño: ${globalEval.size}\n`;
        text += `Ecoestructura: ${globalEval.texture}\n`;

        if (noNodulesMode) {
            text += "No se identifican nódulos tiroideos.\n\n";
            text += "IMPRESIÓN DIAGNÓSTICA\n";
            text += "======================\n";
            text += "Tiroides sin nódulos. No se identifican hallazgos que requieran PAAF ni seguimiento estructurado en este estudio.\n";

            document.getElementById('reportPreview').textContent = text;
            renderSummaryList([]);
            return;
        }

        text += `Nódulos totales ≥1 cm estimados: ${globalEval.totalNodules}\n`;
        if (parseInt(globalEval.spongiform) > 0) {
            text += `Nódulos espongiformes ≥2 cm (TR1) no descritos individualmente: ${globalEval.spongiform}\n`;
        }
        if (parseInt(globalEval.mixed) > 0) {
            text += `Nódulos mixtos quístico/sólido ≥1.5 cm (TR2) no descritos individualmente: ${globalEval.mixed}\n`;
        }
        text += "\n";

        text += "Nódulos evaluados (ACR TI-RADS)\n";
        text += "--------------------------------\n\n";

        const scored = nodules.map((nod, idx) => ({ nod, idx: idx + 1, s: scoreNodule(nod) }));

        scored.forEach(({ nod, idx, s }) => {
            let locText = nod.locSide;
            if (nod.locZone && nod.locZone !== "No aplica") locText += `, tercio ${nod.locZone.toLowerCase()}`;

            text += `NÓDULO #${idx} — ${locText}\n`;
            text += `  Tamaño: D. máximo ${nod.sizeD1 !== "" ? nod.sizeD1 + " cm" : "no indicado"}`;
            text += nod.sizeOther ? `; otras dimensiones ${nod.sizeOther} cm\n` : "\n";
            text += `  Composición: ${s.comp.txt} (${s.comp.pts} pts)\n`;
            text += `  Ecogenicidad: ${s.echo.txt} (${s.echo.pts} pts)\n`;
            text += `  Forma: ${s.shape.txt} (${s.shape.pts} pts)\n`;
            text += `  Márgenes: ${s.margin.txt} (${s.margin.pts} pts)\n`;
            text += `  Focos ecogénicos: ${s.fociDescs.join(', ')}\n`;
            text += `  Comparación con estudio previo: ${getComparisonText(nod.comparisonVal)}`;
            text += nod.comparisonNote ? ` (${nod.comparisonNote})\n` : "\n";
            text += `  Puntuación total: ${s.totalPts} pts  →  ${s.tier}\n`;
            text += `  Recomendación: ${s.rec}\n\n`;
        });

        text += "IMPRESIÓN DIAGNÓSTICA\n";
        text += "======================\n";
        scored.forEach(({ idx, s }) => {
            text += `${idx}. Nódulo #${idx}: ${TR_META[s.trLevel].label.replace('TR' + s.trLevel + ' · ', 'TR' + s.trLevel + ', ')}. ${s.rec}\n`;
        });

        const maxLevel = Math.max(...scored.map(x => x.s.trLevel));
        const needsPAAF = scored.filter(x => x.s.rec.startsWith("PAAF"));
        text += "\n";
        if (needsPAAF.length > 0) {
            text += `Se recomienda punción-aspiración con aguja fina (PAAF) del/de los nódulo(s) ${needsPAAF.map(x => "#" + x.idx).join(', ')}, según criterios ACR TI-RADS.\n`;
        } else if (maxLevel >= 3) {
            text += "Se recomienda seguimiento ecográfico según criterios ACR TI-RADS detallados por nódulo.\n";
        } else {
            text += "No se identifican hallazgos que requieran PAAF ni seguimiento estructurado en este estudio.\n";
        }

        document.getElementById('reportPreview').textContent = text;
        renderSummaryList(scored);
    }

    function renderSummaryList(scored) {
        const list = document.getElementById('summaryList');
        list.innerHTML = '';
        scored.forEach(({ idx, s, nod }) => {
            const m = TR_META[s.trLevel];
            const row = document.createElement('div');
            row.className = 'summary-row';
            row.innerHTML = `<span class="chip" style="background:${m.color}">${m.short}</span>
                <span>Nódulo #${idx} · ${nod.locSide}${nod.sizeD1 ? ' · ' + nod.sizeD1 + ' cm' : ''} · ${s.totalPts} pts</span>`;
            list.appendChild(row);
        });
    }

    // ---------- COPY ----------
    function copyReportToClipboard() {
        const reportText = document.getElementById('reportPreview').textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(reportText).then(showToast).catch(() => fallbackCopyText(reportText));
        } else {
            fallbackCopyText(reportText);
        }
    }

    function fallbackCopyText(text) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand('copy'); showToast(); }
        catch (err) { alert('No se pudo copiar automáticamente. Selecciónelo manualmente.'); }
        document.body.removeChild(ta);
    }

    function showToast() {
        const toast = document.getElementById('copyToast');
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 2500);
    }
