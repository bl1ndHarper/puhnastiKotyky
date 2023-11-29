using System;
using System.Collections.Generic;

namespace testProject.Data;

public partial class Request
{
    public uint RequestsId { get; set; }

    public uint UsersId { get; set; }

    public uint ProjectsId { get; set; }

    public DateTime Date { get; set; }

    public string Status { get; set; } = null!;

    public virtual Project Projects { get; set; } = null!;

    public virtual User Users { get; set; } = null!;
}
