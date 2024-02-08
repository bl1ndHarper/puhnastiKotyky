using testProject.Models;

namespace testProject.Areas.Home.Models;

public partial class Page
{
    public int PageIndex { get; set; }
    public IEnumerable<Project> CurrentPageProjects { get; set; }
}
