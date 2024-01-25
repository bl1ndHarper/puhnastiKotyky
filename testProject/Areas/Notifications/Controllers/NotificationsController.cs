using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using testProject.Data;
using testProject.Hubs;

namespace testProject.Areas.Notifications.Controllers
{
    [Area("Notifications")]
    [Route("Notifications/[controller]/[action]")]
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
            return View();
        }

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
