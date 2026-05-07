import { FormEvent, useEffect, useState } from "react";
import type { RiotCluster, RiotPlatform } from "@/api/types";

export interface RiotIdSearchValue {
  gameName: string;
  tagLine: string;
  platform: RiotPlatform;
  cluster: RiotCluster;
}

const PLATFORMS: RiotPlatform[] = [
  "Br1", "Na1", "Lan", "Las", "Euw1", "Eun1", "Tr1", "Ru",
  "Kr",  "Jp1", "Oc1", "Ph2", "Sg2",  "Th2",  "Tw2", "Vn2"
];
const CLUSTERS: RiotCluster[] = ["Americas", "Europe", "Asia", "Sea"];

interface Props {
  defaults?: Partial<RiotIdSearchValue>;
  onSubmit: (value: RiotIdSearchValue) => void;
  loading?: boolean;
  showCluster?: boolean;
  showPlatform?: boolean;
  variant?: "card" | "inline";
}

export default function RiotIdSearch({
  defaults,
  onSubmit,
  loading = false,
  showCluster = true,
  showPlatform = true,
  variant = "card"
}: Props) {
  const [gameName, setGameName] = useState(defaults?.gameName ?? "");
  const [tagLine, setTagLine] = useState(defaults?.tagLine ?? "BR1");
  const [platform, setPlatform] = useState<RiotPlatform>(defaults?.platform ?? "Br1");
  const [cluster, setCluster] = useState<RiotCluster>(defaults?.cluster ?? "Americas");

  useEffect(() => {
    if (defaults?.gameName !== undefined) setGameName(defaults.gameName);
    if (defaults?.tagLine !== undefined) setTagLine(defaults.tagLine);
    if (defaults?.platform !== undefined) setPlatform(defaults.platform);
    if (defaults?.cluster !== undefined) setCluster(defaults.cluster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults?.gameName, defaults?.tagLine, defaults?.platform, defaults?.cluster]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!gameName.trim() || !tagLine.trim()) return;
    onSubmit({ gameName: gameName.trim(), tagLine: tagLine.trim(), platform, cluster });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    fontSize: 13,
    background: "var(--bg-2)",
    color: "var(--text-0)",
    border: "1px solid var(--line-2)",
    borderRadius: 8,
    fontFamily: "inherit"
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-2)",
    marginBottom: 4
  };

  if (variant === "inline") {
    return (
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(120px, 1fr) 80px 90px 90px auto",
          gap: 8,
          alignItems: "end",
          width: "100%"
        }}
      >
        <input
          aria-label="Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Game Name"
          style={inputStyle}
        />
        <input
          aria-label="Tag Line"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          placeholder="BR1"
          style={inputStyle}
        />
        {showPlatform ? (
          <select
            aria-label="Platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as RiotPlatform)}
            style={inputStyle}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        ) : <span />}
        {showCluster ? (
          <select
            aria-label="Cluster"
            value={cluster}
            onChange={(e) => setCluster(e.target.value as RiotCluster)}
            style={inputStyle}
          >
            {CLUSTERS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        ) : <span />}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ padding: "8px 14px", fontSize: 12, justifyContent: "center" }}
        >
          {loading ? "..." : "Buscar"}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
        gap: 12,
        padding: 16
      }}
    >
      <label style={{ gridColumn: "span 5" }}>
        <span style={labelStyle}>Game Name</span>
        <input value={gameName} onChange={(e) => setGameName(e.target.value)} placeholder="ex: Faker" style={inputStyle} />
      </label>
      <label style={{ gridColumn: "span 2" }}>
        <span style={labelStyle}>Tag Line</span>
        <input value={tagLine} onChange={(e) => setTagLine(e.target.value)} placeholder="BR1" style={inputStyle} />
      </label>
      {showPlatform && (
        <label style={{ gridColumn: "span 2" }}>
          <span style={labelStyle}>Platform</span>
          <select value={platform} onChange={(e) => setPlatform(e.target.value as RiotPlatform)} style={inputStyle}>
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      )}
      {showCluster && (
        <label style={{ gridColumn: "span 2" }}>
          <span style={labelStyle}>Cluster</span>
          <select value={cluster} onChange={(e) => setCluster(e.target.value as RiotCluster)} style={inputStyle}>
            {CLUSTERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      )}
      <div style={{ gridColumn: "span 1", display: "flex", alignItems: "end" }}>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "..." : "Buscar"}
        </button>
      </div>
    </form>
  );
}
