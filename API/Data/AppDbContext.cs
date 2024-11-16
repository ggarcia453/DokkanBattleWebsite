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
        }
    }
}