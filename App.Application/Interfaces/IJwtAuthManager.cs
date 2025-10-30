using App.core.DTOs.Auth;

namespace App.Application.Interfaces
{
    public interface IJwtAuthManager
    {
        Task<JwtAuthResult> GenerateToken(string userId, string email, string? oldRefreshToken = null);
    }
}