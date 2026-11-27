import { useId } from "react";
import { EXAMPLES } from "../../lib/examples";

export const CodeEditor = ({ value, setCobol, label = "program.cbl", placeholder = "Paste your COBOL code here..." }) => {
  const id = useId();
  const lines = value ? value.split("\n").length : 0;

  return (
    <div className="bg-bg-secondary border border-border rounded-xl h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <label htmlFor={id} className="font-mono text-xs text-text-secondary">
          <span className="text-text-muted">COBOL · </span>{label}
        </label>
        <select
          aria-label="Load an example"
          value=""
          onChange={(e) => {
            const ex = EXAMPLES.find((x) => x.id === e.target.value);
            if (ex) setCobol(ex.code);
          }}
          className="rounded-md border border-border bg-bg-tertiary px-2 py-1 text-xs text-text-secondary hover:border-border-strong cursor-pointer"
        >
          <option value="" disabled>Load example…</option>
          {EXAMPLES.map((ex) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
        </select>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => setCobol(e.target.value)}
        className="w-full flex-1 min-h-100 bg-code-bg text-code-text p-4 font-mono text-[13px] leading-6 focus:outline-none resize-y"
        placeholder={placeholder}
        spellCheck={false}
      />
      <div className="border-t border-border px-4 py-1.5 text-xs text-text-muted font-mono">{lines} lines · {value.length.toLocaleString()} chars</div>
    </div>
  );
};
