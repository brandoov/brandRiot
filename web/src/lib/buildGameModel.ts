import type {
  LolMatchResponse,
  LolPlayerResponse,
  LolRankedResponse,
  LorLeaderboardResponse,
  LorMatchIdsResponse,
  TftMatchResponse,
  TftPlayerResponse,
  TftRankedResponse,
  ValorantMatchHistoryResponse
} from "@/api/types";
import { MOCK_DATA, type GameDataMock, type AnyMatchMock } from "@/data/mock";
import type { GameKey } from "./gameKey";

export interface GameModel extends GameDataMock {
  /** quais campos vieram de mocks (todo card que use um campo aqui mostra <MockBadge/>) */
  mocked: {
    rankProgression: boolean;
    winRate: boolean;
    pool: boolean;
    metaPicks: boolean;
    matches: boolean;
    rank: boolean;
    summoner: boolean;
  };
}

interface LolInputs {
  player?: LolPlayerResponse;
  ranked?: LolRankedResponse;
  matches?: LolMatchResponse[];
}
interface TftInputs {
  player?: TftPlayerResponse;
  ranked?: TftRankedResponse;
  matches?: TftMatchResponse[];
}
interface ValorantInputs {
  history?: ValorantMatchHistoryResponse;
  /** Riot ID custom (modo demonstração — sobrescreve o mock summoner). */
  displayName?: string;
  displayTag?: string;
  displayPlatform?: string;
}
interface LorInputs {
  matches?: LorMatchIdsResponse;
  leaderboard?: LorLeaderboardResponse;
}

const PRIMARY_LOL_QUEUE = "RANKED_SOLO_5x5";
const PRIMARY_TFT_QUEUE = "RANKED_TFT";

export function buildLolModel(inputs: LolInputs): GameModel {
  const base = MOCK_DATA.lol;
  const player = inputs.player;
  const rankedEntry =
    inputs.ranked?.entries.find((e) => e.queueType === PRIMARY_LOL_QUEUE) ??
    inputs.ranked?.entries[0];

  const matches: AnyMatchMock[] | undefined = inputs.matches?.map((m, idx) => {
    const me = m.participants.find((p) => p.puuid === player?.puuid);
    const win = me?.win ?? false;
    return {
      id: idx + 1,
      champ: me?.championName ?? "—",
      role: me?.role || me?.lane || "—",
      kda: me ? `${me.kills}/${me.deaths}/${me.assists}` : "—",
      cs: me?.csTotal ?? 0,
      win,
      duration: formatDuration(m.gameDurationSeconds),
      lp: win ? "+22" : "-18",
      mode: m.gameMode || "Partida",
      when: relativeFromIso(m.gameCreationUtc)
    } as AnyMatchMock;
  });

  return {
    summoner: player
      ? { name: player.gameName, tag: player.tagLine, level: Number(player.summonerLevel), region: player.platform }
      : base.summoner,
    rank: rankedEntry
      ? {
          tier: rankedEntry.tier,
          division: rankedEntry.rank,
          lp: rankedEntry.leaguePoints,
          wins: rankedEntry.wins,
          losses: rankedEntry.losses
        }
      : base.rank,
    rankProgression: base.rankProgression,
    winRate: base.winRate,
    matches: matches && matches.length > 0 ? matches : base.matches,
    pool: base.pool,
    metaPicks: base.metaPicks,
    mocked: {
      rankProgression: true,
      winRate: true,
      pool: true,
      metaPicks: true,
      matches: !matches || matches.length === 0,
      rank: !rankedEntry,
      summoner: !player
    }
  };
}

