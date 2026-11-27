import { IconCode } from "../ui/Icons";

export const Header = () => {
  return (
    <header className="mb-10 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary mb-5">
        <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
        Demo · free-tier model, limited requests
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary flex items-center justify-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-bg text-accent border border-accent/30">
          <IconCode width={24} height={24} />
        </span>
        COBOL Migrator
      </h1>
      <p className="mt-4 mx-auto max-w-2xl text-text-secondary text-lg">
        Translate COBOL to Python without losing decimal arithmetic — and get a warning when something can't be translated faithfully, instead of an invention.
      </p>
    </header>
  );
};
