import { SelectHTMLAttributes } from "react";
import styled from "styled-components";

interface Option {
  label: string;
  value: string | number;
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
}

function Dropdown({ label, options, ...rest }: DropdownProps) {
  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <StyledSelect {...rest}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </Wrapper>
  );
}

const Wrapper = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Label = styled.span`
  font-size: 14px;
`;

const StyledSelect = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.third};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
`;

export default Dropdown;
