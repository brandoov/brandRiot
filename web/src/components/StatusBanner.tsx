import { ApiError } from "@/api/client";

interface Props {
  loading?: boolean;
  error?: unknown;
  emptyMessage?: string;
  empty?: boolean;
}

const baseStyle: React.CSSProperties = {
  borderRadius: 10,
  padding: "12px 16px",
  fontSize: 13,
  border: "1px solid var(--line)",
  background: "var(--bg-1)",
  color: "var(--text-1)"
};

const errorStyle: React.CSSProperties = {
  ...baseStyle,
  borderColor: "rgba(255, 138, 149, 0.4)",
  background: "rgba(255, 70, 85, 0.06)",
  color: "#ff8a95"
};

export default function StatusBanner({ loading, error, emptyMessage, empty }: Props) {
  if (loading) {
    return <div style={baseStyle}>Carregando dados da Riot…</div>;
  }
  if (error) {
    if (error instanceof ApiError) {
      return (
        <div style={errorStyle}>
          <strong style={{ marginRight: 6 }}>Erro {error.status}:</strong>
          {error.detail ?? error.message}
          {error.retryAfter ? <span style={{ marginLeft: 6 }}>(tente novamente em {error.retryAfter}s)</span> : null}
        </div>
      );
    }
    return <div style={errorStyle}>Erro inesperado: {String((error as Error)?.message ?? error)}</div>;
  }
  if (empty) {
    return <div style={baseStyle}>{emptyMessage ?? "Sem dados ainda. Faça uma busca."}</div>;
  }
  return null;
}
