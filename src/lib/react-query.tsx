import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type QueryKey = readonly unknown[];

type CacheEntry<T> = {
  data?: T;
  error?: unknown;
  updatedAt: number;
  status: "idle" | "loading" | "success" | "error";
};

type QueryClientConfig = {
  defaultOptions?: {
    queries?: {
      staleTime?: number;
    };
  };
};

type UseQueryOptions<T> = {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  staleTime?: number;
};

export type UseQueryResult<T> = {
  data: T | undefined;
  error: unknown;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
};

const serializeKey = (key: QueryKey) => JSON.stringify(key);

export class QueryClient {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultStaleTime: number | undefined;

  constructor(config: QueryClientConfig = {}) {
    this.defaultStaleTime = config.defaultOptions?.queries?.staleTime;
  }

  get<T>(key: QueryKey) {
    return this.cache.get(serializeKey(key)) as CacheEntry<T> | undefined;
  }

  set<T>(key: QueryKey, entry: CacheEntry<T>) {
    this.cache.set(serializeKey(key), entry);
  }

  getStaleTime() {
    return this.defaultStaleTime ?? 0;
  }
}

const QueryClientContext = createContext<QueryClient | null>(null);

export function QueryClientProvider({ children, client }: PropsWithChildren<{ client: QueryClient }>) {
  return <QueryClientContext.Provider value={client}>{children}</QueryClientContext.Provider>;
}

export function useQueryClient() {
  const client = useContext(QueryClientContext);
  if (!client) {
    throw new Error("useQueryClient must be used within a QueryClientProvider");
  }
  return client;
}

export function useQuery<T>({ queryKey, queryFn, enabled = true, staleTime }: UseQueryOptions<T>): UseQueryResult<T> {
  const client = useQueryClient();
  const key = useMemo(() => queryKey, [queryKey]);
  const resolvedStaleTime = staleTime ?? client.getStaleTime();
  const [state, setState] = useState<CacheEntry<T>>(() => {
    const cached = client.get<T>(key);
    if (cached && Date.now() - cached.updatedAt < resolvedStaleTime) {
      return cached;
    }
    return { status: enabled ? "loading" : "idle", updatedAt: Date.now() };
  });

  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setState(prev => ({ ...prev, status: "idle" }));
      return;
    }

    const cached = client.get<T>(key);
    const shouldUseCache = cached && Date.now() - cached.updatedAt < resolvedStaleTime;
    if (shouldUseCache) {
      setState(cached);
      return;
    }

    let mounted = true;
    isFetchingRef.current = true;
    setState({ status: "loading", updatedAt: Date.now() });

    queryFn()
      .then(data => {
        if (!mounted) return;
        const next: CacheEntry<T> = { data, status: "success", updatedAt: Date.now() };
        client.set(key, next);
        setState(next);
      })
      .catch(error => {
        if (!mounted) return;
        const next: CacheEntry<T> = { error, status: "error", updatedAt: Date.now() };
        client.set(key, next);
        setState(next);
      })
      .finally(() => {
        isFetchingRef.current = false;
      });

    return () => {
      mounted = false;
    };
  }, [client, key, queryFn, enabled, resolvedStaleTime]);

  const refetch = async () => {
    const next: CacheEntry<T> = { status: "loading", updatedAt: Date.now() };
    setState(next);
    try {
      const data = await queryFn();
      const successEntry: CacheEntry<T> = { data, status: "success", updatedAt: Date.now() };
      client.set(key, successEntry);
      setState(successEntry);
    } catch (error) {
      const errorEntry: CacheEntry<T> = { error, status: "error", updatedAt: Date.now() };
      client.set(key, errorEntry);
      setState(errorEntry);
      throw error;
    }
  };

  return {
    data: state.data,
    error: state.error,
    isLoading: state.status === "loading",
    isFetching: isFetchingRef.current,
    refetch,
  };
}
