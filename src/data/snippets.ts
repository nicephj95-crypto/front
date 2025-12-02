export const todayLectureSnippets = [
  {
    title: "Import Alias",
    description: "src 기준 절대 경로를 사용해 경로 중복을 줄였습니다.",
    code: "import { useAuthMutations } from '@/hooks/useAuthMutations';",
  },
  {
    title: "React Query 스타일 훅",
    description: "useMutation을 활용해 인증 요청 상태를 공통으로 관리합니다.",
    code: `const { signInMutation } = useAuthMutations();\n\nsignInMutation.mutate(credentials);`,
  },
  {
    title: "중복 제거된 폼 상태",
    description: "공통 훅으로 가입/로그인/비밀번호 초기화 폼 로직을 통일했습니다.",
    code: `const isSubmitting = signUpMutation.isPending;\nconst error = signUpMutation.error;`,
  },
];
