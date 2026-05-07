import { useCallback, useState } from "react";

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

  const run = useCallback(
    async (...args: TArgs) => {
      const controller = new AbortController();
      setState({ data: undefined, loading: true, error: undefined });
      try {
        const data = await fn(...args, controller.signal);
        setState({ data, loading: false, error: undefined });
        return data;
      } catch (error) {
        if ((error as { name?: string })?.name === "AbortError") return undefined;
        setState({ data: undefined, loading: false, error });
        return undefined;
      }
    },
    [fn]
  );

  const reset = useCallback(
    () => setState({ data: undefined, loading: false, error: undefined }),
    []
  );

  return { ...state, run, reset };
}
