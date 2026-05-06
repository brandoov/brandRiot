namespace BrandRiot.Application.Dtos.Riot.Valorant;

public sealed record ValContentDto(
    string Version,
    IReadOnlyList<ValContentItemDto> Characters,
    IReadOnlyList<ValContentItemDto> Maps,
    IReadOnlyList<ValContentItemDto> GameModes,
    IReadOnlyList<ValContentItemDto> Acts);

public sealed record ValContentItemDto(
    string Name,
    string LocalizedNames,
    string Id,
    string AssetName,
    bool IsActive);
