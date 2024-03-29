﻿global using Microsoft.EntityFrameworkCore;
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
        public DbSet<Files> files { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Page>().HasOne(u => u.User).WithMany(a => a.Pages).HasForeignKey(p => p.userId);
            modelBuilder.Entity<Block>().HasOne(u => u.Page).WithMany(a => a.Blocks).HasForeignKey(p => p.pageId);
            modelBuilder.Entity<Files>().HasOne(u => u.Block).WithOne(a => a.File).HasForeignKey<Files>(p => p.blockId);
        }
    }
}
