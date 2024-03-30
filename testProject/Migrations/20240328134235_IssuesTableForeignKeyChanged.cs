using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace testProject.Migrations
{
    /// <inheritdoc />
    public partial class IssuesTableForeignKeyChanged : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_issues_users_users_id",
                table: "issues");

            migrationBuilder.DropIndex(
                name: "IX_issues_users_id",
                table: "issues");

            migrationBuilder.DropColumn(
                name: "users_id",
                table: "issues");

            migrationBuilder.AddColumn<string>(
                name: "contact_email",
                table: "issues",
                type: "varchar(100)",
                nullable: false,
                defaultValue: "",
                collation: "utf8mb4_0900_ai_ci")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "contact_email",
                table: "issues");

            migrationBuilder.AddColumn<uint>(
                name: "users_id",
                table: "issues",
                type: "int unsigned",
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.CreateIndex(
                name: "IX_issues_users_id",
                table: "issues",
                column: "users_id");

            migrationBuilder.AddForeignKey(
                name: "FK_issues_users_users_id",
                table: "issues",
                column: "users_id",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
