import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type MutationStatus = "idle" | "pending" | "success" | "error";

export class QueryClient {
  reset() {
    // Lightweight placeholder for future cache reset behaviour.
  }
}

const QueryClientContext = createContext<QueryClient | null>(null);

export function QueryClientProvider({
  client,
  children,
}: {
  client: QueryClient;
  children: ReactNode;
}) {
  const value = useMemo(() => client, [client]);

  return <QueryClientContext.Provider value={value}>{children}</QueryClientContext.Provider>;
}

export function useQueryClient() {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error("useQueryClient must be used within a QueryClientProvider");
  }
  return context;
}

interface UseMutationOptions<TData, TError, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
}

interface MutateCallbacks<TData, TError, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
}

export function useMutation<TData = unknown, TError = unknown, TVariables = void>(
  options: UseMutationOptions<TData, TError, TVariables>,
) {
  const { mutationFn, onError, onSuccess } = options;
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<TError | null>(null);
  const [status, setStatus] = useState<MutationStatus>("idle");

  const callbacksRef = useRef({ onError, onSuccess });
  callbacksRef.current = { onError, onSuccess };

  const mutateAsync = useCallback(
    async (variables: TVariables) => {
      setStatus("pending");
      setError(null);
      try {
        const result = await mutationFn(variables);
        setData(result);
        setStatus("success");
        callbacksRef.current.onSuccess?.(result, variables);
        return result;
      } catch (err) {
        setStatus("error");
        const typedError = err as TError;
        setError(typedError);
        callbacksRef.current.onError?.(typedError, variables);
        throw err;
      }
    },
    [mutationFn],
  );

  const mutate = useCallback(
    (variables: TVariables, callbacks?: MutateCallbacks<TData, TError, TVariables>) => {
      mutateAsync(variables)
        .then(result => callbacks?.onSuccess?.(result, variables))
        .catch(err => callbacks?.onError?.(err as TError, variables));
    },
    [mutateAsync],
  );

  return {
    data,
    error,
    status,
    mutate,
    mutateAsync,
    isIdle: status === "idle",
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
  };
}
