using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace BrandRiot.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IRiotAccountService, RiotAccountService>();
        services.AddScoped<ILolService, LolService>();
        services.AddScoped<ITftService, TftService>();
        services.AddScoped<IValorantService, ValorantService>();
        services.AddScoped<ILorService, LorService>();
        return services;
    }
}
