import { CartItem } from "./cart.model";

export interface OrderItem {
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  paymentMethod: string;
  requestMemo?: string;
  createdAt: string;
  items: OrderItem[];
  totalPrice: number;
}

export interface OrderDraft {
  customerName: string;
  address: string;
  paymentMethod: string;
  requestMemo?: string;
  items: CartItem[];
}
