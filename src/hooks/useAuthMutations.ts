import { signUp } from "api/authApi";
import { useAuth } from "context/AuthContext";
import { useMutation } from "lib/reactQuery";
import { ResetPasswordPayload, SignInPayload, SignUpPayload, SignUpResponse } from "models/user.model";

export function useAuthMutations() {
  const { login, resetPassword } = useAuth();

  const signInMutation = useMutation<string, Error, SignInPayload>({
    mutationFn: login,
  });

  const signUpMutation = useMutation<SignUpResponse, Error, SignUpPayload>({
    mutationFn: signUp,
  });

  const resetPasswordMutation = useMutation<string, Error, ResetPasswordPayload>({
    mutationFn: resetPassword,
  });

  return {
    signInMutation,
    signUpMutation,
    resetPasswordMutation,
  };
}
