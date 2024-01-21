using Microsoft.EntityFrameworkCore;
using testProject.Data;
using Microsoft.AspNetCore.Identity;
using testProject.Models;
using Microsoft.Extensions.Options;
using testProject.Helpers;
using testProject.Services;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddAuthentication().AddGoogle(googleOptions =>
{
    googleOptions.ClientId = configuration["Authentication:Google:ClientId"];
    googleOptions.ClientSecret = configuration["Authentication:Google:ClientSecret"];
    googleOptions.AuthorizationEndpoint = string.Concat(googleOptions.AuthorizationEndpoint, "?prompt=select_account");
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string is not found");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddDefaultIdentity<User>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<AppDbContext>();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

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
app.UseAuthorization();

app.UseEndpoints(endpoints => {
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
    pattern: "{controller=Home}/{action=Index}/{id?}");
});

app.Run();
