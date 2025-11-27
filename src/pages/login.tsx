import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import styled from "styled-components";
import Button from "../components/common/Button";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Input from "../components/common/Input";
import Title from "../components/common/Title";
import { useAuth } from "../context/AuthContext";
import { SignInPayload } from "../models/user.model";

const initialForm: SignInPayload = {
  email: "",
  password: "",
};

function Login() {
  const { user, login } = useAuth();
  const [form, setForm] = useState<SignInPayload>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const isSubmitDisabled = useMemo(() => {
    return !form.email.trim() || form.password.length < 4;
  }, [form]);

  const handleChange = (field: keyof SignInPayload) =>
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
      await login(form);
      setStatus("success");
      setMessage("로그인에 성공했습니다. 환영합니다!");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">로그인</Title>
        <p>가입한 이메일과 비밀번호로 로그인 후 전역 상태에 사용자 정보를 저장합니다.</p>

        <LoginForm onSubmit={handleSubmit}>
          <Label>
            이메일
            <Input
              placeholder="example@email.com"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
            />
          </Label>
          <Label>
            비밀번호
            <Input
              placeholder="비밀번호를 입력하세요"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
            />
          </Label>
          <Button type="submit" disabled={isSubmitDisabled || status === "loading"}>
            {status === "loading" ? "로그인 중..." : "로그인"}
          </Button>
        </LoginForm>

        {user && <SuccessBox>현재 로그인: {user.name} ({user.email})</SuccessBox>}
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

const LoginForm = styled.form`
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

const SuccessBox = styled.div`
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.secondary};
  font-weight: 700;
`;

export default Login;
