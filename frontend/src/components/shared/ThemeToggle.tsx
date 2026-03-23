import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-700 transition hover:scale-105 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

