using testProject.Models;

namespace testProject.Areas.UserAccount.Models
{
    public class OwnProjectsViewModel
    {
        public IEnumerable<Project> Projects { get; set; }
        public IEnumerable<Technology> Technologies { get; set; }
    }
}

