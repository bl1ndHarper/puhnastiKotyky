using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace testProject.Models;

public class SocialMedia
{
    public uint SocialMediasId { get; set; }

    [ForeignKey("User")]
    public uint UsersId { get; set; }

    public string Url { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
