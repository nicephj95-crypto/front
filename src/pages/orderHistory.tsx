import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchOrders } from "../api/orderApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import Title from "../components/common/Title";
import { useHashRouter } from "../hooks/useHashRouter";
import { Order } from "../models/order.model";
import { formatNuber } from "../utils/format";

const paymentMethodLabel = (method: Order["paymentMethod"]) => {
  switch (method) {
    case "card":
      return "카드";
    case "transfer":
      return "계좌이체";
    case "mobile":
      return "모바일";
    default:
      return method;
  }
};

function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { navigate } = useHashRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        setError("주문 내역을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <HeaderRow>
          <div>
            <Title size="large">주문 내역</Title>
            <p>오늘 강의에서 만든 주문 데이터 흐름을 한눈에 확인하세요.</p>
          </div>
          <Button type="button" onClick={() => navigate("/orders/new")}>새 주문 작성</Button>
        </HeaderRow>

        {loading && <StatusMessage>불러오는 중...</StatusMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <OrderList>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <div>
                  <OrderId>{order.id}</OrderId>
                  <Customer>{order.customerName}</Customer>
                  <SmallText>{new Date(order.createdAt).toLocaleString()}</SmallText>
                </div>
                <MethodBadge>{paymentMethodLabel(order.paymentMethod)}</MethodBadge>
              </OrderHeader>

              <ItemList>
                {order.items.map((item, index) => (
                  <ItemRow key={`${order.id}-${index}`}>
                    <span>
                      {item.title} <Meta>({item.quantity}권)</Meta>
                    </span>
                    <strong>{formatNuber(item.price * item.quantity)}원</strong>
                  </ItemRow>
                ))}
              </ItemList>

              <OrderFooter>
                <SmallText>{order.requestMemo || "요청사항 없음"}</SmallText>
                <Total>총 {formatNuber(order.totalPrice)}원</Total>
              </OrderFooter>
            </OrderCard>
          ))}
        </OrderList>

        {!loading && !orders.length && (
          <StatusMessage>
            아직 주문 내역이 없습니다. 주문서를 작성해보세요.
          </StatusMessage>
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
  width: min(1040px, 94%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const OrderList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 14px;
`;

const OrderCard = styled.article`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const OrderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const OrderId = styled.p`
  margin: 0;
  font-weight: 900;
`;

const Customer = styled.p`
  margin: 4px 0 0;
  font-weight: 700;
`;

const SmallText = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const MethodBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const OrderFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Total = styled.span`
  font-weight: 900;
`;

const StatusMessage = styled.p`
  margin: 0;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: crimson;
`;

export default OrderHistoryPage;
