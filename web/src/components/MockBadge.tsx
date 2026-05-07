interface Props {
  label?: string;
}

/**
 * Selo discreto colocado em qualquer card cujos dados ainda não vêm do
 * backend real. Quando o endpoint correspondente existir (agregação,
 * histórico, IA, etc.) basta remover o badge e ligar a fonte real.
 */
export default function MockBadge({ label = "dados demo" }: Props) {
  return (
    <span
      title="Este card usa dados simulados até existir o endpoint correspondente no backend."
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255, 215, 100, 0.85)",
        background: "rgba(255, 215, 100, 0.08)",
        border: "1px dashed rgba(255, 215, 100, 0.35)"
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "rgba(255, 215, 100, 0.7)"
        }}
      />
      {label}
    </span>
  );
}
