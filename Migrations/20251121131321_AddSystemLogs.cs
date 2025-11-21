using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArcheryWebsite.Migrations
{
    /// <inheritdoc />
    public partial class AddSystemLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // [FIX] Comment lại các cột đã có trong Database để tránh lỗi "Duplicate column name"
            /*
            migrationBuilder.AddColumn<string>(
                name: "arrow_values",
                table: "stagingscore",
                type: "longtext",
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "round_family_code",
                table: "round",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true,
                collation: "utf8mb4_unicode_ci")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "valid_from",
                table: "round",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateOnly>(
                name: "valid_to",
                table: "round",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "face_size_cm",
                table: "range",
                type: "int",
                nullable: false,
                defaultValue: 122);

            migrationBuilder.AddColumn<int>(
                name: "round_range_id",
                table: "end",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_club_championship",
                table: "competition",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<ulong>(
                name: "is_x",
                table: "arrow",
                type: "bit",
                nullable: false,
                defaultValue: 0ul);

            // [FIX] Table này cũng đã có trong DB nên comment lại
            migrationBuilder.CreateTable(
                name: "round_equivalence",
                columns: table => new
                {
                    equivalence_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    round_id = table.Column<int>(type: "int", nullable: false),
                    equivalent_round_id = table.Column<int>(type: "int", nullable: false),
                    valid_from = table.Column<DateOnly>(type: "date", nullable: false),
                    valid_to = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_round_equivalence", x => x.equivalence_id);
                    table.ForeignKey(
                        name: "FK_round_equivalence_round_equivalent_round_id",
                        column: x => x.equivalent_round_id,
                        principalTable: "round",
                        principalColumn: "round_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_round_equivalence_round_round_id",
                        column: x => x.round_id,
                        principalTable: "round",
                        principalColumn: "round_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");
            */

            // [QUAN TRỌNG] CHỈ GIỮ LẠI BẢNG MỚI NÀY
            migrationBuilder.CreateTable(
                name: "system_log",
                columns: table => new
                {
                    log_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    timestamp = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    level = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    user = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    action = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    details = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ip_address = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_system_log", x => x.log_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            // [FIX] Comment các Index liên quan đến cột/bảng đã có
            /*
            migrationBuilder.CreateIndex(
                name: "IX_end_round_range_id",
                table: "end",
                column: "round_range_id");

            migrationBuilder.CreateIndex(
                name: "IX_round_equivalence_equivalent_round_id",
                table: "round_equivalence",
                column: "equivalent_round_id");

            migrationBuilder.CreateIndex(
                name: "IX_round_equivalence_round_id",
                table: "round_equivalence",
                column: "round_id");

            migrationBuilder.AddForeignKey(
                name: "fk_end_roundrange",
                table: "end",
                column: "round_range_id",
                principalTable: "roundrange",
                principalColumn: "id");
            */
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "system_log");

            // Các phần khác có thể để nguyên hoặc comment tùy ý
        }
    }
}