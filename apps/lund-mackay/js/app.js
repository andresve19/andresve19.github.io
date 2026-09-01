    // ---------- CONFIGURACIÓN DEL SCORE DE LUND-MACKAY ----------
    const SINUS_FIELDS = [
        { key: 'maxilar', label: 'Seno maxilar' },
        { key: 'etmoidesAnt', label: 'Celdillas etmoidales anteriores' },
        { key: 'etmoidesPost', label: 'Celdillas etmoidales posteriores' },
        { key: 'esfenoidal', label: 'Seno esfenoidal' },
        { key: 'frontal', label: 'Seno frontal' }
    ];

    const SINUS_OPTIONS = [
        { val: '0', txt: 'No opacificado (aireado)' },
        { val: '1', txt: 'Opacificación parcial' },
        { val: '2', txt: 'Opacificación total' }
    ];

    const OMC_OPTIONS = [
        { val: '0', txt: 'No obstruido' },
        { val: '2', txt: 'Obstruido' }
    ];

    const SIDES = [
        { key: 'D', label: 'Derecho' },
        { key: 'I', label: 'Izquierdo' }
    ];

    const LATERALITY_OPTIONS = [
        { val: 'none', txt: 'No presente' },
        { val: 'D', txt: 'Derecha' },
        { val: 'I', txt: 'Izquierda' },
        { val: 'B', txt: 'Bilateral' }
    ];

    const SEPTUM_OPTIONS = [
        { val: 'none', txt: 'No significativa / rectilíneo' },
        { val: 'D', txt: 'Convexidad hacia la derecha' },
        { val: 'I', txt: 'Convexidad hacia la izquierda' },
        { val: 'B', txt: 'Sigmoideo, con contacto/impacto turbinal' }
    ];

    const VARIANTS = [
        { key: 'conchaBullosa', label: 'Concha bullosa', options: LATERALITY_OPTIONS },
        { key: 'celdaHaller', label: 'Celda de Haller (infraorbitaria)', options: LATERALITY_OPTIONS },
        { key: 'celulaOnodi', label: 'Célula de Onodi (esfenoetmoidal posterior)', options: LATERALITY_OPTIONS },
        { key: 'laminaPapiracea', label: 'Dehiscencia de la lámina papirácea', options: LATERALITY_OPTIONS },
        { key: 'canalOptico', label: 'Trayecto dehiscente del canal del nervio óptico', options: LATERALITY_OPTIONS },
        { key: 'arteriaEtmoidal', label: 'Procidencia de la arteria etmoidal anterior', options: LATERALITY_OPTIONS },
        { key: 'septum', label: 'Desviación septal', options: SEPTUM_OPTIONS }
    ];

    function freshData() {
        const sides = {};
        SIDES.forEach(s => {
            const side = { omc: '0' };
            SINUS_FIELDS.forEach(f => { side[f.key] = '0'; });
            sides[s.key] = side;
        });
        const variants = {};
        VARIANTS.forEach(v => { variants[v.key] = 'none'; });
        return { sides, variants, additionalFindings: '' };
    }

    let data = freshData();

    window.onload = function () {
        renderSidePanel('D');
        renderSidePanel('I');
        renderVariants();
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
            const ptsTxt = o.val === '1' ? '1 pt' : `${o.val} pts`;
            optLabel.innerHTML = `<span><input type="radio" name="${name}" value="${o.val}"><span class="opt-label">${o.txt}</span></span><span class="pts">${ptsTxt}</span>`;
            const input = optLabel.querySelector('input');
            input.checked = (currentVal === o.val);
            input.addEventListener('change', () => onChange(o.val));
            grp.appendChild(optLabel);
        });

        wrap.appendChild(grp);
        return wrap;
    }

    function renderSidePanel(sideKey) {
        const container = document.getElementById('panel' + sideKey);
        container.innerHTML = '';

        SINUS_FIELDS.forEach(f => {
            container.appendChild(buildFieldGroup(f.label, `${sideKey}_${f.key}`, SINUS_OPTIONS, data.sides[sideKey][f.key], (val) => {
                data.sides[sideKey][f.key] = val;
                refresh();
            }));
        });

        container.appendChild(buildFieldGroup('Complejo osteomeatal (CDM)', `${sideKey}_omc`, OMC_OPTIONS, data.sides[sideKey].omc, (val) => {
            data.sides[sideKey].omc = val;
            refresh();
        }));
    }

    function renderVariants() {
        const container = document.getElementById('variantsContainer');
        container.innerHTML = '';

        VARIANTS.forEach(v => {
            const wrap = document.createElement('div');
            wrap.className = 'form-group';

            const lbl = document.createElement('label');
            lbl.textContent = v.label;
            wrap.appendChild(lbl);

            const sel = document.createElement('select');
            v.options.forEach(o => {
                const opt = document.createElement('option');
                opt.value = o.val;
                opt.textContent = o.txt;
                if (data.variants[v.key] === o.val) opt.selected = true;
                sel.appendChild(opt);
            });
            sel.addEventListener('change', () => { data.variants[v.key] = sel.value; refresh(); });

            wrap.appendChild(sel);
            container.appendChild(wrap);
        });
    }

    // ---------- METADATOS ----------
    function updateMeta() {
        data.additionalFindings = document.getElementById('additionalFindings').value;
        refresh();
    }

    // ---------- PUNTUACIÓN ----------
    function sideSubtotal(sideKey) {
        const s = data.sides[sideKey];
        const sinusSum = SINUS_FIELDS.reduce((sum, f) => sum + (parseInt(s[f.key], 10) || 0), 0);
        return sinusSum + (parseInt(s.omc, 10) || 0);
    }

    function renderScoreBanner(id, label, score, max) {
        document.getElementById(id).innerHTML = `
            <span class="pts-total">${label}: <b>${score}</b> / ${max}</span>
            <span class="tr-pill" style="background:var(--accent)">${score}</span>
        `;
    }

    function refresh() {
        const dScore = sideSubtotal('D');
        const iScore = sideSubtotal('I');
        const total = dScore + iScore;

        renderScoreBanner('scoreBannerD', 'Subtotal lado derecho', dScore, 12);
        renderScoreBanner('scoreBannerI', 'Subtotal lado izquierdo', iScore, 12);

        document.getElementById('scoreBannerTotal').innerHTML = `
            <span class="pts-total">Puntuación total de Lund-Mackay</span>
            <span class="tr-pill" style="background:var(--primary); font-size:13pt;">${total} / 24</span>
            <span class="rec-text">Derecho ${dScore}/12 · Izquierdo ${iScore}/12</span>
        `;

        generateReportText(dScore, iScore, total);
    }

    // ---------- TEXTO DEL INFORME ----------
    function generateReportText(dScore, iScore, total) {
        let text = "";

        text += "TC DE SENOS PARANASALES — INFORME ESTRUCTURADO\n";
        text += "================================================\n\n";

        text += "HALLAZGOS — SCORE DE LUND-MACKAY\n";
        text += "----------------------------------\n\n";

        SIDES.forEach(side => {
            const s = data.sides[side.key];
            text += `Lado ${side.label.toLowerCase()}\n`;
            SINUS_FIELDS.forEach(f => {
                const opt = SINUS_OPTIONS.find(o => o.val === s[f.key]);
                const pts = parseInt(s[f.key], 10) || 0;
                text += `  ${f.label}: ${opt ? opt.txt : 'Pendiente de selección'} (${pts} pt${pts === 1 ? '' : 's'})\n`;
            });
            const omcOpt = OMC_OPTIONS.find(o => o.val === s.omc);
            const omcPts = parseInt(s.omc, 10) || 0;
            text += `  Complejo osteomeatal: ${omcOpt ? omcOpt.txt : 'Pendiente de selección'} (${omcPts} pts)\n`;
            const subtotal = sideSubtotal(side.key);
            text += `  Subtotal lado ${side.label.toLowerCase()}: ${subtotal}/12\n\n`;
        });

        text += `PUNTUACIÓN TOTAL DE LUND-MACKAY: ${total}/24 (derecho ${dScore}/12, izquierdo ${iScore}/12)\n\n`;

        const activeVariants = VARIANTS.filter(v => data.variants[v.key] && data.variants[v.key] !== 'none');
        if (activeVariants.length > 0) {
            text += "VARIANTES ANATÓMICAS Y HALLAZGOS ASOCIADOS\n";
            text += "----------------------------------------------\n";
            activeVariants.forEach(v => {
                const opt = v.options.find(o => o.val === data.variants[v.key]);
                text += `  ${v.label}: ${opt.txt}\n`;
            });
            text += "\n";
        }

        if (data.additionalFindings) {
            text += "OTROS HALLAZGOS\n";
            text += "-----------------\n";
            text += `${data.additionalFindings}\n\n`;
        }

        text += "IMPRESIÓN DIAGNÓSTICA\n";
        text += "======================\n";
        text += `Score de Lund-Mackay total: ${total}/24 (derecho ${dScore}/12, izquierdo ${iScore}/12).\n`;
        if (total === 0) {
            text += "Senos paranasales y complejos osteomeatales sin opacificación significativa.\n";
        } else {
            text += "Correlacionar con la clínica y, si procede, con la exploración endoscópica (score de Lund-Kennedy) antes de establecer el diagnóstico de rinosinusitis crónica.\n";
        }
        if (activeVariants.length > 0) {
            text += "Se describen variantes anatómicas de relevancia quirúrgica (ver detalle arriba); considerar en la planificación de cirugía endoscópica nasosinusal, si está indicada.\n";
        }

        document.getElementById('reportPreview').textContent = text;
    }

    // ---------- RESET ----------
    function resetAll() {
        if (!confirm("Esto borrará todos los datos introducidos y comenzará un informe nuevo. ¿Continuar?")) return;
        document.getElementById('additionalFindings').value = '';
        data = freshData();
        renderSidePanel('D');
        renderSidePanel('I');
        renderVariants();
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
