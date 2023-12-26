using testProject.Models;

namespace testProject.Areas.UserAccount.Models
{
    public class AccountViewModel
    {
        public User User { get; set; }
        public IEnumerable<Technology> Technologies { get; set; }
    }
}
