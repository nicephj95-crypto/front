import { CartItem } from "../models/cart.model";

const CART_ITEMS: CartItem[] = [
  {
    id: 1,
    title: "리액트 마스터 가이드",
    option: "기본 표지 · 사은품 포함",
    price: 18000,
    quantity: 1,
  },
  {
    id: 2,
    title: "타입스크립트 첫걸음",
    option: "초판 한정 · 포스트잇 세트",
    price: 15000,
    quantity: 2,
  },
  {
    id: 3,
    title: "프론트엔드 테스트 전략",
    option: "전자책 · 무제한 열람",
    price: 12000,
    quantity: 1,
  },
];

export const listCartItems = (): CartItem[] => CART_ITEMS;
