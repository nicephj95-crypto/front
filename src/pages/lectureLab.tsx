import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Title from "../components/common/Title";
import Dropdown from "../components/ui/Dropdown";
import Tabs from "../components/ui/Tabs";
import Toast from "../components/ui/Toast";
import Modal from "../components/ui/Modal";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewForm from "../components/reviews/ReviewForm";
import Button from "../components/common/Button";
import { listBooks } from "../data/bookRepository";
import { fetchReviewFeed, restartMockServer, submitReview } from "../api/reviewApi";
import { Review, ReviewPayload } from "../models/review.model";
import { formatDistanceToNow } from "../utils/date";

const PAGE_SIZE = 5;
const tabs = [
  { key: "feed", label: "리뷰 피드" },
  { key: "write", label: "리뷰 작성" },
];

function LectureLab() {
  const books = useMemo(() => listBooks(), []);
  const bookMap = useMemo(() => new Map(books.map(book => [book.id, book])), [books]);

  const [activeTab, setActiveTab] = useState<string>("feed");
  const [selectedBookId, setSelectedBookId] = useState<string | number>("all");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [serverStatus, setServerStatus] = useState("모킹 서버와 동기화 대기 중");

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadFeed = useCallback(
    async (page: number, reset = false) => {
      setLoading(true);
      setError("");
      setServerStatus(`모킹 서버 호출 중 (page ${page})`);

      try {
        const result = await fetchReviewFeed({
          page,
          limit: PAGE_SIZE,
          bookId: selectedBookId === "all" ? undefined : Number(selectedBookId),
        });

        setReviews(prev => (reset ? result.items : [...prev, ...result.items]));
        setHasMore(result.hasMore);
        setNextPage(result.nextPage ?? page + 1);
        setServerStatus(`응답 완료 · ${result.items.length}건 수신`);
      } catch (err) {
        setError("리뷰를 불러오는 데 실패했어요. 잠시 후 다시 시도해주세요.");
        setServerStatus("응답 실패");
      } finally {
        setLoading(false);
      }
    },
    [selectedBookId]
  );

  useEffect(() => {
    if (activeTab !== "feed") return;
    setReviews([]);
    setHasMore(true);
    setNextPage(1);
    loadFeed(1, true);
  }, [selectedBookId, loadFeed, activeTab]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore || activeTab !== "feed") return;
    loadFeed(nextPage);
  }, [activeTab, hasMore, loadFeed, loading, nextPage]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        handleLoadMore();
      }
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  const handleSubmitReview = async (payload: ReviewPayload) => {
    setLoading(true);
    try {
      await submitReview({
        author: payload.author,
        bookId: payload.bookId,
        rating: payload.rating,
        content: payload.content,
      });
      setToastMessage("리뷰가 등록되어 피드에 반영되었어요!");
      setActiveTab("feed");
      setSelectedBookId("all");
      loadFeed(1, true);
    } catch (err) {
      setToastMessage("리뷰 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const resetMock = async () => {
    setServerStatus("모킹 서버 리셋 중...");
    try {
      await restartMockServer();
      setToastMessage("모킹 서버 데이터를 초기화했어요.");
      loadFeed(1, true);
    } finally {
      setServerStatus("모킹 서버와 동기화 완료");
    }
  };

  const filterOptions = [
    { label: "전체 도서", value: "all" },
    ...books.map(book => ({ label: `${book.title}`, value: book.id })),
  ];

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Hero>
          <div>
            <Title size="large">오늘의 강의: 메인 화면 섹션 &amp; 모바일 대응</Title>
            <p>리뷰/신간/베스트/배너 섹션을 모킹 서버와 함께 실습하며 반응형 UI를 완성해요.</p>
            <TagList>
              <Tag>리뷰 섹션</Tag>
              <Tag>신간 섹션</Tag>
              <Tag>베스트 섹션</Tag>
              <Tag>배너 섹션</Tag>
              <Tag>모바일 대응</Tag>
              <Tag>리뷰 목록</Tag>
              <Tag>리뷰 작성</Tag>
              <Tag>무한스크롤</Tag>
            </TagList>
          </div>
          <StatusCard>
            <StatusTitle>모킹 서버 상태</StatusTitle>
            <StatusText>{serverStatus}</StatusText>
            <Button type="button" onClick={resetMock}>
              초기 데이터로 리셋
            </Button>
          </StatusCard>
        </Hero>

        <ControlBar>
          <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} />
          <Dropdown
            label="도서 필터"
            value={selectedBookId}
            onChange={event => setSelectedBookId(event.target.value)}
            options={filterOptions}
          />
        </ControlBar>

        {activeTab === "feed" && (
          <Section>
            <SectionHeader>
              <Title size="medium">리뷰 목록</Title>
              <span>{loading ? "불러오는 중" : `${reviews.length}개 표시 중`}</span>
            </SectionHeader>

            {error && <ErrorText>{error}</ErrorText>}

            <ReviewGrid>
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  book={bookMap.get(review.bookId)}
                  onClick={() => setSelectedReview(review)}
                />
              ))}
            </ReviewGrid>

            {loading && <InlineStatus>모킹 서버에서 데이터를 받아오는 중...</InlineStatus>}
            {!loading && reviews.length === 0 && <InlineStatus>표시할 리뷰가 없습니다.</InlineStatus>}
            <Sentinel ref={loadMoreRef}>무한 스크롤 트리거</Sentinel>
            {!hasMore && <InlineStatus>모든 리뷰를 확인했습니다.</InlineStatus>}
          </Section>
        )}

        {activeTab === "write" && (
          <Section>
            <SectionHeader>
              <Title size="medium">리뷰 작성</Title>
              <span>모킹 서버로 전송 후 토스트로 결과를 확인하세요.</span>
            </SectionHeader>
            <ReviewForm onSubmit={handleSubmitReview} submitting={loading} />
          </Section>
        )}
      </MainContent>
      <Footer />

      <Modal
        open={!!selectedReview}
        title={selectedReview ? `${bookMap.get(selectedReview.bookId)?.title ?? "도서"} 리뷰` : "리뷰"}
        onClose={() => setSelectedReview(null)}
      >
        {selectedReview && (
          <ModalBody>
            <ModalMeta>
              <strong>{selectedReview.author}</strong>
              <span>★ {selectedReview.rating}점</span>
            </ModalMeta>
            <p>{selectedReview.content}</p>
            <small>{formatDistanceToNow(selectedReview.createdAt)} · {selectedReview.createdAt}</small>
          </ModalBody>
        )}
      </Modal>

      <Toast open={!!toastMessage} message={toastMessage} onClose={() => setToastMessage(null)} />
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
  width: min(1040px, 92%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

const StatusCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StatusTitle = styled.h3`
  margin: 0;
`;

const StatusText = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const ControlBar = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
`;

const InlineStatus = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

const ErrorText = styled.p`
  color: crimson;
  margin: 0;
`;

const Sentinel = styled.div`
  height: 1px;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default LectureLab;
