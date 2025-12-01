import { CartItem } from "../models/cart.model";
import { listCartItems } from "../data/cartRepository";

export const fetchCartItems = async (): Promise<CartItem[]> => {
  return Promise.resolve(listCartItems());
};
