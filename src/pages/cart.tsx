import { FormEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { fetchCartItems } from "../api/cartApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Title from "../components/common/Title";
import { CartItem } from "../models/cart.model";

const DELIVERY_FEE = 3000;
const FREE_SHIPPING_THRESHOLD = 30000;

type OrderFormState = {
  receiver: string;
  phone: string;
  address: string;
  request: string;
};

const defaultFormState: OrderFormState = {
  receiver: "",
  phone: "",
  address: "",
  request: "",
};

function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<OrderFormState>(defaultFormState);
  const [orderNote, setOrderNote] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCartItems();
        setItems(data);
      } catch (err) {
        setError("장바구니를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleQuantityChange = (id: number, delta: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const nextQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQuantity };
      })
    );
  };

  const totals = useMemo(() => {
    const productTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryCost = productTotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_FEE;
    return {
      productTotal,
      deliveryCost,
      finalTotal: productTotal + deliveryCost,
    };
  }, [items]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderNote(
      `주문서가 저장되었습니다. (${form.receiver} / ${form.phone}) 배송지를 확인해주세요.`
    );
  };

  const handleInputChange = (key: keyof OrderFormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">장바구니 · 주문서 작성</Title>
        <p>담긴 도서를 확인하고 주문 정보를 작성한 뒤 주문 내용을 검토하세요.</p>

        {loading && <StatusMessage>불러오는 중...</StatusMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!loading && !error && (
          <ContentGrid>
            <Section>
              <SectionHeader>
                <Title size="medium">장바구니 목록</Title>
                <span>수량을 조정해 예상 금액을 바로 확인할 수 있습니다.</span>
              </SectionHeader>

              <Card>
                {items.map(item => (
                  <CartRow key={item.id}>
                    <div>
                      <CartTitle>{item.title}</CartTitle>
                      <OptionText>{item.option}</OptionText>
                    </div>
                    <RowRight>
                      <QuantityControls>
                        <QuantityButton
                          type="button"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          aria-label={`${item.title} 수량 줄이기`}
                        >
                          -
                        </QuantityButton>
                        <QuantityValue>{item.quantity}</QuantityValue>
                        <QuantityButton
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          aria-label={`${item.title} 수량 늘리기`}
                        >
                          +
                        </QuantityButton>
                      </QuantityControls>
                      <Price>{(item.price * item.quantity).toLocaleString()}원</Price>
                    </RowRight>
                  </CartRow>
                ))}
              </Card>

              <SummaryCard>
                <SummaryRow>
                  <span>상품 금액</span>
                  <strong>{totals.productTotal.toLocaleString()}원</strong>
                </SummaryRow>
                <SummaryRow>
                  <span>배송비</span>
                  <strong>
                    {totals.deliveryCost === 0
                      ? "무료"
                      : `${totals.deliveryCost.toLocaleString()}원`}
                  </strong>
                </SummaryRow>
                <SummaryRow>
                  <span>총 결제 예정</span>
                  <FinalPrice>{totals.finalTotal.toLocaleString()}원</FinalPrice>
                </SummaryRow>
              </SummaryCard>
            </Section>

            <Section as="form" onSubmit={handleSubmit}>
              <SectionHeader>
                <Title size="medium">주문서 작성</Title>
                <span>받는 사람과 배송 요청 사항을 입력해 주세요.</span>
              </SectionHeader>

              <Card $gap="12px">
                <label>
                  <FieldLabel>받는 사람</FieldLabel>
                  <Input
                    required
                    value={form.receiver}
                    onChange={e => handleInputChange("receiver", e.target.value)}
                    placeholder="이름을 입력하세요"
                  />
                </label>
                <label>
                  <FieldLabel>연락처</FieldLabel>
                  <Input
                    required
                    value={form.phone}
                    onChange={e => handleInputChange("phone", e.target.value)}
                    placeholder="010-0000-0000"
                  />
                </label>
                <label>
                  <FieldLabel>배송지</FieldLabel>
                  <Input
                    required
                    value={form.address}
                    onChange={e => handleInputChange("address", e.target.value)}
                    placeholder="주소를 입력하세요"
                  />
                </label>
                <label>
                  <FieldLabel>배송 요청 사항</FieldLabel>
                  <Input
                    value={form.request}
                    onChange={e => handleInputChange("request", e.target.value)}
                    placeholder="부재 시 경비실에 맡겨주세요"
                  />
                </label>
                <Button type="submit">주문서 저장</Button>
                {orderNote && <HelpText>{orderNote}</HelpText>}
              </Card>

              <SectionHeader>
                <Title size="medium">주문 내용</Title>
                <span>입력한 정보를 기준으로 결제 전 주문 요약을 확인합니다.</span>
              </SectionHeader>
              <Card $gap="12px">
                <div>
                  <FieldLabel>배송지</FieldLabel>
                  <SummaryText>{form.address || "배송지를 입력하세요"}</SummaryText>
                </div>
                <div>
                  <FieldLabel>연락처</FieldLabel>
                  <SummaryText>
                    {form.receiver && form.phone
                      ? `${form.receiver} · ${form.phone}`
                      : "수령인 정보를 입력하세요"}
                  </SummaryText>
                </div>
                <div>
                  <FieldLabel>요청 사항</FieldLabel>
                  <SummaryText>{form.request || "특별 요청 없음"}</SummaryText>
                </div>
                <div>
                  <FieldLabel>결제 예정 금액</FieldLabel>
                  <FinalPrice>{totals.finalTotal.toLocaleString()}원</FinalPrice>
                </div>
              </Card>
            </Section>
          </ContentGrid>
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
  width: min(1080px, 92%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatusMessage = styled.p`
  margin: 0;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: crimson;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const Card = styled.div<{ $gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap ?? "8px"};
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const CartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:last-of-type {
    border-bottom: none;
  }
`;

const CartTitle = styled.p`
  margin: 0;
  font-weight: 700;
`;

const OptionText = styled.span`
  display: inline-block;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
`;

const RowRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityControls = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 800;
  cursor: pointer;
`;

const QuantityValue = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  font-weight: 700;
`;

const Price = styled.span`
  min-width: 90px;
  text-align: right;
  font-weight: 700;
`;

const SummaryCard = styled(Card)`
  gap: 10px;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FinalPrice = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const FieldLabel = styled.p`
  margin: 0 0 6px 0;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const HelpText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const SummaryText = styled.p`
  margin: 0;
  line-height: 1.5;
`;

export default Cart;
