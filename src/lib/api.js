const REQUEST_TIMEOUT_MS = 960_000; 

export class ApiError extends Error {
  constructor(message, { status = null, details = null, partialCode = null, cancelled = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.partialCode = partialCode;
    this.cancelled = cancelled;
  }
}

function resolveApiUrl(apiUrl) {
  const url = apiUrl ?? import.meta.env?.VITE_API_URL;
  if (!url || url === "undefined") {
    throw new ApiError("Configuration error: VITE_API_URL is not set. Check your .env file.");
  }
  return String(url).replace(/\/+$/, "");
}

function createRequest(externalSignal, timeoutMs) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onAbort = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", onAbort);
  }

  return {
    signal: controller.signal,
    wasTimeout: () => timedOut,
    done: () => {
      clearTimeout(timer);
      externalSignal?.removeEventListener("abort", onAbort);
    },
  };
}

async function request(path, init, { signal, apiUrl, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  const base = resolveApiUrl(apiUrl);
  const req = createRequest(signal, timeoutMs);

  try {
    let response;
    try {
      response = await fetch(`${base}${path}`, { ...init, signal: req.signal });
    } catch (err) {
      if (err.name === "AbortError") {
        if (req.wasTimeout()) {
          throw new ApiError("The server took too long to respond. Try a smaller program or try again.");
        }
        throw new ApiError("Cancelled", { cancelled: true });
      }
      throw new ApiError("Could not reach the server. Check that the backend is running and the API URL is correct.");
    }

    if (!response.ok) throw await readError(response);
    return { response, read: (fn) => fn(response) };
  } finally {
    req.done();
  }
}

async function readError(response) {
  const data = await response.json().catch(() => ({}));
  const { status } = response;
  let message = data.error;

  if (!message) {
    if (status === 401) message = "The server requires an API key.";
    else if (status === 429) message = "Too many requests. Wait a moment and try again.";
    else message = `Server error (${status}).`;
  }
  if (status === 429) {
    const wait = response.headers.get("Retry-After");
    if (wait) message = `${message} (retry in ~${wait}s)`;
  }
  return new ApiError(message, { status, details: data.details ?? null, partialCode: data.code ?? null });
}

export async function translateText(code, options = {}) {
  const { response } = await request(
    "/text",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) },
    options,
  );
  const data = await response.json();
  return { code: data.translatedCode, model: data.model ?? null, warnings: data.warnings ?? [] };
}

function untranslatedMessage(code) {
  const found = [...code.matchAll(/raise\s+NotImplementedError\(\s*(["'])(.*?)\1\s*\)/g)].map((m) => m[2]);
  return found.length ? `Not translated (the program stops there): ${[...new Set(found)].join("; ")}` : undefined;
}

function filenameFromDisposition(header, fallback) {
  const match = /filename="?([^";]+)"?/i.exec(header || "");
  return match ? match[1] : fallback;
}

export async function translateFile(file, options = {}) {
  const formData = new FormData();
  formData.append("file", file);

  const { response } = await request("/file", { method: "POST", body: formData }, options);
  const code = await response.text();

  const codes = (response.headers.get("X-Translation-Warnings") || "").split(",").map((c) => c.trim()).filter(Boolean);
  return {
    code,
    model: response.headers.get("X-Translation-Model") || null,
    warnings: codes.map((c) => (c === "NOT_TRANSLATED" ? { code: c, message: untranslatedMessage(code) } : { code: c })),
    fileName: filenameFromDisposition(response.headers.get("Content-Disposition"), file.name.replace(/\.[^.]+$/, "") + ".py"),
  };
}
