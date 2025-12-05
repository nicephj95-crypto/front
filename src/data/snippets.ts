export const todayLectureSnippets = [
  {
    title: "메인 화면 - 리뷰 섹션",
    description: "짧은 후기와 별점을 한눈에 볼 수 있도록 강조한 리뷰 카드 UI.",
    code: `<ReviewHighlightCard title=\"강의가 도움됐어요\" rating={4.8} />`,
  },
  {
    title: "메인 화면 - 신간 섹션",
    description: "publishedYear를 기준으로 최신 도서를 슬림한 카드로 노출합니다.",
    code: `const newBooks = useMemo(() => books.sort((a, b) => b.publishedYear - a.publishedYear));`,
  },
  {
    title: "메인 화면 - 베스트 섹션",
    description: "조회수·리뷰 수 등 핵심 지표를 추가해 베스트 타이틀을 소개합니다.",
    code: `<BestBadge>BEST</BestBadge>`,
  },
  {
    title: "메인 화면 - 배너 섹션",
    description: "강의 포인트와 CTA를 배너 카드 두 개로 나누어 전달합니다.",
    code: `<Banner tone=\"purple\">모바일 대응도 확인해보세요</Banner>`,
  },
  {
    title: "모바일 대응",
    description: "그리드와 배너가 화면 너비에 맞춰 자연스럽게 재배치됩니다.",
    code: "@media (max-width: 768px) { grid-template-columns: 1fr; }",
  },
];
