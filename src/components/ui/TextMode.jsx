import { useEffect, useRef, useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { ResultPanel } from "./ResultPanel";
import { Notices } from "./Notices";
import { translateText } from "../../lib/api";
import { formatElapsed, useElapsed } from "../../lib/useElapsed";
import { IconArrow } from "./Icons";

const SAMPLE = `IDENTIFICATION DIVISION.
    PROGRAM-ID. SUMA.
    DATA DIVISION.
    WORKING-STORAGE SECTION.
    01 A PIC 9(3) VALUE 10.
    01 B PIC 9(3) VALUE 20.
    01 RESULT PIC 9(3).
    PROCEDURE DIVISION.
        COMPUTE RESULT = A + B
        DISPLAY "RESULT: " RESULT
        STOP RUN.`;

export const TextMode = () => {
  const [loading, setLoading] = useState(false);
  const [cobolCode, setCobolCode] = useState(SAMPLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const elapsed = useElapsed(loading);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleTextTranslate = async () => {
    if (!cobolCode.trim() || loading) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setResult(await translateText(cobolCode, { signal: controller.signal }));
    } catch (err) {
      if (!err.cancelled) setError(err);
    } finally {
      controllerRef.current = null;
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === "Enter" && handleTextTranslate()}>
          <CodeEditor value={cobolCode} setCobol={setCobolCode} />
        </div>
        <ResultPanel value={result?.code ?? ""} loading={loading} />
      </div>

      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          type="button"
          onClick={handleTextTranslate}
          disabled={loading || !cobolCode.trim()}
          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              Translating… {formatElapsed(elapsed)}
            </>
          ) : (
            <>Translate to Python <IconArrow /></>
          )}
        </button>
        {!loading && <span className="hidden sm:inline text-xs text-text-muted">Ctrl + Enter</span>}
        {loading && (
          <button
            type="button"
            onClick={() => controllerRef.current?.abort()}
            className="px-4 py-3 rounded-lg border border-border text-text-secondary hover:text-accent hover:border-accent transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {loading && elapsed >= 20 && (
        <p className="mt-3 text-center text-sm text-text-muted">Large programs are translated in parts and can take a few minutes.</p>
      )}

      <Notices error={error} warnings={result?.warnings} model={result?.model} translated={Boolean(result)} />
    </>
  );
};
