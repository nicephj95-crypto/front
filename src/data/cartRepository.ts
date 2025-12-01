import { CartItem } from "../models/cart.model";

const STORAGE_KEY = "bookstore_cart_items";

const DEFAULT_CART: CartItem[] = [
  {
    id: 101,
    title: "리액트 마스터 가이드",
    author: "홍길동",
    price: 23800,
    quantity: 1,
  },
  {
    id: 102,
    title: "타입스크립트 첫걸음",
    author: "이몽룡",
    price: 19800,
    quantity: 2,
  },
  {
    id: 103,
    title: "프론트엔드 테스트 전략",
    author: "강감찬",
    price: 25000,
    quantity: 1,
  },
];

const readCartItems = (): CartItem[] => {
  if (typeof localStorage === "undefined") {
    return DEFAULT_CART;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_CART;

  try {
    return JSON.parse(raw) as CartItem[];
  } catch (error) {
    console.error("Failed to parse cart items", error);
    return DEFAULT_CART;
  }
};

const writeCartItems = (items: CartItem[]) => {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const listCartItems = (): CartItem[] => {
  const items = readCartItems();
  writeCartItems(items);
  return items;
};
