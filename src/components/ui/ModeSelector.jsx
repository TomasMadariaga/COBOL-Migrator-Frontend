import { IconCode, IconUpload } from "./Icons";

const tab = (active) =>
  `inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-colors ${
    active ? "bg-bg-tertiary text-text-primary shadow-sm ring-1 ring-border-strong" : "text-text-secondary hover:text-text-primary"
  }`;

export const ModeSelector = ({ mode, setMode }) => {
  return (
    <div className="mb-8 flex justify-center">
      <div role="group" aria-label="Input mode" className="inline-flex gap-1 rounded-lg border border-border bg-bg-secondary p-1">
        <button type="button" aria-pressed={mode === "text"} onClick={() => setMode("text")} className={tab(mode === "text")}>
          <IconCode /> Paste code
        </button>
        <button type="button" aria-pressed={mode === "file"} onClick={() => setMode("file")} className={tab(mode === "file")}>
          <IconUpload /> Upload file
        </button>
      </div>
    </div>
  );
};
