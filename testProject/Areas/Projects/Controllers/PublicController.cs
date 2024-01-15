using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using testProject.Areas.Projects.Models;
using testProject.Data;
using testProject.Models;

namespace testProject.Areas.Projects.Controllers
{
    [Area("Projects")]
    [Route("Projects/Public/[action]/{id}")]
    public class PublicController : Controller
    {
        private AppDbContext _db;

        public PublicController(AppDbContext db)
        {
            _db = db;
        }
        public IActionResult Index(int id, string uId)
        {
            var project = _db.Projects.Where(p => p.ProjectsId == id)
                .Include(p => p.Users)
                .FirstOrDefault();

            var technologies = _db.Technologies
                .Where(t => t.ProjectsTechnologies.Any(pt => pt.ProjectsId == id))
                .ToList();

            var team = _db.Users
                .Where(t => t.ProjectsUser.Any(pt => pt.ProjectsId == id))
                .ToList();

            var projectViewModel = new ProjectViewModel { Project = project, Technologies = technologies, Team = team, CurrentUserId = uId};

            return View(projectViewModel);
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
