using App.Application.Interfaces;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace App.Application.Services
{
    internal class EncryptionService(IDataProtectionProvider provider) : IEncryptionService
    {
        private readonly IDataProtector _protector = provider.CreateProtector("App.Application.Services.EncryptionService.v1");
        public string Encrypt(string data)
        {
            if (!string.IsNullOrWhiteSpace(data))
            {
                return _protector.Protect(data);
            }
            else
            {
                return "";
            }
        }

        public string Decrypt(string data)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(data))
                {
                    return _protector.Unprotect(data);
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public string GenerateRandomToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return WebEncoders.Base64UrlEncode(randomNumber);
        }
    }
}
