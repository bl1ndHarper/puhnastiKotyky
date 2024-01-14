using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;

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

        [HttpPost]
        public ActionResult CreateNewRequest()
        {
            try
            {
                // ...
                int[] array = { 1 };
                Console.WriteLine(array[1]);
                return Json(new { success = true, message = "Successfully requested to be a part of the team!" });
            }
            catch (Exception)
            {
                // ...
                return Json(new { success = false, message = "An error occurred while sending a request. Try again later."});
            }
        }
    }
}
