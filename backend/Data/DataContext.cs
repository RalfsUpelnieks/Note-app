global using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data {
    public class DataContext: DbContext {
        public DataContext(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }
        public DbSet<User> users { get; set; }
        public DbSet<Page> pages { get; set; }
        public DbSet<Block> blocks { get; set; }
        public DbSet<Models.File> files { get; set; }
        public DbSet<Event> events { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Page>().HasOne(u => u.User).WithMany(a => a.Pages).HasForeignKey(p => p.userId);
            modelBuilder.Entity<Block>().HasOne(u => u.Page).WithMany(a => a.Blocks).HasForeignKey(p => p.pageId);
            modelBuilder.Entity<Block>().HasOne(f => f.file).WithOne(b => b.block).HasForeignKey<Models.File>(a => a.blockId);
            modelBuilder.Entity<Event>().HasOne(u => u.Block).WithMany(a => a.Event).HasForeignKey(a => a.blockId);
        }
    }
}
