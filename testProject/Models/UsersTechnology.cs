using System;
using System.Collections.Generic;

namespace testProject.Models;

public partial class UsersTechnology
{
    public uint UsersTechnologiesId { get; set; }

    public uint UsersId { get; set; }

    public uint TechnologiesId { get; set; }

    public virtual Technology Technologies { get; set; } = null!;

    public virtual User Users { get; set; } = null!;
}
