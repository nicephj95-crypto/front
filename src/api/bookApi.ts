import { listBooks } from "../data/bookRepository";
import { Book } from "../models/book.model";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchBooks = async (): Promise<Book[]> => {
  await wait(200);
  return listBooks();
};
