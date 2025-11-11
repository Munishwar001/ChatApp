
namespace App.Application.Interfaces 
{ 
    public interface IUserRepository
    {
        Task<bool> AddNewDeleteOldUserRefreshToken(string userId, string newRefreshToken, string oldRefreshToken, DateTime issuedAt, DateTime expiresAt);
    }
}