using App.core.DTOs.Auth;

namespace App.Application.Interfaces
{
    public interface IJwtAuthManager
    {
        Task<JwtAuthResult> GenerateToken(string userId, string email, string? oldRefreshToken = null);
        string? GetUserIdFromAccessToken(string accessToken);
        Task<bool> ValidateRefreshToken(string userId, string refreshToken);
        Task<bool> RevokeRefreshToken(string userId, string refreshToken);
    }
}