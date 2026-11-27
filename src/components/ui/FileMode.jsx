import { useEffect, useRef, useState } from "react";
import { ResultPanel } from "./ResultPanel";
import { Notices } from "./Notices";
import { ApiError, translateFile } from "../../lib/api";
import { formatElapsed, useElapsed } from "../../lib/useElapsed";
import { IconUpload } from "./Icons";

const ACCEPTED = /\.(cob|cbl|cobol)$/i;

export const FileMode = () => {
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const inputRef = useRef(null);
  const elapsed = useElapsed(loading);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const processFile = async (file) => {
    if (!file || loading) return;

    setError(null);
    setResult(null);
    setFileName(file.name);

    if (!ACCEPTED.test(file.name)) {
      setError(new ApiError("Only .cob, .cbl or .cobol files are accepted"));
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);

    try {
      setResult(await translateFile(file, { signal: controller.signal }));
    } catch (err) {
      if (!err.cancelled) setError(err);
    } finally {
      controllerRef.current = null;
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl px-6 py-16 text-center transition-colors ${
          dragging ? "border-accent bg-accent-bg" : "border-border-strong bg-bg-secondary"
        }`}
      >
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-xl bg-accent-bg text-accent border border-accent/30">
          <IconUpload width={26} height={26} />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Upload a COBOL file</h2>
        <p className="text-text-secondary mb-6">
          Drag and drop a <span className="font-mono text-text-primary">.cob</span>, <span className="font-mono text-text-primary">.cbl</span> or{" "}
          <span className="font-mono text-text-primary">.cobol</span> file here
        </p>
        <input ref={inputRef} type="file" accept=".cob,.cbl,.cobol" onChange={handleInput} disabled={loading} className="sr-only" aria-label="Choose a COBOL file" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Choose file
        </button>

        {loading && (
          <div role="status" className="mt-6 mx-auto max-w-lg p-3 bg-accent-bg border border-accent/40 rounded-lg text-accent flex flex-wrap items-center justify-center gap-3">
            <span className="spinner" aria-hidden="true"></span>
            <span>Translating {fileName}… {formatElapsed(elapsed)}</span>
            <button
              type="button"
              onClick={() => controllerRef.current?.abort()}
              className="px-3 py-1 text-sm rounded-md border border-accent/60 hover:bg-accent hover:text-white transition-colors"
            >
              Cancel
            </button>
            <p className="w-full text-xs text-text-secondary">Large programs are translated in parts and can take a few minutes.</p>
          </div>
        )}
      </div>

      <Notices error={error} warnings={result?.warnings} model={result?.model} translated={Boolean(result)} />

      {result && (
        <div className="mt-6">
          <ResultPanel value={result.code} fileName={result.fileName} label={result.fileName} />
        </div>
      )}
    </>
  );
};
