using App.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using App.Application.Interfaces;

namespace App.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection Service ,IConfiguration Config)
        {
            var redisConnection = Config.GetSection("Redis:Connection").Value;

            if (string.IsNullOrEmpty(redisConnection))
                throw new ArgumentNullException("Redis connection is missing in appsettings.json");

            Service.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnection));
            Service.AddScoped<IRedisService , RedisService>();
            Service.AddScoped<IEmailService, EmailService>();

            return Service;
        }
    }
}
