import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { fetchCartItems } from "../api/cartApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Title from "../components/common/Title";
import { CartItem, OrderFormValues } from "../models/cart.model";
import { formatNuber } from "../utils/format";

const DELIVERY_THRESHOLD = 50000;
const DELIVERY_FEE = 3000;

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [orderForm, setOrderForm] = useState<OrderFormValues>({
    customerName: "",
    phoneNumber: "",
    address: "",
    deliveryRequest: "",
    paymentMethod: "card",
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchCartItems();
        setItems(data);
      } catch (err) {
        setError("장바구니를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setError("");
    loadCart();
  }, []);

  const handleQuantityChange = (id: number, value: number) => {
    if (!Number.isFinite(value) || value < 1) return;
    setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity: value } : item)));
  };

  const handleRemove = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleInputChange = (
    field: keyof OrderFormValues,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const deliveryFee = items.length === 0 || subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const totalAmount = subtotal + deliveryFee;

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">장바구니</Title>
        <p>담아둔 도서들을 확인하고 주문서를 작성해 보세요.</p>

        {loading && <StatusMessage>불러오는 중...</StatusMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Section>
          <SectionHeader>
            <Title size="medium">장바구니 목록</Title>
            <span>총 {items.length}개</span>
          </SectionHeader>
          <ItemGrid>
            {items.map(item => (
              <ItemCard key={item.id}>
                <div>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemMeta>
                    판매자 {item.seller} · {item.deliveryType}
                  </ItemMeta>
                </div>
                <PriceRow>
                  <span>{formatNuber(item.price)}원</span>
                  <QuantityControl>
                    <label htmlFor={`quantity-${item.id}`}>수량</label>
                    <QuantityInput
                      id={`quantity-${item.id}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={event =>
                        handleQuantityChange(item.id, Number(event.target.value))
                      }
                    />
                    <RemoveButton type="button" onClick={() => handleRemove(item.id)}>
                      삭제
                    </RemoveButton>
                  </QuantityControl>
                </PriceRow>
              </ItemCard>
            ))}
            {items.length === 0 && <EmptyState>장바구니가 비어 있습니다.</EmptyState>}
          </ItemGrid>
        </Section>

        <FormSection onSubmit={handleSubmit}>
          <Title size="medium">주문서 작성</Title>
          <FormGrid>
            <label>
              주문자 이름
              <Input
                required
                placeholder="이름을 입력하세요"
                value={orderForm.customerName}
                onChange={event => handleInputChange("customerName", event)}
              />
            </label>
            <label>
              연락처
              <Input
                required
                placeholder="010-0000-0000"
                value={orderForm.phoneNumber}
                onChange={event => handleInputChange("phoneNumber", event)}
              />
            </label>
            <label>
              배송지
              <Input
                required
                placeholder="서울시 어딘가 123"
                value={orderForm.address}
                onChange={event => handleInputChange("address", event)}
              />
            </label>
            <label>
              배송 요청사항
              <RequestArea
                rows={3}
                placeholder="문 앞에 두고 가주세요"
                value={orderForm.deliveryRequest}
                onChange={event => handleInputChange("deliveryRequest", event)}
              />
            </label>
            <PaymentFieldset>
              <legend>결제수단</legend>
              <RadioLabel>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={orderForm.paymentMethod === "card"}
                  onChange={event => handleInputChange("paymentMethod", event)}
                />
                카드 결제
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={orderForm.paymentMethod === "bank"}
                  onChange={event => handleInputChange("paymentMethod", event)}
                />
                계좌이체
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="payment"
                  value="phone"
                  checked={orderForm.paymentMethod === "phone"}
                  onChange={event => handleInputChange("paymentMethod", event)}
                />
                휴대폰 결제
              </RadioLabel>
            </PaymentFieldset>
          </FormGrid>
          <Button type="submit">주문 내용 확인</Button>
        </FormSection>

        <SummarySection>
          <Title size="medium">주문 내용</Title>
          <SummaryGrid>
            <div>
              <SummaryTitle>주문자 정보</SummaryTitle>
              <SummaryList>
                <li>
                  <strong>이름</strong>
                  <span>{orderForm.customerName || "입력 대기"}</span>
                </li>
                <li>
                  <strong>연락처</strong>
                  <span>{orderForm.phoneNumber || "입력 대기"}</span>
                </li>
                <li>
                  <strong>주소</strong>
                  <span>{orderForm.address || "입력 대기"}</span>
                </li>
                <li>
                  <strong>요청사항</strong>
                  <span>{orderForm.deliveryRequest || "없음"}</span>
                </li>
                <li>
                  <strong>결제수단</strong>
                  <span>
                    {orderForm.paymentMethod === "card"
                      ? "카드 결제"
                      : orderForm.paymentMethod === "bank"
                      ? "계좌이체"
                      : "휴대폰 결제"}
                  </span>
                </li>
              </SummaryList>
            </div>
            <div>
              <SummaryTitle>금액 정보</SummaryTitle>
              <AmountList>
                <li>
                  <span>상품 금액</span>
                  <strong>{formatNuber(subtotal)}원</strong>
                </li>
                <li>
                  <span>배송비</span>
                  <strong>{formatNuber(deliveryFee)}원</strong>
                </li>
                <li>
                  <span>총 결제 금액</span>
                  <TotalAmount>{formatNuber(totalAmount)}원</TotalAmount>
                </li>
              </AmountList>
              {subtotal > 0 && subtotal < DELIVERY_THRESHOLD && (
                <Notice>5만원 이상 주문 시 배송비가 무료로 적용됩니다.</Notice>
              )}
              {submitted && items.length > 0 && orderForm.customerName && orderForm.address && (
                <Success>주문 정보가 준비되었습니다. 결제 단계로 진행할 수 있어요!</Success>
              )}
            </div>
          </SummaryGrid>

          <SummaryTitle>주문 상품</SummaryTitle>
          <OrderList>
            {items.map(item => (
              <li key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <small>
                    {item.deliveryType} · {item.quantity}개
                  </small>
                </div>
                <span>{formatNuber(item.price * item.quantity)}원</span>
              </li>
            ))}
            {items.length === 0 && <EmptyState>상품이 없습니다.</EmptyState>}
          </OrderList>
        </SummarySection>
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
  gap: 20px;
`;

const StatusMessage = styled.p`
  margin: 0;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: crimson;
`;

const Section = styled.section`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemCard = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.third};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ItemTitle = styled.h3`
  margin: 0;
`;

const ItemMeta = styled.p`
  margin: 0;
  font-size: 14px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityInput = styled.input`
  width: 80px;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.third};
  color: ${({ theme }) => theme.colors.primary};
`;

const RemoveButton = styled(Button)`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const EmptyState = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
`;

const FormSection = styled.form`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px 16px;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-weight: 600;
  }
`;

const RequestArea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.third};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
`;

const PaymentFieldset = styled.fieldset`
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SummarySection = styled.section`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px 16px;
`;

const SummaryTitle = styled.h4`
  margin: 0;
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  strong {
    min-width: 72px;
  }
`;

const AmountList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const TotalAmount = styled.span`
  font-size: 18px;
  font-weight: 800;
`;

const Notice = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const Success = styled.p`
  margin: 8px 0 0;
  color: teal;
  font-weight: 700;
`;

const OrderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.third};
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }

  small {
    display: block;
    margin-top: 4px;
  }
`;

export default CartPage;
