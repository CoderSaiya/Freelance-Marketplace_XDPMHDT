using FreelanceMarketplace.Models;
using Microsoft.EntityFrameworkCore;

namespace FreelanceMarketplace.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<RefreshTokens> RefreshTokens { get; set; }
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
        }
    }
}
