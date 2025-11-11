using Dapper;
using System.Data;
using App.Application.Interfaces;

namespace App.Infrastructure.DataAccess
{
    public class UserRepository(IDbConnection connection) : IUserRepository
    {
        public async Task<bool> AddNewDeleteOldUserRefreshToken(string userId, string newRefreshToken, string oldRefreshToken, DateTime issuedAt, DateTime expiresAt)
        {
            string sql = @"DELETE FROM [UserRefreshTokens] WHERE [UserID] = @UserID AND [RefreshToken] = @OldRefreshToken;
            INSERT INTO [UserRefreshTokens] ([UserID],[RefreshToken],[IssuedAt],[ExpiresAt])
            VALUES (@UserID,@NewRefreshToken,@IssuedAt,@ExpiresAt)";
            var param = new DynamicParameters();
            param.Add("@UserID", userId);
            param.Add("@OldRefreshToken", oldRefreshToken);
            param.Add("@NewRefreshToken", newRefreshToken);
            param.Add("@IssuedAt", issuedAt);
            param.Add("@ExpiresAt", expiresAt);

            var result = await connection.ExecuteAsync(sql, param);
            return result > 0;
        }
    }
}
