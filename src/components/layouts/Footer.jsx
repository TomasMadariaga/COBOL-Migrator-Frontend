export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border pt-6 text-center text-text-muted text-sm space-y-1">
      <p>The output is checked against GnuCOBOL on test programs only. Always verify the result against the original program before using it.</p>
      <p>COBOL Migrator © {new Date().getFullYear()}</p>
    </footer>
  );
};
