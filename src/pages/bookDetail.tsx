import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchBookById } from "../api/bookApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import Title from "../components/common/Title";
import { Book } from "../models/book.model";

interface Props {
  bookId: number;
  onNavigate: (path: string) => void;
}

function BookDetail({ bookId, onNavigate }: Props) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadBook = async () => {
      if (!Number.isFinite(bookId)) {
        setError("잘못된 도서 번호입니다.");
        setLoading(false);
        return;
      }

      try {
        const result = await fetchBookById(bookId);
        if (!result) {
          setError("도서를 찾을 수 없습니다.");
          return;
        }
        setBook(result);
      } catch (err) {
        setError("도서 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setError("");
    setBook(null);
    loadBook();
  }, [bookId]);

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">도서 상세</Title>
        <p>도서 목록에서 선택한 항목을 상세하게 확인할 수 있습니다.</p>

        {loading && <StatusMessage>불러오는 중...</StatusMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {book && (
          <DetailCard>
            <DetailHeader>
              <div>
                <MetaLabel>카테고리</MetaLabel>
                <MetaBadge>{book.category}</MetaBadge>
              </div>
              <MetaText>
                출간연도 <strong>{book.publishedYear}</strong>
              </MetaText>
            </DetailHeader>

            <Title size="medium">{book.title}</Title>
            <MetaText>저자 {book.author}</MetaText>
            <Description>{book.description}</Description>

            <ButtonRow>
              <Button type="button" onClick={() => onNavigate("/books")}>
                목록으로 돌아가기
              </Button>
              <GhostButton type="button" onClick={() => onNavigate("/")}>
                홈으로 이동
              </GhostButton>
            </ButtonRow>
          </DetailCard>
        )}
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
  width: min(720px, 90%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailCard = styled.section`
  padding: 20px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const MetaLabel = styled.span`
  display: inline-block;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

const MetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const MetaText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  line-height: 1.6;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const GhostButton = styled(Button)`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const StatusMessage = styled.p`
  margin: 0;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: crimson;
`;

export default BookDetail;
