using testProject.Models;

namespace testProject.Areas.Home.Models
{
    public class HomeViewModel
    {
        public IEnumerable<Project> AvailableProjects { get; set;}
        public IEnumerable<Project> RecommendedProjects { get; set;}
        public IEnumerable<Project> LatestProjects { get; set;} 
    }
}
