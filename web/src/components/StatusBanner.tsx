import { ApiError } from "@/api/client";

interface Props {
  loading?: boolean;
  loadingMessage?: string;
  error?: unknown;
  emptyMessage?: string;
  empty?: boolean;
  successMessage?: string;
  success?: boolean;
}

const baseStyle: React.CSSProperties = {
  borderRadius: 10,
  padding: "12px 16px",
  fontSize: 13,
  border: "1px solid var(--line)",
  background: "var(--bg-1)",
  color: "var(--text-1)",
  display: "flex",
  alignItems: "center",
  gap: 10
};

const errorStyle: React.CSSProperties = {
  ...baseStyle,
  borderColor: "rgba(255, 138, 149, 0.55)",
  background: "rgba(255, 70, 85, 0.08)",
  color: "#ff8a95"
};

const successStyle: React.CSSProperties = {
  ...baseStyle,
  borderColor: "rgba(74, 223, 160, 0.45)",
  background: "rgba(74, 223, 160, 0.06)",
  color: "#4adfa0"
};

const Spinner = () => (
  <span
    aria-hidden
    style={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: "2px solid currentColor",
      borderTopColor: "transparent",
      animation: "br-spin 0.8s linear infinite"
    }}
  />
);

const Dot = ({ color }: { color: string }) => (
  <span
    aria-hidden
    style={{ width: 8, height: 8, borderRadius: "50%", background: color }}
  />
);

function explain(error: ApiError): string {
  const detail = error.detail ?? error.message ?? "";
  if (error.status === 404) {
    return `Riot ID não encontrado nessa região/cluster. Verifique se a plataforma e o cluster combinam com o servidor do invocador (ex.: KR + Asia, BR1 + Americas).`;
  }
  if (error.status === 401 || error.status === 403) {
    return `Acesso negado pela Riot (${error.status}). Provavelmente a chave da API está faltando, expirou (chaves dev expiram em 24h) ou esse endpoint exige chave de produção.`;
  }
  if (error.status === 429) {
    return `Limite de requisições atingido. ${error.retryAfter ? `Tente novamente em ${error.retryAfter}s.` : ""}`;
  }
  if (error.status >= 500) {
    return `A Riot API ou nosso backend retornou erro ${error.status}. Tente novamente em instantes.`;
  }
  return detail;
}

export default function StatusBanner({
  loading,
  loadingMessage,
  error,
  emptyMessage,
  empty,
  successMessage,
  success
}: Props) {
  if (loading) {
    return (
      <div style={baseStyle}>
        <Spinner />
        <span>{loadingMessage ?? "Carregando dados da Riot…"}</span>
      </div>
    );
  }
  if (error) {
    if (error instanceof ApiError) {
      return (
        <div style={errorStyle} role="alert">
          <Dot color="#ff8a95" />
          <div style={{ display: "grid", gap: 2 }}>
            <strong style={{ fontSize: 13 }}>Erro {error.status}</strong>
            <span style={{ fontSize: 12, color: "var(--text-1)" }}>{explain(error)}</span>
          </div>
        </div>
      );
    }
    return (
      <div style={errorStyle} role="alert">
        <Dot color="#ff8a95" />
        <span>Erro inesperado: {String((error as Error)?.message ?? error)}</span>
      </div>
    );
  }
  if (success && successMessage) {
    return (
      <div style={successStyle}>
        <Dot color="#4adfa0" />
        <span>{successMessage}</span>
      </div>
    );
  }
  if (empty) {
    return (
      <div style={baseStyle}>
        <Dot color="var(--text-3)" />
        <span>{emptyMessage ?? "Sem dados ainda. Faça uma busca."}</span>
      </div>
    );
  }
  return null;
}
