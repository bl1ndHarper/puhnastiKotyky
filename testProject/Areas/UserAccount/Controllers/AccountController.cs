using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using testProject.Data;
using testProject.Models;
using testProject.Services;

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

        [HttpPost]
        public ActionResult UpdateProfilePhoto(IFormFile file, [FromServices] CloudinaryService cloudinaryService)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _db.Users.FirstOrDefault(u => u.Id.ToString() == userId);
            if (user != null)
            {
                string safeUserEmail = user.Email.Replace('@', '_').Replace('.', '_');

                if (file == null)
                {
                    cloudinaryService.DeleteImage("PuhnastiKotyky/UsersProfileImages/" + safeUserEmail);
                    user.Photo = "https://res.cloudinary.com/dsjlfcky6/image/upload/v1703186888/PuhnastiKotyky/UsersProfileImages/gtidxkjrk4qns1dh0iya.png";
                    _db.SaveChanges();
                }
                else
                {
                    string imageUrl = cloudinaryService.UploadImage(file, "PuhnastiKotyky/UsersProfileImages", safeUserEmail);
                    user.Photo = imageUrl;
                    _db.SaveChanges();
                }
            }
            return RedirectToAction("Index");
        }
    }
}