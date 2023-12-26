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
using testProject.Areas.UserAccount.Models;

namespace testProject.Areas.UserAccount.Controllers
{
    [Area("UserAccount")]
    [Route("Account/[controller]/[action]")]
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private AppDbContext _db;

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

            var tech = _db.Technologies.ToList();

            AccountViewModel accountViewModel = new AccountViewModel { User = user, Technologies = tech };

            return View(accountViewModel);
        }

        [HttpPost]
        public ActionResult SaveUserChanges(IFormFile file, [FromServices] CloudinaryService cloudinaryService, string updatedDescription, string userTechsArray, string updatedUserTechsArray)
        {
            UpdateProfilePhoto(file, cloudinaryService);
            UpdateProfileDescription(updatedDescription);
            UpdateUserTechnologies(userTechsArray, updatedUserTechsArray);

            return RedirectToAction("Index");
        }

        public ActionResult UpdateProfileDescription(string updatedDescription)
        {
            Console.WriteLine("------------" + updatedDescription);
            return RedirectToAction("Index");
        }

        public ActionResult UpdateUserTechnologies(string userTechsArray, string updatedUserTechsArray)
        {
            _db = new AppDbContext();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _db.Users.FirstOrDefault(u => u.Id.ToString() == userId);

            var uId = Convert.ToUInt32(userId);

            string[] originalUserTechs = string.IsNullOrEmpty(userTechsArray) ? new string[0] : userTechsArray.Split(',');
            string[] updatedUserTechs = string.IsNullOrEmpty(updatedUserTechsArray) ? new string[0] : updatedUserTechsArray.Split(',');

            if (updatedUserTechs.Any() || originalUserTechs.Any())
            {
                var addedItems = updatedUserTechs.Except(originalUserTechs);
                var deletedItems = originalUserTechs.Except(updatedUserTechs);

                foreach (var item in addedItems)
                {
                    var techId = _db.Technologies
                        .Where(e => e.Name == item)
                        .Select(e => e.TechnologiesId)
                        .FirstOrDefault();

                    UsersTechnology usersTech = new UsersTechnology { UsersId = uId, TechnologiesId = techId };
                    _db.UsersTechnologies.Add(usersTech);
                    _db.SaveChanges();
                }

                foreach (var item in deletedItems)
                {
                    var techId = _db.Technologies
                        .Where(e => e.Name == item)
                        .Select(e => e.TechnologiesId)
                        .FirstOrDefault();

                    var usersTech = _db.UsersTechnologies
                        .Where(ut => ut.UsersId == uId && ut.TechnologiesId == techId)
                        .FirstOrDefault();

                    if (usersTech != null)
                    {
                        _db.UsersTechnologies.Remove(usersTech);
                    }
                }
                _db.SaveChanges();
            }

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