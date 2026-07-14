const STATUS_META = {
    disponible:   { label: "Disponible",    className: "status-live" },
    beta:         { label: "Beta",          className: "status-beta" },
    proximamente: { label: "Próximamente",  className: "status-soon" }
};

function renderApps() {
    const grid = document.getElementById('appsGrid');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('appsCount');
    grid.innerHTML = '';

    if (!APPS_MANIFEST || APPS_MANIFEST.length === 0) {
        emptyState.style.display = 'block';
        if (countEl) countEl.textContent = '';
        return;
    }
    emptyState.style.display = 'none';

    const availableCount = APPS_MANIFEST.filter(a => a.status === "disponible" || a.status === "beta").length;
    if (countEl) {
        countEl.textContent = `${availableCount} de ${APPS_MANIFEST.length} disponible${availableCount === 1 ? '' : 's'}`;
    }

    APPS_MANIFEST.forEach(app => {
        const status = STATUS_META[app.status] || STATUS_META.proximamente;
        const isAvailable = app.status === "disponible" || app.status === "beta";

        const card = document.createElement(isAvailable ? 'a' : 'div');
        card.className = `app-card ${isAvailable ? '' : 'app-card-disabled'}`;
        if (isAvailable) {
            card.href = app.path;
        }

        const tags = (app.tags || [])
            .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
            .join('');

        card.innerHTML = `
            <div class="app-card-header">
                <h3>${escapeHtml(app.title)}</h3>
                <span class="status-pill ${status.className}">${status.label}</span>
            </div>
            <p class="app-card-desc">${escapeHtml(app.description)}</p>
            <div class="app-card-tags">${tags}</div>
            <div class="app-card-cta">${isAvailable ? 'Abrir herramienta →' : 'En desarrollo'}</div>
        `;

        grid.appendChild(card);
    });
}

// Utilidad mínima para evitar que un título/descripción/etiqueta con
// caracteres especiales rompa el marcado al insertarse vía innerHTML.
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', renderApps);
