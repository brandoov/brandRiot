namespace BrandRiot.Application.Common;

public sealed class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }
    public int? StatusCode { get; }

    private Result(bool isSuccess, T? value, string? error, int? statusCode)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
        StatusCode = statusCode;
    }

    public static Result<T> Ok(T value) => new(true, value, null, null);
    public static Result<T> Fail(string error, int statusCode = 500) => new(false, default, error, statusCode);
}
