﻿using System;
using System.Collections.Generic;

namespace testProject.Data;

public partial class User
{
    public uint UsersId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Photo { get; set; }

    public string? About { get; set; }

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();

    public virtual ProjectsUser? ProjectsUser { get; set; }

    public virtual ICollection<Request> Requests { get; set; } = new List<Request>();

    public virtual ICollection<UsersTechnology> UsersTechnologies { get; set; } = new List<UsersTechnology>();
}