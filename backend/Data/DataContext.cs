global using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {        
            Database.EnsureCreated();
        }

        public DbSet<User> users { get; set; }
    }
}
