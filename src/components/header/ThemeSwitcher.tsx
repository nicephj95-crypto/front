// src/components/header/ThemeSwitcher.tsx
import { useTheme } from "../../context/ThemeContext";

function ThemeSwitcher() {
  const { themeName, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{themeName}</button>;
}

export default ThemeSwitcher;