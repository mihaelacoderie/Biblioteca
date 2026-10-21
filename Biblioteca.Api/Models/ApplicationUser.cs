using Microsoft.AspNetCore.Identity;

namespace Biblioteca.Api.Models;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public List<Loan> Loans { get; set; } = new();
}