// src/components/header/ThemeSwitcher.tsx
import styled from "styled-components";
import Button from "../common/Button";
import { useTheme } from "../../context/ThemeContext";

function ThemeSwitcher() {
  const { themeName, toggleTheme } = useTheme();
  return (
    <SwitcherButton type="button" onClick={toggleTheme}>
      테마: {themeName}
    </SwitcherButton>
  );
}

const SwitcherButton = styled(Button)`
  padding: 8px 12px;
`;

export default ThemeSwitcher;
