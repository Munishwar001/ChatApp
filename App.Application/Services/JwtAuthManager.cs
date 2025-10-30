using App.Application.Interfaces;
using App.core.DTOs.Auth;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace App.Application.Services
{
    public class JwtAuthManager(IEncryptionService encryptionService, IOptions<JwtSettings> jwtOptions) : IJwtAuthManager
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
            //await userRepository.AddNewDeleteOldUserRefreshToken(userId, newRefreshToken, oldRefreshToken, DateTime.UtcNow, DateTime.UtcNow.AddMinutes(jwtConfig.Value.RefreshTokenExpiration));

            return newRefreshToken;
        }
    }
}
