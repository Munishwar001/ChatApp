using App.Application.Interfaces;
using System.Security.Claims;
//using CallNet.Application.Interfaces;
//using CallNet.Core.Constants;

namespace Backend.Middleware
{
    public class ClaimsDecryptionMiddleware(RequestDelegate next, IEncryptionService encryptionService)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User?.Identity?.IsAuthenticated == true)
            {
                // Claim types to decrypt
                var claimTypes = new[]
                {
                    ClaimTypes.NameIdentifier,
                    ClaimTypes.Email,
                };

                if (context.User.Identity is ClaimsIdentity identity)
                {
                    foreach (var claimType in claimTypes)
                    {
                        var claimsOfType = identity.FindAll(claimType).ToArray();
                        if (claimsOfType.Length != 0)
                        {
                            foreach (var claim in claimsOfType)
                            {
                                if (!string.IsNullOrWhiteSpace(claim.Value))
                                {
                                    string decryptedValue = encryptionService.Decrypt(claim.Value);
                                    // Remove the old claim and add a new claim with the decrypted value.
                                    identity.RemoveClaim(claim);
                                    identity.AddClaim(new Claim(claimType, decryptedValue));
                                }
                            }
                        }
                    }
                }
            }

            await next(context);
        }
    }

    public static class ClaimsDecryptionMiddlewareExtension
    {
        public static IApplicationBuilder DecryptClaims(
           this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ClaimsDecryptionMiddleware>();
        }
    }
}
