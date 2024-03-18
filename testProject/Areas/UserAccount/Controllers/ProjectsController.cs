using Microsoft.AspNetCore.Authorization;
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
                Level = projectLevel, Duration = projectDuration, Status = "searching for participants"
            };
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

        [HttpPost]
        public ActionResult DeleteUserFormProject(string deleteUserIdInput, string deleteUserProjectInput)
        {
            var userId = Convert.ToUInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));
            Console.WriteLine("--------Deleting the user №" + deleteUserIdInput + " from the project №" + deleteUserProjectInput);
            
            /* логіка методу */
            _db = new AppDbContext();
            var projectUser = _db.ProjectsUsers
                        .Where(p => p.UsersId == uint.Parse(deleteUserIdInput) && p.ProjectsId == uint.Parse(deleteUserProjectInput))
                        .FirstOrDefault();

            if (projectUser != null)
            {
                _db.ProjectsUsers.Remove(projectUser);
            }
            _db.SaveChanges();
            /* кінець основної логіки */
            
            if (Convert.ToInt32(deleteUserIdInput) == userId) // якщо користувач видаляє себе ж
            {
                return RedirectToAction("Index", "Account");    // оновлюємо (повертаємо) сторінку
            }
            else    // інакше - асинхронний виклик і жодних змін у view (повертаємо рядок із результатом)
            {
                return Json(new { success = true, message = "User " + deleteUserIdInput + " successfully deleted from project " + deleteUserProjectInput });
            }
        }

        [HttpPost]
        public ActionResult AddProjectTechnology(string projectId, string technology)
        {
            try
            {
                _db = new AppDbContext();                
                var techId = _db.Technologies
                        .Where(e => e.Name == technology)
                        .Select(e => e.TechnologiesId)
                        .FirstOrDefault();

                var projTech = _db.ProjectsTechnologies
                        .Where(pt => pt.ProjectsId == Convert.ToUInt32(projectId) && pt.TechnologiesId == techId)
                        .FirstOrDefault();

                if (projTech == null)
                {
                    projTech = new ProjectsTechnology { ProjectsId = Convert.ToUInt32(projectId), TechnologiesId = techId };
                    _db.ProjectsTechnologies.Add(projTech);
                    _db.SaveChanges();
                }      

                return Json(new { success = true, message = technology + "was successfully added to the project's technologies list" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while changing the project technologies. Details: " + ex.Message });
            }
        }

        [HttpPost]
        public ActionResult RemoveProjectTechnology(string projectId, string technology)
        {
            try
            {
                _db = new AppDbContext();
                var techId = _db.Technologies
                        .Where(e => e.Name == technology)
                        .Select(e => e.TechnologiesId)
                        .FirstOrDefault();

                var projTech = _db.ProjectsTechnologies
                        .Where(pt => pt.ProjectsId == Convert.ToUInt32(projectId) && pt.TechnologiesId == techId)
                        .FirstOrDefault();

                if (projTech != null)
                {
                    _db.ProjectsTechnologies.Remove(projTech);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = technology + "was successfully removed from the project's technologies list" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while changing the project technologies. Details: " + ex.Message });
            }
        }

        [HttpPost]
        public ActionResult EditProjectStatus(string projectId, string projectStatus)
        {
            try
            {
                _db = new AppDbContext();
                
                var project = _db.Projects
                        .Where(p => p.ProjectsId == Convert.ToUInt32(projectId))
                        .FirstOrDefault();

                if (project != null)
                {
                    project.Status = projectStatus;
                    _db.SaveChanges();
                }

                return Json(new { success = true, message = "Project " + projectId + " status successfully changed to " + projectStatus });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while changing the status. Details: " + ex.Message });
            }
        }
    }
}
