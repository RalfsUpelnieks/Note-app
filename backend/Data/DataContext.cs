global using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class DataContext: DbContext 
    {
        public DataContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<Block> Blocks { get; set; }
        public DbSet<StoredFile> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>().HasKey(u => u.UserId);

            builder.Entity<Book>().HasKey(b => b.BookId);

            builder.Entity<Book>()
                .HasOne(u => u.User)
                .WithMany(a => a.Books)
                .HasForeignKey(p => p.UserId);

            builder.Entity<Page>().HasKey(p => p.PageId);

            builder.Entity<Page>()
                .HasOne(u => u.Book)
                .WithMany(a => a.Pages)
                .HasForeignKey(p => p.BookId);

            builder.Entity<Block>().HasKey(b => b.BlockId);

            builder.Entity<Block>()
                .HasOne(u => u.Page)
                .WithMany(a => a.Blocks)
                .HasForeignKey(p => p.PageId);

            builder.Entity<StoredFile>().HasKey(f => f.BlockId);

            builder.Entity<StoredFile>()
                .HasOne(u => u.Block)
                .WithOne(a => a.File)
                .HasForeignKey<StoredFile>(p => p.BlockId);

            base.OnModelCreating(builder);
        }
    }
}
