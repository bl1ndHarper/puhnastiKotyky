using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace testProject.Migrations
{
    /// <inheritdoc />
    public partial class participantsAddingTriggers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE TRIGGER addAuthorAsParticipant AFTER INSERT ON projects FOR EACH ROW
                BEGIN
                    INSERT INTO projects_users (users_id, projects_id) VALUES (NEW.users_id, NEW.projects_id);
                END");

            migrationBuilder.Sql(@"CREATE TRIGGER addNewParticipant AFTER UPDATE ON requests
                FOR EACH ROW
                BEGIN
                    IF NEW.Status = 'accepted' THEN
                        INSERT INTO projects_users (users_id, projects_id) VALUES (NEW.users_id, NEW.projects_id);
                    END IF;
                END");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TRIGGER addAuthorAsParticipant");
            migrationBuilder.Sql("DROP TRIGGER addNewParticipant");
        }
    }
}
