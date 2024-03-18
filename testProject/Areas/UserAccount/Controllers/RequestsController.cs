using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using testProject.Data;
using testProject.Hubs;
using testProject.Models;

namespace testProject.Areas.UserAccount.Controllers
{
    [Area("UserAccount")]
    [Route("Account/[controller]/[action]")]
    [Authorize]
    public class RequestsController : Controller
    {
        private AppDbContext _db;
        private readonly IHubContext<NotificationsHub> _hubContext;

        public RequestsController(AppDbContext db, IHubContext<NotificationsHub> hubContext)
        {
            _db = db;
            _hubContext = hubContext;
        }

        [HttpPost]
        public ActionResult WithdrawRequest(string requestId)
        {
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
            Console.WriteLine();
            _db = new AppDbContext();
            var request = _db.Requests
                        .Where(r => r.RequestsId == Convert.ToUInt32(requestId))
                        .FirstOrDefault();

            var userName = _db.Requests
                         .Where(r => r.RequestsId == Convert.ToUInt32(requestId))
                         .Select(r => r.Users.UserName)
                         .FirstOrDefault();

            var projectName = _db.Requests
                         .Where(r => r.RequestsId == Convert.ToUInt32(requestId))
                         .Select(r => r.Projects.Name)
                         .FirstOrDefault();

            if (request != null)
            {
                request.Status = "accepted";
                _db.Requests.Update(request);
                _db.SaveChanges();

                var notification = new Notification { UsersId =  request.UsersId, Title = "Your request has been accepted", 
                Content = $"Congratulations! The owner of project {projectName} has accepted your request. " +
                    $"Now you are a part of the project’s team! Once the team is fully assembled, " +
                    $"you'll be all set to kick off your work. Stay tuned for further updates, " +
                    $"and get ready to dive into exciting projects with your team.", CreatedAt = DateTime.Now, isRead = false
                };

                _db.Notifications.Add(notification);
                _db.SaveChanges();

                SendNotificationToUser(userName, "Your request has been accepted", 
                    $"Congratulations! The owner of project {projectName} has accepted your request. " +
                    $"Now you are a part of the project’s team! You have the access to all functions that the team can use. Contact the owner and start working!",
                    notification.NotificationsId, notification.CreatedAt);

                AddNewParticipant(request.UsersId, request.ProjectsId);   
            }
            return Json(new { success = true, message = "Participation request was successfully accepted" });
        }

        private async void SendNotificationToUser(string user, string title, string message, uint notificationId, DateTime sentAt)
        {
            await _hubContext.Clients.Group(user).SendAsync("ReceiveNotification", title, message, notificationId, sentAt);
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
