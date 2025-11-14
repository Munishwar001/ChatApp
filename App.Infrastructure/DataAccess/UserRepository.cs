using App.Application.Interfaces;
using App.core.DTOs.Auth;
using Dapper;
using System.Data;

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

        public async Task<UserRefreshToken> GetRefreshToken(string userId, string refreshToken)
        {
            string sql = @"SELECT [UserID],[RefreshToken],[ExpiresAt] FROM [UserRefreshTokens]
            WHERE UserID = @UserID AND RefreshToken = @RefreshToken";
            var param = new DynamicParameters();
            param.Add("@UserID", userId);
            param.Add("@RefreshToken", refreshToken);

            var result = await connection.QuerySingleOrDefaultAsync<UserRefreshToken>(sql, param);
            return result;
        }

        public async Task<bool> DeleteUserRefreshToken(string userId, string refreshToken)
        {
            string sql = @"DELETE FROM [UserRefreshTokens] WHERE [UserID] = @UserID AND [RefreshToken] = @OldRefreshToken";
            var param = new DynamicParameters();
            param.Add("@UserID", userId);
            param.Add("@OldRefreshToken", refreshToken);

            var result = await connection.ExecuteAsync(sql, param);
            return result > 0;
        }
    }
}
