using App.core.DTOs.Users;
using App.core.Models;
using App.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController(UserManager<ApplicationUser> _userManager) : Controller
    {
        [HttpGet]
        public async Task<ActionResult> Index()
        {
            var users = await _userManager.Users.Select(u => new User
            {
                Id = u.Id,
                FullName = u.FullName!,
                Email = u.Email!
            }).ToListAsync();

            var loggedUserId = User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            var loggedUser = users.FirstOrDefault(u => u.Id == loggedUserId);
            var otherUsers = users.Where(u => u.Id != loggedUserId).ToList();

            var response = new UserResp
            {
                LoggedUser = loggedUser!,
                Users = otherUsers
            };
            return Ok(response);
        }


    }
}
