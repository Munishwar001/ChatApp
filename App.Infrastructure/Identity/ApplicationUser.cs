using Microsoft.AspNetCore.Identity;

namespace App.Infrastructure.Identity
{
    public class ApplicationUser: IdentityUser
    {
        public string FullName { get; set; } = null!;
        public string? PhotoUrl { get; set; }     
        public bool IsFavourite { get; set; }      
        public string? LastMessage { get; set; }  
        public DateTime? LastMessageTime { get; set; }
    }
}
