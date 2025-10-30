using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace App.Infrastructure.Identity
{
    public static class IdentityService
    { 
        public static IServiceCollection AddIdentitySetup(this IServiceCollection services)
        {
            services.AddDataProtection();

            services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.User.RequireUniqueEmail = true;
            })
           .AddRoles<IdentityRole>()
           .AddEntityFrameworkStores<AppDbContext>()
           .AddDefaultTokenProviders();


            return services;
        }
    }
}
