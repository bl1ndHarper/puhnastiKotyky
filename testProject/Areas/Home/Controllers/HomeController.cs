using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using testProject.Areas.Home.Models;
using testProject.Data;
using testProject.Models;

namespace testProject.Areas.Home.Controllers
{
    [Area("Home")]
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private AppDbContext _db;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        [Route("")]
        public IActionResult Index()
        {
            _db = new AppDbContext();

            var availableProjects = _db.Projects.Include(p => p.ProjectsTechnologies)
                                                .ThenInclude(pt => pt.Technologies)
                                                .Where(p => p.Status == "searching for participants" || 
                                                       p.Status == "in development");

            var latestProjects = _db.Projects.Include(p => p.ProjectsTechnologies)
                                                .ThenInclude(pt => pt.Technologies)
                                                .Where(p => p.Status == "searching for participants" ||
                                                       p.Status == "in development")
                                                .OrderByDescending(p => p.CreationDate);

            var userId = Convert.ToUInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));
            
            var userTechnologies = _db.UsersTechnologies.Where(u => u.UsersId == userId)
                                    .Select(u => u.TechnologiesId).ToList();

            var recommendedProjects = _db.Projects
                                    .Include(p => p.ProjectsTechnologies)
                                    .ThenInclude(pt => pt.Technologies)
                                    .Include(p => p.ProjectsUsers)
                                    .ThenInclude(pu => pu.Users)
            .Where(p => (p.Status == "searching for participants" || p.Status == "in development") &&
            p.ProjectsTechnologies.Any(t => userTechnologies.Contains(t.TechnologiesId)) &&
            !p.ProjectsUsers.Any(pu => userTechnologies.Contains(pu.Users.Id)))
            .OrderByDescending(p => p.ProjectsTechnologies.Count(t => userTechnologies.Contains(t.TechnologiesId)))
            .ToList();

            HomeViewModel homeViewModel = new HomeViewModel { AvailableProjects = availableProjects, LatestProjects = latestProjects, RecommendedProjects = recommendedProjects };

            Console.Write("======== User's technologies: ");

            foreach(var i in userTechnologies)
            {
                Console.Write(i + " ");
            }

            foreach(var p in recommendedProjects)
            {
                Console.Write("\n\n\t" + p.Name + ". Number of matches in technologies: " + p.ProjectsTechnologies.Count(u => userTechnologies.Contains(u.TechnologiesId)) + "  ( ");
                foreach(var t in p.ProjectsTechnologies)
                {
                    Console.Write(t.TechnologiesId + " ");
                }
                Console.Write(")");
            }

            return View(homeViewModel);
        }

        [HttpGet]
        public IActionResult LoadProjects(int page)
        {
            _db = new AppDbContext();
            var latestProjects = _db.Projects.Include(p => p.ProjectsTechnologies)
                                                .ThenInclude(pt => pt.Technologies)
                                                .Where(p => p.Status == "searching for participants" ||
                                                       p.Status == "in development")
                                                .OrderByDescending(p => p.CreationDate).ToList();

            // Retrieve projects for the specified page
            int projectsPerPage = 6;
            var currentPageProjects = latestProjects.Skip((page - 1) * projectsPerPage).Take(projectsPerPage).ToList();

            return PartialView("_ProjectList", currentPageProjects);
        }

        [HttpGet]
        public IActionResult CountPages()
        {
            _db = new AppDbContext();
            var latestProjects = _db.Projects.Include(p => p.ProjectsTechnologies)
                                                .ThenInclude(pt => pt.Technologies)
                                                .Where(p => p.Status == "searching for participants" ||
                                                       p.Status == "in development")
                                                .OrderByDescending(p => p.CreationDate).ToList();

            int projectsPerPage = 6;
            int pagesCount = Convert.ToInt32(Math.Ceiling(Convert.ToDouble(latestProjects.Count()) / Convert.ToDouble(projectsPerPage)));

            for (int i = 0; i < latestProjects.Count(); i++)
            {
                if(i % 6 == 0)
                {
                    Console.WriteLine("========== " + "Page " + (i/6 + 1));
                }
                Console.WriteLine(latestProjects.ElementAt(i).Name);
            }

            return Json(pagesCount);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}