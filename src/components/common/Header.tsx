import styled from "styled-components";
import Title from "./Title";

function Header() {
  return (
    <HeaderStyle>
      <Title size="large">Welcome to the Book Store</Title>
    </HeaderStyle>
  );
}

const HeaderStyle = styled.header`
  width: 100%;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: center;
`;

export default Header;
