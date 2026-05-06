using BrandRiot.Domain.Entities.Lor;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrandRiot.Infrastructure.Persistence.Configurations.Lor;

public sealed class LorMatchConfiguration : IEntityTypeConfiguration<LorMatch>
{
    public void Configure(EntityTypeBuilder<LorMatch> builder)
    {
        builder.ToTable("lor_matches");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.MatchId).HasMaxLength(64).IsRequired();
        builder.Property(x => x.Cluster).HasConversion<string>().HasMaxLength(16);
        builder.Property(x => x.GameMode).HasMaxLength(32);
        builder.Property(x => x.GameType).HasMaxLength(32);
        builder.Property(x => x.GameFormat).HasMaxLength(32);
        builder.Property(x => x.GameVersion).HasMaxLength(32);
        builder.HasIndex(x => x.MatchId).IsUnique();

        builder.HasMany(x => x.Players)
               .WithOne(x => x.Match!)
               .HasForeignKey(x => x.MatchId)
               .HasPrincipalKey(x => x.MatchId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class LorMatchPlayerConfiguration : IEntityTypeConfiguration<LorMatchPlayer>
{
    public void Configure(EntityTypeBuilder<LorMatchPlayer> builder)
    {
        builder.ToTable("lor_match_players");
        builder.HasKey(x => new { x.MatchId, x.Puuid });
        builder.Property(x => x.MatchId).HasMaxLength(64);
        builder.Property(x => x.Puuid).HasMaxLength(78);
        builder.Property(x => x.DeckCode).HasMaxLength(2048);
        builder.Property(x => x.DeckId).HasMaxLength(64);
        builder.Property(x => x.GameOutcome).HasMaxLength(16);
        builder.Property(x => x.FactionsJson).HasColumnType("jsonb");
        builder.HasIndex(x => x.Puuid);
    }
}

public sealed class LorRankedLeaderboardEntryConfiguration : IEntityTypeConfiguration<LorRankedLeaderboardEntry>
{
    public void Configure(EntityTypeBuilder<LorRankedLeaderboardEntry> builder)
    {
        builder.ToTable("lor_ranked_leaderboard_entries");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Cluster).HasConversion<string>().HasMaxLength(16);
        builder.Property(x => x.Name).HasMaxLength(128);
        builder.HasIndex(x => new { x.Cluster, x.Rank });
    }
}
