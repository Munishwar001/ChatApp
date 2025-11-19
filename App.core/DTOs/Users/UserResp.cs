using App.core.Models;

namespace App.core.DTOs.Users
{
    public class UserResp
    {  
        public User LoggedUser { get; set; } = null!;
        public List<User>? Users { get; set; }
    }
}
