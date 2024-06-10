using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using testProject.Areas.UserAccount.Models;
using testProject.Data;
using testProject.Models;

namespace testProject.Areas.UserAccount.Controllers
{
    [Area("UserAccount")]
    [Authorize]
    public class TabsController : Controller
    {
        private AppDbContext _db;

        public TabsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult OpenOwnProjectsTab()
        {
            _db = new AppDbContext();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            List<Project> projects = _db.Projects
            .Where(p => p.ProjectsUsers.Any(pu => pu.UsersId.ToString().Equals(userId)) && p.UsersId.ToString().Equals(userId))
            .Include(p => p.ProjectsTechnologies)
                .ThenInclude(pt => pt.Technologies)
            .Include(p => p.Requests)
                .ThenInclude(p => p.Users)
            .Include(p => p.ProjectsUsers)
                .ThenInclude(p => p.Users)
            .Include(p => p.Users)
            .ToList();

            List<Technology> technologies = _db.Technologies.ToList();
            OwnProjectsViewModel ownProjects = new OwnProjectsViewModel { Projects = projects, Technologies = technologies };

            return PartialView("_OwnProjects", ownProjects);
        }

        [HttpGet]
        public IActionResult OpenCommunityProjectsTab()
        { 
            _db = new AppDbContext();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            List<Project> projects = _db.Projects
            .Where(p => p.ProjectsUsers.Any(pu => pu.UsersId.ToString().Equals(userId)) && !p.UsersId.ToString().Equals(userId))
            .Include(p => p.ProjectsTechnologies)
                .ThenInclude(pt => pt.Technologies)
            .Include(p => p.ProjectsUsers)
                .ThenInclude(pu => pu.Users)
            .Include(p => p.Users)
            .ToList();

            return PartialView("_CommunityProjects", projects);
        }

        [HttpGet]
        public IActionResult OpenRequestsTab()
        {
            _db = new AppDbContext();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            List<Request> requests = _db.Requests
                .Where(r => r.UsersId.ToString().Equals(userId))
                .Include(r => r.Projects)
                .ThenInclude(r => r.Users)
                .ToList();

            return PartialView("_ParticipationRequests", requests);
        }
    }
}
