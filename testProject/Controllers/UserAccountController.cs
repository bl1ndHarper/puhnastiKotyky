using Microsoft.AspNetCore.Mvc;

namespace testProject.Controllers
{
    public class UserAccountController : Controller
    {
        public IActionResult UserAccountPage()
        {
            return View();
        }
    }
}