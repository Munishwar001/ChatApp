
using App.core.DTOs.Auth;

namespace App.Application.Interfaces 
{ 
    public interface IUserRepository
    {
        Task<bool> AddNewDeleteOldUserRefreshToken(string userId, string newRefreshToken, string oldRefreshToken, DateTime issuedAt, DateTime expiresAt);
        Task<UserRefreshToken> GetRefreshToken(string userId, string refreshToken);
        Task<bool> DeleteUserRefreshToken(string userId, string refreshToken);
    }
}