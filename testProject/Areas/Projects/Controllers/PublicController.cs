using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Evaluation;
using Microsoft.CodeAnalysis;
using System.Security.Claims;
﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using testProject.Areas.Projects.Models;
using testProject.Data;
using testProject.Models;

namespace testProject.Areas.Projects.Controllers
{
    [Area("Projects")]
    [Route("Projects/Public/[action]/{id}")]
    [Authorize]
    public class PublicController : Controller
    {
        private AppDbContext _db;

        public PublicController(AppDbContext db)
        {
            _db = db;
        }
        public IActionResult Index(int id)
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

            var projectViewModel = new ProjectViewModel { Project = project, Technologies = technologies, Team = team};

            return View(projectViewModel);
        }

        [HttpPost]
        public ActionResult CreateNewRequest(string projectsId)
        {
            try
            {
                _db = new AppDbContext();
                var userId = Convert.ToUInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));

                // searching for existing request with given parameters and status != "deleted"
                var checkRequest = _db.Requests
                            .Where(r => r.UsersId == userId
                            && r.ProjectsId == Convert.ToUInt32(projectsId)
                            && r.Status != "deleted")
                            .FirstOrDefault();

                if (checkRequest != null && checkRequest.Status == "considering")       // if it exists user cannot create its copy
                {
                    return Json(new { success = false, message = "You've already submitted a request for this project. Delete it to resubmit or contact the project owner." });
                }
                else if (checkRequest != null && checkRequest.Status == "accepted")     // if user is in the team they also can't submit a request
                {
                    return Json(new { success = false, message = "You're already a part of this project's team. " });
                }
                else if (checkRequest == null)  // if it doesn't exist create one
                {
                    Models.Request request = new Models.Request
                    { 
                        UsersId = userId,
                        ProjectsId = Convert.ToUInt32(projectsId),
                        Date = DateTime.Now,
                        Status = "considering",
                        IsHidden = false
                    };
                    _db.Requests.Add(request);
                    _db.SaveChanges();
                    // check if the creation succeeded
                    var requestId = request.RequestsId;
                    checkRequest = _db.Requests
                                .Where(r => r.RequestsId == Convert.ToUInt32(requestId))
                                .FirstOrDefault();
                    if (checkRequest != null)
                    {
                        return Json(new { success = true, message = "Successfully requested to be a part of the team!" });
                    } else
                    {
                        return Json(new { success = false, message = "An error occurred while sending a request. Try again later." });
                    }
                }
                else    // I dunno what else can go wrong
                {
                    return Json(new { success = false, message = "An error occurred while sending a request. Try again later." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while sending a request: " + ex.Message });
            }
        }
    }
}
