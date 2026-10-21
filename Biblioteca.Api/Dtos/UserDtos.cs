using System.ComponentModel.DataAnnotations;

namespace Biblioteca.Api.Dtos;

public class CreateUserRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public record BorrowedBookResponse(int BookId, string Title, string Author, DateTime BorrowedAt);

public record UserResponse(string Id, string Email, string FullName, List<BorrowedBookResponse> BorrowedBooks);