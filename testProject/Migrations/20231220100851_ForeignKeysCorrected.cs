using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace testProject.Migrations
{
    /// <inheritdoc />
    public partial class ForeignKeysCorrected : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "projects_users_projects_users_id_foreign",
                table: "projects_users");

            migrationBuilder.AlterColumn<uint>(
                name: "projects_users_id",
                table: "projects_users",
                type: "int unsigned",
                nullable: false,
                oldClrType: typeof(uint),
                oldType: "int unsigned")
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<uint>(
                name: "users_technologies_id",
                table: "users_technologies",
                type: "int unsigned",
                nullable: false,
                oldClrType: typeof(uint),
                oldType: "int unsigned")
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.CreateIndex(
                name: "IX_projects_users_users_id",
                table: "projects_users",
                column: "users_id");

            migrationBuilder.AddForeignKey(
                name: "projects_users_users_id_foreign",
                table: "projects_users",
                column: "users_id",
                principalTable: "users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "projects_users_users_id_foreign",
                table: "projects_users");

            migrationBuilder.DropIndex(
                name: "IX_projects_users_users_id",
                table: "projects_users");

            migrationBuilder.AlterColumn<uint>(
                name: "projects_users_id",
                table: "projects_users",
                type: "int unsigned",
                nullable: false,
                oldClrType: typeof(uint),
                oldType: "int unsigned")
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddForeignKey(
                name: "projects_users_projects_users_id_foreign",
                table: "projects_users",
                column: "projects_users_id",
                principalTable: "users",
                principalColumn: "Id");
        }
    }
}
