import { listCartItems } from "../data/cartRepository";
import { CartItem } from "../models/cart.model";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCartItems = async (): Promise<CartItem[]> => {
  await wait(200);
  return listCartItems();
};
