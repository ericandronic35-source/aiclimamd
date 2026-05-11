// ============================================================
//  filters.js — AiClima filtre produse
//  Exporturi: initFilters(), applyFilters(), resetFilters()
// ============================================================

/**
 * Construiește checkbox-urile pentru brand, BTU și categorie
 * și le injectează în sidebar.
 *
 * @param {Array}    products      - lista completă de produse din Firestore
 * @param {Object}   activeFilters - obiect filtru reactiv (shared reference)
 * @param {Function} renderFn      - funcție de re-render apelată la orice schimb
 */
export function initFilters(products, activeFilters, renderFn) {
  buildCheckboxGroup({
    containerId: "brandFilters",
    values:      [...new Set(products.map(p => p.brand).filter(Boolean))].sort(),
    filterKey:   "brands",
    activeFilters,
    renderFn,
  });

  buildCheckboxGroup({
    containerId: "btuFilters",
    values:      [...new Set(products.map(p => p.btu).filter(Boolean))].sort((a, b) => +a - +b),
    filterKey:   "btus",
    activeFilters,
    renderFn,
    labelFn:     v => `${Number(v).toLocaleString("ro-MD")} BTU`,
  });

  const CAT_LABELS = {
    split:    "Split",
    multi:    "Multi-Split",
    caseta:   "Casetă",
    duct:     "Duct",
    portabil: "Portabil",
  };
  buildCheckboxGroup({
    containerId: "catFilters",
    values:      [...new Set(products.map(p => p.category).filter(Boolean))],
    filterKey:   "cats",
    activeFilters,
    renderFn,
    labelFn:     v => CAT_LABELS[v] || v,
  });
}

/**
 * Construiește un grup de checkbox-uri dinamic.
 */
function buildCheckboxGroup({ containerId, values, filterKey, activeFilters, renderFn, labelFn }) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (values.length === 0) {
    container.innerHTML = `<p style="font-size:12px;color:#94a3b8">—</p>`;
    return;
  }

  container.innerHTML = values.map(v => {
    const id  = `${filterKey}_${v.toString().replace(/\s+/g, "_")}`;
    const lbl = labelFn ? labelFn(v) : v;
    return `
      <div class="filter-opt">
        <input type="checkbox" id="${id}" value="${v}" data-filter="${filterKey}" />
        <label for="${id}">${lbl}</label>
      </div>`;
  }).join("");

  // Event listeners
  container.querySelectorAll(`input[data-filter="${filterKey}"]`).forEach(cb => {
    cb.addEventListener("change", () => {
      const checked = [...container.querySelectorAll(`input[data-filter="${filterKey}"]:checked`)]
        .map(el => el.value);
      activeFilters[filterKey] = checked;
      renderFn();
    });
  });
}

// ============================================================
//  applyFilters — returnează lista filtrată
// ============================================================
/**
 * @param {Array}  products      - lista completă de produse
 * @param {Object} activeFilters - { brands[], btus[], cats[], priceMin, priceMax, search }
 * @returns {Array} produse filtrate
 */
export function applyFilters(products, activeFilters) {
  return products.filter(p => {

    // ── Brand ──
    if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(p.brand)) {
      return false;
    }

    // ── BTU ──
    if (activeFilters.btus.length > 0 && !activeFilters.btus.includes(String(p.btu))) {
      return false;
    }

    // ── Categorie ──
    if (activeFilters.cats.length > 0 && !activeFilters.cats.includes(p.category)) {
      return false;
    }

    // ── Preț Min ──
    if (activeFilters.priceMin !== null && p.price < activeFilters.priceMin) {
      return false;
    }

    // ── Preț Max ──
    if (activeFilters.priceMax !== null && p.price > activeFilters.priceMax) {
      return false;
    }

    // ── Search text ──
    if (activeFilters.search) {
      const q   = activeFilters.search.toLowerCase();
      const txt = [p.name, p.brand, p.category, p.desc, p.btu]
        .filter(Boolean).join(" ").toLowerCase();
      if (!txt.includes(q)) return false;
    }

    return true;
  });
}

// ============================================================
//  resetFilters — curăță obiectul de filtre
// ============================================================
/**
 * @param {Object} activeFilters - obiect reactiv de resetat
 */
export function resetFilters(activeFilters) {
  activeFilters.brands   = [];
  activeFilters.btus     = [];
  activeFilters.cats     = [];
  activeFilters.priceMin = null;
  activeFilters.priceMax = null;
  activeFilters.search   = "";
}
