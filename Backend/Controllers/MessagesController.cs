using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public class MessagesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
