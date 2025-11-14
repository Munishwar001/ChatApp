using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : Controller
    {
        [HttpGet("protected")]
        [Authorize]
        public IActionResult ProtectedTest()
        {
            return Ok(new { message = "Protected API accessed successfully!" });
        }
    }
}
