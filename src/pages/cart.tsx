import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { fetchCartItems } from "../api/cartApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import Title from "../components/common/Title";
import { useHashRouter } from "../hooks/useHashRouter";
import { CartItem } from "../models/cart.model";
import { formatNuber } from "../utils/format";

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { navigate } = useHashRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchCartItems();
        setItems(result);
      } catch (err) {
        setError("장바구니를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">장바구니 목록</Title>
        <p>오늘 강의에서 추가한 장바구니 데이터를 확인할 수 있습니다.</p>

        {loading && <StatusMessage>불러오는 중...</StatusMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <CardGrid>
          {items.map(item => (
            <ItemCard key={item.id}>
              <Title size="medium">{item.title}</Title>
              <Meta>
                {item.author} · 수량 {item.quantity}권 · {formatNuber(item.price)}원
              </Meta>
              <PriceRow>
                <span>합계</span>
                <strong>{formatNuber(item.price * item.quantity)}원</strong>
              </PriceRow>
            </ItemCard>
          ))}
        </CardGrid>

        {!loading && !items.length && (
          <StatusMessage>장바구니가 비어 있습니다.</StatusMessage>
        )}

        <SummaryCard>
          <SummaryLine>
            <span>총 상품 금액</span>
            <strong>{formatNuber(totalPrice)}원</strong>
          </SummaryLine>
          <ButtonRow>
            <Button type="button" onClick={() => navigate("/orders/new")}>
              주문서 작성으로 이동
            </Button>
            <GhostButton type="button" onClick={() => navigate("/books")}>
              도서 계속 둘러보기
            </GhostButton>
          </ButtonRow>
        </SummaryCard>
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
  width: min(960px, 92%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
`;

const ItemCard = styled.article`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SummaryCard = styled.section`
  padding: 18px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const SummaryLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export default CartPage;
