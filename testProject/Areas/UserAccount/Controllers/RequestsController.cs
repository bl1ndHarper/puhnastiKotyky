using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using testProject.Data;

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
            Console.WriteLine("============= (Accept) Request id: " + requestId);
            return Json(new { success = true, message = "Participation request was accepted" });
        }

        [HttpPost]
        public ActionResult HideRequest(string requestId)
        {
            Console.WriteLine("============= (Hide) Request id: " + requestId);
            return Json(new { success = true, message = "Participation request was hidden" });
        }
    }
}
