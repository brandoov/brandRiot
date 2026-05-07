import { ApiError } from "@/api/client";

interface Props {
  loading?: boolean;
  error?: unknown;
  emptyMessage?: string;
  empty?: boolean;
}

export default function StatusBanner({ loading, error, emptyMessage, empty }: Props) {
  if (loading) {
    return (
      <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        Carregando dados da Riot…
      </div>
    );
  }
  if (error) {
    if (error instanceof ApiError) {
      return (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Erro {error.status}:</strong> {error.detail ?? error.message}
          {error.retryAfter ? <span className="ml-1">(tente novamente em {error.retryAfter}s)</span> : null}
        </div>
      );
    }
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Erro inesperado: {String((error as Error)?.message ?? error)}
      </div>
    );
  }
  if (empty) {
    return (
      <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
        {emptyMessage ?? "Sem dados ainda. Faça uma busca."}
      </div>
    );
  }
  return null;
}
