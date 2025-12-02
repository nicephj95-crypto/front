import styled from "styled-components";

interface SnippetCardProps {
  title: string;
  description: string;
  code: string;
}

function SnippetCard({ title, description, code }: SnippetCardProps) {
  return (
    <Card>
      <Header>
        <strong>{title}</strong>
        <p>{description}</p>
      </Header>
      <CodeBlock>
        <code>{code}</code>
      </CodeBlock>
    </Card>
  );
}

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.85;
  }
`;

const CodeBlock = styled.pre`
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.third};
  color: ${({ theme }) => theme.colors.primary};
  white-space: pre-wrap;
  font-family: "Fira Code", "Courier New", monospace;
  font-size: 14px;
`;

export default SnippetCard;
