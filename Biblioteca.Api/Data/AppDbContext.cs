using Biblioteca.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Book> Books => Set<Book>();
    public DbSet<Loan> Loans => Set<Loan>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Book>(b =>
        {
            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.Property(x => x.Author).IsRequired().HasMaxLength(200);
        });

        builder.Entity<Loan>(l =>
        {
            l.HasOne(x => x.Book).WithMany(b => b.Loans)
                .HasForeignKey(x => x.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            l.HasOne(x => x.User).WithMany(u => u.Loans)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // O carte poate avea cel mult un împrumut activ (nereturnat)
            l.HasIndex(x => x.BookId)
                .IsUnique()
                .HasFilter("\"ReturnedAt\" IS NULL");
        });
    }
}