using System;
using System.Collections.Generic;

namespace testProject.Models;

public partial class ProjectsUser
{
    public uint ProjectsUsersId { get; set; }

    public uint ProjectsId { get; set; }

    public uint UsersId { get; set; }

    public virtual Project Projects { get; set; } = null!;

    public virtual User ProjectsUsers { get; set; } = null!;
}
