import { useMemo } from "react";
import styled from "styled-components";
import Button from "components/common/Button";
import Footer from "components/common/Footer";
import Header from "components/common/Header";
import Input from "components/common/Input";
import SnippetCard from "components/common/SnippetCard";
import Title from "components/common/Title";
import { bannerNotices, reviewHighlights } from "data/homeContent";
import { listBooks } from "data/bookRepository";
import { todayLectureSnippets } from "data/snippets";
import { formatNuber } from "utils/format";

const COUNT = 10000;

const getNewBooks = () =>
  listBooks()
    .slice()
    .sort((a, b) => b.publishedYear - a.publishedYear)
    .slice(0, 3);

const getBestBooks = () =>
  listBooks()
    .slice(0, 3)
    .map((book, index) => ({
      ...book,
      highlight: index === 0 ? "리뷰 1,200+ · 별점 4.9" : "추천 800+ · 재방문 92%",
    }));

function Home() {
  const newBooks = useMemo(() => getNewBooks(), []);
  const bestBooks = useMemo(() => getBestBooks(), []);

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Hero>
          <div>
            <Title size="large">오늘의 강의: 메인 화면 섹션 &amp; 모바일 대응</Title>
            <Description>
              방문자 수 <strong>{formatNuber(COUNT)}</strong> · 리뷰/신간/베스트/배너 섹션을 모두 모바일 대응으로 묶었습니다.
            </Description>
            <TagRow>
              <Tag>리뷰 섹션</Tag>
              <Tag>신간 섹션</Tag>
              <Tag>베스트 섹션</Tag>
              <Tag>배너 섹션(1)(2)</Tag>
              <Tag>모바일 대응</Tag>
            </TagRow>
          </div>
          <HeroCard>
            <small>기존 기능 유지</small>
            <strong>강의 실습 연계 홈화면</strong>
            <p>리뷰 피드, 도서 리스트, CTA를 기존 흐름과 자연스럽게 연결했습니다.</p>
            <Button onClick={() => (window.location.hash = "#/lectures/today")}>강의 실습 바로가기</Button>
          </HeroCard>
        </Hero>

        <FormArea>
          <Title size="medium">책 검색</Title>
          <Input placeholder="검색어를 입력하세요" />
          <Button>검색하기</Button>
        </FormArea>

        <Section id="reviews">
          <SectionHeader>
            <Title size="medium">메인 화면 - 리뷰 섹션</Title>
            <SectionMeta>강의에서 만든 리뷰 흐름을 홈에서 빠르게 확인</SectionMeta>
          </SectionHeader>
          <CardGrid>
            {reviewHighlights.map(item => (
              <Card key={item.title}>
                <CardBadge>리뷰</CardBadge>
                <CardTitle>{item.title}</CardTitle>
                <p>{item.summary}</p>
                <CardFooter>
                  <span>{item.detail}</span>
                  <Score>★ {item.rating.toFixed(1)}</Score>
                </CardFooter>
              </Card>
            ))}
          </CardGrid>
        </Section>

        <Section id="new">
          <SectionHeader>
            <Title size="medium">메인 화면 - 신간 섹션</Title>
            <SectionMeta>publishedYear 기준 최신 도서</SectionMeta>
          </SectionHeader>
          <CardGrid>
            {newBooks.map(book => (
              <Card key={book.id}>
                <CardBadge>신간</CardBadge>
                <CardTitle>{book.title}</CardTitle>
                <p>{book.description}</p>
                <CardFooter>
                  <span>{book.author}</span>
                  <span>{book.publishedYear}년</span>
                </CardFooter>
              </Card>
            ))}
          </CardGrid>
        </Section>

        <Section id="best">
          <SectionHeader>
            <Title size="medium">메인 화면 - 베스트 섹션</Title>
            <SectionMeta>집계된 하이라이트 지표와 함께 노출</SectionMeta>
          </SectionHeader>
          <CardGrid>
            {bestBooks.map(book => (
              <Card key={book.id}>
                <CardBadge tone="warning">BEST</CardBadge>
                <CardTitle>{book.title}</CardTitle>
                <p>{book.description}</p>
                <CardFooter>
                  <span>{book.author}</span>
                  <strong>{book.highlight}</strong>
                </CardFooter>
              </Card>
            ))}
          </CardGrid>
        </Section>

        <BannerArea>
          {bannerNotices.map(banner => (
            <Banner key={banner.title} tone={banner.tone}>
              <div>
                <small>{banner.title}</small>
                <strong>{banner.description}</strong>
              </div>
              <Button onClick={() => (window.location.hash = banner.link)}>{banner.actionLabel}</Button>
            </Banner>
          ))}
        </BannerArea>

        <SnippetSection>
          <Title size="medium">오늘의 강의 스니펫</Title>
          <SnippetGrid>
            {todayLectureSnippets.map(snippet => (
              <SnippetCard key={snippet.title} {...snippet} />
            ))}
          </SnippetGrid>
        </SnippetSection>
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
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Description = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

const HeroCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
`;

const FormArea = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.secondary};
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

const SectionMeta = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
`;

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
`;

const CardBadge = styled.span<{ tone?: "warning" }>`
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ tone, theme }) => (tone === "warning" ? theme.colors.primary : theme.colors.third)};
  color: ${({ tone, theme }) => (tone === "warning" ? theme.colors.secondary : theme.colors.primary)};
  font-weight: 700;
  font-size: 12px;
`;

const CardTitle = styled.h3`
  margin: 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.primary};
`;

const Score = styled.span`
  font-weight: 700;
`;

const BannerArea = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
`;

const Banner = styled.div<{ tone: string }>`
  padding: 16px;
  border-radius: 12px;
  background: ${({ tone, theme }) =>
    tone === "purple"
      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
      : `linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.third} 100%)`};
  color: ${({ tone }) => (tone === "purple" ? "#ffffff" : "inherit")};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const SnippetSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SnippetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
`;

export default Home;
