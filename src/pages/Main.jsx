import { useState } from "react";
import { TextMode } from "../components/ui/TextMode";
import { FileMode } from "../components/ui/FileMode";
import { Footer } from "../components/layouts/Footer";
import { Header } from "../components/layouts/Header";
import { ModeSelector } from "../components/ui/ModeSelector";

export const Main = () => {
  const [mode, setMode] = useState("text");

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        <ModeSelector mode={mode} setMode={setMode} />

        <div hidden={mode !== "text"}>
          <TextMode />
        </div>
        <div hidden={mode !== "file"}>
          <FileMode />
        </div>

        <Footer />
      </div>
    </div>
  );
};
