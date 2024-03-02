using Microsoft.AspNetCore.Mvc;
using Microsoft.SqlServer.Server;
using System.Security.Claims;
using testProject.Data;
using testProject.Models;
using testProject.Services;

namespace testProject.Areas.Help.Controllers
{
    [Area("Help")]
    public class HelpController : Controller
    {
        private AppDbContext _db;

        public HelpController(AppDbContext db)
        {
            _db = db;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SubmitForm(string topic, string description, List<IFormFile> screenshots, [FromServices] CloudinaryService cloudinaryService)
        {
            _db = new AppDbContext();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Json(new { success = false, message = "Please, log in to your account to submit this form" });
            }

            try
            {
                Issue issue = new Issue
                {
                    UsersId = Convert.ToUInt32(userId),
                    Topic = topic,
                    Description = description,
                    Date = DateTime.Now,
                    IsSolved = false
                };

                _db.Issues.Add(issue);
                _db.SaveChanges();

                Console.WriteLine("Uploaded screenshots count: " + screenshots.Count());
                foreach (IFormFile file in screenshots)
                {
                    SaveAttachment(issue.IssuesId, file, cloudinaryService);
                }    
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Json(new { success = true, message = "Sorry, something went wrong... Try later" });
            }
           
            return Json(new { success = true, message = "The form has been submitted. Thank you for contacting us!" });
        }

        private ActionResult SaveAttachment(uint issueId, IFormFile file, [FromServices] CloudinaryService cloudinaryService)
        {
            string fileName = Guid.NewGuid().ToString();
            
            if (file != null)
            {
                string imageUrl = cloudinaryService.UploadImage(file, "PuhnastiKotyky/HelpFormAttachments", fileName);
                Attachment attachment = new Attachment { IssuesId = issueId, Path = imageUrl };
                _db.Attachments.Add(attachment);
                _db.SaveChanges();
            }

            return Json(new { success = true, message = "The attachments have been successfully saved" });
        }
    }
}
