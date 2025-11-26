import styled from "styled-components";
import Button from "../common/Button";
import Title from "../common/Title";
import ThemeSwitcher from "./ThemeSwitcher";

interface Props {
  currentRoute: string;
  onNavigate: (path: string) => void;
}

const navItems = [
  { path: "/", label: "홈" },
  { path: "/signup", label: "회원가입" },
];

function Navigation({ currentRoute, onNavigate }: Props) {
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
            $active={currentRoute === item.path}
            onClick={() => onNavigate(item.path)}
          >
            {item.label}
          </NavButton>
        ))}
      </NavLinks>
      <ThemeSwitcher />
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

export default Navigation;
