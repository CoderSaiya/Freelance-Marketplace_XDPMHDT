using FreelanceMarketplace.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;

namespace FreelanceMarketplace.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Contracts> Contracts { get; set; }
        public DbSet<RefreshTokens> RefreshTokens { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RefreshTokens>()
                .HasKey(rt => rt.Id);

            modelBuilder.Entity<RefreshTokens>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.Role).IsRequired().HasMaxLength(10);
            });

            modelBuilder.Entity<ChatMessage>(entity =>
            {
                entity.Property(e => e.Message).IsRequired();
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(e => e.CategoryName).IsUnique();
            });

            modelBuilder.Entity<Project>(entity =>
            {

            });

            modelBuilder.Entity<Contracts>()
            .HasOne(c => c.Freelancer)
            .WithMany(u => u.FreelancerContracts)
            .HasForeignKey(c => c.FreelancerId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Contracts>()
            .HasOne(c => c.Client)
            .WithMany(u => u.ClientContracts)
            .HasForeignKey(c => c.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Contracts>(entity =>
            {
                entity.Property(e => e.ContractDate).IsRequired();
                entity.Property(e => e.EndDate).IsRequired();
                entity.Property(e => e.Status).IsRequired();
            });
        }
    }
}
