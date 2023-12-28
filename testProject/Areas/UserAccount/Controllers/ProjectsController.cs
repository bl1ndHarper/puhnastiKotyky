﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using testProject.Data;
using testProject.Models;

namespace testProject.Areas.UserAccount.Controllers
{
    [Area("UserAccount")]
    [Route("Account/[controller]/[action]")]
    [Authorize]
    public class ProjectsController : Controller
    {
        private AppDbContext _db;

        public ProjectsController(AppDbContext db)
        {
            _db = db;
        }

        public ActionResult SaveNewProject(string projectName, string projectDescription, string projectLevel, int projectDuration, string projectTechnologies)
        {
            _db = new AppDbContext();
            var userId = Convert.ToUInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));

            Project project = new Project { Name = projectName, Description = projectDescription, 
                UsersId = userId, CreationDate = DateTime.Now, 
                Level = projectLevel, Duration = projectDuration, Status = "in development" };
            _db.Projects.Add(project);
            _db.SaveChanges();

            var projectId = project.ProjectsId;

            SaveProjectTechnologies(projectTechnologies, projectId);
            AddAuthorAsParticipant(userId, projectId);

            return RedirectToAction("Index", "Account");
        }

        private ActionResult SaveProjectTechnologies(string projectTechnologies, uint projectId)
        {
            _db = new AppDbContext();
            string[] technologies = string.IsNullOrEmpty(projectTechnologies) ? new string[0] : projectTechnologies.Split(',');

            if (technologies.Any())
            {
                foreach (var item in technologies)
                {
                    var techId = _db.Technologies
                        .Where(e => e.Name == item)
                        .Select(e => e.TechnologiesId)
                        .FirstOrDefault();

                    ProjectsTechnology projTech = new ProjectsTechnology { ProjectsId = projectId, TechnologiesId = techId };
                    _db.ProjectsTechnologies.Add(projTech);
                    _db.SaveChanges();
                }
            }
            return RedirectToAction("Index", "Account");
        }

        private ActionResult AddAuthorAsParticipant(uint userId, uint projectId)
        {
            _db = new AppDbContext();
            ProjectsUser projectsUser = new ProjectsUser { UsersId = userId, ProjectsId = projectId};
            _db.ProjectsUsers.Add(projectsUser);
            _db.SaveChanges();
               
            return RedirectToAction("Index", "Account");
        }
    }
}