﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace testProject.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<ProjectsTechnology> ProjectsTechnologies { get; set; }

    public virtual DbSet<ProjectsUser> ProjectsUsers { get; set; }

    public virtual DbSet<Request> Requests { get; set; }

    public virtual DbSet<Technology> Technologies { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UsersTechnology> UsersTechnologies { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseMySql("server=localhost;port=3306;database=DB;user=newuser;password=Password123", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.33-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.ProjectsId).HasName("PRIMARY");

            entity.ToTable("projects");

            entity.HasIndex(e => e.Name, "projects_name_index");

            entity.HasIndex(e => e.UsersId, "projects_users_id_foreign");

            entity.Property(e => e.ProjectsId).HasColumnName("projects_id");
            entity.Property(e => e.CreationDate)
                .HasColumnType("datetime")
                .HasColumnName("creation_date");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.Duration).HasColumnName("duration");
            entity.Property(e => e.Level)
                .HasColumnType("enum('easy','medium','hard')")
                .HasColumnName("level");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Status)
                .HasColumnType("enum('draft','in development','completed')")
                .HasColumnName("status");
            entity.Property(e => e.UsersId).HasColumnName("users_id");

            entity.HasOne(d => d.Users).WithMany(p => p.Projects)
                .HasForeignKey(d => d.UsersId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("projects_users_id_foreign");
        });

        modelBuilder.Entity<ProjectsTechnology>(entity =>
        {
            entity.HasKey(e => e.ProjectsTechnologiesId).HasName("PRIMARY");

            entity.ToTable("projects_technologies");

            entity.HasIndex(e => e.ProjectsId, "projects_tech_projects_id_foreign");

            entity.HasIndex(e => e.TechnologiesId, "projects_tech_tech_id_foreign");

            entity.Property(e => e.ProjectsTechnologiesId).HasColumnName("projects_technologies_id");
            entity.Property(e => e.ProjectsId).HasColumnName("projects_id");
            entity.Property(e => e.TechnologiesId).HasColumnName("technologies_id");

            entity.HasOne(d => d.Projects).WithMany(p => p.ProjectsTechnologies)
                .HasForeignKey(d => d.ProjectsId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("projects_tech_projects_id_foreign");

            entity.HasOne(d => d.Technologies).WithMany(p => p.ProjectsTechnologies)
                .HasForeignKey(d => d.TechnologiesId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("projects_tech_tech_id_foreign");
        });

        modelBuilder.Entity<ProjectsUser>(entity =>
        {
            entity.HasKey(e => e.ProjectsUsersId).HasName("PRIMARY");

            entity.ToTable("projects_users");

            entity.HasIndex(e => e.ProjectsId, "projects_users_projects_id_foreign");

            entity.Property(e => e.ProjectsUsersId)
                .ValueGeneratedOnAdd()
                .HasColumnName("projects_users_id");
            entity.Property(e => e.ProjectsId).HasColumnName("projects_id");
            entity.Property(e => e.UsersId).HasColumnName("users_id");

            entity.HasOne(d => d.Projects).WithMany(p => p.ProjectsUsers)
                .HasForeignKey(d => d.ProjectsId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("projects_users_projects_id_foreign");

            entity.HasOne(d => d.ProjectsUsers).WithOne(p => p.ProjectsUser)
                .HasForeignKey<ProjectsUser>(d => d.ProjectsUsersId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("projects_users_projects_users_id_foreign");
        });

        modelBuilder.Entity<Request>(entity =>
        {
            entity.HasKey(e => e.RequestsId).HasName("PRIMARY");

            entity.ToTable("requests");

            entity.HasIndex(e => e.ProjectsId, "requests_projects_id_foreign");

            entity.HasIndex(e => e.UsersId, "requests_users_id_foreign");

            entity.Property(e => e.RequestsId).HasColumnName("requests_id");
            entity.Property(e => e.Date)
                .HasColumnType("datetime")
                .HasColumnName("date");
            entity.Property(e => e.ProjectsId).HasColumnName("projects_id");
            entity.Property(e => e.Status)
                .HasColumnType("enum('considering','denied','accepted')")
                .HasColumnName("status");
            entity.Property(e => e.UsersId).HasColumnName("users_id");

            entity.HasOne(d => d.Projects).WithMany(p => p.Requests)
                .HasForeignKey(d => d.ProjectsId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("requests_projects_id_foreign");

            entity.HasOne(d => d.Users).WithMany(p => p.Requests)
                .HasForeignKey(d => d.UsersId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("requests_users_id_foreign");
        });

        modelBuilder.Entity<Technology>(entity =>
        {
            entity.HasKey(e => e.TechnologiesId).HasName("PRIMARY");

            entity.ToTable("technologies");

            entity.Property(e => e.TechnologiesId).HasColumnName("technologies_id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UsersId).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.Property(e => e.UsersId).HasColumnName("users_id");
            entity.Property(e => e.About)
                .HasColumnType("text")
                .HasColumnName("about");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("last_name");
            entity.Property(e => e.Password)
                .HasMaxLength(32)
                .HasColumnName("password");
            entity.Property(e => e.Photo)
                .HasMaxLength(255)
                .HasColumnName("photo");
        });

        modelBuilder.Entity<UsersTechnology>(entity =>
        {
            entity.HasKey(e => e.UsersTechnologiesId).HasName("PRIMARY");

            entity.ToTable("users_technologies");

            entity.HasIndex(e => e.TechnologiesId, "users_tech_tech_id_foreign");

            entity.HasIndex(e => e.UsersId, "users_tech_users_id_foreign");

            entity.Property(e => e.UsersTechnologiesId)
                .ValueGeneratedNever()
                .HasColumnName("users_technologies_id");
            entity.Property(e => e.TechnologiesId).HasColumnName("technologies_id");
            entity.Property(e => e.UsersId).HasColumnName("users_id");

            entity.HasOne(d => d.Technologies).WithMany(p => p.UsersTechnologies)
                .HasForeignKey(d => d.TechnologiesId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("users_tech_tech_id_foreign");

            entity.HasOne(d => d.Users).WithMany(p => p.UsersTechnologies)
                .HasForeignKey(d => d.UsersId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("users_tech_users_id_foreign");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}