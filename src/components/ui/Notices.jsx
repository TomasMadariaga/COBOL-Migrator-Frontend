import { describeWarning } from "../../lib/warnings";
import { IconAlert, IconX } from "./Icons";

export const Notices = ({ error, warnings = [], model = null, translated = false }) => {
  const items = warnings.map(describeWarning);
  const risks = items.filter((w) => w.level !== "info");
  const infos = items.filter((w) => w.level === "info");

  if (!error && !translated) return null;

  return (
    <div className="mt-6 space-y-3" aria-live="polite">
      {error && (
        <div role="alert" className="p-4 bg-error/10 border border-error rounded-xl text-error">
          <p className="font-semibold flex items-start gap-2"><IconX className="mt-0.5 shrink-0" />{error.message}</p>
          {error.details && <p className="mt-1 text-sm opacity-90">Details: {error.details}</p>}
          {error.partialCode && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer">Show the last attempt (it has errors, do not use it as is)</summary>
              <pre className="mt-2 p-3 bg-code-bg text-code-text rounded-md overflow-x-auto text-xs">{error.partialCode}</pre>
            </details>
          )}
        </div>
      )}

      {translated && risks.length > 0 && (
        <div className="p-4 bg-warning/10 border border-warning/60 rounded-xl">
          <p className="font-semibold text-warning flex items-center gap-2"><IconAlert />Review before using ({risks.length})</p>
          <ul className="mt-2 space-y-2 text-sm">
            {risks.map((w) => (
              <li key={w.code} className="text-text-primary">
                <span className="font-medium">{w.title}</span>
                {w.description && <span className="text-text-secondary"> — {w.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {translated && (
        <p className="text-xs text-text-muted">
          {model && <>Translated by <span className="text-text-secondary">{model}</span>. </>}
          {infos.map((w) => w.description).filter(Boolean).join(" ")}
          {" "}Only a limited set of risk patterns is checked: always verify the result against the original program.
        </p>
      )}
    </div>
  );
};
