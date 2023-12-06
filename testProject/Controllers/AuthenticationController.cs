using Microsoft.AspNetCore.Mvc;

namespace testProject.Controllers
{
    public class AuthenticationController : Controller
    {
        public IActionResult SignUpPage()
        {
            return View();
        }
        public IActionResult LogInPage()
        {
            return View();
        }
    }
}
