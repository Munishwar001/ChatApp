using App.Application.Interfaces;
using App.core.DTOs.Auth;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace App.Application.Services
{
    public class JwtAuthManager(IEncryptionService encryptionService, IOptions<JwtSettings> jwtOptions ,IUserRepository userRepository) : IJwtAuthManager
    {
        private readonly byte[] _secret = Encoding.UTF8.GetBytes(jwtOptions.Value.Key);

        public async Task<JwtAuthResult> GenerateToken(string userId, string email, string? oldRefreshToken = null)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier,  encryptionService.Encrypt(userId)),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(ClaimTypes.Email, encryptionService.Encrypt(email)),
            };

            var signinCredentials = new SigningCredentials(new SymmetricSecurityKey(_secret), SecurityAlgorithms.HmacSha256);

            var expiration = DateTime.UtcNow.AddMinutes(jwtOptions.Value.AccessTokenExpiration);

            var jwtToken = new JwtSecurityToken(
                issuer: jwtOptions.Value.Issuer,
                audience: jwtOptions.Value.Audience,
                claims: claims,
                expires: expiration,
                signingCredentials: signinCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(jwtToken);

            var refreshToken = await GenerateRefreshToken(userId, oldRefreshToken);
            return new JwtAuthResult
            {
                AccessToken = tokenString,
                AccessTokenExpiration = expiration,
                RefreshToken = refreshToken
            };
        }
        private async Task<string> GenerateRefreshToken(string userId, string oldRefreshToken)
        {
            string newRefreshToken = encryptionService.GenerateRandomToken();
            // Add new and delete the old refresh token for the user
            await userRepository.AddNewDeleteOldUserRefreshToken(userId, newRefreshToken, oldRefreshToken, DateTime.UtcNow, DateTime.UtcNow.AddMinutes(jwtOptions.Value.RefreshTokenExpiration));

            return newRefreshToken;
        }

        public string? GetUserIdFromAccessToken(string accessToken)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidAudience = jwtOptions.Value.Audience,
                ValidateIssuer = true,
                ValidIssuer = jwtOptions.Value.Issuer,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(_secret),
                ValidateLifetime = false // Do not validate lifetime here
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out SecurityToken securityToken);
            JwtSecurityToken? jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken is null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return null;
            }

            string? userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            return encryptionService.Decrypt(userId);
        }

        public async Task<bool> ValidateRefreshToken(string userId, string refreshToken)
        {
            UserRefreshToken storedRefreshToken = await userRepository.GetRefreshToken(userId, refreshToken);
            if (storedRefreshToken == null) { return false; }

            // Ensure that the refresh token that we got from storage is not yet expired.
            if (DateTime.UtcNow > storedRefreshToken.ExpiresAt)
            {
                // Delete from db if expired
                await userRepository.DeleteUserRefreshToken(userId, refreshToken);
                return false;
            }
            return true;
        }

        public async Task<bool> RevokeRefreshToken(string userId, string refreshToken)
        {
            return await userRepository.DeleteUserRefreshToken(userId, refreshToken);
        }
    }
}
