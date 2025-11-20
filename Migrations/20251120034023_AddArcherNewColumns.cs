using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArcheryWebsite.Migrations
{
    /// <inheritdoc />
    public partial class AddArcherNewColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "archer",
                columns: table => new
                {
                    archer_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<int>(type: "int", nullable: true),
                    first_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    last_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    gender = table.Column<string>(type: "enum('Male','Female','Other')", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: false),
                    email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    phone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    default_equipment_id = table.Column<int>(type: "int", nullable: false, defaultValue: 1)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.archer_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "competition",
                columns: table => new
                {
                    comp_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    comp_name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    start_date = table.Column<DateOnly>(type: "date", nullable: false),
                    end_date = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.comp_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "equipment",
                columns: table => new
                {
                    equipment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    division_type = table.Column<string>(type: "enum('Recurve','Compound','Recurve Barebow','Compound Barebow','Longbow')", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.equipment_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "range",
                columns: table => new
                {
                    range_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    distance_meters = table.Column<int>(type: "int", nullable: false),
                    end_count = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.range_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "round",
                columns: table => new
                {
                    round_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    round_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "text", nullable: true, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.round_id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "roundrange",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    round_id = table.Column<int>(type: "int", nullable: false),
                    range_id = table.Column<int>(type: "int", nullable: false),
                    sequence_number = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "roundrange_ibfk_1",
                        column: x => x.round_id,
                        principalTable: "round",
                        principalColumn: "round_id");
                    table.ForeignKey(
                        name: "roundrange_ibfk_2",
                        column: x => x.range_id,
                        principalTable: "range",
                        principalColumn: "range_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "score",
                columns: table => new
                {
                    score_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    archer_id = table.Column<int>(type: "int", nullable: false),
                    round_id = table.Column<int>(type: "int", nullable: false),
                    comp_id = table.Column<int>(type: "int", nullable: true),
                    date_shot = table.Column<DateOnly>(type: "date", nullable: false),
                    total_score = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.score_id);
                    table.ForeignKey(
                        name: "score_ibfk_1",
                        column: x => x.archer_id,
                        principalTable: "archer",
                        principalColumn: "archer_id");
                    table.ForeignKey(
                        name: "score_ibfk_2",
                        column: x => x.round_id,
                        principalTable: "round",
                        principalColumn: "round_id");
                    table.ForeignKey(
                        name: "score_ibfk_3",
                        column: x => x.comp_id,
                        principalTable: "competition",
                        principalColumn: "comp_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "stagingscore",
                columns: table => new
                {
                    staging_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    archer_id = table.Column<int>(type: "int", nullable: false),
                    round_id = table.Column<int>(type: "int", nullable: false),
                    equipment_id = table.Column<int>(type: "int", nullable: false),
                    date_time = table.Column<DateTime>(type: "datetime", nullable: false),
                    raw_score = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "enum('pending','approved','rejected')", nullable: true, defaultValueSql: "'pending'", collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.staging_id);
                    table.ForeignKey(
                        name: "stagingscore_ibfk_1",
                        column: x => x.archer_id,
                        principalTable: "archer",
                        principalColumn: "archer_id");
                    table.ForeignKey(
                        name: "stagingscore_ibfk_2",
                        column: x => x.round_id,
                        principalTable: "round",
                        principalColumn: "round_id");
                    table.ForeignKey(
                        name: "stagingscore_ibfk_3",
                        column: x => x.equipment_id,
                        principalTable: "equipment",
                        principalColumn: "equipment_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "end",
                columns: table => new
                {
                    end_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    score_id = table.Column<int>(type: "int", nullable: false),
                    range_id = table.Column<int>(type: "int", nullable: false),
                    end_number = table.Column<int>(type: "int", nullable: false),
                    end_score = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.end_id);
                    table.ForeignKey(
                        name: "end_ibfk_1",
                        column: x => x.score_id,
                        principalTable: "score",
                        principalColumn: "score_id");
                    table.ForeignKey(
                        name: "end_ibfk_2",
                        column: x => x.range_id,
                        principalTable: "range",
                        principalColumn: "range_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateTable(
                name: "arrow",
                columns: table => new
                {
                    arrow_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    end_id = table.Column<int>(type: "int", nullable: false),
                    arrow_value = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.arrow_id);
                    table.ForeignKey(
                        name: "arrow_ibfk_1",
                        column: x => x.end_id,
                        principalTable: "end",
                        principalColumn: "end_id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");

            migrationBuilder.CreateIndex(
                name: "end_id",
                table: "arrow",
                column: "end_id");

            migrationBuilder.CreateIndex(
                name: "range_id",
                table: "end",
                column: "range_id");

            migrationBuilder.CreateIndex(
                name: "score_id",
                table: "end",
                column: "score_id");

            migrationBuilder.CreateIndex(
                name: "range_id1",
                table: "roundrange",
                column: "range_id");

            migrationBuilder.CreateIndex(
                name: "round_id",
                table: "roundrange",
                column: "round_id");

            migrationBuilder.CreateIndex(
                name: "archer_id",
                table: "score",
                column: "archer_id");

            migrationBuilder.CreateIndex(
                name: "comp_id",
                table: "score",
                column: "comp_id");

            migrationBuilder.CreateIndex(
                name: "round_id1",
                table: "score",
                column: "round_id");

            migrationBuilder.CreateIndex(
                name: "archer_id1",
                table: "stagingscore",
                column: "archer_id");

            migrationBuilder.CreateIndex(
                name: "equipment_id",
                table: "stagingscore",
                column: "equipment_id");

            migrationBuilder.CreateIndex(
                name: "round_id2",
                table: "stagingscore",
                column: "round_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "arrow");

            migrationBuilder.DropTable(
                name: "roundrange");

            migrationBuilder.DropTable(
                name: "stagingscore");

            migrationBuilder.DropTable(
                name: "end");

            migrationBuilder.DropTable(
                name: "equipment");

            migrationBuilder.DropTable(
                name: "score");

            migrationBuilder.DropTable(
                name: "range");

            migrationBuilder.DropTable(
                name: "archer");

            migrationBuilder.DropTable(
                name: "round");

            migrationBuilder.DropTable(
                name: "competition");
        }
    }
}
