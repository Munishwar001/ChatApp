namespace App.Application.Interfaces
{
    public interface IEncryptionService
    {
        string Decrypt(string data);
        string Encrypt(string data);
        string GenerateRandomToken();
    }
}