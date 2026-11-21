import { useCallback, useState } from "react";

const KEY = "theme";

export default function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light",
  );

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.classList.add("theme-transition"); // enables the smooth fade
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    setTheme(next);

    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
  }, [theme]);

  return { theme, isDark: theme === "dark", toggleTheme };
}
