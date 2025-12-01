import { CartItem } from "../models/cart.model";
import { Order, OrderDraft, OrderItem } from "../models/order.model";

const STORAGE_KEY = "bookstore_orders";

let memoryOrders: Order[] = [];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-2400001",
    customerName: "북스토어 1호",
    address: "서울시 중구 북스토어로 101",
    paymentMethod: "card",
    requestMemo: "문 앞에 놓아주세요",
    createdAt: new Date().toISOString(),
    items: [
      { title: "리액트 마스터 가이드", price: 23800, quantity: 1 },
      { title: "타입스크립트 첫걸음", price: 19800, quantity: 1 },
    ],
    totalPrice: 43600,
  },
  {
    id: "ORD-2400002",
    customerName: "북스토어 단골",
    address: "부산시 해운대구 해변로 5",
    paymentMethod: "transfer",
    requestMemo: "배송 전 연락 부탁드립니다",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    items: [{ title: "프론트엔드 테스트 전략", price: 25000, quantity: 1 }],
    totalPrice: 25000,
  },
];

const readOrders = (): Order[] => {
  if (typeof localStorage === "undefined") {
    return memoryOrders.length ? memoryOrders : [...DEFAULT_ORDERS];
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [...DEFAULT_ORDERS];

  try {
    return JSON.parse(raw) as Order[];
  } catch (error) {
    console.error("Failed to parse orders", error);
    return [...DEFAULT_ORDERS];
  }
};

const writeOrders = (orders: Order[]) => {
  memoryOrders = orders;
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

const transformItems = (items: CartItem[]): OrderItem[] =>
  items.map(item => ({
    title: item.title,
    price: item.price,
    quantity: item.quantity,
  }));

const calculateTotal = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const listOrders = (): Order[] => {
  const orders = readOrders();
  writeOrders(orders);
  return orders;
};

export const createOrder = (draft: OrderDraft): Order => {
  const items = transformItems(draft.items);
  const newOrder: Order = {
    id: `ORD-${Date.now()}`,
    customerName: draft.customerName.trim(),
    address: draft.address.trim(),
    paymentMethod: draft.paymentMethod,
    requestMemo: draft.requestMemo?.trim(),
    createdAt: new Date().toISOString(),
    items,
    totalPrice: calculateTotal(items),
  };

  const current = listOrders();
  const updated = [newOrder, ...current];
  writeOrders(updated);
  return newOrder;
};
