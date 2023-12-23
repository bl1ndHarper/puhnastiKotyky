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
        private readonly AppDbContext _db;

        public AccountController(UserManager<User> userManager, AppDbContext db)
        {
            _userManager = userManager;
            _db = db;
        }

        public IActionResult Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            User user = _db.Users
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

            return View(user);
        }

        [HttpPost]
        public ActionResult SaveUserChanges(IFormFile file, [FromServices] CloudinaryService cloudinaryService, string updatedDescription)
        {
            UpdateProfilePhoto(file, cloudinaryService);
            UpdateProfileDescription(updatedDescription);

            return RedirectToAction("Index");
        }

        public ActionResult UpdateProfileDescription(string updatedDescription)
        {
            Console.WriteLine("------------" + updatedDescription);
            return RedirectToAction("Index");
        }

        private ActionResult UpdateProfilePhoto(IFormFile file, [FromServices] CloudinaryService cloudinaryService)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _db.Users.FirstOrDefault(u => u.Id.ToString() == userId);
            if (user != null)
            {
                string safeUserEmail = user.Email.Replace('@', '_').Replace('.', '_');

                if (file != null)
                {
                    string imageUrl = cloudinaryService.UploadImage(file, "PuhnastiKotyky/UsersProfileImages", safeUserEmail);
                    user.Photo = imageUrl;
                    _db.SaveChanges();
                }
            }
            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult DeleteProfilePhoto(IFormFile file, [FromServices] CloudinaryService cloudinaryService)
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
            }
            return RedirectToAction("Index");
        }
    }
}