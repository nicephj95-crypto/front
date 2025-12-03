import { Review, ReviewPayload } from "../models/review.model";

interface PaginatedReviews {
  items: Review[];
  hasMore: boolean;
  nextPage: number | null;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    bookId: 1,
    author: "스승님",
    rating: 5,
    content: "강의 내용 덕분에 모킹 서버의 역할을 확실히 이해했어요. 실습 예제가 많아서 좋았습니다.",
    createdAt: "2024-11-20T09:00:00Z",
  },
  {
    id: 2,
    bookId: 2,
    author: "JS러버",
    rating: 4,
    content: "타입스크립트 예시 코드가 깔끔해서 금방 적응했습니다. 유틸 타입 부분이 특히 유용했어요!",
    createdAt: "2024-11-21T12:30:00Z",
  },
  {
    id: 3,
    bookId: 3,
    author: "클린코더",
    rating: 5,
    content: "리뷰 작성 폼 예제에서 밸리데이션 흐름을 배웠습니다. 리액트 훅 패턴을 잘 보여줍니다.",
    createdAt: "2024-11-22T08:10:00Z",
  },
  {
    id: 4,
    bookId: 4,
    author: "UI연구가",
    rating: 4,
    content: "탭, 드롭다운, 모달, 토스트까지 한 번에 경험할 수 있어 실습하기 좋았습니다.",
    createdAt: "2024-11-22T10:20:00Z",
  },
  {
    id: 5,
    bookId: 5,
    author: "테스터",
    rating: 5,
    content: "무한 스크롤 구현을 단계별로 보여줘서 실제 서비스에 바로 적용할 수 있을 것 같아요.",
    createdAt: "2024-11-22T11:45:00Z",
  },
  {
    id: 6,
    bookId: 1,
    author: "강의완주",
    rating: 4,
    content: "모킹 서버 응답을 기다리는 로딩 UI가 직관적이라 사용성이 좋습니다.",
    createdAt: "2024-11-22T12:05:00Z",
  },
  {
    id: 7,
    bookId: 2,
    author: "프론트조아",
    rating: 5,
    content: "드롭다운으로 도서 필터링하는 부분이 깔끔합니다. 상태 관리가 단순해서 이해하기 쉬워요.",
    createdAt: "2024-11-22T13:15:00Z",
  },
  {
    id: 8,
    bookId: 3,
    author: "초보개발자",
    rating: 3,
    content: "샘플 데이터가 다양해서 리뷰 카드 UI를 테스트하기 좋았어요.",
    createdAt: "2024-11-22T14:35:00Z",
  },
  {
    id: 9,
    bookId: 4,
    author: "실습러",
    rating: 4,
    content: "토스트가 자연스럽게 사라져서 사용자에게 방해가 적네요. 모달도 접근성 있게 구현되어 있습니다.",
    createdAt: "2024-11-22T15:20:00Z",
  },
  {
    id: 10,
    bookId: 5,
    author: "북스덕후",
    rating: 5,
    content: "리뷰를 작성하면 바로 목록에 반영되어서 상태 관리 흐름을 확인하기 좋습니다.",
    createdAt: "2024-11-22T16:40:00Z",
  },
  {
    id: 11,
    bookId: 1,
    author: "UX러버",
    rating: 4,
    content: "탭으로 보기/작성 화면을 분리한 아이디어가 마음에 들어요.",
    createdAt: "2024-11-22T17:05:00Z",
  },
  {
    id: 12,
    bookId: 2,
    author: "FE Rookie",
    rating: 4,
    content: "모달 안에서 리뷰 전문을 읽을 수 있어 편합니다.",
    createdAt: "2024-11-22T18:25:00Z",
  },
  {
    id: 13,
    bookId: 3,
    author: "Node킹",
    rating: 5,
    content: "모킹 서버 타임아웃을 두어서 네트워크 지연 테스트에 도움이 됩니다.",
    createdAt: "2024-11-22T19:15:00Z",
  },
  {
    id: 14,
    bookId: 4,
    author: "테마전환러",
    rating: 4,
    content: "다크 모드에서도 레이아웃이 잘 보입니다.",
    createdAt: "2024-11-22T20:35:00Z",
  },
  {
    id: 15,
    bookId: 5,
    author: "인피니트",
    rating: 5,
    content: "무한 스크롤에서 로딩 스피너가 있어 사용성이 좋네요.",
    createdAt: "2024-11-22T21:50:00Z",
  },
];

let reviews = [...INITIAL_REVIEWS];

export const listReviews = (
  page: number,
  limit: number,
  bookId?: number
): PaginatedReviews => {
  const filtered = bookId ? reviews.filter(review => review.bookId === bookId) : reviews;
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filtered.slice(start, end);
  const hasMore = end < filtered.length;

  return {
    items,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  };
};

export const addReview = (payload: ReviewPayload): Review => {
  const newReview: Review = {
    id: reviews.length + 1,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  reviews = [newReview, ...reviews];
  return newReview;
};

export const resetReviews = () => {
  reviews = [...INITIAL_REVIEWS];
};
