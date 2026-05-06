using BrandRiot.Domain.Entities.Lol;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrandRiot.Infrastructure.Persistence.Configurations.Lol;

public sealed class SummonerConfiguration : IEntityTypeConfiguration<Summoner>
{
    public void Configure(EntityTypeBuilder<Summoner> builder)
    {
        builder.ToTable("lol_summoners");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Puuid).HasMaxLength(78).IsRequired();
        builder.Property(x => x.SummonerId).HasMaxLength(64);
        builder.Property(x => x.AccountId).HasMaxLength(64);
        builder.Property(x => x.Platform).HasConversion<string>().HasMaxLength(16);
        builder.HasIndex(x => x.Puuid).IsUnique();
    }
}

public sealed class LolMatchConfiguration : IEntityTypeConfiguration<LolMatch>
{
    public void Configure(EntityTypeBuilder<LolMatch> builder)
    {
        builder.ToTable("lol_matches");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.MatchId).HasMaxLength(64).IsRequired();
        builder.Property(x => x.Platform).HasConversion<string>().HasMaxLength(16);
        builder.Property(x => x.GameVersion).HasMaxLength(32);
        builder.Property(x => x.GameMode).HasMaxLength(32);
        builder.Property(x => x.GameType).HasMaxLength(32);
        builder.HasIndex(x => x.MatchId).IsUnique();
        builder.HasIndex(x => x.GameCreationUtc);

        builder.HasMany(x => x.Participants)
               .WithOne(x => x.Match!)
               .HasForeignKey(x => x.MatchId)
               .HasPrincipalKey(x => x.MatchId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class LolMatchParticipantConfiguration : IEntityTypeConfiguration<LolMatchParticipant>
{
    public void Configure(EntityTypeBuilder<LolMatchParticipant> builder)
    {
        builder.ToTable("lol_match_participants");
        builder.HasKey(x => new { x.MatchId, x.Puuid });
        builder.Property(x => x.MatchId).HasMaxLength(64).IsRequired();
        builder.Property(x => x.Puuid).HasMaxLength(78).IsRequired();
        builder.Property(x => x.ChampionName).HasMaxLength(64);
        builder.Property(x => x.Lane).HasMaxLength(16);
        builder.Property(x => x.Role).HasMaxLength(32);
        builder.HasIndex(x => x.Puuid);
        builder.HasIndex(x => x.ChampionId);
    }
}

public sealed class LolLeagueEntryConfiguration : IEntityTypeConfiguration<LolLeagueEntry>
{
    public void Configure(EntityTypeBuilder<LolLeagueEntry> builder)
    {
        builder.ToTable("lol_league_entries");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Puuid).HasMaxLength(78).IsRequired();
        builder.Property(x => x.SummonerId).HasMaxLength(64);
        builder.Property(x => x.QueueType).HasMaxLength(32);
        builder.Property(x => x.Tier).HasMaxLength(16);
        builder.Property(x => x.Rank).HasMaxLength(8);
        builder.HasIndex(x => new { x.Puuid, x.QueueType }).IsUnique();
    }
}

public sealed class LolChampionMasteryConfiguration : IEntityTypeConfiguration<LolChampionMastery>
{
    public void Configure(EntityTypeBuilder<LolChampionMastery> builder)
    {
        builder.ToTable("lol_champion_masteries");
        builder.HasKey(x => new { x.Puuid, x.ChampionId });
        builder.Property(x => x.Puuid).HasMaxLength(78).IsRequired();
        builder.HasIndex(x => x.Puuid);
    }
}
