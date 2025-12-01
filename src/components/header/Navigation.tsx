import styled from "styled-components";
import Button from "../common/Button";
import Title from "../common/Title";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuth } from "../../context/AuthContext";

interface Props {
  currentRoute: string;
  onNavigate: (path: string) => void;
}

const navItems = [
  { path: "/", label: "홈" },
  { path: "/books", label: "도서목록" },
  { path: "/cart", label: "장바구니" },
  { path: "/signup", label: "회원가입" },
  { path: "/login", label: "로그인" },
  { path: "/reset-password", label: "비밀번호 초기화" },
];

function Navigation({ currentRoute, onNavigate }: Props) {
  const { user, logout } = useAuth();
  const isActive = (path: string) => {
    if (path === "/books") {
      return currentRoute.startsWith("/books");
    }
    return currentRoute === path;
  };

  return (
    <Wrapper>
      <Brand type="button" onClick={() => onNavigate("/")}>
        <Title size="small">Book Store</Title>
      </Brand>
      <NavLinks>
        {navItems.map(item => (
          <NavButton
            key={item.path}
            type="button"
            $active={isActive(item.path)}
            onClick={() => onNavigate(item.path)}
          >
            {item.label}
          </NavButton>
        ))}
      </NavLinks>
      <RightArea>
        {user ? (
          <UserInfo>
            <span>{user.name}님</span>
            <LogoutButton type="button" onClick={logout}>
              로그아웃
            </LogoutButton>
          </UserInfo>
        ) : (
          <HelperText>로그인하고 더 많은 기능을 사용하세요</HelperText>
        )}
        <ThemeSwitcher />
      </RightArea>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  width: 100%;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: ${({ theme }) => theme.colors.background};
  box-sizing: border-box;
`;

const Brand = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px 0;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 12px;
`;

const NavButton = styled(Button)<{ $active: boolean }>`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.secondary};
  color: ${({ $active, theme }) => ($active ? theme.colors.third : theme.colors.primary)};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
`;

const LogoutButton = styled(Button)`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const HelperText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default Navigation;
