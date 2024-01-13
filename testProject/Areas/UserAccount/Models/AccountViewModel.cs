using testProject.Models;

namespace testProject.Areas.UserAccount.Models
{
    public class AccountViewModel
    {
        public User User { get; set; }
        public Dictionary<uint, List<User>> ProjectParticipants { get; set; } = new Dictionary<uint, List<User>>();
        public IEnumerable<Technology> Technologies { get; set; }
        public IEnumerable<Request> Requests { get; set; }
    }
}
