import { FormEvent, useState } from "react";
import type { RiotCluster, RiotPlatform } from "@/api/types";

export interface RiotIdSearchValue {
  gameName: string;
  tagLine: string;
  platform: RiotPlatform;
  cluster: RiotCluster;
}

const platforms: RiotPlatform[] = [
  "Br1", "Na1", "Lan", "Las", "Euw1", "Eun1", "Tr1", "Ru",
  "Kr",  "Jp1", "Oc1", "Ph2", "Sg2",  "Th2",  "Tw2", "Vn2"
];
const clusters: RiotCluster[] = ["Americas", "Europe", "Asia", "Sea"];

interface Props {
  defaults?: Partial<RiotIdSearchValue>;
  onSubmit: (value: RiotIdSearchValue) => void;
  loading?: boolean;
  showCluster?: boolean;
  showPlatform?: boolean;
}

export default function RiotIdSearch({
  defaults,
  onSubmit,
  loading = false,
  showCluster = true,
  showPlatform = true
}: Props) {
  const [gameName, setGameName] = useState(defaults?.gameName ?? "");
  const [tagLine, setTagLine] = useState(defaults?.tagLine ?? "BR1");
  const [platform, setPlatform] = useState<RiotPlatform>(defaults?.platform ?? "Br1");
  const [cluster, setCluster] = useState<RiotCluster>(defaults?.cluster ?? "Americas");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!gameName.trim() || !tagLine.trim()) return;
    onSubmit({ gameName: gameName.trim(), tagLine: tagLine.trim(), platform, cluster });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-12"
    >
      <label className="sm:col-span-5">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Game Name
        </span>
        <input
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="ex: Faker"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Tag Line
        </span>
        <input
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          placeholder="BR1"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>
      {showPlatform && (
        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Platform
          </span>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as RiotPlatform)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      )}
      {showCluster && (
        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Cluster
          </span>
          <select
            value={cluster}
            onChange={(e) => setCluster(e.target.value as RiotCluster)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {clusters.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="flex items-end sm:col-span-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "..." : "Buscar"}
        </button>
      </div>
    </form>
  );
}
