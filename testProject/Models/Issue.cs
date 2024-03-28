using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace testProject.Models
{
    [Table("issues")]
    public class Issue
    {
        [Key]
        [Column("issues_id")]
        public uint IssuesId { get; set; }

        [Column("topic", TypeName = "enum('Account and personal information','Projects creation','Requests, teams and communication','Bans and projects deletion', 'Bugs or inconveniences')")]
        public string Topic { get; set; }

        [Column("description", TypeName = "text")]
        public string Description { get; set; }

        [Column("date", TypeName = "datetime")]
        public DateTime Date { get; set; }

        [Column("contact_email", TypeName = "varchar(100)")]
        public string ContactEmail { get; set; }

        [Column("is_solved", TypeName = "tinyint(1)")]
        public bool IsSolved { get; set; }

        public virtual ICollection<Attachment> Attachments { get; set; }
    }
}
