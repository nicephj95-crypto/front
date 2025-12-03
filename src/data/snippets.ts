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
  {
    title: "리뷰 피드 모킹 서버",
    description: "setTimeout 기반 모킹 서버로 리뷰 목록/작성 흐름을 체험합니다.",
    code: `await fetchReviewFeed({ page: 1, limit: 5, bookId });`,
  },
  {
    title: "UI 인터랙션 모음",
    description: "드롭다운, 탭, 모달, 토스트, 무한스크롤을 단일 페이지에서 시연합니다.",
    code: `<Tabs items={tabs} />\n<Modal open={open} />`,
  },
];
