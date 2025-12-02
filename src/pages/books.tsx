import styled from "styled-components";

import AsyncSnippet from "components/common/AsyncSnippet";
import Footer from "components/common/Footer";
import Header from "components/common/Header";
import Title from "components/common/Title";
import { useBooksQuery } from "hooks/useBooksQuery";
import { useHashRouter } from "hooks/useHashRouter";

function BookList() {
  const { navigate } = useHashRouter();
  const { data: books = [], isLoading, error } = useBooksQuery();
  const errorMessage = error ? "도서 목록을 불러오는 중 오류가 발생했습니다." : "";

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">도서목록</Title>
        <p>강의에서 만든 데이터 레이어를 사용해 도서 정보를 불러옵니다.</p>

        <AsyncSnippet isLoading={isLoading} error={errorMessage} />

        <Grid>
          {books.map(book => (
            <CardButton
              key={book.id}
              type="button"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              <CardTitle>{book.title}</CardTitle>
              <Meta>
                {book.author} · {book.publishedYear}년 · {book.category}
              </Meta>
              <Description>{book.description}</Description>
              <ActionHint>상세 정보 보기 →</ActionHint>
            </CardButton>
          ))}
        </Grid>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: ${({ theme }) => theme.colors.third};
`;

const MainContent = styled.main`
  width: min(960px, 90%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
`;

const CardButton = styled.button`
  padding: 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
  cursor: pointer;
  text-align: left;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const ActionHint = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export default BookList;
