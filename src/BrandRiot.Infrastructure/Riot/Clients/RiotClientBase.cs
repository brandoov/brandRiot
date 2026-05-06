using System.Net.Http.Json;
using System.Text.Json;

namespace BrandRiot.Infrastructure.Riot.Clients;

internal abstract class RiotClientBase
{
    protected static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    protected static async Task<T> ReadAsync<T>(HttpResponseMessage response, CancellationToken cancellationToken)
    {
        var value = await response.Content.ReadFromJsonAsync<T>(JsonOptions, cancellationToken).ConfigureAwait(false);
        if (value is null)
        {
            throw new InvalidOperationException("Riot API returned an empty response body.");
        }
        return value;
    }
}
