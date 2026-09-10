import { parseBte, renderBte } from "../scripts/bitwig.mjs";

export const MAX_BASE_BYTES = 2 * 1024 * 1024;

/** Read and validate a user-selected file without sending its contents anywhere. */
export async function readDefaultFile(file) {
  if (!file || typeof file.text !== "function") throw new Error("Choose a complete default.bte from your installed Bitwig version.");
  if (file.size > MAX_BASE_BYTES) throw new Error("The base file is too large. Choose a .bte file no larger than 2 MiB.");
  if (file.size === 0) throw new Error("The base file is empty. Choose a complete default.bte.");
  const text = await file.text();
  if (text.length > MAX_BASE_BYTES) throw new Error("The base file is too large. Choose a .bte file no larger than 2 MiB.");
  parseBte(text, { requireComplete: true });
  return text;
}

/** Bind local export controls; every download is rebuilt for the current theme. */
export function initBrowserExport({ fileInput, downloadLink, status, clearButton }) {
  let theme = null;
  let baseText = null;
  let baseName = "";
  let readVersion = 0;
  let downloadUrl = null;

  function report(message, kind = "idle") {
    status.textContent = message;
    status.dataset.state = kind;
  }

  function discardDownload() {
    downloadLink.removeAttribute("href");
    downloadLink.removeAttribute("download");
    downloadLink.setAttribute("aria-disabled", "true");
    downloadLink.setAttribute("tabindex", "-1");
    downloadLink.textContent = theme ? `Download ${theme.id}.bte` : "Download selected theme .bte";
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = null;
  }

  function refreshDownload() {
    discardDownload();
    if (baseText === null || !theme) return;
    try {
      const result = renderBte(baseText, theme);
      downloadUrl = URL.createObjectURL(new Blob([result.text], { type: "text/plain;charset=utf-8" }));
      downloadLink.href = downloadUrl;
      downloadLink.download = `${theme.id}.bte`;
      downloadLink.removeAttribute("aria-disabled");
      downloadLink.removeAttribute("tabindex");
      downloadLink.setAttribute("aria-label", `Download ${theme.name} as a complete BTE theme`);
      report(`${baseName} loaded. ${theme.name} is ready to export with all ${result.colorCount} colour keys.`, "ready");
    } catch (error) {
      baseText = null;
      baseName = "";
      fileInput.value = "";
      clearButton.disabled = true;
      report(error instanceof Error ? error.message : "This theme could not be exported. Choose your default.bte again.", "error");
    }
  }

  function clear() {
    readVersion += 1;
    baseText = null;
    baseName = "";
    fileInput.value = "";
    clearButton.disabled = true;
    discardDownload();
    report("Choose your version’s complete default.bte to enable export.");
  }

  fileInput.addEventListener("change", async () => {
    const version = ++readVersion;
    const file = fileInput.files?.[0];
    baseText = null;
    baseName = "";
    discardDownload();
    clearButton.disabled = !file;
    if (!file) {
      report("Choose your version’s complete default.bte to enable export.");
      return;
    }
    report("Reading and checking your file in this browser…", "reading");
    try {
      const text = await readDefaultFile(file);
      if (version !== readVersion) return;
      baseText = text;
      baseName = file.name;
      if (theme) refreshDownload();
      else report(`${baseName} loaded. Waiting for the palette collection.`, "ready");
    } catch (error) {
      if (version !== readVersion) return;
      fileInput.value = "";
      clearButton.disabled = true;
      report(error instanceof Error ? error.message : "The file could not be read. Choose your default.bte again.", "error");
    }
  });

  clearButton.addEventListener("click", clear);
  downloadLink.addEventListener("click", (event) => {
    if (!downloadUrl) event.preventDefault();
  });

  // Replaced/cleared downloads are revoked above. Do not revoke on pagehide:
  // BFCache restores this document and its current download link on Back.
  // The browser releases remaining object URLs when the document is destroyed.
  clear();
  return {
    setTheme(selectedTheme) {
      theme = selectedTheme;
      refreshDownload();
    },
    clear,
  };
}
