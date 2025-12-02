import { useMemo } from "react";

import { fetchBookById, fetchBooks } from "api/bookApi";
import { useQuery } from "@tanstack/react-query";

export const bookKeys = {
  all: ["books"] as const,
  detail: (id: number) => ["books", "detail", id] as const,
};

export function useBooksQuery() {
  return useQuery({
    queryKey: bookKeys.all,
    queryFn: fetchBooks,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBookDetailQuery(id: number, enabled: boolean) {
  const queryKey = useMemo(() => bookKeys.detail(id), [id]);
  return useQuery({
    queryKey,
    queryFn: () => fetchBookById(id),
    enabled,
    staleTime: 60 * 1000,
  });
}
