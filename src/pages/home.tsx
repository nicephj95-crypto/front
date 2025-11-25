import styled from "styled-components";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Title from "../components/common/Title";
import { formatNuber } from "../utils/format";

const COUNT = 10000;

function Home() {
  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">오늘의 북 스토어</Title>
        <Description>
          방문자 수: <strong>{formatNuber(COUNT)}</strong>
        </Description>
        <FormArea>
          <Title size="medium">책 검색</Title>
          <Input placeholder="검색어를 입력하세요" />
          <Button>검색하기</Button>
        </FormArea>
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

const Description = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const FormArea = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.secondary};
`;

export default Home;
