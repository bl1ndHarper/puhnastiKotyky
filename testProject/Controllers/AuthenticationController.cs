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
        public IActionResult ChangePassword()
        {
            return View();
        }
        public IActionResult PasswordRecovery()
        {
            return View();
        }
    }
}
