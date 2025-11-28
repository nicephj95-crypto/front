import { findBookById, listBooks } from "../data/bookRepository";
import { Book } from "../models/book.model";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchBooks = async (): Promise<Book[]> => {
  await wait(200);
  return listBooks();
};

export const fetchBookById = async (id: number): Promise<Book | undefined> => {
  await wait(200);
  return findBookById(id);
};
