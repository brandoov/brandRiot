using BrandRiot.Domain.Entities.Tft;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrandRiot.Infrastructure.Persistence.Configurations.Tft;

public sealed class TftSummonerConfiguration : IEntityTypeConfiguration<TftSummoner>
{
    public void Configure(EntityTypeBuilder<TftSummoner> builder)
    {
        builder.ToTable("tft_summoners");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Puuid).HasMaxLength(78).IsRequired();
        builder.Property(x => x.SummonerId).HasMaxLength(64);
        builder.Property(x => x.AccountId).HasMaxLength(64);
        builder.Property(x => x.Platform).HasConversion<string>().HasMaxLength(16);
        builder.HasIndex(x => x.Puuid).IsUnique();
    }
}

public sealed class TftMatchConfiguration : IEntityTypeConfiguration<TftMatch>
{
    public void Configure(EntityTypeBuilder<TftMatch> builder)
    {
        builder.ToTable("tft_matches");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.MatchId).HasMaxLength(64).IsRequired();
        builder.Property(x => x.Cluster).HasConversion<string>().HasMaxLength(16);
        builder.Property(x => x.GameVersion).HasMaxLength(32);
        builder.Property(x => x.TftGameType).HasMaxLength(32);
        builder.HasIndex(x => x.MatchId).IsUnique();

        builder.HasMany(x => x.Participants)
               .WithOne(x => x.Match!)
               .HasForeignKey(x => x.MatchId)
               .HasPrincipalKey(x => x.MatchId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class TftMatchParticipantConfiguration : IEntityTypeConfiguration<TftMatchParticipant>
{
    public void Configure(EntityTypeBuilder<TftMatchParticipant> builder)
    {
        builder.ToTable("tft_match_participants");
        builder.HasKey(x => new { x.MatchId, x.Puuid });
        builder.Property(x => x.MatchId).HasMaxLength(64);
        builder.Property(x => x.Puuid).HasMaxLength(78);
        builder.Property(x => x.CompanionContentId).HasMaxLength(128);
        builder.Property(x => x.TraitsJson).HasColumnType("jsonb");
        builder.Property(x => x.UnitsJson).HasColumnType("jsonb");
        builder.Property(x => x.AugmentsJson).HasColumnType("jsonb");
        builder.HasIndex(x => x.Puuid);
    }
}

public sealed class TftLeagueEntryConfiguration : IEntityTypeConfiguration<TftLeagueEntry>
{
    public void Configure(EntityTypeBuilder<TftLeagueEntry> builder)
    {
        builder.ToTable("tft_league_entries");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Puuid).HasMaxLength(78).IsRequired();
        builder.Property(x => x.SummonerId).HasMaxLength(64);
        builder.Property(x => x.QueueType).HasMaxLength(32);
        builder.Property(x => x.Tier).HasMaxLength(16);
        builder.Property(x => x.Rank).HasMaxLength(8);
        builder.HasIndex(x => new { x.Puuid, x.QueueType }).IsUnique();
    }
}
