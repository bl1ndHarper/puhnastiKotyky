using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace testProject.Areas.Notifications.Controllers
{
    [Area("Notifications")]
    public class NotificationsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
