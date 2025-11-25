import styled from "styled-components";

function Footer() {
  return (
    <FooterWrapper>
      <Divider />
      <FooterText>copyright(c), 2024, book store.</FooterText>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  width: 100%;
  padding: 16px 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Divider = styled.hr`
  width: min(960px, 90%);
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.primary};
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default Footer;
