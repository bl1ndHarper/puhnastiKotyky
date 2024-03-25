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
                        .Where(r => r.RequestsId.ToString().Equals(requestId))
                        .Include(r => r.Users)
                        .Include(r => r.Projects)
                        .FirstOrDefault();

            if (request != null)
            {
                request.Status = "accepted";
                _db.Requests.Update(request);
                _db.SaveChanges();

                var notification = new Notification { UsersId =  request.UsersId, Title = "Your request has been accepted", 
                Content = $"Congratulations! The owner of project {request.Projects.Name} has accepted your request. " +
                    $"Now you are a part of the project’s team! Once the team is fully assembled, " +
                    $"you'll be all set to kick off your work. Stay tuned for further updates, " +
                    $"and get ready to dive into exciting projects with your team.", CreatedAt = DateTime.Now, isRead = false
                };

                _db.Notifications.Add(notification);
                _db.SaveChanges();

                SendNotificationToUser(request.Users.UserName, notification.Title, notification.Content,
                    notification.NotificationsId, notification.CreatedAt);

                AddNewParticipant(request.UsersId, request.ProjectsId);

                var team = _db.ProjectsUsers
                    .Include(p => p.Users)
                    .Where(p => p.ProjectsId == request.Projects.ProjectsId).ToList();

                foreach(var teamMember in team)
                {
                    // send notification to all team members except the owner and
                    // the user whose request has just been accepted 
                    if(teamMember.UsersId != request.Projects.UsersId && teamMember.UsersId != request.UsersId) { 
                    Notification notificationForTeam = new Notification
                    {
                        UsersId = teamMember.UsersId,
                        Title = "New team member joined",
                        Content = $"<a href=\"\\Profile?id={request.UsersId}\">" +
                        $"{request.Users.FirstName} {request.Users.LastName}</a> has joined the {request.Projects.Name} team.",
                        CreatedAt = DateTime.Now,
                        isRead = false
                    };

                    _db.Notifications.Add(notificationForTeam);
                    _db.SaveChanges();

                    SendNotificationToUser(teamMember.Users.UserName, notificationForTeam.Title, notificationForTeam.Content,
                        notificationForTeam.NotificationsId, notificationForTeam.CreatedAt);
                    }
                }
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
