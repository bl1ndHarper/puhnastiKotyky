using Microsoft.EntityFrameworkCore;
using testProject.Data;
using testProject.Models;
using testProject.Helpers;
using testProject.Services;
using testProject.Hubs;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using System.Net.Http.Headers;
using System.Text.Json;
using System.ComponentModel;
using System.Configuration;
using Microsoft.EntityFrameworkCore.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddAuthentication()
    .AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = configuration["Authentication:Google:ClientSecret"];
        googleOptions.AuthorizationEndpoint = string.Concat(googleOptions.AuthorizationEndpoint, "?prompt=select_account");
    })
    .AddOAuth("GitHub", options =>
    {
        options.ClientId = configuration["Authentication:GitHub:ClientId"];
        options.ClientSecret = configuration["Authentication:GitHub:ClientSecret"];
        options.CallbackPath = new PathString("/signin-github");
        options.AuthorizationEndpoint = "https://github.com/login/oauth/authorize";
        options.TokenEndpoint = "https://github.com/login/oauth/access_token";
        options.UserInformationEndpoint = "https://api.github.com/user";
        options.Scope.Add("user:email");

        options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
        options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
        options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");

        options.Events = new OAuthEvents
        {
            OnCreatingTicket = async context =>
            {
                var request = new HttpRequestMessage(System.Net.Http.HttpMethod.Get, context.Options.UserInformationEndpoint);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);

                var response = await context.Backchannel.SendAsync(request, context.HttpContext.RequestAborted);
                response.EnsureSuccessStatusCode();

                using var responseStream = await response.Content.ReadAsStreamAsync();
                using var jsonDocument = await JsonDocument.ParseAsync(responseStream);

                var user = jsonDocument.RootElement;

                context.RunClaimActions(user);
            }
        };
    });

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string is not found");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddDefaultIdentity<User>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<AppDbContext>();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.MapRazorPages();
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints => {
    endpoints.MapControllerRoute(
          name: "Help",
          pattern: "{area:exists}/{controller=Help}/{action=Index}/{id?}"
        );

    endpoints.MapControllerRoute(
      name: "Notifications",
      pattern: "{area:exists}/{controller=Notifications}/{action=Index}/{id?}"
    );
    endpoints.MapControllerRoute(
          name: "Projects",
          pattern: "{area:exists}/{controller=Public}/{action=Index}/{id?}"
        );

    endpoints.MapControllerRoute(
          name: "UserAccount",
          pattern: "{area:exists}/{controller=Account}/{action=Index}/{id?}"
        );

    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
    );

    endpoints.MapHub<NotificationsHub>("/NotificationsHub");
});

app.Run();
