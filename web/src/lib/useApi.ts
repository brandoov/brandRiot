import { useCallback, useEffect, useRef, useState } from "react";

interface State<T> {
  data: T | undefined;
  loading: boolean;
  error: unknown;
}

export function useApi<TArgs extends unknown[], TData>(
  fn: (...args: [...TArgs, AbortSignal?]) => Promise<TData>
) {
  const [state, setState] = useState<State<TData>>({
    data: undefined,
    loading: false,
    error: undefined
  });

  // Mantém o token da execução atual: se uma nova chamada `run` for feita antes
  // da anterior terminar, descartamos o resultado da antiga (evita race em
  // React.StrictMode com double-mount e em buscas rápidas seguidas).
  const tokenRef = useRef(0);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const run = useCallback(
    async (...args: TArgs) => {
      const controller = new AbortController();
      const token = ++tokenRef.current;
      setState((prev) => ({ ...prev, loading: true, error: undefined }));
      try {
        const data = await fn(...args, controller.signal);
        if (token !== tokenRef.current || !aliveRef.current) return data;
        setState({ data, loading: false, error: undefined });
        return data;
      } catch (error) {
        if ((error as { name?: string })?.name === "AbortError") return undefined;
        if (token !== tokenRef.current || !aliveRef.current) return undefined;
        setState({ data: undefined, loading: false, error });
        return undefined;
      }
    },
    [fn]
  );

  const reset = useCallback(() => {
    tokenRef.current++;
    setState({ data: undefined, loading: false, error: undefined });
  }, []);

  return { ...state, run, reset };
}
