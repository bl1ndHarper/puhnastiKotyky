using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using testProject.Data;
using testProject.Models;

namespace testProject.Areas.UserAccount.Controllers
{
    [Area("UserAccount")]
    [Route("Account/[controller]/[action]")]
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;

        public AccountController(UserManager<User> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public IActionResult Index()
        {
            User user = GetUser();
            return View(user);
        }

        [HttpPost]
        public IActionResult SaveProfileChanges(string updatedDescription)
        {
            if (ModelState.IsValid)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                User currentUser = _context.Users.FirstOrDefault(u => u.Id.ToString() == userId);
                currentUser.About = updatedDescription;
                _context.Users.Update(currentUser);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View("Index", GetUser());
        }

        private User GetUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            User user = _context.Users
                .Include(u => u.Requests)
                .ThenInclude(u => u.Projects)
                .Include(user => user.UsersTechnologies)
                .ThenInclude(user => user.Technologies)
                .Include(user => user.ProjectsUser)
                .ThenInclude(user => user.Projects)
                .ThenInclude(user => user.Users)
                .Include(user => user.ProjectsUser)
                .ThenInclude(user => user.Projects)
                .ThenInclude(user => user.ProjectsTechnologies)
                .ThenInclude(user => user.Technologies)
                .Include(user => user.Projects)
                .FirstOrDefault(u => u.Id.ToString() == userId);
            return user;
        }
    }
}
