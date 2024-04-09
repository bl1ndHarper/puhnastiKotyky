using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace testProject.Models;

public partial class Project
{
    public uint ProjectsId { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public uint UsersId { get; set; }

    public DateTime CreationDate { get; set; }

    public string Level { get; set; } = null!;

    public int Duration { get; set; }

    public string Status { get; set; } = null!;

    [Column("repository", TypeName = "varchar(255)")]
    public string? Repository { get; set; }

    public virtual ICollection<ProjectsTechnology> ProjectsTechnologies { get; set; } = new List<ProjectsTechnology>();

    public virtual ICollection<ProjectsUser> ProjectsUsers { get; set; } = new List<ProjectsUser>();

    public virtual ICollection<Request> Requests { get; set; } = new List<Request>();

    public virtual User Users { get; set; } = null!;
}
