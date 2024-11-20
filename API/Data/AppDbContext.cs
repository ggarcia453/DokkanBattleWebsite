// Data/AppDbContext.cs

using DokkanAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace DokkanAPI.Data
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Card> Cards { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<CardCategory> CardCategories { get; set; } 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Card>()
                .ToTable("cards");
            modelBuilder.Entity<Card>()
                .Property(c => c.Title)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<Card>()
                .Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Category>()
                .ToTable("categories");
            
            modelBuilder.Entity<CardCategory>()
                .ToTable("cardcategories");
            modelBuilder.Entity<CardCategory>()
                .HasKey(cc => new { cc.CardId, cc.CategoryId });
            modelBuilder.Entity<CardCategory>()
                .HasOne(cc => cc.Card)
                .WithMany(c => c.CardCategories)
                .HasForeignKey(cc => cc.CardId);
            modelBuilder.Entity<CardCategory>()
                .HasOne(cc => cc.Category)
                .WithMany(c => c.CategoryCards)
                .HasForeignKey(cc => cc.CategoryId);
            
            modelBuilder.Entity<Link>()
                .ToTable("linkskills");
            
            modelBuilder.Entity<CardLink>()
                .HasKey(cl => new { cl.CardId, cl.LinkId });
            modelBuilder.Entity<CardLink>()
                .HasOne(cl => cl.Card)
                .WithMany(c => c.CardLinks)
                .HasForeignKey(cl => cl.CardId);
            modelBuilder.Entity<CardLink>()
                .HasOne(cc => cc.Link)
                .WithMany(l => l.LinkCards)
                .HasForeignKey(cc => cc.LinkId);
        }
    }
}