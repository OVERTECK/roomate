using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addAttrsToHouseAnnouncement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasFridge",
                table: "HouseAnnouncements",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasMicrowave",
                table: "HouseAnnouncements",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasStove",
                table: "HouseAnnouncements",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HasWashingMachine",
                table: "HouseAnnouncements",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RequiredNumberNeighbors",
                table: "HouseAnnouncements",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasFridge",
                table: "HouseAnnouncements");

            migrationBuilder.DropColumn(
                name: "HasMicrowave",
                table: "HouseAnnouncements");

            migrationBuilder.DropColumn(
                name: "HasStove",
                table: "HouseAnnouncements");

            migrationBuilder.DropColumn(
                name: "HasWashingMachine",
                table: "HouseAnnouncements");

            migrationBuilder.DropColumn(
                name: "RequiredNumberNeighbors",
                table: "HouseAnnouncements");
        }
    }
}
