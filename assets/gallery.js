/* A dependency-free palette study. No audio or DAW UI is simulated. */
"use strict";

(() => {
  const byId = (id) => document.getElementById(id);
  const elements = {
    inspector: byId("inspector"), grid: byId("theme-grid"), filters: byId("group-filters"),
    search: byId("theme-search"), count: byId("result-count"), empty: byId("empty-state"),
    download: byId("download-theme"), copy: byId("copy-command"), status: byId("action-status"),
    fallback: byId("copy-fallback"), command: byId("command-text"),
  };
  const state = { catalog: null, group: "all", search: "", selected: null };
  const primaryTokens = [["canvas", "Canvas"], ["panelRaised", "Raised"], ["accent", "Accent"], ["textMuted", "Muted"], ["text", "Text"]];
  const detailTokens = [["canvas", "Canvas"], ["panel", "Panel"], ["text", "Text"], ["textMuted", "Muted text"], ["accent", "Accent"], ["focus", "Focus"]];
  const escapeHash = (id) => `#theme=${encodeURIComponent(id)}`;
  const groupFor = (id) => state.catalog.groups.find((group) => group.id === id);
  const create = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = value;
    return element;
  };

  function getThemeFromHash() {
    try {
      const id = new URLSearchParams(location.hash.slice(1)).get("theme");
      return state.catalog.themes.find((theme) => theme.id === id);
    } catch { return undefined; }
  }

  function commandFor(theme) {
    return `node scripts/export-bitwig.mjs --theme ${theme.id} --base /path/to/default.bte --out /path/to/${theme.id}.bte`;
  }

  function selectTheme(theme, updateUrl = true) {
    state.selected = theme;
    for (const [name, colour] of Object.entries(theme.colors)) elements.inspector.style.setProperty(`--t-${name}`, colour);
    const group = groupFor(theme.group);
    byId("selected-group").textContent = group ? group.name.toUpperCase() : theme.group.toUpperCase();
    byId("selected-name").textContent = theme.name;
    byId("selected-id").textContent = theme.id.toUpperCase();
    byId("selected-description").textContent = theme.description;
    byId("selected-index").textContent = `${String(state.catalog.themes.indexOf(theme) + 1).padStart(2, "0")} / ${state.catalog.themes.length}`;
    byId("primary-swatches").replaceChildren(...primaryTokens.map(([key, name]) => {
      const swatch = create("div", "primary-swatch");
      const colour = create("span", "swatch-colour");
      colour.style.backgroundColor = theme.colors[key];
      colour.setAttribute("aria-hidden", "true");
      swatch.append(colour, create("span", "swatch-label", name), create("span", "swatch-value", theme.colors[key].toUpperCase()));
      return swatch;
    }));
    byId("token-list").replaceChildren(...detailTokens.map(([key, name]) => {
      const row = create("div", "token");
      const dot = create("span", "token-dot");
      dot.style.backgroundColor = theme.colors[key];
      dot.setAttribute("aria-hidden", "true");
      row.append(dot, create("span", "token-label", name), create("span", "token-value", theme.colors[key].toUpperCase()));
      return row;
    }));
    elements.download.href = `themes/${theme.group}/${theme.id}.json`;
    elements.download.download = `${theme.id}.json`;
    elements.download.removeAttribute("aria-disabled");
    elements.download.setAttribute("aria-label", `Download ${theme.name} palette as JSON`);
    elements.copy.disabled = false;
    elements.copy.setAttribute("aria-label", `Copy Bitwig export command for ${theme.name}`);
    elements.command.value = commandFor(theme);
    elements.fallback.hidden = true;
    elements.status.textContent = "";
    elements.inspector.setAttribute("aria-busy", "false");
    for (const card of elements.grid.querySelectorAll(".theme-card")) card.setAttribute("aria-pressed", String(card.dataset.theme === theme.id));
    if (updateUrl) history.replaceState(null, "", escapeHash(theme.id));
  }

  function createCard(theme) {
    const button = create("button", "theme-card");
    button.type = "button";
    button.dataset.theme = theme.id;
    button.setAttribute("aria-pressed", String(state.selected && state.selected.id === theme.id));
    const group = groupFor(theme.group);
    button.setAttribute("aria-label", `Preview ${theme.name}, ${group ? group.name : theme.group} family`);
    const properties = { canvas: "canvas", panel: "panel", raised: "panelRaised", control: "control", line: "line", accent: "accent", "accent-muted": "accentMuted", "accent-bright": "accentBright", text: "text", "text-muted": "textMuted" };
    for (const [property, token] of Object.entries(properties)) button.style.setProperty(`--card-${property}`, theme.colors[token]);
    const study = create("span", "card-study");
    study.setAttribute("aria-hidden", "true");
    const surfaces = create("span", "card-surface-lines");
    const accents = create("span", "card-accent-line");
    for (let index = 0; index < 4; index += 1) { surfaces.append(create("i")); accents.append(create("i")); }
    study.append(surfaces, accents);
    const info = create("span", "card-info");
    const top = create("span", "card-topline");
    top.append(create("span", "theme-name", theme.name), create("span", "theme-number", String(state.catalog.themes.indexOf(theme) + 1).padStart(2, "0")));
    const bottom = create("span", "card-bottomline");
    bottom.append(create("span", "theme-family", group ? group.name : theme.group), create("span", "selection-marker", "Selected"));
    info.append(top, bottom);
    button.append(study, info);
    button.addEventListener("click", () => {
      selectTheme(theme);
      elements.status.textContent = `${theme.name} selected. Palette study updated.`;
      byId("selected-name").focus({ preventScroll: true });
      elements.inspector.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    });
    return button;
  }

  function renderCollection() {
    const query = state.search.trim().toLocaleLowerCase();
    const themes = state.catalog.themes.filter((theme) => {
      const group = groupFor(theme.group);
      const words = [theme.name, theme.id, theme.description, group?.name, ...(theme.aliases || [])].join(" ").toLocaleLowerCase();
      return (state.group === "all" || theme.group === state.group) && (!query || words.includes(query));
    });
    elements.grid.replaceChildren(...themes.map(createCard));
    elements.count.textContent = `${themes.length} of ${state.catalog.themes.length} palettes`;
    elements.empty.hidden = themes.length > 0;
    for (const filter of elements.filters.querySelectorAll("button")) filter.setAttribute("aria-pressed", String(filter.dataset.group === state.group));
  }

  function renderFilters() {
    const groups = [{ id: "all", name: "All themes" }, ...state.catalog.groups];
    elements.filters.replaceChildren(...groups.map((group) => {
      const filter = create("button", "group-filter", group.name);
      filter.type = "button";
      filter.dataset.group = group.id;
      filter.setAttribute("aria-pressed", String(group.id === state.group));
      if (group.description) filter.title = group.description;
      filter.addEventListener("click", () => { state.group = group.id; renderCollection(); });
      return filter;
    }));
  }

  elements.search.addEventListener("input", () => {
    state.search = elements.search.value;
    if (state.catalog) renderCollection();
  });
  byId("reset-filters").addEventListener("click", () => {
    state.group = "all";
    state.search = "";
    elements.search.value = "";
    renderCollection();
    elements.search.focus();
  });
  elements.copy.addEventListener("click", async () => {
    if (!state.selected) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(commandFor(state.selected));
      elements.status.textContent = "Export command copied. Replace the example file paths before running.";
    } catch {
      elements.fallback.hidden = false;
      elements.command.focus();
      elements.command.select();
      elements.status.textContent = "Select and copy the command shown above. Replace the example file paths before running.";
    }
  });
  window.addEventListener("hashchange", () => {
    if (!state.catalog) return;
    const theme = getThemeFromHash();
    if (theme) selectTheme(theme, false);
  });

  fetch("catalog.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
      return response.json();
    })
    .then((catalog) => {
      if (!Array.isArray(catalog.themes) || !Array.isArray(catalog.groups) || !catalog.themes.length) throw new Error("Invalid catalog");
      state.catalog = catalog;
      document.querySelectorAll(".signature-spectrum i").forEach((swatch, index) => {
        const representative = catalog.themes.find((theme) => theme.group === catalog.groups[index]?.id);
        if (representative) swatch.style.backgroundColor = representative.colors.accent;
      });
      renderFilters();
      const initial = getThemeFromHash() || catalog.themes.find((theme) => theme.id === catalog.defaultTheme) || catalog.themes[0];
      selectTheme(initial, false);
      renderCollection();
    })
    .catch((error) => {
      console.error("Unable to load the theme collection:", error);
      byId("load-error").hidden = false;
      elements.count.textContent = "Collection unavailable";
      byId("selected-name").textContent = "Collection unavailable";
      byId("selected-description").textContent = "Visit the repository for the palette source and installation guide.";
      elements.inspector.setAttribute("aria-busy", "false");
    });
})();
