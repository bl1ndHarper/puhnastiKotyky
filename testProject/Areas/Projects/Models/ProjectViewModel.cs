using testProject.Models;

namespace testProject.Areas.Projects.Models
{
    public class ProjectViewModel
    {
        public Project Project { get; set; }
        public IEnumerable<Technology> Technologies { get; set; }
        public IEnumerable<User> Team { get; set; }

    }
}
