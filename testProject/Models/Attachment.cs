using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace testProject.Models
{
    [Table("attachments")]
    public class Attachment
    {
        [Key]
        [Column("attachments_id")]
        public uint AttachmentsId { get; set; }

        [Column("path", TypeName = "varchar(255)")]
        public string Path { get; set; }

        [Column("issues_id")]
        public uint IssuesId { get; set; }

        [ForeignKey("IssuesId")]
        public virtual Issue Issue { get; set; } = null!;
    }
}
