import { useEffect, useState } from "react";

import { getTheme, setTheme } from "../lib/theme";

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">(getTheme());

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setThemeState((current) => (current === "light" ? "dark" : "light")),
  };
}
