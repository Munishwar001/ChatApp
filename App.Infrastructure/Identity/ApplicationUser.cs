﻿using Microsoft.AspNetCore.Identity;

namespace App.Infrastructure.Identity
{
    public class ApplicationUser: IdentityUser
    {
        public string FullName { get; set; } = null!;
    }
}
