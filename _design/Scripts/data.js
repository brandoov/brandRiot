// data.js — fake Riot API fixtures, in PT-BR
window.DATA = {
  lol: {
    summoner: { name: 'RiotZera', tag: 'BR1', level: 287, region: 'BR1' },
    rank: { tier: 'EMERALD', division: 'II', lp: 67, wins: 142, losses: 121 },
    rankProgression: [12, 18, 32, 28, 45, 41, 58, 64, 52, 68, 71, 67],
    winRate: [48, 49, 51, 50, 52, 51, 53, 54, 53, 55, 54, 56],
    matches: [
      { id: 1, champ: 'Ahri',     role: 'Mid', kda: '8/2/11', cs: 234, win: true,  duration: '32:14', lp: '+22', mode: 'Ranqueada Solo', when: 'há 2h' },
      { id: 2, champ: 'Sylas',    role: 'Mid', kda: '4/6/3',  cs: 187, win: false, duration: '28:43', lp: '-18', mode: 'Ranqueada Solo', when: 'há 4h' },
      { id: 3, champ: 'Ahri',     role: 'Mid', kda: '12/4/8', cs: 256, win: true,  duration: '36:02', lp: '+24', mode: 'Ranqueada Solo', when: 'ontem' },
      { id: 4, champ: 'Yone',     role: 'Mid', kda: '6/3/4',  cs: 198, win: true,  duration: '24:55', lp: '+19', mode: 'Ranqueada Solo', when: 'ontem' },
      { id: 5, champ: 'Akali',    role: 'Mid', kda: '5/7/2',  cs: 165, win: false, duration: '31:12', lp: '-21', mode: 'Ranqueada Solo', when: 'ontem' },
      { id: 6, champ: 'Ahri',     role: 'Mid', kda: '9/3/14', cs: 221, win: true,  duration: '29:08', lp: '+20', mode: 'Ranqueada Flex', when: 'há 2 dias' },
    ],
    champPool: [
      { name: 'Ahri',   games: 48, wr: 64, kda: 3.8, color: '#e0a8d0' },
      { name: 'Sylas',  games: 32, wr: 52, kda: 2.4, color: '#7a4ea0' },
      { name: 'Yone',   games: 21, wr: 58, kda: 2.9, color: '#d4a85a' },
      { name: 'Akali',  games: 18, wr: 47, kda: 2.1, color: '#7adfb5' },
      { name: 'Sett',   games: 12, wr: 50, kda: 2.8, color: '#c9745a' },
    ],
    metaPicks: [
      { name: 'Hwei',     wr: 53.2, pr: 18.4, tier: 'S+', delta: +1.2 },
      { name: 'Yasuo',    wr: 49.8, pr: 14.2, tier: 'A',  delta: -0.3 },
      { name: 'Ahri',     wr: 51.4, pr: 12.1, tier: 'S',  delta: +0.8 },
      { name: 'Aurelion', wr: 52.7, pr: 8.9,  tier: 'S',  delta: +2.1 },
      { name: 'Taliyah',  wr: 50.9, pr: 6.2,  tier: 'A',  delta: -0.5 },
    ],
  },
  valorant: {
    summoner: { name: 'RiotZera', tag: 'BR1', level: 142, region: 'BR' },
    rank: { tier: 'IMMORTAL', division: 'I', lp: 84, wins: 89, losses: 76 },
    rankProgression: [22, 28, 41, 38, 55, 51, 68, 74, 62, 78, 81, 84],
    winRate: [52, 51, 53, 52, 54, 53, 55, 54, 56, 55, 57, 56],
    matches: [
      { id: 1, agent: 'Jett',     map: 'Bind',   kda: '24/15/4', score: '13-9',  win: true,  duration: '38:04', rr: '+22', mode: 'Competitivo', when: 'há 1h' },
      { id: 2, agent: 'Reyna',    map: 'Haven',  kda: '18/19/2', score: '11-13', win: false, duration: '42:18', rr: '-19', mode: 'Competitivo', when: 'há 3h' },
      { id: 3, agent: 'Jett',     map: 'Ascent', kda: '28/12/3', score: '13-7',  win: true,  duration: '34:22', rr: '+24', mode: 'Competitivo', when: 'ontem' },
      { id: 4, agent: 'Chamber',  map: 'Split',  kda: '20/14/5', score: '13-10', win: true,  duration: '40:55', rr: '+18', mode: 'Competitivo', when: 'ontem' },
      { id: 5, agent: 'Phoenix',  map: 'Lotus',  kda: '14/17/6', score: '9-13',  win: false, duration: '36:11', rr: '-22', mode: 'Competitivo', when: 'ontem' },
      { id: 6, agent: 'Jett',     map: 'Sunset', kda: '22/13/4', score: '13-11', win: true,  duration: '44:08', rr: '+20', mode: 'Competitivo', when: 'há 2 dias' },
    ],
    agentPool: [
      { name: 'Jett',    games: 64, wr: 62, kda: 1.4, color: '#bce4f5' },
      { name: 'Reyna',   games: 38, wr: 50, kda: 1.2, color: '#9c4ec4' },
      { name: 'Chamber', games: 24, wr: 56, kda: 1.5, color: '#d4a85a' },
      { name: 'Phoenix', games: 18, wr: 48, kda: 1.1, color: '#e07a40' },
      { name: 'Yoru',    games: 12, wr: 52, kda: 1.3, color: '#5a7adf' },
    ],
    metaPicks: [
      { name: 'Iso',      wr: 53.8, pr: 16.2, tier: 'S+', delta: +1.4 },
      { name: 'Jett',     wr: 51.2, pr: 22.4, tier: 'S',  delta: +0.4 },
      { name: 'Omen',     wr: 52.1, pr: 18.8, tier: 'S',  delta: +0.6 },
      { name: 'Killjoy',  wr: 51.7, pr: 14.1, tier: 'A',  delta: -0.2 },
      { name: 'Sova',     wr: 50.4, pr: 11.9, tier: 'A',  delta: -0.8 },
    ],
  },
  tft: {
    summoner: { name: 'RiotZera', tag: 'BR1', level: 84, region: 'BR1' },
    rank: { tier: 'DIAMOND', division: 'IV', lp: 42, wins: 56, losses: 47, top4: 73 },
    rankProgression: [8, 14, 22, 18, 32, 28, 41, 45, 38, 48, 44, 42],
    winRate: [58, 60, 62, 61, 64, 63, 65, 67, 66, 68, 67, 73],
    matches: [
      { id: 1, comp: 'Heavenly Reroll',  placement: 1, traits: ['Heavenly', 'Duelist'],   gold: 84, level: 9, duration: '34:12', lp: '+58', mode: 'Ranqueada', when: 'há 1h' },
      { id: 2, comp: 'Storyweaver Flex', placement: 4, traits: ['Storyweaver', 'Mage'],   gold: 22, level: 8, duration: '32:48', lp: '+8',  mode: 'Ranqueada', when: 'há 3h' },
      { id: 3, comp: 'Dragonlord',       placement: 2, traits: ['Dragonlord', 'Sage'],    gold: 64, level: 9, duration: '36:55', lp: '+42', mode: 'Ranqueada', when: 'ontem' },
      { id: 4, comp: 'Ghostly Snipers',  placement: 7, traits: ['Ghostly', 'Sniper'],     gold: 0,  level: 7, duration: '24:18', lp: '-32', mode: 'Ranqueada', when: 'ontem' },
      { id: 5, comp: 'Inkshadow Bruiser',placement: 3, traits: ['Inkshadow', 'Bruiser'],  gold: 38, level: 8, duration: '30:22', lp: '+18', mode: 'Ranqueada', when: 'ontem' },
      { id: 6, comp: 'Heavenly Reroll',  placement: 1, traits: ['Heavenly', 'Duelist'],   gold: 92, level: 9, duration: '38:04', lp: '+62', mode: 'Ranqueada', when: 'há 2 dias' },
    ],
    compPool: [
      { name: 'Heavenly Reroll',  games: 28, top4: 78, avg: 3.2, color: '#ffd95a' },
      { name: 'Storyweaver Flex', games: 22, top4: 64, avg: 4.1, color: '#a85bd1' },
      { name: 'Dragonlord',       games: 18, top4: 72, avg: 3.6, color: '#5b9be0' },
      { name: 'Inkshadow Bruiser',games: 14, top4: 68, avg: 3.8, color: '#3eb86c' },
      { name: 'Ghostly Snipers',  games: 11, top4: 54, avg: 4.6, color: '#e6e6e6' },
    ],
    metaPicks: [
      { name: 'Heavenly Reroll',  wr: 24.8, pr: 14.2, tier: 'S+', delta: +2.4 },
      { name: 'Dragonlord',       wr: 22.1, pr: 12.4, tier: 'S',  delta: +1.1 },
      { name: 'Storyweaver',      wr: 19.4, pr: 18.1, tier: 'S',  delta: -0.6 },
      { name: 'Inkshadow Bruiser',wr: 21.2, pr: 9.4,  tier: 'A',  delta: +0.8 },
      { name: 'Ghostly Snipers',  wr: 18.8, pr: 7.2,  tier: 'A',  delta: -1.2 },
    ],
  },
  lor: {
    summoner: { name: 'RiotZera', tag: 'BR1', level: 38, region: 'AMÉRICAS' },
    rank: { tier: 'MASTER', division: '', lp: 218, wins: 124, losses: 96 },
    rankProgression: [42, 58, 78, 88, 110, 124, 156, 172, 188, 204, 212, 218],
    winRate: [54, 55, 56, 57, 58, 57, 59, 60, 58, 61, 60, 56],
    matches: [
      { id: 1, deck: 'Annie / Jhin Discard',     archetype: 'Aggro',   regions: ['Noxus', 'Bilgewater'],     turns: 11, mulligan: 3, win: true,  duration: '08:42', lp: '+18', mode: 'Ranqueada', when: 'há 30min' },
      { id: 2, deck: 'Ahri / Kennen Stun',       archetype: 'Tempo',   regions: ['Ionia', 'Ionia'],           turns: 14, mulligan: 2, win: false, duration: '11:18', lp: '-14', mode: 'Ranqueada', when: 'há 2h' },
      { id: 3, deck: 'Annie / Jhin Discard',     archetype: 'Aggro',   regions: ['Noxus', 'Bilgewater'],     turns: 9,  mulligan: 4, win: true,  duration: '07:14', lp: '+16', mode: 'Ranqueada', when: 'há 4h' },
      { id: 4, deck: 'Aurelion / Zoe Invoke',    archetype: 'Control', regions: ['Targon', 'Shurima'],        turns: 18, mulligan: 1, win: true,  duration: '14:32', lp: '+22', mode: 'Ranqueada', when: 'ontem' },
      { id: 5, deck: 'Karma / Sett Burn',        archetype: 'Midrange',regions: ['Ionia', 'Noxus'],           turns: 12, mulligan: 3, win: false, duration: '10:08', lp: '-12', mode: 'Ranqueada', when: 'ontem' },
      { id: 6, deck: 'Annie / Jhin Discard',     archetype: 'Aggro',   regions: ['Noxus', 'Bilgewater'],     turns: 10, mulligan: 2, win: true,  duration: '08:55', lp: '+18', mode: 'Ranqueada', when: 'há 2 dias' },
    ],
    deckPool: [
      { name: 'Annie / Jhin Discard',    games: 36, wr: 64, archetype: 'Aggro',    color: '#e07a40' },
      { name: 'Ahri / Kennen Stun',      games: 24, wr: 56, archetype: 'Tempo',    color: '#e0a8d0' },
      { name: 'Aurelion / Zoe',          games: 18, wr: 58, archetype: 'Control',  color: '#d4a657' },
      { name: 'Karma / Sett Burn',       games: 14, wr: 50, archetype: 'Midrange', color: '#b85a40' },
      { name: 'Hecarim Ephemeral',       games: 12, wr: 52, archetype: 'Midrange', color: '#7adfb5' },
    ],
    metaPicks: [
      { name: 'Annie / Jhin',     wr: 56.4, pr: 18.2, tier: 'S+', delta: +1.8 },
      { name: 'Aurelion / Zoe',   wr: 54.1, pr: 12.4, tier: 'S',  delta: +0.6 },
      { name: 'Karma / Sett',     wr: 51.8, pr: 14.8, tier: 'A',  delta: -0.4 },
      { name: 'Hecarim Ephemeral',wr: 52.7, pr: 9.2,  tier: 'A',  delta: +0.2 },
      { name: 'Lurk Pyke',        wr: 49.8, pr: 7.4,  tier: 'B',  delta: -1.6 },
    ],
  },
};

