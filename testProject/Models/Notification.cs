using System.ComponentModel.DataAnnotations;

namespace testProject.Models
{
    public class Notification
    {
        [Key]
        public uint NotificationsId { get; set; }

        public uint UsersId { get; set; }

        public string Title { get; set; }
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }
        public bool isRead { get; set; }

        public virtual User Users { get; set; } = null!;
    }
}
