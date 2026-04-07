using ClaimFlow.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ClaimFlow.API.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Claim> Claims { get; set; }
        public DbSet<ClaimError> ClaimErrors { get; set; }
        public DbSet<StateRule> StateRules { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<ClaimNote> ClaimNotes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure relationships and constraints if needed
            modelBuilder.Entity<Claim>()
                .HasOne(c => c.CreatedByUser)
                .WithMany(u => u.Claims)
                .HasForeignKey(c => c.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ClaimError>()
                .HasOne(ce => ce.Claim)
                .WithMany(c => c.ClaimErrors)
                .HasForeignKey(ce => ce.ClaimId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AuditLog>()
                .HasOne(al => al.User)
                .WithMany(u => u.AuditLogs)
                .HasForeignKey(al => al.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<ClaimNote>()
                .HasOne(cn => cn.Claim)
                .WithMany(c => c.ClaimNotes)
                .HasForeignKey(cn => cn.ClaimId)
                .OnDelete(DeleteBehavior.Cascade); // If a Claim is deleted → ALL its ClaimNotes are automatically deleted

            modelBuilder.Entity<ClaimNote>()
                .HasOne(cn => cn.User)
                .WithMany(c => c.ClaimNotes)
                .HasForeignKey(cn => cn.UserId)
                .OnDelete(DeleteBehavior.Restrict); // You CANNOT delete a User if they have ClaimNotes
        }
    }
}
