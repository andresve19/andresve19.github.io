    // ---------- NIVELES VERTEBRALES ----------
    // locScore = puntuación de localización sugerida por SINS (Fisher et al. 2010):
    //   3 = charnela (occipito-C2, C7-T2, T11-L1, L5-S1) · 2 = columna móvil (C3-C6, L2-L4)
    //   1 = columna semirrígida (T3-T10)                 · 0 = columna rígida (S2-S5)
    const LEVELS = [
        { val: 'C1', label: 'C1', region: 'Cervical', locScore: '3' },
        { val: 'C2', label: 'C2', region: 'Cervical', locScore: '3' },
        { val: 'C3', label: 'C3', region: 'Cervical', locScore: '2' },
        { val: 'C4', label: 'C4', region: 'Cervical', locScore: '2' },
        { val: 'C5', label: 'C5', region: 'Cervical', locScore: '2' },
        { val: 'C6', label: 'C6', region: 'Cervical', locScore: '2' },
        { val: 'C7', label: 'C7', region: 'Cervical', locScore: '3' },
        { val: 'T1', label: 'T1', region: 'Torácica', locScore: '3' },
        { val: 'T2', label: 'T2', region: 'Torácica', locScore: '3' },
        { val: 'T3', label: 'T3', region: 'Torácica', locScore: '1' },
        { val: 'T4', label: 'T4', region: 'Torácica', locScore: '1' },
        { val: 'T5', label: 'T5', region: 'Torácica', locScore: '1' },
        { val: 'T6', label: 'T6', region: 'Torácica', locScore: '1' },
        { val: 'T7', label: 'T7', region: 'Torácica', locScore: '1' },
        { val: 'T8', label: 'T8', region: 'Torácica', locScore: '1' },
        { val: 'T9', label: 'T9', region: 'Torácica', locScore: '1' },
        { val: 'T10', label: 'T10', region: 'Torácica', locScore: '1' },
        { val: 'T11', label: 'T11', region: 'Torácica', locScore: '3' },
        { val: 'T12', label: 'T12', region: 'Torácica', locScore: '3' },
        { val: 'L1', label: 'L1', region: 'Lumbar', locScore: '3' },
        { val: 'L2', label: 'L2', region: 'Lumbar', locScore: '2' },
        { val: 'L3', label: 'L3', region: 'Lumbar', locScore: '2' },
        { val: 'L4', label: 'L4', region: 'Lumbar', locScore: '2' },
        { val: 'L5', label: 'L5', region: 'Lumbar', locScore: '3' },
        { val: 'S1', label: 'S1', region: 'Sacra', locScore: '3' },
        { val: 'S2', label: 'S2', region: 'Sacra', locScore: '0' },
        { val: 'S3', label: 'S3', region: 'Sacra', locScore: '0' },
        { val: 'S4', label: 'S4', region: 'Sacra', locScore: '0' },
        { val: 'S5', label: 'S5', region: 'Sacra', locScore: '0' }
    ];

    // Por debajo de esta posición (índice de LEVELS) se considera cola de caballo, no médula espinal.
    const CAUDA_EQUINA_FROM = 'L2';

    function levelInfo(val) { return LEVELS.find(l => l.val === val); }
    function levelIndex(val) { return LEVELS.findIndex(l => l.val === val); }
    function isCaudaEquinaLevel(val) { return levelIndex(val) >= levelIndex(CAUDA_EQUINA_FROM); }

    // ---------- SINS (Spinal Instability Neoplastic Score) ----------
    const SINS_COMPONENTS = [
        {
            key: 'location', label: 'Localización de la lesión',
            options: [
                { val: '3', txt: 'Charnela (occipito-C2, C7-T2, T11-L1 o L5-S1)' },
                { val: '2', txt: 'Columna móvil (C3-C6 o L2-L4)' },
                { val: '1', txt: 'Columna semirrígida (T3-T10)' },
                { val: '0', txt: 'Columna rígida (S2-S5)' }
            ]
        },
        {
            key: 'pain', label: 'Dolor',
            options: [
                { val: '3', txt: 'Dolor mecánico (relacionado con la postura/carga, mejora en decúbito)' },
                { val: '1', txt: 'Dolor ocasional, no mecánico' },
                { val: '0', txt: 'Lesión asintomática' }
            ]
        },
        {
            key: 'boneLesion', label: 'Tipo de lesión ósea',
            options: [
                { val: '2', txt: 'Lítica' },
                { val: '1', txt: 'Mixta (lítica/blástica)' },
                { val: '0', txt: 'Blástica' }
            ]
        },
        {
            key: 'alignment', label: 'Alineación radiográfica de la columna',
            options: [
                { val: '4', txt: 'Subluxación/traslación presente' },
                { val: '2', txt: 'Deformidad de novo (cifosis o escoliosis)' },
                { val: '0', txt: 'Alineación normal' }
            ]
        },
        {
            key: 'collapse', label: 'Colapso del cuerpo vertebral',
            options: [
                { val: '3', txt: 'Colapso > 50%' },
                { val: '2', txt: 'Colapso < 50%' },
                { val: '1', txt: 'Sin colapso, con > 50% del cuerpo vertebral afectado' },
                { val: '0', txt: 'Ninguna de las anteriores' }
            ]
        },
        {
            key: 'posterolateral', label: 'Afectación posterolateral de elementos espinales (faceta, pedículo o articulación costovertebral)',
            options: [
                { val: '3', txt: 'Bilateral' },
                { val: '1', txt: 'Unilateral' },
                { val: '0', txt: 'Ninguna de las anteriores' }
            ]
        }
    ];

    // ---------- ESCC / Bilsky ----------
    const ESCC_OPTIONS = [
        { val: '0', txt: 'Grado 0 — Tumor confinado al hueso', badge: 'Grado 0' },
        { val: '1a', txt: 'Grado 1a — Impronta epidural, sin deformidad del saco tecal', badge: 'Grado 1a' },
        { val: '1b', txt: 'Grado 1b — Deformidad del saco tecal, sin contacto con la médula', badge: 'Grado 1b' },
        { val: '1c', txt: 'Grado 1c — Deformidad del saco tecal con contacto medular, sin compresión', badge: 'Grado 1c' },
        { val: '2', txt: 'Grado 2 — Compresión medular, con LCR perimedular visible', badge: 'Grado 2' },
        { val: '3', txt: 'Grado 3 — Compresión medular, sin LCR perimedular visible', badge: 'Grado 3' }
    ];

    function esccInfo(val) { return ESCC_OPTIONS.find(o => o.val === val); }
    function esccIsSignificant(val) { return val === '1c' || val === '2' || val === '3'; }

    // ---------- ESTADO ----------
    let lesions = [];
    let lesionCounter = 0;
    let meta = { indication: '', priorStudy: '', additionalFindings: '' };

    function freshLesion(level) {
        const lvl = level || 'T1';
        return {
            id: 'lesion' + (++lesionCounter),
            level: lvl,
            sins: {
                location: levelInfo(lvl).locScore,
                pain: '0',
                boneLesion: '0',
                alignment: '0',
                collapse: '0',
                posterolateral: '0'
            },
            escc: '0'
        };
    }

    window.onload = function () {
        lesions.push(freshLesion());
        renderLesions();
        refresh();
    };

    // ---------- RENDERIZADO ----------
    function buildFieldGroup(label, name, options, currentVal, onChange) {
        const wrap = document.createElement('div');
        wrap.className = 'form-group';

        const lbl = document.createElement('label');
        lbl.textContent = label;
        wrap.appendChild(lbl);

        const grp = document.createElement('div');
        grp.className = 'option-group';

        options.forEach(o => {
            const optLabel = document.createElement('label');
            optLabel.className = 'opt';
            const ptsTxt = o.badge ? o.badge : (o.val === '1' ? '1 pt' : `${o.val} pts`);
            optLabel.innerHTML = `<span><input type="radio" name="${name}"><span class="opt-label">${o.txt}</span></span><span class="pts">${ptsTxt}</span>`;
            const input = optLabel.querySelector('input');
            input.checked = (currentVal === o.val);
            input.addEventListener('change', () => onChange(o.val));
            grp.appendChild(optLabel);
        });

        wrap.appendChild(grp);
        return wrap;
    }

    function buildLevelSelect(lesion) {
        const wrap = document.createElement('div');
        wrap.className = 'form-group level-select-group';

        const lbl = document.createElement('label');
        lbl.textContent = 'Cuerpo vertebral';
        wrap.appendChild(lbl);

        const sel = document.createElement('select');
        let currentRegion = null;
        let optgroup = null;
        LEVELS.forEach(l => {
            if (l.region !== currentRegion) {
                currentRegion = l.region;
                optgroup = document.createElement('optgroup');
                optgroup.label = currentRegion;
                sel.appendChild(optgroup);
            }
            const opt = document.createElement('option');
            opt.value = l.val;
            opt.textContent = l.label;
            if (lesion.level === l.val) opt.selected = true;
            optgroup.appendChild(opt);
        });
        sel.addEventListener('change', () => {
            lesion.level = sel.value;
            lesion.sins.location = levelInfo(sel.value).locScore;
            renderLesions();
            refresh();
        });

        wrap.appendChild(sel);
        return wrap;
    }

    function renderLesions() {
        const container = document.getElementById('lesionsContainer');
        container.innerHTML = '';
        lesions.forEach((lesion, idx) => {
            container.appendChild(buildLesionCard(lesion, idx));
        });
    }

    function buildLesionCard(lesion, idx) {
        const card = document.createElement('div');
        card.className = 'lesion-card';

        const header = document.createElement('div');
        header.className = 'lesion-header';

        const title = document.createElement('div');
        title.className = 'lesion-title';
        title.textContent = `Lesión vertebral #${idx + 1}`;
        header.appendChild(title);

        header.appendChild(buildLevelSelect(lesion));

        if (lesions.length > 1) {
            const btnRemove = document.createElement('button');
            btnRemove.className = 'btn-remove-lesion';
            btnRemove.textContent = '✕ Eliminar lesión';
            btnRemove.addEventListener('click', () => removeLesion(lesion.id));
            header.appendChild(btnRemove);
        }

        card.appendChild(header);

        const sinsTitle = document.createElement('div');
        sinsTitle.className = 'subsection-title';
        sinsTitle.textContent = 'SINS — Puntuación de inestabilidad espinal neoplásica';
        card.appendChild(sinsTitle);

        const sinsBanner = document.createElement('div');
        sinsBanner.className = 'score-banner';
        sinsBanner.id = `sinsBanner_${lesion.id}`;
        card.appendChild(sinsBanner);

        SINS_COMPONENTS.forEach(c => {
            const group = buildFieldGroup(c.label, `${lesion.id}_sins_${c.key}`, c.options, lesion.sins[c.key], (val) => {
                lesion.sins[c.key] = val;
                refresh();
            });
            if (c.key === 'location') {
                const hint = document.createElement('p');
                hint.className = 'field-hint';
                hint.textContent = 'Sugerida automáticamente según el cuerpo vertebral elegido; modifíquela si el caso lo requiere.';
                group.appendChild(hint);
            }
            card.appendChild(group);
        });

        const esccTitle = document.createElement('div');
        esccTitle.className = 'subsection-title';
        esccTitle.textContent = 'ESCC / Bilsky — Grado de compresión epidural';
        card.appendChild(esccTitle);

        if (isCaudaEquinaLevel(lesion.level)) {
            const note = document.createElement('div');
            note.className = 'cauda-note';
            note.textContent = 'A este nivel no existe médula espinal (por debajo del cono medular). La escala ESCC/Bilsky se aplica aquí de forma descriptiva a la afectación del saco tecal y las raíces de la cola de caballo.';
            card.appendChild(note);
        }

        card.appendChild(buildFieldGroup('Grado ESCC/Bilsky', `${lesion.id}_escc`, ESCC_OPTIONS, lesion.escc, (val) => {
            lesion.escc = val;
            refresh();
        }));

        return card;
    }

    // ---------- LESIONES: ALTA / BAJA ----------
    function addLesion() {
        lesions.push(freshLesion());
        renderLesions();
        refresh();
    }

    function removeLesion(id) {
        lesions = lesions.filter(l => l.id !== id);
        if (lesions.length === 0) lesions.push(freshLesion());
        renderLesions();
        refresh();
    }

    // ---------- METADATOS ----------
    function updateMeta() {
        meta.indication = document.getElementById('indication').value;
        meta.priorStudy = document.getElementById('priorStudy').value;
        meta.additionalFindings = document.getElementById('additionalFindings').value;
        refresh();
    }

    // ---------- PUNTUACIÓN ----------
    function sinsSubtotal(lesion) {
        return SINS_COMPONENTS.reduce((sum, c) => sum + (parseInt(lesion.sins[c.key], 10) || 0), 0);
    }

    function sinsCategory(score) {
        if (score <= 6) return { txt: 'Estable', cls: 'ok' };
        if (score <= 12) return { txt: 'Indeterminada (potencialmente inestable)', cls: 'warn' };
        return { txt: 'Inestable', cls: 'danger' };
    }

    function renderSinsBanner(lesion) {
        const score = sinsSubtotal(lesion);
        const cat = sinsCategory(score);
        const el = document.getElementById(`sinsBanner_${lesion.id}`);
        if (!el) return;
        el.innerHTML = `
            <span class="pts-total">Puntuación SINS: <b>${score}</b> / 18</span>
            <span class="tr-pill ${cat.cls}">${cat.txt}</span>
        `;
    }

    function refresh() {
        lesions.forEach(renderSinsBanner);
        renderGlobalSummary();
        generateReportText();
    }

    function sortedLesions() {
        return [...lesions].sort((a, b) => levelIndex(a.level) - levelIndex(b.level));
    }

    function renderGlobalSummary() {
        const el = document.getElementById('globalSummary');
        const sorted = sortedLesions();

        let worstScore = -1, worstCat = null;
        sorted.forEach(l => {
            const s = sinsSubtotal(l);
            if (s > worstScore) { worstScore = s; worstCat = sinsCategory(s); }
        });

        const compressiveLevels = sorted.filter(l => esccIsSignificant(l.escc)).map(l => levelInfo(l.level).label);

        el.innerHTML = `
            <span class="pts-total">${sorted.length} ${sorted.length === 1 ? 'lesión vertebral registrada' : 'lesiones vertebrales registradas'}</span>
            <span class="tr-pill ${worstCat.cls}">SINS máx.: ${worstScore}/18 · ${worstCat.txt}</span>
            <span class="rec-text">${compressiveLevels.length > 0 ? `Compresión medular relevante (ESCC 1c-3) en: ${compressiveLevels.join(', ')}` : 'Sin compresión medular relevante (ESCC 1c-3) en los niveles registrados'}</span>
        `;
    }

    // ---------- TEXTO DEL INFORME ----------
    function generateReportText() {
        const sorted = sortedLesions();
        let text = "";

        text += "RM/TC DE COLUMNA — METÁSTASIS VERTEBRALES — INFORME ESTRUCTURADO\n";
        text += "===================================================================\n\n";

        if (meta.indication) text += `Indicación clínica: ${meta.indication}\n`;
        if (meta.priorStudy) text += `Comparación con estudio previo: ${meta.priorStudy}\n`;
        if (meta.indication || meta.priorStudy) text += "\n";

        text += "HALLAZGOS POR NIVEL VERTEBRAL\n";
        text += "--------------------------------\n\n";

        sorted.forEach(lesion => {
            const lvl = levelInfo(lesion.level);
            const score = sinsSubtotal(lesion);
            const cat = sinsCategory(score);
            const escc = esccInfo(lesion.escc);

            text += `Nivel ${lvl.label}\n`;
            text += `  SINS (inestabilidad espinal neoplásica):\n`;
            SINS_COMPONENTS.forEach(c => {
                const opt = c.options.find(o => o.val === lesion.sins[c.key]);
                const pts = parseInt(lesion.sins[c.key], 10) || 0;
                text += `    ${c.label}: ${opt ? opt.txt : 'Pendiente de selección'} (${pts} pt${pts === 1 ? '' : 's'})\n`;
            });
            text += `    Puntuación SINS: ${score}/18 — ${cat.txt}\n`;
            text += `  ESCC/Bilsky: ${escc ? escc.txt : 'Pendiente de selección'}\n`;
            if (isCaudaEquinaLevel(lesion.level)) {
                text += `    (Nivel infracono: la escala ESCC/Bilsky se aplica de forma descriptiva a la afectación del saco tecal/cola de caballo.)\n`;
            }
            text += "\n";
        });

        text += "RESUMEN GLOBAL\n";
        text += "----------------\n";
        text += `Número de lesiones vertebrales registradas: ${sorted.length}\n`;
        text += `Niveles afectados: ${sorted.map(l => levelInfo(l.level).label).join(', ')}\n`;

        let worstScore = -1, worstCat = null, worstLevels = [];
        sorted.forEach(l => {
            const s = sinsSubtotal(l);
            if (s > worstScore) { worstScore = s; worstCat = sinsCategory(s); worstLevels = [levelInfo(l.level).label]; }
            else if (s === worstScore) { worstLevels.push(levelInfo(l.level).label); }
        });
        text += `Puntuación SINS más alta: ${worstScore}/18 (${worstCat.txt}) en ${worstLevels.join(', ')}\n`;

        const compressiveLevels = sorted.filter(l => esccIsSignificant(l.escc));
        if (compressiveLevels.length > 0) {
            text += `Compresión medular relevante (ESCC 1c-3) en: ${compressiveLevels.map(l => `${levelInfo(l.level).label} (${esccInfo(l.escc).txt.split('—')[0].trim()})`).join(', ')}\n`;
        } else {
            text += "Sin compresión medular relevante (ESCC 1c-3) en los niveles registrados.\n";
        }
        text += "\n";

        if (meta.additionalFindings) {
            text += "OTROS HALLAZGOS\n";
            text += "-----------------\n";
            text += `${meta.additionalFindings}\n\n`;
        }

        text += "IMPRESIÓN DIAGNÓSTICA\n";
        text += "======================\n";
        text += `Metástasis vertebrales en ${sorted.length} nivel${sorted.length === 1 ? '' : 'es'} (${sorted.map(l => levelInfo(l.level).label).join(', ')}).\n`;
        text += `Puntuación SINS máxima: ${worstScore}/18 (${worstCat.txt}) en ${worstLevels.join(', ')}.\n`;
        if (worstScore >= 7) {
            text += "Se recomienda valoración por cirugía de columna dado el riesgo de inestabilidad mecánica.\n";
        }
        if (compressiveLevels.length > 0) {
            text += `Compresión medular relevante (ESCC 1c-3) en ${compressiveLevels.map(l => levelInfo(l.level).label).join(', ')}: se recomienda valoración conjunta con oncología radioterápica y/o neurocirugía/cirugía de columna para definir la necesidad de descompresión y planificar el tratamiento local.\n`;
        }
        if (worstScore < 7 && compressiveLevels.length === 0) {
            text += "No se identifican datos de inestabilidad mecánica significativa (SINS) ni de compresión medular relevante (ESCC) en los niveles evaluados.\n";
        }

        document.getElementById('reportPreview').textContent = text;
    }

    // ---------- RESET ----------
    function resetAll() {
        if (!confirm("Esto borrará todos los datos introducidos y comenzará un informe nuevo. ¿Continuar?")) return;
        document.getElementById('indication').value = '';
        document.getElementById('priorStudy').value = '';
        document.getElementById('additionalFindings').value = '';
        meta = { indication: '', priorStudy: '', additionalFindings: '' };
        lesions = [];
        lesions.push(freshLesion());
        renderLesions();
        refresh();
    }

    // ---------- COPIAR ----------
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
