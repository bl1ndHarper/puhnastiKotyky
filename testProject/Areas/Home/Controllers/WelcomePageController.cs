using Microsoft.AspNetCore.Mvc;

namespace testProject.Areas.Home.Controllers
{
    [Area("Home")]
    [Route("Welcome")]
    public class WelcomePageController : Controller
    {
        public IActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home", new { area = "Home" });
            }
            return View();
        }
    }
}
