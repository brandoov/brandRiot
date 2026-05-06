using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BrandRiot.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "riot");

            migrationBuilder.CreateTable(
                name: "lol_champion_masteries",
                schema: "riot",
                columns: table => new
                {
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    ChampionId = table.Column<int>(type: "integer", nullable: false),
                    ChampionLevel = table.Column<int>(type: "integer", nullable: false),
                    ChampionPoints = table.Column<long>(type: "bigint", nullable: false),
                    LastPlayTimeUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ChampionPointsSinceLastLevel = table.Column<long>(type: "bigint", nullable: false),
                    ChampionPointsUntilNextLevel = table.Column<long>(type: "bigint", nullable: false),
                    TokensEarned = table.Column<int>(type: "integer", nullable: false),
                    ChestGranted = table.Column<bool>(type: "boolean", nullable: false),
                    FetchedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lol_champion_masteries", x => new { x.Puuid, x.ChampionId });
                });

            migrationBuilder.CreateTable(
                name: "lol_league_entries",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    SummonerId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    QueueType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Tier = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    Rank = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    LeaguePoints = table.Column<int>(type: "integer", nullable: false),
                    Wins = table.Column<int>(type: "integer", nullable: false),
                    Losses = table.Column<int>(type: "integer", nullable: false),
                    HotStreak = table.Column<bool>(type: "boolean", nullable: false),
                    Veteran = table.Column<bool>(type: "boolean", nullable: false),
                    FreshBlood = table.Column<bool>(type: "boolean", nullable: false),
                    Inactive = table.Column<bool>(type: "boolean", nullable: false),
                    FetchedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lol_league_entries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "lol_matches",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MatchId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Platform = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    GameCreationUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GameDurationSeconds = table.Column<long>(type: "bigint", nullable: false),
                    GameVersion = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    QueueId = table.Column<int>(type: "integer", nullable: false),
                    MapId = table.Column<int>(type: "integer", nullable: false),
                    GameMode = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    GameType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lol_matches", x => x.Id);
                    table.UniqueConstraint("AK_lol_matches_MatchId", x => x.MatchId);
                });

            migrationBuilder.CreateTable(
                name: "lol_summoners",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    SummonerId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    AccountId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    ProfileIconId = table.Column<int>(type: "integer", nullable: false),
                    SummonerLevel = table.Column<long>(type: "bigint", nullable: false),
                    RevisionDate = table.Column<long>(type: "bigint", nullable: false),
                    Platform = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lol_summoners", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "lor_matches",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MatchId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Cluster = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    GameStartUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GameMode = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    GameType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    GameVersion = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    GameFormat = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    TotalTurnCount = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lor_matches", x => x.Id);
                    table.UniqueConstraint("AK_lor_matches_MatchId", x => x.MatchId);
                });

            migrationBuilder.CreateTable(
                name: "lor_ranked_leaderboard_entries",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Cluster = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    Rank = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    LeaguePoints = table.Column<int>(type: "integer", nullable: false),
                    FetchedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lor_ranked_leaderboard_entries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "riot_accounts",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    GameName = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    TagLine = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    ResolvedCluster = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    LastSeenPlatform = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    FirstFetchedUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastFetchedUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_riot_accounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tft_league_entries",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    SummonerId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    QueueType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Tier = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    Rank = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    LeaguePoints = table.Column<int>(type: "integer", nullable: false),
                    Wins = table.Column<int>(type: "integer", nullable: false),
                    Losses = table.Column<int>(type: "integer", nullable: false),
                    HotStreak = table.Column<bool>(type: "boolean", nullable: false),
                    Veteran = table.Column<bool>(type: "boolean", nullable: false),
                    FreshBlood = table.Column<bool>(type: "boolean", nullable: false),
                    Inactive = table.Column<bool>(type: "boolean", nullable: false),
                    FetchedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tft_league_entries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tft_matches",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MatchId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Cluster = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    GameDateUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GameLengthSeconds = table.Column<long>(type: "bigint", nullable: false),
                    GameVersion = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    QueueId = table.Column<int>(type: "integer", nullable: false),
                    TftSetNumber = table.Column<int>(type: "integer", nullable: false),
                    TftGameType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tft_matches", x => x.Id);
                    table.UniqueConstraint("AK_tft_matches_MatchId", x => x.MatchId);
                });

            migrationBuilder.CreateTable(
                name: "tft_summoners",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    SummonerId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    AccountId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    ProfileIconId = table.Column<int>(type: "integer", nullable: false),
                    SummonerLevel = table.Column<long>(type: "bigint", nullable: false),
                    RevisionDate = table.Column<long>(type: "bigint", nullable: false),
                    Platform = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tft_summoners", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "valorant_content_items",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContentType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    ContentId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    LocalizedNamesJson = table.Column<string>(type: "jsonb", nullable: false),
                    AssetPath = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    FetchedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_valorant_content_items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "valorant_matches",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MatchId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Platform = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    MapId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    GameVersion = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    QueueId = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    GameStartUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GameLengthMillis = table.Column<long>(type: "bigint", nullable: false),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    SeasonId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_valorant_matches", x => x.Id);
                    table.UniqueConstraint("AK_valorant_matches_MatchId", x => x.MatchId);
                });

            migrationBuilder.CreateTable(
                name: "valorant_ranked_entries",
                schema: "riot",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    ActId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Tier = table.Column<int>(type: "integer", nullable: false),
                    RankedRating = table.Column<int>(type: "integer", nullable: false),
                    NumberOfWins = table.Column<int>(type: "integer", nullable: false),
                    FetchedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_valorant_ranked_entries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "lol_match_participants",
                schema: "riot",
                columns: table => new
                {
                    MatchId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    ChampionId = table.Column<int>(type: "integer", nullable: false),
                    ChampionName = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    TeamId = table.Column<int>(type: "integer", nullable: false),
                    Win = table.Column<bool>(type: "boolean", nullable: false),
                    Kills = table.Column<int>(type: "integer", nullable: false),
                    Deaths = table.Column<int>(type: "integer", nullable: false),
                    Assists = table.Column<int>(type: "integer", nullable: false),
                    GoldEarned = table.Column<long>(type: "bigint", nullable: false),
                    TotalDamageDealtToChampions = table.Column<long>(type: "bigint", nullable: false),
                    VisionScore = table.Column<int>(type: "integer", nullable: false),
                    CsTotal = table.Column<int>(type: "integer", nullable: false),
                    Lane = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    Role = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Item0 = table.Column<int>(type: "integer", nullable: false),
                    Item1 = table.Column<int>(type: "integer", nullable: false),
                    Item2 = table.Column<int>(type: "integer", nullable: false),
                    Item3 = table.Column<int>(type: "integer", nullable: false),
                    Item4 = table.Column<int>(type: "integer", nullable: false),
                    Item5 = table.Column<int>(type: "integer", nullable: false),
                    Item6 = table.Column<int>(type: "integer", nullable: false),
                    Summoner1Id = table.Column<int>(type: "integer", nullable: false),
                    Summoner2Id = table.Column<int>(type: "integer", nullable: false),
                    KeystonePerk = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lol_match_participants", x => new { x.MatchId, x.Puuid });
                    table.ForeignKey(
                        name: "FK_lol_match_participants_lol_matches_MatchId",
                        column: x => x.MatchId,
                        principalSchema: "riot",
                        principalTable: "lol_matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "lor_match_players",
                schema: "riot",
                columns: table => new
                {
                    MatchId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    DeckCode = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    DeckId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    GameOutcome = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    OrderOfPlay = table.Column<int>(type: "integer", nullable: false),
                    FactionsJson = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lor_match_players", x => new { x.MatchId, x.Puuid });
                    table.ForeignKey(
                        name: "FK_lor_match_players_lor_matches_MatchId",
                        column: x => x.MatchId,
                        principalSchema: "riot",
                        principalTable: "lor_matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "tft_match_participants",
                schema: "riot",
                columns: table => new
                {
                    MatchId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    Placement = table.Column<int>(type: "integer", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    LastRound = table.Column<int>(type: "integer", nullable: false),
                    PlayersEliminated = table.Column<int>(type: "integer", nullable: false),
                    TotalDamageToPlayers = table.Column<long>(type: "bigint", nullable: false),
                    GoldLeft = table.Column<int>(type: "integer", nullable: false),
                    TimeEliminatedSeconds = table.Column<double>(type: "double precision", nullable: false),
                    CompanionContentId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    TraitsJson = table.Column<string>(type: "jsonb", nullable: false),
                    UnitsJson = table.Column<string>(type: "jsonb", nullable: false),
                    AugmentsJson = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tft_match_participants", x => new { x.MatchId, x.Puuid });
                    table.ForeignKey(
                        name: "FK_tft_match_participants_tft_matches_MatchId",
                        column: x => x.MatchId,
                        principalSchema: "riot",
                        principalTable: "tft_matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "valorant_match_players",
                schema: "riot",
                columns: table => new
                {
                    MatchId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Puuid = table.Column<string>(type: "character varying(78)", maxLength: 78, nullable: false),
                    TeamId = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    CharacterId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Score = table.Column<int>(type: "integer", nullable: false),
                    RoundsPlayed = table.Column<int>(type: "integer", nullable: false),
                    Kills = table.Column<int>(type: "integer", nullable: false),
                    Deaths = table.Column<int>(type: "integer", nullable: false),
                    Assists = table.Column<int>(type: "integer", nullable: false),
                    PlaytimeMillis = table.Column<long>(type: "bigint", nullable: false),
                    AbilityCastsJson = table.Column<string>(type: "jsonb", nullable: false),
                    DamagePerRoundJson = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_valorant_match_players", x => new { x.MatchId, x.Puuid });
                    table.ForeignKey(
                        name: "FK_valorant_match_players_valorant_matches_MatchId",
                        column: x => x.MatchId,
                        principalSchema: "riot",
                        principalTable: "valorant_matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_lol_champion_masteries_Puuid",
                schema: "riot",
                table: "lol_champion_masteries",
                column: "Puuid");

            migrationBuilder.CreateIndex(
                name: "IX_lol_league_entries_Puuid_QueueType",
                schema: "riot",
                table: "lol_league_entries",
                columns: new[] { "Puuid", "QueueType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_lol_match_participants_ChampionId",
                schema: "riot",
                table: "lol_match_participants",
                column: "ChampionId");

            migrationBuilder.CreateIndex(
                name: "IX_lol_match_participants_Puuid",
                schema: "riot",
                table: "lol_match_participants",
                column: "Puuid");

            migrationBuilder.CreateIndex(
                name: "IX_lol_matches_GameCreationUtc",
                schema: "riot",
                table: "lol_matches",
                column: "GameCreationUtc");

            migrationBuilder.CreateIndex(
                name: "IX_lol_matches_MatchId",
                schema: "riot",
                table: "lol_matches",
                column: "MatchId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_lol_summoners_Puuid",
                schema: "riot",
                table: "lol_summoners",
                column: "Puuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_lor_match_players_Puuid",
                schema: "riot",
                table: "lor_match_players",
                column: "Puuid");

            migrationBuilder.CreateIndex(
                name: "IX_lor_matches_MatchId",
                schema: "riot",
                table: "lor_matches",
                column: "MatchId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_lor_ranked_leaderboard_entries_Cluster_Rank",
                schema: "riot",
                table: "lor_ranked_leaderboard_entries",
                columns: new[] { "Cluster", "Rank" });

            migrationBuilder.CreateIndex(
                name: "IX_riot_accounts_GameName_TagLine",
                schema: "riot",
                table: "riot_accounts",
                columns: new[] { "GameName", "TagLine" });

            migrationBuilder.CreateIndex(
                name: "IX_riot_accounts_Puuid",
                schema: "riot",
                table: "riot_accounts",
                column: "Puuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tft_league_entries_Puuid_QueueType",
                schema: "riot",
                table: "tft_league_entries",
                columns: new[] { "Puuid", "QueueType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tft_match_participants_Puuid",
                schema: "riot",
                table: "tft_match_participants",
                column: "Puuid");

            migrationBuilder.CreateIndex(
                name: "IX_tft_matches_MatchId",
                schema: "riot",
                table: "tft_matches",
                column: "MatchId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tft_summoners_Puuid",
                schema: "riot",
                table: "tft_summoners",
                column: "Puuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_valorant_content_items_ContentType_ContentId",
                schema: "riot",
                table: "valorant_content_items",
                columns: new[] { "ContentType", "ContentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_valorant_match_players_Puuid",
                schema: "riot",
                table: "valorant_match_players",
                column: "Puuid");

            migrationBuilder.CreateIndex(
                name: "IX_valorant_matches_MatchId",
                schema: "riot",
                table: "valorant_matches",
                column: "MatchId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_valorant_ranked_entries_Puuid_ActId",
                schema: "riot",
                table: "valorant_ranked_entries",
                columns: new[] { "Puuid", "ActId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "lol_champion_masteries",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "lol_league_entries",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "lol_match_participants",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "lol_summoners",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "lor_match_players",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "lor_ranked_leaderboard_entries",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "riot_accounts",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "tft_league_entries",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "tft_match_participants",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "tft_summoners",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "valorant_content_items",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "valorant_match_players",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "valorant_ranked_entries",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "lol_matches",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "lor_matches",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "tft_matches",
                schema: "riot");

            migrationBuilder.DropTable(
                name: "valorant_matches",
                schema: "riot");
        }
    }
}
