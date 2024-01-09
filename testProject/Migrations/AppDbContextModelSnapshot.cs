﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using testProject.Data;

#nullable disable

namespace testProject.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseCollation("utf8mb4_0900_ai_ci")
                .HasAnnotation("ProductVersion", "7.0.14")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.HasCharSet(modelBuilder, "utf8mb4");

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole<uint>", b =>
                {
                    b.Property<uint>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.Property<string>("NormalizedName")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<uint>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("ClaimType")
                        .HasColumnType("longtext");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("longtext");

                    b.Property<uint>("RoleId")
                        .HasColumnType("int unsigned");

                    b.HasKey("Id");

                    b.ToTable("RoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<uint>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("ClaimType")
                        .HasColumnType("longtext");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("longtext");

                    b.Property<uint>("UserId")
                        .HasColumnType("int unsigned");

                    b.HasKey("Id");

                    b.ToTable("UserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<uint>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("varchar(255)");

                    b.Property<uint>("UserId")
                        .HasColumnType("int unsigned");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("longtext");

                    b.HasKey("LoginProvider", "ProviderKey", "UserId");

                    b.ToTable("UserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<uint>", b =>
                {
                    b.Property<uint>("UserId")
                        .HasColumnType("int unsigned");

                    b.Property<uint>("RoleId")
                        .HasColumnType("int unsigned");

                    b.HasKey("UserId", "RoleId");

                    b.ToTable("UserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<uint>", b =>
                {
                    b.Property<uint>("UserId")
                        .HasColumnType("int unsigned");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Value")
                        .HasColumnType("longtext");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("UserTokens");
                });

            modelBuilder.Entity("testProject.Models.Project", b =>
                {
                    b.Property<uint>("ProjectsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned")
                        .HasColumnName("projects_id");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime")
                        .HasColumnName("creation_date");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<int>("Duration")
                        .HasColumnType("int")
                        .HasColumnName("duration");

                    b.Property<string>("Level")
                        .IsRequired()
                        .HasColumnType("enum('easy','medium','hard')")
                        .HasColumnName("level");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)")
                        .HasColumnName("name");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("enum('searching for participants','draft','in development','completed')")
                        .HasColumnName("status");

                    b.Property<uint>("UsersId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("users_id");

                    b.HasKey("ProjectsId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "Name" }, "projects_name_index");

                    b.HasIndex(new[] { "UsersId" }, "projects_users_id_foreign");

                    b.ToTable("projects", (string)null);
                });

            modelBuilder.Entity("testProject.Models.ProjectsTechnology", b =>
                {
                    b.Property<uint>("ProjectsTechnologiesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned")
                        .HasColumnName("projects_technologies_id");

                    b.Property<uint>("ProjectsId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("projects_id");

                    b.Property<uint>("TechnologiesId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("technologies_id");

                    b.HasKey("ProjectsTechnologiesId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "ProjectsId" }, "projects_tech_projects_id_foreign");

                    b.HasIndex(new[] { "TechnologiesId" }, "projects_tech_tech_id_foreign");

                    b.ToTable("projects_technologies", (string)null);
                });

            modelBuilder.Entity("testProject.Models.ProjectsUser", b =>
                {
                    b.Property<uint>("ProjectsUsersId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned")
                        .HasColumnName("projects_users_id");

                    b.Property<uint>("ProjectsId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("projects_id");

                    b.Property<uint>("UsersId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("users_id");

                    b.HasKey("ProjectsUsersId")
                        .HasName("PRIMARY");

                    b.HasIndex("UsersId");

                    b.HasIndex(new[] { "ProjectsId" }, "projects_users_projects_id_foreign");

                    b.ToTable("projects_users", (string)null);
                });

            modelBuilder.Entity("testProject.Models.Request", b =>
                {
                    b.Property<uint>("RequestsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned")
                        .HasColumnName("requests_id");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime")
                        .HasColumnName("date");

                    b.Property<uint>("ProjectsId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("projects_id");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("enum('considering','denied','accepted','deleted')")
                        .HasColumnName("status");

                    b.Property<uint>("UsersId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("users_id");

                    b.HasKey("RequestsId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "ProjectsId" }, "requests_projects_id_foreign");

                    b.HasIndex(new[] { "UsersId" }, "requests_users_id_foreign");

                    b.ToTable("requests", (string)null);
                });

            modelBuilder.Entity("testProject.Models.Technology", b =>
                {
                    b.Property<uint>("TechnologiesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned")
                        .HasColumnName("technologies_id");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("name");

                    b.HasKey("TechnologiesId")
                        .HasName("PRIMARY");

                    b.ToTable("technologies", (string)null);
                });

            modelBuilder.Entity("testProject.Models.User", b =>
                {
                    b.Property<uint>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned");

                    b.Property<string>("About")
                        .HasColumnType("text")
                        .HasColumnName("about");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("longtext");

                    b.Property<string>("Email")
                        .HasColumnType("longtext");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("first_name");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("last_name");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("NormalizedEmail")
                        .HasColumnType("longtext");

                    b.Property<string>("NormalizedUserName")
                        .HasColumnType("longtext");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("longtext");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("longtext");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Photo")
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)")
                        .HasColumnName("photo");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("longtext");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("UserName")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("testProject.Models.UsersTechnology", b =>
                {
                    b.Property<uint>("UsersTechnologiesId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned")
                        .HasColumnName("users_technologies_id");

                    b.Property<uint>("TechnologiesId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("technologies_id");

                    b.Property<uint>("UsersId")
                        .HasColumnType("int unsigned")
                        .HasColumnName("users_id");

                    b.HasKey("UsersTechnologiesId")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "TechnologiesId" }, "users_tech_tech_id_foreign");

                    b.HasIndex(new[] { "UsersId" }, "users_tech_users_id_foreign");

                    b.ToTable("users_technologies", (string)null);
                });

            modelBuilder.Entity("testProject.Models.Project", b =>
                {
                    b.HasOne("testProject.Models.User", "Users")
                        .WithMany("Projects")
                        .HasForeignKey("UsersId")
                        .IsRequired()
                        .HasConstraintName("projects_users_id_foreign");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("testProject.Models.ProjectsTechnology", b =>
                {
                    b.HasOne("testProject.Models.Project", "Projects")
                        .WithMany("ProjectsTechnologies")
                        .HasForeignKey("ProjectsId")
                        .IsRequired()
                        .HasConstraintName("projects_tech_projects_id_foreign");

                    b.HasOne("testProject.Models.Technology", "Technologies")
                        .WithMany("ProjectsTechnologies")
                        .HasForeignKey("TechnologiesId")
                        .IsRequired()
                        .HasConstraintName("projects_tech_tech_id_foreign");

                    b.Navigation("Projects");

                    b.Navigation("Technologies");
                });

            modelBuilder.Entity("testProject.Models.ProjectsUser", b =>
                {
                    b.HasOne("testProject.Models.Project", "Projects")
                        .WithMany("ProjectsUsers")
                        .HasForeignKey("ProjectsId")
                        .IsRequired()
                        .HasConstraintName("projects_users_projects_id_foreign");

                    b.HasOne("testProject.Models.User", "Users")
                        .WithMany("ProjectsUser")
                        .HasForeignKey("UsersId")
                        .IsRequired()
                        .HasConstraintName("projects_users_users_id_foreign");

                    b.Navigation("Projects");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("testProject.Models.Request", b =>
                {
                    b.HasOne("testProject.Models.Project", "Projects")
                        .WithMany("Requests")
                        .HasForeignKey("ProjectsId")
                        .IsRequired()
                        .HasConstraintName("requests_projects_id_foreign");

                    b.HasOne("testProject.Models.User", "Users")
                        .WithMany("Requests")
                        .HasForeignKey("UsersId")
                        .IsRequired()
                        .HasConstraintName("requests_users_id_foreign");

                    b.Navigation("Projects");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("testProject.Models.UsersTechnology", b =>
                {
                    b.HasOne("testProject.Models.Technology", "Technologies")
                        .WithMany("UsersTechnologies")
                        .HasForeignKey("TechnologiesId")
                        .IsRequired()
                        .HasConstraintName("users_tech_tech_id_foreign");

                    b.HasOne("testProject.Models.User", "Users")
                        .WithMany("UsersTechnologies")
                        .HasForeignKey("UsersId")
                        .IsRequired()
                        .HasConstraintName("users_tech_users_id_foreign");

                    b.Navigation("Technologies");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("testProject.Models.Project", b =>
                {
                    b.Navigation("ProjectsTechnologies");

                    b.Navigation("ProjectsUsers");

                    b.Navigation("Requests");
                });

            modelBuilder.Entity("testProject.Models.Technology", b =>
                {
                    b.Navigation("ProjectsTechnologies");

                    b.Navigation("UsersTechnologies");
                });

            modelBuilder.Entity("testProject.Models.User", b =>
                {
                    b.Navigation("Projects");

                    b.Navigation("ProjectsUser");

                    b.Navigation("Requests");

                    b.Navigation("UsersTechnologies");
                });
#pragma warning restore 612, 618
        }
    }
}
