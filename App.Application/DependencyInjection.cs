using App.Application.Interfaces;
using App.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace App.Application
{
    public static class DependencyInjection
    {

        public static IServiceCollection AddApplication(this IServiceCollection Services) 
        {
            Services.AddScoped<IJwtAuthManager ,JwtAuthManager>();
            Services.AddScoped<IEncryptionService, EncryptionService>();

            return Services;
        }
    }
}
