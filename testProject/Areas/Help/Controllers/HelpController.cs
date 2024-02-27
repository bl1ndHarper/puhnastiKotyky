using Microsoft.AspNetCore.Mvc;

namespace testProject.Areas.Help.Controllers
{
    [Area("Help")]
    public class HelpController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
