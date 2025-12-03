import styled from "styled-components";

export interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <TabList>
      {items.map(item => (
        <TabButton
          key={item.key}
          type="button"
          $active={item.key === activeKey}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </TabButton>
      ))}
    </TabList>
  );
}

const TabList = styled.div`
  display: inline-flex;
  background: ${({ theme }) => theme.colors.secondary};
  padding: 4px;
  border-radius: 999px;
  gap: 4px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  border: none;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.third};
  color: ${({ $active, theme }) => ($active ? theme.colors.third : theme.colors.primary)};
  box-shadow: ${({ $active }) => ($active ? "0 4px 10px rgba(0,0,0,0.1)" : "none")};
  transition: background 120ms ease, transform 120ms ease;

  &:active {
    transform: translateY(1px);
  }
`;

export default Tabs;
