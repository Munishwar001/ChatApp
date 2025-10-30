using App.Application;
using App.core.DTOs.Auth;
using App.Infrastructure;
using System.Runtime.CompilerServices;
namespace Backend
{
    public static class DependencyInjection
    {   
        public static IServiceCollection AddBackendServices(this IServiceCollection Service ,IConfiguration Config)
        {
            Service.AddApplication().AddInfrastructure(Config);

            Service.Configure<JwtSettings>(Config.GetSection("Jwt"));
            var jwtSettings = Config.GetSection("Jwt").Get<JwtSettings>();

            return Service;
        }
    }
}
