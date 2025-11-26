// src/App.tsx
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import Navigation from "./components/header/Navigation";
import { ThemeProviderContext, useTheme } from "./context/ThemeContext";
import { useHashRouter } from "./hooks/useHashRouter";
import Home from "./pages/home";
import Signup from "./pages/signup";
import { GlobalStyle } from "./style/global";
import { themes } from "./style/theme";

function AppContent() {
  const { themeName } = useTheme();
  const { route, navigate } = useHashRouter();

  const renderPage = () => {
    switch (route) {
      case "/signup":
        return <Signup />;
      case "/":
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider theme={themes[themeName]}>
      <GlobalStyle themeName={themeName} />
      <AppShell>
        <Navigation currentRoute={route} onNavigate={navigate} />
        <ContentArea>{renderPage()}</ContentArea>
      </AppShell>
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

const AppShell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.third};
`;

const ContentArea = styled.div`
  display: flex;
  justify-content: center;
`;

export default App;
