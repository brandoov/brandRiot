using BrandRiot.Domain.Common;
using BrandRiot.Domain.Entities.Accounts;
using BrandRiot.Domain.Entities.Lol;
using BrandRiot.Domain.Entities.Lor;
using BrandRiot.Domain.Entities.Tft;
using BrandRiot.Domain.Entities.Valorant;
using Microsoft.EntityFrameworkCore;

namespace BrandRiot.Infrastructure.Persistence;

public sealed class BrandRiotDbContext : DbContext
{
    public const string Schema = "riot";

    public BrandRiotDbContext(DbContextOptions<BrandRiotDbContext> options) : base(options)
    {
    }

    public DbSet<RiotAccount> RiotAccounts => Set<RiotAccount>();
    public DbSet<Summoner> Summoners => Set<Summoner>();
    public DbSet<LolMatch> LolMatches => Set<LolMatch>();
    public DbSet<LolMatchParticipant> LolMatchParticipants => Set<LolMatchParticipant>();
    public DbSet<LolLeagueEntry> LolLeagueEntries => Set<LolLeagueEntry>();
    public DbSet<LolChampionMastery> LolChampionMasteries => Set<LolChampionMastery>();
    public DbSet<TftSummoner> TftSummoners => Set<TftSummoner>();
    public DbSet<TftMatch> TftMatches => Set<TftMatch>();
    public DbSet<TftMatchParticipant> TftMatchParticipants => Set<TftMatchParticipant>();
    public DbSet<TftLeagueEntry> TftLeagueEntries => Set<TftLeagueEntry>();
    public DbSet<ValorantMatch> ValorantMatches => Set<ValorantMatch>();
    public DbSet<ValorantMatchPlayer> ValorantMatchPlayers => Set<ValorantMatchPlayer>();
    public DbSet<ValorantContentItem> ValorantContentItems => Set<ValorantContentItem>();
    public DbSet<ValorantRankedEntry> ValorantRankedEntries => Set<ValorantRankedEntry>();
    public DbSet<LorMatch> LorMatches => Set<LorMatch>();
    public DbSet<LorMatchPlayer> LorMatchPlayers => Set<LorMatchPlayer>();
    public DbSet<LorRankedLeaderboardEntry> LorRankedLeaderboardEntries => Set<LorRankedLeaderboardEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BrandRiotDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<Entity>())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity.CreatedAtUtc == default)
                {
                    entry.Entity.CreatedAtUtc = now;
                }
                entry.Entity.UpdatedAtUtc = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAtUtc = now;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
