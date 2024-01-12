using Microsoft.AspNetCore.Mvc;

namespace testProject.Areas.Projects.Controllers
{
    [Area("Projects")]
    [Route("Projects/Public/[action]")]
    public class PublicController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
