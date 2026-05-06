using BrandRiot.Domain.Abstractions;

namespace BrandRiot.Infrastructure.Persistence;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly BrandRiotDbContext _context;

    public UnitOfWork(BrandRiotDbContext context)
    {
        _context = context;
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _context.SaveChangesAsync(cancellationToken);
}
