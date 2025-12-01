import { createOrder, listOrders } from "../data/orderRepository";
import { Order, OrderDraft } from "../models/order.model";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchOrders = async (): Promise<Order[]> => {
  await wait(200);
  return listOrders();
};

export const submitOrder = async (draft: OrderDraft): Promise<Order> => {
  await wait(200);
  return createOrder(draft);
};
