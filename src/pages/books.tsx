import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchBooks } from "../api/bookApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Title from "../components/common/Title";
import { Book } from "../models/book.model";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        setError("도서 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">도서목록</Title>
        <p>강의에서 만든 데이터 레이어를 사용해 도서 정보를 불러옵니다.</p>

        {loading && <StatusMessage>불러오는 중...</StatusMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Grid>
          {books.map(book => (
            <Card key={book.id}>
              <CardTitle>{book.title}</CardTitle>
              <Meta>{book.author} · {book.publishedYear}년 · {book.category}</Meta>
              <Description>{book.description}</Description>
            </Card>
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

const Card = styled.article`
  padding: 16px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
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

const StatusMessage = styled.p`
  margin: 0;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: crimson;
`;

export default BookList;
