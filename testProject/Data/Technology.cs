using System;
using System.Collections.Generic;

namespace testProject.Data;

public partial class Technology
{
    public uint TechnologiesId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<ProjectsTechnology> ProjectsTechnologies { get; set; } = new List<ProjectsTechnology>();

    public virtual ICollection<UsersTechnology> UsersTechnologies { get; set; } = new List<UsersTechnology>();
}
