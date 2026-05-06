using BrandRiot.Domain.Entities.Valorant;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrandRiot.Infrastructure.Persistence.Configurations.Valorant;

public sealed class ValorantMatchConfiguration : IEntityTypeConfiguration<ValorantMatch>
{
    public void Configure(EntityTypeBuilder<ValorantMatch> builder)
    {
        builder.ToTable("valorant_matches");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.MatchId).HasMaxLength(64).IsRequired();
        builder.Property(x => x.Platform).HasConversion<string>().HasMaxLength(16);
        builder.Property(x => x.MapId).HasMaxLength(128);
        builder.Property(x => x.GameVersion).HasMaxLength(32);
        builder.Property(x => x.QueueId).HasMaxLength(32);
        builder.Property(x => x.SeasonId).HasMaxLength(64);
        builder.HasIndex(x => x.MatchId).IsUnique();

        builder.HasMany(x => x.Players)
               .WithOne(x => x.Match!)
               .HasForeignKey(x => x.MatchId)
               .HasPrincipalKey(x => x.MatchId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class ValorantMatchPlayerConfiguration : IEntityTypeConfiguration<ValorantMatchPlayer>
{
    public void Configure(EntityTypeBuilder<ValorantMatchPlayer> builder)
    {
        builder.ToTable("valorant_match_players");
        builder.HasKey(x => new { x.MatchId, x.Puuid });
        builder.Property(x => x.MatchId).HasMaxLength(64);
        builder.Property(x => x.Puuid).HasMaxLength(78);
        builder.Property(x => x.TeamId).HasMaxLength(16);
        builder.Property(x => x.CharacterId).HasMaxLength(64);
        builder.Property(x => x.AbilityCastsJson).HasColumnType("jsonb");
        builder.Property(x => x.DamagePerRoundJson).HasColumnType("jsonb");
        builder.HasIndex(x => x.Puuid);
    }
}

public sealed class ValorantContentItemConfiguration : IEntityTypeConfiguration<ValorantContentItem>
{
    public void Configure(EntityTypeBuilder<ValorantContentItem> builder)
    {
        builder.ToTable("valorant_content_items");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ContentType).HasMaxLength(32).IsRequired();
        builder.Property(x => x.ContentId).HasMaxLength(64).IsRequired();
        builder.Property(x => x.Name).HasMaxLength(128);
        builder.Property(x => x.AssetPath).HasMaxLength(256);
        builder.Property(x => x.LocalizedNamesJson).HasColumnType("jsonb");
        builder.HasIndex(x => new { x.ContentType, x.ContentId }).IsUnique();
    }
}

public sealed class ValorantRankedEntryConfiguration : IEntityTypeConfiguration<ValorantRankedEntry>
{
    public void Configure(EntityTypeBuilder<ValorantRankedEntry> builder)
    {
        builder.ToTable("valorant_ranked_entries");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Puuid).HasMaxLength(78).IsRequired();
        builder.Property(x => x.ActId).HasMaxLength(64);
        builder.HasIndex(x => new { x.Puuid, x.ActId }).IsUnique();
    }
}
