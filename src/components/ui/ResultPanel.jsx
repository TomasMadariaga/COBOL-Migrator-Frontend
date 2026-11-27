import { useEffect, useId, useRef, useState } from "react";
import { copyText, downloadText } from "../../lib/files";
import { IconCheck, IconCopy, IconDownload } from "./Icons";

const actionButton =
  "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border border-border text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:border-border";

export const ResultPanel = ({
  value,
  label = "translation.py",
  placeholder = "The translation will appear here...",
  fileName = "translation.py",
  loading = false,
}) => {
  const id = useId();
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const empty = !value;
  const lines = value ? value.split("\n").length : 0;

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    if (!(await copyText(value))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-xl h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <label htmlFor={id} className="font-mono text-xs text-text-secondary">
          <span className="text-text-muted">Python · </span>{label}
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={handleCopy} disabled={empty} className={actionButton}>
            {copied ? <IconCheck className="text-success" /> : <IconCopy />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" onClick={() => downloadText(fileName, value)} disabled={empty} className={actionButton}>
            <IconDownload /> .py
          </button>
        </div>
      </div>
      <div className="relative flex-1 flex">
        <textarea
          id={id}
          readOnly
          value={value}
          className="w-full flex-1 min-h-100 bg-code-bg text-code-text p-4 font-mono text-[13px] leading-6 focus:outline-none resize-y"
          placeholder={loading ? "" : placeholder}
          spellCheck={false}
        />
        {loading && (
          <div className="pointer-events-none absolute inset-0 space-y-3 p-5" aria-hidden="true">
            {[70, 45, 85, 60, 35, 78, 52].map((w, i) => <div key={i} className="skeleton" style={{ width: `${w}%` }} />)}
          </div>
        )}
      </div>
      <div className="border-t border-border px-4 py-1.5 text-xs text-text-muted font-mono">{lines} lines</div>
    </div>
  );
};
