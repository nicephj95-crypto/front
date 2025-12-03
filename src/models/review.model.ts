export interface Review {
  id: number;
  bookId: number;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ReviewPayload {
  bookId: number;
  author: string;
  rating: number;
  content: string;
}
