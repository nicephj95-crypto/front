// src/App.tsx
import styled from "styled-components";
import { ThemeProvider } from "styled-components";
import Navigation from "components/header/Navigation";
import { AuthProvider } from "context/AuthContext";
import { ThemeProviderContext, useTheme } from "context/ThemeContext";
import { useHashRouter } from "hooks/useHashRouter";
import { queryClient } from "lib/queryClient";
import { QueryClientProvider } from "lib/reactQuery";
import BookDetail from "pages/bookDetail";
import BookList from "pages/books";
import CartPage from "pages/cart";
import Home from "pages/home";
import Login from "pages/login";
import OrderFormPage from "pages/orderForm";
import OrderHistoryPage from "pages/orderHistory";
import ResetPassword from "pages/resetPassword";
import Signup from "pages/signup";
import LectureLab from "pages/lectureLab";
import { GlobalStyle } from "style/global";
import { themes } from "style/theme";

function AppContent() {
  const { themeName } = useTheme();
  const { route, navigate } = useHashRouter();

  const renderPage = () => {
    if (route.startsWith("/books/")) {
      const [, , bookIdRaw] = route.split("/");
      const bookId = Number(bookIdRaw);
      return <BookDetail bookId={bookId} onNavigate={navigate} />;
    }

    switch (route) {
      case "/signup":
        return <Signup />;
      case "/login":
        return <Login />;
      case "/reset-password":
        return <ResetPassword />;
      case "/books":
        return <BookList />;
      case "/cart":
        return <CartPage />;
      case "/orders/new":
        return <OrderFormPage />;
      case "/orders":
        return <OrderHistoryPage />;
      case "/lectures/today":
        return <LectureLab />;
      case "/":
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider theme={themes[themeName]}>
      <GlobalStyle themeName={themeName} />
      <AuthProvider>
        <AppShell>
          <Navigation currentRoute={route} onNavigate={navigate} />
          <ContentArea>{renderPage()}</ContentArea>
        </AppShell>
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderContext>
        <AppContent />
      </ThemeProviderContext>
    </QueryClientProvider>
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
