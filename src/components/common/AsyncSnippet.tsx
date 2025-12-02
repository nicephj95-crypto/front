import styled from "styled-components";

interface AsyncSnippetProps {
  isLoading?: boolean;
  error?: string | null;
  loadingText?: string;
}

function AsyncSnippet({ isLoading, error, loadingText = "불러오는 중..." }: AsyncSnippetProps) {
  if (!isLoading && !error) return null;

  return (
    <Container>
      {isLoading && <StatusMessage>{loadingText}</StatusMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StatusMessage = styled.p`
  margin: 0;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: crimson;
`;

export default AsyncSnippet;
