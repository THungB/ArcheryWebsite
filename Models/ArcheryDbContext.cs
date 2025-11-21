using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace ArcheryWebsite.Models;

public partial class ArcheryDbContext : DbContext
{
    public ArcheryDbContext()
    {
    }

    public ArcheryDbContext(DbContextOptions<ArcheryDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Archer> Archers { get; set; }
    public virtual DbSet<Arrow> Arrows { get; set; }
    public virtual DbSet<Competition> Competitions { get; set; }
    public virtual DbSet<End> Ends { get; set; }
    public virtual DbSet<Equipment> Equipment { get; set; }
    public virtual DbSet<Range> Ranges { get; set; }
    public virtual DbSet<Round> Rounds { get; set; }
    public virtual DbSet<Roundrange> Roundranges { get; set; }
    public virtual DbSet<Score> Scores { get; set; }
    public virtual DbSet<Stagingscore> Stagingscores { get; set; }
    public virtual DbSet<RoundEquivalence> RoundEquivalences { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Range>(entity =>
        {
            entity.HasKey(e => e.RangeId).HasName("PRIMARY");
            entity.ToTable("range");

            entity.Property(e => e.RangeId).HasColumnName("range_id");
            entity.Property(e => e.DistanceMeters).HasColumnName("distance_meters");
            entity.Property(e => e.EndCount).HasColumnName("end_count");
            entity.Property(e => e.FaceSizeCm)
                  .HasColumnName("face_size_cm")
                  .HasDefaultValue(122);
        });

        modelBuilder.Entity<Stagingscore>(entity =>
        {
            entity.HasKey(e => e.StagingId).HasName("PRIMARY");
            entity.ToTable("stagingscore");

            entity.HasIndex(e => e.ArcherId, "archer_id");
            entity.HasIndex(e => e.EquipmentId, "equipment_id");
            entity.HasIndex(e => e.RoundId, "round_id");

            entity.Property(e => e.StagingId).HasColumnName("staging_id");
            entity.Property(e => e.ArcherId).HasColumnName("archer_id");
            entity.Property(e => e.EquipmentId).HasColumnName("equipment_id");
            entity.Property(e => e.RoundId).HasColumnName("round_id");
            entity.Property(e => e.RawScore).HasColumnName("raw_score");

            entity.Property(e => e.DateTime)
                .HasColumnType("datetime")
                .HasColumnName("date_time");

            entity.Property(e => e.Status)
                .HasDefaultValueSql("'pending'")
                .HasColumnType("enum('pending','approved','rejected')")
                .HasColumnName("status");

            entity.Property(e => e.ArrowValues)
                  .HasColumnName("arrow_values");

            entity.HasOne(d => d.Archer).WithMany(p => p.Stagingscores)
                .HasForeignKey(d => d.ArcherId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("stagingscore_ibfk_1");
            entity.HasOne(d => d.Round).WithMany(p => p.Stagingscores)
                .HasForeignKey(d => d.RoundId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("stagingscore_ibfk_2");
            entity.HasOne(d => d.Equipment).WithMany(p => p.Stagingscores)
                .HasForeignKey(d => d.EquipmentId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("stagingscore_ibfk_3");
        });

        modelBuilder.Entity<RoundEquivalence>(entity =>
        {
            entity.ToTable("round_equivalence");
            entity.HasKey(e => e.EquivalenceId);

            entity.Property(e => e.EquivalenceId).HasColumnName("equivalence_id");
            entity.Property(e => e.RoundId).HasColumnName("round_id");
            entity.Property(e => e.EquivalentRoundId).HasColumnName("equivalent_round_id");
            entity.Property(e => e.ValidFrom).HasColumnName("valid_from");
            entity.Property(e => e.ValidTo).HasColumnName("valid_to");

            entity.HasOne(d => d.Round)
                .WithMany(p => p.EquivalentRoundDefinitions)
                .HasForeignKey(d => d.RoundId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.EquivalentRound)
                .WithMany(p => p.EquivalentRoundTargets)
                .HasForeignKey(d => d.EquivalentRoundId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Archer>(entity =>
        {
            entity.HasKey(e => e.ArcherId).HasName("PRIMARY");
            entity.ToTable("archer");
            entity.Property(e => e.ArcherId).HasColumnName("archer_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.FirstName).HasMaxLength(100).HasColumnName("first_name");
            entity.Property(e => e.LastName).HasMaxLength(100).HasColumnName("last_name");
            entity.Property(e => e.Gender).HasColumnType("enum('Male','Female','Other')").HasColumnName("gender");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Email).HasMaxLength(255).HasColumnName("email");
            entity.Property(e => e.Phone).HasMaxLength(20).HasColumnName("phone");
            entity.Property(e => e.DefaultEquipmentId).HasDefaultValue(1).HasColumnName("default_equipment_id");
        });

        modelBuilder.Entity<Arrow>(entity =>
        {
            entity.HasKey(e => e.ArrowId).HasName("PRIMARY");
            entity.ToTable("arrow");
            entity.HasIndex(e => e.EndId, "end_id");
            entity.Property(e => e.ArrowId).HasColumnName("arrow_id");
            entity.Property(e => e.ArrowValue).HasColumnName("arrow_value");
            entity.Property(e => e.EndId).HasColumnName("end_id");

            // [MAPPING MỚI] Mapping cho cột IsX
            entity.Property(e => e.IsX)
                  .HasColumnName("is_x")
                  .HasColumnType("bit")
                  .HasDefaultValue(false);

            entity.HasOne(d => d.End).WithMany(p => p.Arrows).HasForeignKey(d => d.EndId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("arrow_ibfk_1");
        });

        modelBuilder.Entity<Competition>(entity =>
        {
            entity.HasKey(e => e.CompId).HasName("PRIMARY");
            entity.ToTable("competition");
            entity.Property(e => e.CompId).HasColumnName("comp_id");
            entity.Property(e => e.CompName).HasMaxLength(255).HasColumnName("comp_name");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.IsClubChampionship).HasColumnName("is_club_championship").HasDefaultValue(false);
        });

        modelBuilder.Entity<End>(entity =>
        {
            entity.HasKey(e => e.EndId).HasName("PRIMARY");
            entity.ToTable("end");
            entity.HasIndex(e => e.RangeId, "range_id");
            entity.HasIndex(e => e.ScoreId, "score_id");

            entity.Property(e => e.EndId).HasColumnName("end_id");
            entity.Property(e => e.EndNumber).HasColumnName("end_number");
            entity.Property(e => e.EndScore).HasColumnName("end_score");
            entity.Property(e => e.RangeId).HasColumnName("range_id");
            entity.Property(e => e.ScoreId).HasColumnName("score_id");

            // [MAPPING MỚI] Mapping cho cột RoundRangeId
            entity.Property(e => e.RoundRangeId).HasColumnName("round_range_id");

            entity.HasOne(d => d.Range).WithMany(p => p.Ends).HasForeignKey(d => d.RangeId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("end_ibfk_2");
            entity.HasOne(d => d.Score).WithMany(p => p.Ends).HasForeignKey(d => d.ScoreId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("end_ibfk_1");

            // [MỚI] Relationship với RoundRange (Optional)
            entity.HasOne(d => d.RoundRange)
                  .WithMany()
                  .HasForeignKey(d => d.RoundRangeId)
                  .HasConstraintName("fk_end_roundrange");
        });

        modelBuilder.Entity<Equipment>(entity =>
        {
            entity.HasKey(e => e.EquipmentId).HasName("PRIMARY");
            entity.ToTable("equipment");
            entity.Property(e => e.EquipmentId).HasColumnName("equipment_id");
            entity.Property(e => e.DivisionType).HasColumnType("enum('Recurve','Compound','Recurve Barebow','Compound Barebow','Longbow')").HasColumnName("division_type");
        });

        modelBuilder.Entity<Round>(entity =>
        {
            entity.HasKey(e => e.RoundId).HasName("PRIMARY");
            entity.ToTable("round");
            entity.Property(e => e.RoundId).HasColumnName("round_id");
            entity.Property(e => e.Description).HasColumnType("text").HasColumnName("description");
            entity.Property(e => e.RoundName).HasMaxLength(100).HasColumnName("round_name");
            entity.Property(e => e.ValidFrom).HasColumnName("valid_from");
            entity.Property(e => e.ValidTo).HasColumnName("valid_to");
            entity.Property(e => e.RoundFamilyCode).HasMaxLength(50).HasColumnName("round_family_code");
        });

        modelBuilder.Entity<Roundrange>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("roundrange");
            entity.HasIndex(e => e.RangeId, "range_id");
            entity.HasIndex(e => e.RoundId, "round_id");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RangeId).HasColumnName("range_id");
            entity.Property(e => e.RoundId).HasColumnName("round_id");
            entity.Property(e => e.SequenceNumber).HasColumnName("sequence_number");
            entity.HasOne(d => d.Range).WithMany(p => p.Roundranges).HasForeignKey(d => d.RangeId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("roundrange_ibfk_2");
            entity.HasOne(d => d.Round).WithMany(p => p.Roundranges).HasForeignKey(d => d.RoundId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("roundrange_ibfk_1");
        });

        modelBuilder.Entity<Score>(entity =>
        {
            entity.HasKey(e => e.ScoreId).HasName("PRIMARY");
            entity.ToTable("score");
            entity.HasIndex(e => e.ArcherId, "archer_id");
            entity.HasIndex(e => e.CompId, "comp_id");
            entity.HasIndex(e => e.RoundId, "round_id");
            entity.Property(e => e.ScoreId).HasColumnName("score_id");
            entity.Property(e => e.ArcherId).HasColumnName("archer_id");
            entity.Property(e => e.CompId).HasColumnName("comp_id");
            entity.Property(e => e.DateShot).HasColumnName("date_shot");
            entity.Property(e => e.RoundId).HasColumnName("round_id");
            entity.Property(e => e.TotalScore).HasColumnName("total_score");
            entity.HasOne(d => d.Archer).WithMany(p => p.Scores).HasForeignKey(d => d.ArcherId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("score_ibfk_1");
            entity.HasOne(d => d.Comp).WithMany(p => p.Scores).HasForeignKey(d => d.CompId).HasConstraintName("score_ibfk_3");
            entity.HasOne(d => d.Round).WithMany(p => p.Scores).HasForeignKey(d => d.RoundId).OnDelete(DeleteBehavior.ClientSetNull).HasConstraintName("score_ibfk_2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}