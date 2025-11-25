import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { HeadingSize } from "../../style/theme";

interface Props {
  children?: ReactNode;
  size?: HeadingSize;
}

function Title({ children, size = "medium" }: Props) {
  return <TitleStyle $size={size}>{children}</TitleStyle>;
}

const sizeStyles: Record<HeadingSize, ReturnType<typeof css>> = {
  large: css`
    font-size: 28px;
    font-weight: 800;
  `,
  medium: css`
    font-size: 22px;
    font-weight: 700;
  `,
  small: css`
    font-size: 18px;
    font-weight: 600;
  `,
};

const TitleStyle = styled.div<{ $size: HeadingSize }>`
  ${({ $size }) => sizeStyles[$size]};
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

export default Title;
