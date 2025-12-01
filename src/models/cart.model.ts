export interface CartItem {
  id: number;
  title: string;
  seller: string;
  price: number;
  quantity: number;
  deliveryType: "무료배송" | "빠른배송" | "묶음배송";
}

export interface OrderFormValues {
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryRequest: string;
  paymentMethod: "card" | "bank" | "phone";
}
