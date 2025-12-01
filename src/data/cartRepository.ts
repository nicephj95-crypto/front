import { CartItem } from "../models/cart.model";

const CART_ITEMS: CartItem[] = [
  {
    id: 101,
    title: "실무에 바로 쓰는 리액트 컴포넌트",
    seller: "북스토어 공식",
    price: 15800,
    quantity: 1,
    deliveryType: "무료배송",
  },
  {
    id: 102,
    title: "타입스크립트로 배우는 견고한 프론트엔드",
    seller: "프론트엔드 스터디",
    price: 24200,
    quantity: 2,
    deliveryType: "빠른배송",
  },
  {
    id: 103,
    title: "디자인 시스템 길잡이",
    seller: "UI 아카데미",
    price: 19800,
    quantity: 1,
    deliveryType: "묶음배송",
  },
];

export const listCartItems = (): CartItem[] => CART_ITEMS.map(item => ({ ...item }));
