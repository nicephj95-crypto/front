import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import styled from "styled-components";
import Button from "../components/common/Button";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Input from "../components/common/Input";
import Title from "../components/common/Title";
import { useAuth } from "../context/AuthContext";
import { ResetPasswordPayload } from "../models/user.model";

const initialForm: ResetPasswordPayload = {
  email: "",
  newPassword: "",
};

function ResetPassword() {
  const { resetPassword } = useAuth();
  const [form, setForm] = useState<ResetPasswordPayload>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const isSubmitDisabled = useMemo(() => {
    return !form.email.trim() || form.newPassword.length < 4;
  }, [form]);

  const handleChange = (field: keyof ResetPasswordPayload) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    setStatus("loading");
    setError("");
    setMessage("");

    try {
      const responseMessage = await resetPassword(form);
      setStatus("success");
      setMessage(responseMessage);
      setForm(initialForm);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "비밀번호 초기화에 실패했습니다.");
    }
  };

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">비밀번호 초기화</Title>
        <p>가입한 이메일을 입력하고 새 비밀번호로 초기화합니다.</p>

        <ResetForm onSubmit={handleSubmit}>
          <Label>
            이메일
            <Input
              placeholder="가입한 이메일을 입력하세요"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
            />
          </Label>
          <Label>
            새 비밀번호
            <Input
              placeholder="새 비밀번호를 입력하세요"
              type="password"
              value={form.newPassword}
              onChange={handleChange("newPassword")}
            />
          </Label>
          <Button type="submit" disabled={isSubmitDisabled || status === "loading"}>
            {status === "loading" ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </ResetForm>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <SuccessMessage>{message}</SuccessMessage>}
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
  width: min(640px, 90%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ResetForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.secondary};
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: crimson;
`;

const SuccessMessage = styled.p`
  margin: 0;
  color: green;
  font-weight: 700;
`;

export default ResetPassword;
