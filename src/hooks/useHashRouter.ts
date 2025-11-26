import { useCallback, useEffect, useState } from "react";

const normalizePath = (path: string) => {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }
  return path;
};

const getCurrentPath = () => {
  const raw = window.location.hash.replace("#", "");
  return raw ? normalizePath(raw) : "/";
};

export function useHashRouter() {
  const [route, setRoute] = useState<string>(getCurrentPath);

  useEffect(() => {
    const handleHashChange = () => setRoute(getCurrentPath());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = useCallback(
    (path: string) => {
      const normalized = normalizePath(path);
      if (normalized === route) return;
      window.location.hash = normalized;
      setRoute(normalized);
    },
    [route]
  );

  return { route, navigate } as const;
}
