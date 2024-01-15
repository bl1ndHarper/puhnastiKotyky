using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using testProject.Data;
using testProject.Models;

namespace testProject.Areas.UserAccount.Controllers
{
    [Area("UserAccount")]
    [Route("Account/[controller]/[action]")]
    [Authorize]
    public class RequestsController : Controller
    {
        private AppDbContext _db;

        public RequestsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public ActionResult WithdrawRequest(string requestId)
        {
            Console.WriteLine("-----------Deleting the request #" + requestId);
            _db = new AppDbContext();
            var request = _db.Requests
                        .Where(r => r.RequestsId == Convert.ToUInt32(requestId))
                        .FirstOrDefault();

            if (request != null && request.Status == "considering")
            {
                request.Status = "deleted";
                _db.Requests.Update(request);
                _db.SaveChanges();
            }

            return RedirectToAction("Index", "Account");
        }

        [HttpPost]
        public ActionResult AcceptRequest(string requestId) 
        {
            _db = new AppDbContext();
            var request = _db.Requests
                        .Where(r => r.RequestsId == Convert.ToUInt32(requestId))
                        .FirstOrDefault();

            if (request != null)
            {
                request.Status = "accepted";
                _db.Requests.Update(request);
                _db.SaveChanges();
                AddNewParticipant(request.UsersId, request.ProjectsId);
            }
            return Json(new { success = true, message = "Participation request was successfully accepted" });
        }

        private ActionResult AddNewParticipant(uint userId, uint projectId)
        {
            _db = new AppDbContext();

            var projectsUser = _db.ProjectsUsers
                .Where(u => u.ProjectsId == projectId && u.UsersId == userId)
                .FirstOrDefault();

            if(projectsUser == null) {
                projectsUser = new ProjectsUser { UsersId = userId, ProjectsId = projectId };
                _db.ProjectsUsers.Add(projectsUser);
                _db.SaveChanges();
            }
            return RedirectToAction("Index", "Account");
        }

        [HttpPost]
        public ActionResult HideRequest(string requestId)
        {
            _db = new AppDbContext();
            var request = _db.Requests
                        .Where(r => r.RequestsId == Convert.ToUInt32(requestId))
                        .FirstOrDefault();

            if (request != null)
            {
                request.IsHidden = true;
                _db.Requests.Update(request);
                _db.SaveChanges();
            }
            return Json(new { success = true, message = "Participation request was hidden from the list" });
        }
    }
}
