using BrandRiot.Domain.Entities.Accounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrandRiot.Infrastructure.Persistence.Configurations;

public sealed class RiotAccountConfiguration : IEntityTypeConfiguration<RiotAccount>
{
    public void Configure(EntityTypeBuilder<RiotAccount> builder)
    {
        builder.ToTable("riot_accounts");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Puuid).HasMaxLength(78).IsRequired();
        builder.Property(x => x.GameName).HasMaxLength(64).IsRequired();
        builder.Property(x => x.TagLine).HasMaxLength(16).IsRequired();
        builder.Property(x => x.ResolvedCluster).HasConversion<string>().HasMaxLength(16);
        builder.Property(x => x.LastSeenPlatform).HasConversion<string?>().HasMaxLength(16);
        builder.HasIndex(x => x.Puuid).IsUnique();
        builder.HasIndex(x => new { x.GameName, x.TagLine });
    }
}
