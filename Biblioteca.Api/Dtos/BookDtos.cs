using System.ComponentModel.DataAnnotations;

namespace Biblioteca.Api.Dtos;

public class CreateBookRequest
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(200)]
    public string Author { get; set; } = string.Empty;

    [StringLength(20)]
    public string? Isbn { get; set; }
}

public record BookResponse(
    int Id,
    string Title,
    string Author,
    string? Isbn,
    bool IsAvailable,
    bool BorrowedByMe);