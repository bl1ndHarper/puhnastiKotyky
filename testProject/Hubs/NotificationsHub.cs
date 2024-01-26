using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Reflection;

namespace testProject.Hubs
{
    public class NotificationsHub : Hub
    {

        public async Task SendNotification(string user, string title, string message, uint notificationId, DateTime sentAt)
        {
            await Clients.Group(user).SendAsync("ReceiveNotification", title, message, notificationId, sentAt);
        }

        public override Task OnConnectedAsync()
        {
            string name = Context.User.Identity.Name;

            if (name != null) {
                Groups.AddToGroupAsync(Context.ConnectionId, name);
                return base.OnConnectedAsync();
            }
            return Task.CompletedTask;
        }
    }
}
