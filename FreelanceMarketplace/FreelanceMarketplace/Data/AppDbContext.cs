using FreelanceMarketplace.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;

namespace FreelanceMarketplace.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Contracts> Contracts { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Img> Images { get; set; }
        public DbSet<RefreshTokens> RefreshTokens { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<Apply> Applies { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Cau hinh contribute (column)
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

            modelBuilder.Entity<Wallet>(entity =>
            {
                entity.Property(w => w.Balance).HasColumnType("decimal(18, 2)");
            });

            //cau hinh rang buoc quan he
            modelBuilder.Entity<ChatMessage>()
                .HasOne(c => c.Sender)
                .WithMany()
                .HasForeignKey(c => c.SenderId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(c => c.Recipient)
                .WithMany()
                .HasForeignKey(c => c.RecipientId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<UserProfile>()
               .HasOne(up => up.User)
               .WithOne(u => u.UserProfile)
               .HasForeignKey<UserProfile>(up => up.UserId);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Projects)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Images)
                .WithOne(i => i.Project)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Users)
                .WithMany(u => u.Projects)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

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

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Projects)
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Contract)
                .WithMany(c => c.Reviews)
                .HasForeignKey(r => r.ContractId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Contract)
                .WithOne(c => c.Payment)
                .HasForeignKey<Payment>(p => p.ContractId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Img>()
                .HasOne(i => i.UploadedByUser)
                .WithMany(u => u.UploadedImages)
                .HasForeignKey(i => i.UploadedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Apply>()
                .HasOne(a => a.User)
                .WithMany(u => u.Applies)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Apply>()
                .HasOne(a => a.Project)
                .WithMany(p => p.Applies)
                .HasForeignKey(a => a.ProjectId);

            modelBuilder.Entity<Wallet>()
                .HasOne(w => w.User)
                .WithOne(u => u.Wallet)
                .HasForeignKey<Wallet>(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
