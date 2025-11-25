import styled from 'styled-components';

function Header() {
    return (
        <HeaderStyle>
            <h1>Welcome to the Book Store</h1>
        </HeaderStyle>
    );
}

const HeaderStyle = styled.header`
    background-color: ${({ theme }) => theme.colors.background};

    h1 {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

export default Header;