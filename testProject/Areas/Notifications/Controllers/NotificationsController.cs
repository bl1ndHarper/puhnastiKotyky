using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using testProject.Data;
using testProject.Hubs;

namespace testProject.Areas.Notifications.Controllers
{
    [Area("Notifications")]
    [Route("[controller]")]
    [Authorize]
    public class NotificationsController : Controller
    {
        private AppDbContext _db;
        
        public NotificationsController(AppDbContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            _db = new AppDbContext();
            var userId = Convert.ToUInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var notifications = _db.Notifications.Where(n => n.UsersId == userId).ToList();

            return View(notifications);
        }

        [Route("[action]")]
        [HttpPost]
        public IActionResult MarkAllAsRead(string notificationIds)
        {
            Console.WriteLine("============= MarkAllAsRead");
            _db = new AppDbContext();

            if(notificationIds.Length > 0 && !notificationIds.Equals("empty")) {
                List<int> ids = notificationIds.Split(',').Select(int.Parse).ToList();
                foreach (var notificationId in ids)
                {
                    Console.WriteLine(notificationId);
                    var notification = _db.Notifications
                            .Where(n => n.NotificationsId == notificationId)
                            .FirstOrDefault();

                    if (notification != null)
                    {
                        notification.isRead = true;
                        _db.Notifications.Update(notification);
                        _db.SaveChanges();
                    }
                }
            }
            return Json(new { success = true });
        }

        [Route("[action]")]
        [HttpGet]
        public IActionResult CheckUnreadNotifications()
        {
            _db = new AppDbContext();
            var userId = Convert.ToUInt32(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var unreadNotificationsCount = _db.Notifications.Where(n => n.UsersId == userId && n.isRead == false).Count();

            return Json(new { unreadNotificationsCount });
        }
    }
}
