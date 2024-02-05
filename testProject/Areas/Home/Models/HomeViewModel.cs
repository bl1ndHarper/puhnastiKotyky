using testProject.Models;

namespace testProject.Areas.Home.Models
{
    public class HomeViewModel
    {
        public IEnumerable<Page> Pages { get; set; }
        public IEnumerable<Project> AvailableProjects { get; set;}
        public IEnumerable<Project> RecommendedProjects { get; set;}
        public IEnumerable<Project> LatestProjects { get; set;} 
    }
}
