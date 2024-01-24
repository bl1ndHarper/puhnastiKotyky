using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace testProject.Models;

public partial class User : IdentityUser<uint>
{
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Photo { get; set; }

    public string? About { get; set; }

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual ICollection<ProjectsUser> ProjectsUser { get; set; } = new List<ProjectsUser>();

    public virtual ICollection<Request> Requests { get; set; } = new List<Request>();

    public virtual ICollection<UsersTechnology> UsersTechnologies { get; set; } = new List<UsersTechnology>();

    public virtual ICollection<Notification> Notification { get; set; } = new List<Notification>();
}
