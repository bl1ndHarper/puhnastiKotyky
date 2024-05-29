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
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.Extensions.DependencyInjection;

DotNetEnv.Env.Load();
var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddAuthentication()
    .AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENTID");
        googleOptions.ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENTSECRET");
        googleOptions.AuthorizationEndpoint = string.Concat(googleOptions.AuthorizationEndpoint, "?prompt=select_account");

        googleOptions.Events.OnRemoteFailure = (context) =>
        {
            context.Response.Redirect("/Identity/Account/Register");
            context.HandleResponse();
            return Task.CompletedTask;
        };
    })
    .AddOAuth("GitHub", options =>
    {
        options.ClientId = Environment.GetEnvironmentVariable("GITHUB_CLIENTID");
        options.ClientSecret = Environment.GetEnvironmentVariable("GITHUB_CLIENTSECRET");
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

        options.Events.OnRemoteFailure = (context) =>
        {
            context.Response.Redirect("/Identity/Account/Register");
            context.HandleResponse();
            return Task.CompletedTask;
        };
    });

var connectionString = Environment.GetEnvironmentVariable("CONNECTIONSTRINGS_DEFAULTCONNECTION");
if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Connection string not found. Ensure the .env file is correctly configured and placed in the root directory.");
}

builder.Services.AddDbContext<AppDbContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddDefaultIdentity<User>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<AppDbContext>();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.Configure<CloudinarySettings>(options =>
{
    options.CloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUDNAME");
    options.ApiKey = Environment.GetEnvironmentVariable("CLOUDINARY_APIKEY");
    options.ApiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_APISECRET");
});

var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST");
var smtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT"));
var smtpUsername = Environment.GetEnvironmentVariable("SMTP_USERNAME");
var smtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
builder.Services.AddSingleton(new EmailService(smtpHost, smtpPort, smtpUsername, smtpPassword));

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
