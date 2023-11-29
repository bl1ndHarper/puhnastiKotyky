using System;
using System.Collections.Generic;

namespace testProject.Data;

public partial class ProjectsTechnology
{
    public uint ProjectsTechnologiesId { get; set; }

    public uint ProjectsId { get; set; }

    public uint TechnologiesId { get; set; }

    public virtual Project Projects { get; set; } = null!;

    public virtual Technology Technologies { get; set; } = null!;
}
