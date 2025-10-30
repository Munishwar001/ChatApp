
namespace App.Application.Interfaces { 
    public interface IRedisService
    {
        Task<string?> GetValueAsync(string key);
        Task RemoveKeyAsync(string key);
        Task SetValueAsync(string key, string value, TimeSpan? expiry = null);
    }
}