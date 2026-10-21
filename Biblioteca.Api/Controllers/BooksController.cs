using System.Security.Claims;
using Biblioteca.Api.Data;
using Biblioteca.Api.Dtos;
using Biblioteca.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Api.Controllers;

[ApiController]
[Route("api/books")]
[Authorize]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _db;

    public BooksController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<BookResponse>>> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var books = await _db.Books
            .OrderBy(b => b.Title)
            .Select(b => new BookResponse(
                b.Id,
                b.Title,
                b.Author,
                b.Isbn,
                !b.Loans.Any(l => l.ReturnedAt == null),
                b.Loans.Any(l => l.ReturnedAt == null && l.UserId == userId)))
            .ToListAsync();

        return books;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BookResponse>> Create(CreateBookRequest request)
    {
        var book = new Book
        {
            Title = request.Title.Trim(),
            Author = request.Author.Trim(),
            Isbn = string.IsNullOrWhiteSpace(request.Isbn) ? null : request.Isbn.Trim()
        };

        _db.Books.Add(book);
        await _db.SaveChangesAsync();

        return Created($"/api/books/{book.Id}",
            new BookResponse(book.Id, book.Title, book.Author, book.Isbn, true, false));
    }

    [HttpPost("{id:int}/borrow")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> Borrow(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        if (!await _db.Books.AnyAsync(b => b.Id == id))
        {
            return NotFound(new { message = "Cartea nu există." });
        }

        if (await _db.Loans.AnyAsync(l => l.BookId == id && l.ReturnedAt == null))
        {
            return Conflict(new { message = "Cartea este deja împrumutată." });
        }

        _db.Loans.Add(new Loan { BookId = id, UserId = userId });

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqliteException { SqliteErrorCode: 19 })
        {
            return Conflict(new { message = "Cartea tocmai a fost împrumutată de altcineva." });
        }

        return NoContent();
    }

    [HttpPost("{id:int}/return")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> Return(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var loan = await _db.Loans
            .FirstOrDefaultAsync(l => l.BookId == id && l.UserId == userId && l.ReturnedAt == null);

        if (loan is null)
        {
            return NotFound(new { message = "Nu ai această carte împrumutată." });
        }

        loan.ReturnedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return NoContent();
    }
}