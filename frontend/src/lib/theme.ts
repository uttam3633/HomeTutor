export const THEME_KEY = "guruhome-theme";

export function setTheme(mode: "light" | "dark") {
  document.documentElement.classList.toggle("dark", mode === "dark");
  localStorage.setItem(THEME_KEY, mode);
}

export function getTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

