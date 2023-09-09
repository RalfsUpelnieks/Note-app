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
    }
}
