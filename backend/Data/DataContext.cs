global using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Reflection.Metadata;

namespace backend.Data {
    public class DataContext: DbContext {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {        
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.Entity<Page>().HasOne(u => u.User).WithMany(a => a.Pages).HasForeignKey(p => p.UserId);
            modelBuilder.Entity<Block>().HasOne(u => u.Page).WithMany(a => a.Blocks).HasForeignKey(p => p.PageId);
        }

        public DbSet<User> users { get; set; }
        public DbSet<Page> pages { get; set; }
        public DbSet<Block> blocks { get; set; }
    }
}
