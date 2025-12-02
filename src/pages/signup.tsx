import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Button from "components/common/Button";
import Footer from "components/common/Footer";
import Header from "components/common/Header";
import Input from "components/common/Input";
import Title from "components/common/Title";
import { useAuthMutations } from "hooks/useAuthMutations";
import { SignUpPayload } from "models/user.model";

const initialForm: SignUpPayload = {
  name: "",
  email: "",
  password: "",
};

function Signup() {
  const [form, setForm] = useState<SignUpPayload>(initialForm);
  const { signUpMutation } = useAuthMutations();
  const [successMessage, setSuccessMessage] = useState<string>("");

  const isSubmitDisabled = useMemo(() => {
    return !form.name.trim() || !form.email.trim() || form.password.length < 4;
  }, [form]);

  const handleChange = (field: keyof SignUpPayload) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    setSuccessMessage("");
    signUpMutation.mutate(form, {
      onSuccess: response => {
        setSuccessMessage(response.message);
      },
    });
  };

  useEffect(() => {
    if (signUpMutation.isSuccess) {
      setForm(initialForm);
    }
  }, [signUpMutation.isSuccess]);

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Title size="large">회원가입</Title>
        <p>강의에서 만든 데이터 레이어를 활용해 새로운 사용자를 저장합니다.</p>

        <SignupForm onSubmit={handleSubmit}>
          <Label>
            이름
            <Input
              placeholder="홍길동"
              value={form.name}
              onChange={handleChange("name")}
            />
          </Label>
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
              placeholder="4글자 이상 비밀번호"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
            />
          </Label>
          <Button type="submit" disabled={isSubmitDisabled || signUpMutation.isPending}>
            {signUpMutation.isPending ? "가입 중..." : "회원가입"}
          </Button>
        </SignupForm>

        {signUpMutation.isError && (
          <ErrorMessage>
            {signUpMutation.error instanceof Error
              ? signUpMutation.error.message
              : "알 수 없는 오류가 발생했습니다."}
          </ErrorMessage>
        )}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
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

const SignupForm = styled.form`
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

export default Signup;
