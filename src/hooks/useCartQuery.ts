import { useMemo } from "react";

import { fetchCartItems } from "api/cartApi";
import { useQuery } from "@tanstack/react-query";

export const cartKeys = {
  all: ["cart", "items"] as const,
};

export function useCartQuery() {
  const queryKey = useMemo(() => cartKeys.all, []);
  return useQuery({
    queryKey,
    queryFn: fetchCartItems,
    staleTime: 30 * 1000,
  });
}
