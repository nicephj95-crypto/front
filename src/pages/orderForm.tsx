import { FormEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { fetchCartItems } from "../api/cartApi";
import { submitOrder } from "../api/orderApi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Title from "../components/common/Title";
import { useHashRouter } from "../hooks/useHashRouter";
import { CartItem } from "../models/cart.model";
import { OrderDraft } from "../models/order.model";
import { formatNuber } from "../utils/format";

interface FormState {
  customerName: string;
  address: string;
  paymentMethod: string;
  requestMemo: string;
}

const initialFormState: FormState = {
  customerName: "",
  address: "",
  paymentMethod: "card",
  requestMemo: "",
};

function OrderFormPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [items, setItems] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const { navigate } = useHashRouter();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchCartItems();
        setItems(data);
      } catch (err) {
        setMessage("장바구니 정보를 불러오는 중 문제가 발생했습니다.");
      }
    };

    loadCart();
  }, []);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) {
      setMessage("장바구니에 담긴 상품이 없습니다.");
      return;
    }

    const draft: OrderDraft = {
      ...form,
      items,
    };

    setStatus("loading");
    setMessage("");
    try {
      const order = await submitOrder(draft);
      setStatus("success");
      setMessage(`주문이 완료되었습니다. 주문번호 ${order.id}`);
      setForm(initialFormState);
      setTimeout(() => navigate("/orders"), 400);
    } catch (err) {
      setStatus("error");
      setMessage("주문 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">주문서 작성</Title>
        <p>배송 정보와 결제 수단을 입력하고 주문을 완료하세요.</p>

        <ContentGrid>
          <FormCard onSubmit={handleSubmit}>
            <Field>
              <label htmlFor="customerName">받는 사람</label>
              <Input
                id="customerName"
                placeholder="이름을 입력하세요"
                value={form.customerName}
                onChange={e => setForm(prev => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </Field>

            <Field>
              <label htmlFor="address">배송지</label>
              <Input
                id="address"
                placeholder="주소를 입력하세요"
                value={form.address}
                onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </Field>

            <Field>
              <label htmlFor="paymentMethod">결제 수단</label>
              <Select
                id="paymentMethod"
                value={form.paymentMethod}
                onChange={e => setForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
              >
                <option value="card">신용/체크카드</option>
                <option value="transfer">계좌이체</option>
                <option value="mobile">모바일 결제</option>
              </Select>
            </Field>

            <Field>
              <label htmlFor="requestMemo">배송 메모</label>
              <TextArea
                id="requestMemo"
                rows={3}
                placeholder="배송 요청 사항을 입력하세요"
                value={form.requestMemo}
                onChange={e => setForm(prev => ({ ...prev, requestMemo: e.target.value }))}
              />
            </Field>

            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "작성 중..." : "주문 제출"}
            </Button>
            {message && <HelperText $success={status === "success"}>{message}</HelperText>}
          </FormCard>

          <SummaryCard>
            <SummaryHeader>
              <Title size="medium">주문 내역</Title>
              <Button type="button" onClick={() => navigate("/cart")}>장바구니 확인</Button>
            </SummaryHeader>

            {items.map(item => (
              <SummaryItem key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <Meta>{item.author} · {item.quantity}권</Meta>
                </div>
                <span>{formatNuber(item.price * item.quantity)}원</span>
              </SummaryItem>
            ))}

            {!items.length && <StatusMessage>담긴 상품이 없습니다.</StatusMessage>}

            <Divider />
            <SummaryLine>
              <span>총 결제 금액</span>
              <strong>{formatNuber(totalPrice)}원</strong>
            </SummaryLine>
            <SmallText>주문 완료 후 주문 내역에서 상세히 확인할 수 있습니다.</SmallText>
          </SummaryCard>
        </ContentGrid>
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
`;

const FormCard = styled.form`
  padding: 18px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 700;
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.third};
  color: ${({ theme }) => theme.colors.primary};
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.third};
  color: ${({ theme }) => theme.colors.primary};
`;

const SummaryCard = styled.section`
  padding: 18px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Meta = styled.p`
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.primary};
`;

const SummaryLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SmallText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const HelperText = styled.p<{ $success: boolean }>`
  margin: 0;
  color: ${({ $success }) => ($success ? "green" : "crimson")};
  font-weight: 700;
`;

const StatusMessage = styled.p`
  margin: 0;
`;

export default OrderFormPage;
