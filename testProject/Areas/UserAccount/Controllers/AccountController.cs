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
using System.Collections.Generic;
using Microsoft.CodeAnalysis;
using System.Security.Cryptography;

namespace testProject.Areas.UserAccount.Controllers
{
    [Area("UserAccount")]
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

        [Route("[controller]")]
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
                .Include(user => user.SocialMedias)
                .FirstOrDefault(u => u.Id.ToString() == userId);

            var tech = _db.Technologies.ToList();

            var requests = _db.Requests
                .Include(r => r.Users)
                .Include(r => r.Projects)
                .Include(r => r.Projects.Users)
                .ToList();

            AccountViewModel accountViewModel = new AccountViewModel { User = user, Technologies = tech, Requests = requests };

            if (user != null)
            {
                foreach (var projectsUser in user.ProjectsUser)
                {
                    testProject.Models.Project project = projectsUser.Projects;
                    List<User> participants = _db.ProjectsUsers
                        .Where(pu => pu.ProjectsId == project.ProjectsId)
                        .Select(pu => pu.Users).ToList();
                    accountViewModel.ProjectParticipants.Add(project.ProjectsId, participants);
                }
            }

            return View(accountViewModel);
        }

        [Route("[controller]/[action]")]
        [HttpPost]
        public ActionResult SaveUserChanges(IFormFile file, [FromServices] CloudinaryService cloudinaryService,
            string updatedDescription,
            string userTechsArray, string updatedUserTechsArray,
            string newSocialMediasArray, string originalSocialMediasArray)
        {
            UpdateProfilePhoto(file, cloudinaryService);
            UpdateProfileDescription(updatedDescription);
            UpdateUserTechnologies(userTechsArray, updatedUserTechsArray);
            UpdateSocialMediaLinks(newSocialMediasArray, originalSocialMediasArray);

            return RedirectToAction("Index");
        }

        [Route("[controller]/[action]")]
        public ActionResult UpdateProfileDescription(string updatedDescription)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _db.Users.FirstOrDefault(u => u.Id.ToString() == userId);

            if (user != null)
            {
                user.About = updatedDescription;
                _db.Users.Update(user);
                _db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        [Route("[controller]/[action]")]
        public ActionResult UpdateUserTechnologies(string userTechsArray, string updatedUserTechsArray)
        {
            if (updatedUserTechsArray == "none") // user deleteв everything
                updatedUserTechsArray = "";
            else if (updatedUserTechsArray == "" || updatedUserTechsArray == null) // user didn't change anything
                updatedUserTechsArray = userTechsArray;
            // else there were some changes

            Console.WriteLine("------------User technologies before editing: " + userTechsArray);
            Console.WriteLine("------------User technologies after editing: " + updatedUserTechsArray);

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

        [Route("[controller]/[action]")]
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

        [Route("[controller]/[action]")]
        [HttpPost]
        public ActionResult DeleteProfilePhoto(IFormFile file, [FromServices] CloudinaryService cloudinaryService)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _db.Users.FirstOrDefault(u => u.Id.ToString() == userId);
            if (user != null)
            {
                string safeUserEmail = user.Email.Replace('@', '_').Replace('.', '_');

                    cloudinaryService.DeleteImage("PuhnastiKotyky/UsersProfileImages/" + safeUserEmail);
                    user.Photo = "https://res.cloudinary.com/dsjlfcky6/image/upload/v1703186888/PuhnastiKotyky/UsersProfileImages/gtidxkjrk4qns1dh0iya.png";
                    _db.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        [Route("[controller]/[action]")]
        [HttpPost]
        public ActionResult UpdateSocialMediaLinks(string newArray, string originalArray)
        {
            if (newArray != originalArray)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = _db.Users.FirstOrDefault(u => u.Id.ToString() == userId);

                string[] updatedSocialMedias = string.IsNullOrEmpty(newArray) ? new string[0] : newArray.Split(',');
                string[] originalSocialMedias = string.IsNullOrEmpty(originalArray) ? new string[0] : originalArray.Split(',');

                var addedItems = updatedSocialMedias.Except(originalSocialMedias);
                var deletedItems = originalSocialMedias.Except(updatedSocialMedias);

                var uId = Convert.ToUInt32(userId);

                if (user != null)
                {
                    foreach (var item in addedItems)
                    {
                        SocialMedia socialMedia = new SocialMedia { UsersId = uId, Url = item };
                        _db.SocialMedias.Add(socialMedia);
                        _db.SaveChanges();
                    }

                    foreach (var item in deletedItems)
                    {
                        var socialMedia = _db.SocialMedias
                            .Where(sm => sm.UsersId == uId && sm.Url == item)
                            .FirstOrDefault();

                        if (socialMedia != null)
                        {
                            _db.SocialMedias.Remove(socialMedia);
                        }
                    }
                    _db.SaveChanges();
                }
            }
            return RedirectToAction("Index");
        }

    }
}