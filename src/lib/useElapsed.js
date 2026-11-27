import { useEffect, useState } from "react";

export function useElapsed(active) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const start = Date.now();
    const id = setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => {
      clearInterval(id);
      setSeconds(0);
    };
  }, [active]);
  return seconds;
}

export const formatElapsed = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
