// src/App.tsx
import { ThemeProvider } from "styled-components";
import { ThemeProviderContext, useTheme } from "./context/ThemeContext";
import { themes } from "./style/theme";
import { GlobalStyle } from "./style/global";
import ThemeSwitcher from "./components/header/ThemeSwitcher";
import Home from "./pages/home";

function AppContent() {
  const { themeName } = useTheme();
  return (
    <ThemeProvider theme={themes[themeName]}>
      <GlobalStyle themeName={themeName} />
      <ThemeSwitcher />
      <Home />
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeProviderContext>
      <AppContent />
    </ThemeProviderContext>
  );
}

export default App;
