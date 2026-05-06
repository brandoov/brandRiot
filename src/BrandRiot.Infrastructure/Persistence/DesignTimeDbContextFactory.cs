using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BrandRiot.Infrastructure.Persistence;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<BrandRiotDbContext>
{
    public BrandRiotDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("BRANDRIOT_CONN")
            ?? "Host=localhost;Port=5432;Database=brandriot;Username=brandriot;Password=brandriot";

        var options = new DbContextOptionsBuilder<BrandRiotDbContext>()
            .UseNpgsql(connectionString, b => b.MigrationsHistoryTable("__EFMigrationsHistory", BrandRiotDbContext.Schema))
            .Options;

        return new BrandRiotDbContext(options);
    }
}