window.GAME_META = {
  lol:      { name: 'League of Legends',     short: 'LoL',  tagline: 'A Fenda do Invocador te aguarda',     region: 'BRASIL · BR1', accent: '#c8aa6e' },
  valorant: { name: 'VALORANT',              short: 'VAL',  tagline: 'Sua mira é seu legado',                region: 'BRASIL · BR',  accent: '#ff4655' },
  tft:      { name: 'Teamfight Tactics',     short: 'TFT',  tagline: 'Posicionamento é tudo',                region: 'BRASIL · BR1', accent: '#37cdbe' },
  lor:      { name: 'Legends of Runeterra',  short: 'LoR',  tagline: 'Cada carta conta uma história',        region: 'AMÉRICAS',     accent: '#d4a657' },
};

// 12-period heatmap data for SR-style map (10x10)
window.makeHeatmap = (seed = 1) => {
  const m = Array.from({ length: 10 }, () => Array(10).fill(0));
  // hot zones (mid lane, river, jungle)
  const zones = [
    { x: 5, y: 5, r: 2.5, w: 0.95 },   // mid
    { x: 4, y: 4, r: 1.8, w: 0.7 },    // river top
    { x: 6, y: 6, r: 1.8, w: 0.7 },    // river bot
    { x: 3, y: 6, r: 1.5, w: 0.5 },    // blue jg
    { x: 7, y: 3, r: 1.5, w: 0.5 },    // red jg
    { x: 2, y: 5, r: 1.2, w: 0.4 },    // top
    { x: 8, y: 5, r: 1.2, w: 0.4 },    // bot
  ];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let v = 0;
      zones.forEach(z => {
        const d = Math.hypot(x - z.x, y - z.y);
        if (d < z.r) v = Math.max(v, z.w * (1 - d / z.r));
      });
      v += (Math.sin((x + seed) * 1.7) + Math.cos((y + seed) * 1.3)) * 0.05;
      m[y][x] = Math.max(0, Math.min(1, v));
    }
  }
  return m;
};