export function buildTftModel(inputs: TftInputs): GameModel {
  const base = MOCK_DATA.tft;
  const player = inputs.player;
  const rankedEntry =
    inputs.ranked?.entries.find((e) => e.queueType.startsWith(PRIMARY_TFT_QUEUE)) ??
    inputs.ranked?.entries[0];

  const matches: AnyMatchMock[] | undefined = inputs.matches?.map((m, idx) => {
    const me = m.participants.find((p) => p.puuid === player?.puuid);
    const placement = me?.placement ?? 0;
    return {
      id: idx + 1,
      comp: m.tftGameType || "Composição",
      placement,
      traits: [],
      gold: me?.goldLeft ?? 0,
      level: me?.level ?? 0,
      duration: formatDuration(m.gameLengthSeconds),
      lp: placement <= 4 ? `+${(5 - placement) * 12}` : `-${(placement - 4) * 8}`,
      mode: m.tftGameType || "Ranqueada",
      when: relativeFromIso(m.gameDateUtc)
    } as AnyMatchMock;
  });

  return {
    summoner: player
      ? { name: player.gameName, tag: player.tagLine, level: Number(player.summonerLevel), region: player.platform }
      : base.summoner,
    rank: rankedEntry
      ? {
          tier: rankedEntry.tier,
          division: rankedEntry.rank,
          lp: rankedEntry.leaguePoints,
          wins: rankedEntry.wins,
          losses: rankedEntry.losses,
          top4: base.rank.top4
        }
      : base.rank,
    rankProgression: base.rankProgression,
    winRate: base.winRate,
    matches: matches && matches.length > 0 ? matches : base.matches,
    pool: base.pool,
    metaPicks: base.metaPicks,
    mocked: {
      rankProgression: true,
      winRate: true,
      pool: true,
      metaPicks: true,
      matches: !matches || matches.length === 0,
      rank: !rankedEntry,
      summoner: !player
    }
  };
}

export function buildValorantModel(inputs: ValorantInputs): GameModel {
  const base = MOCK_DATA.valorant;
  const history = inputs.history;
  const matches: AnyMatchMock[] | undefined = history?.history.slice(0, 6).map((h, idx) => ({
    id: idx + 1,
    agent: "—",
    map: h.queueId || "—",
    kda: "—",
    score: "—",
    win: idx % 2 === 0,
    duration: "—",
    rr: "+0",
    mode: h.queueId,
    when: relativeFromIso(h.gameStartUtc)
  }));

  const displayedSummoner = inputs.displayName
    ? {
        name: inputs.displayName,
        tag: inputs.displayTag ?? base.summoner.tag,
        level: base.summoner.level,
        region: inputs.displayPlatform ?? base.summoner.region
      }
    : base.summoner;

  return {
    summoner: displayedSummoner,
    rank: base.rank,
    rankProgression: base.rankProgression,
    winRate: base.winRate,
    matches: matches && matches.length > 0 ? matches : base.matches,
    pool: base.pool,
    metaPicks: base.metaPicks,
    mocked: {
      rankProgression: true,
      winRate: true,
      pool: true,
      metaPicks: true,
      matches: !matches || matches.length === 0,
      rank: true,
      // quando o usuário escolhe um Riot ID na demonstração, o nome/tag exibido
      // não é mock (é o que ele digitou) — só os números é que continuam fake.
      summoner: !inputs.displayName
    }
  };
}

export function buildLorModel(inputs: LorInputs): GameModel {
  const base = MOCK_DATA.lor;
  const matchIds = inputs.matches?.matchIds ?? [];
  const matches = matchIds.length > 0
    ? base.matches.slice(0, Math.min(matchIds.length, base.matches.length))
    : base.matches;

  return {
    summoner: base.summoner,
    rank: base.rank,
    rankProgression: base.rankProgression,
    winRate: base.winRate,
    matches,
    pool: base.pool,
    metaPicks: base.metaPicks,
    mocked: {
      rankProgression: true,
      winRate: true,
      pool: true,
      metaPicks: true,
      matches: matchIds.length === 0,
      rank: true,
      summoner: true
    }
  };
}

export function buildModelForGame(game: GameKey, inputs: LolInputs | TftInputs | ValorantInputs | LorInputs): GameModel {
  switch (game) {
    case "lol":
      return buildLolModel(inputs as LolInputs);
    case "tft":
      return buildTftModel(inputs as TftInputs);
    case "valorant":
      return buildValorantModel(inputs as ValorantInputs);
    case "lor":
      return buildLorModel(inputs as LorInputs);
  }
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.max(0, Math.round(totalSeconds - m * 60));
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function relativeFromIso(iso: string): string {
  const date = new Date(iso);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 60 * 60) return `há ${Math.round(diff / 60)}min`;
  if (diff < 60 * 60 * 24) return `há ${Math.round(diff / 3600)}h`;
  if (diff < 60 * 60 * 48) return "ontem";
  return `há ${Math.round(diff / 86400)} dias`;
}
