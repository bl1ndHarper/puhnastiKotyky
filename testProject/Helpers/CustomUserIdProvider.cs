using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using testProject.Models;

namespace testProject.Helpers
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            return connection.User?.Identity.Name;
            // return connection.User?.FindFirst(ClaimTypes.Email)?.Value;
        }
    }
}
