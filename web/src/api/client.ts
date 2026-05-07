import { apiBaseUrl } from "@/lib/env";

export class ApiError extends Error {
  status: number;
  detail?: string;
  retryAfter?: number;

  constructor(status: number, message: string, detail?: string, retryAfter?: number) {
    super(message);
    this.status = status;
    this.detail = detail;
    this.retryAfter = retryAfter;
  }
}

interface RequestOptions {
  signal?: AbortSignal;
  query?: Record<string, string | number | boolean | undefined | null>;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${apiBaseUrl}${path}`, window.location.origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.pathname + url.search;
}

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, options.query);
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: options.signal
  });

  if (!response.ok) {
    let detail: string | undefined;
    let title = response.statusText;
    try {
      const body = await response.json();
      detail = body?.detail ?? body?.title;
      title = body?.title ?? title;
    } catch {
      // body can be empty / non-json
    }
    const retryAfterHeader = response.headers.get("Retry-After");
    const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
    throw new ApiError(response.status, title, detail, Number.isNaN(retryAfter) ? undefined : retryAfter);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
