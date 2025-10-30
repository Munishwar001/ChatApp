using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.core.DTOs.Auth
{
    public class JwtAuthResult
    {
        public string AccessToken { get; set; } = string.Empty;
        public DateTime AccessTokenExpiration { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
    }
}
