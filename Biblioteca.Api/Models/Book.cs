namespace Biblioteca.Api.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string? Isbn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<Loan> Loans { get; set; } = new();
}