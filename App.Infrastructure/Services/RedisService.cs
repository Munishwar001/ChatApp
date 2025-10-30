using App.Application.Interfaces;
using StackExchange.Redis;

namespace App.Infrastructure.Services
{
    public class RedisService : IRedisService
    {
        private readonly IConnectionMultiplexer _connection;
        private readonly IDatabase _db;

        public RedisService(IConnectionMultiplexer connection)
        {
            _connection = connection;
            _db = _connection.GetDatabase();
        }

        public async Task SetValueAsync(string key, string value, TimeSpan? expiry = null)
        {
            await _db.StringSetAsync(key, value, expiry);
        }

        public async Task<string?> GetValueAsync(string key)
        {
            return await _db.StringGetAsync(key);
        }

        public async Task RemoveKeyAsync(string key)
        {
            await _db.KeyDeleteAsync(key);
        }
    }
}
