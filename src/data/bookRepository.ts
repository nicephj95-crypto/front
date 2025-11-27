import { Book } from "../models/book.model";

const BOOKS: Book[] = [
  {
    id: 1,
    title: "리액트 마스터 가이드",
    author: "홍길동",
    description: "실전 예제와 함께 배우는 리액트 입문부터 고급 패턴까지 담은 가이드.",
    publishedYear: 2023,
    category: "프론트엔드",
  },
  {
    id: 2,
    title: "타입스크립트 첫걸음",
    author: "이몽룡",
    description: "자바스크립트 개발자를 위한 타입스크립트 핵심 문법과 활용법 소개.",
    publishedYear: 2022,
    category: "프로그래밍 언어",
  },
  {
    id: 3,
    title: "클린 코드",
    author: "로버트 C. 마틴",
    description: "가독성과 유지보수성을 높이는 코드 작성 원칙을 설명합니다.",
    publishedYear: 2013,
    category: "소프트웨어 공학",
  },
  {
    id: 4,
    title: "북스토어 디자인 시스템",
    author: "성춘향",
    description: "디자인 토큰과 컴포넌트 기반 설계로 일관된 UI를 만드는 방법.",
    publishedYear: 2024,
    category: "디자인",
  },
  {
    id: 5,
    title: "프론트엔드 테스트 전략",
    author: "강감찬",
    description: "테스팅 라이브러리를 활용한 프론트엔드 테스트 자동화 실무 가이드.",
    publishedYear: 2021,
    category: "테스트",
  },
];

export const listBooks = (): Book[] => BOOKS;
