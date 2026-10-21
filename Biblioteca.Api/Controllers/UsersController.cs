using Biblioteca.Api.Data;
using Biblioteca.Api.Dtos;
using Biblioteca.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _users;
    private readonly AppDbContext _db;

    public UsersController(UserManager<ApplicationUser> users, AppDbContext db)
    {
        _users = users;
        _db = db;
    }

    [HttpPost]
    public async Task<ActionResult<UserResponse>> Create(CreateUserRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName.Trim(),
            EmailConfirmed = true
        };

        var result = await _users.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        await _users.AddToRoleAsync(user, "User");

        return Created($"/api/users/{user.Id}",
            new UserResponse(user.Id, user.Email!, user.FullName, new List<BorrowedBookResponse>()));
    }

    [HttpGet]
    public async Task<ActionResult<List<UserResponse>>> GetAll()
    {
        var users = await _users.GetUsersInRoleAsync("User");

        var activeLoans = await _db.Loans
            .Include(l => l.Book)
            .Where(l => l.ReturnedAt == null)
            .ToListAsync();

        var result = users
            .OrderBy(u => u.FullName)
            .Select(u => new UserResponse(
                u.Id,
                u.Email!,
                u.FullName,
                activeLoans
                    .Where(l => l.UserId == u.Id)
                    .Select(l => new BorrowedBookResponse(l.BookId, l.Book.Title, l.Book.Author, l.BorrowedAt))
                    .ToList()))
            .ToList();

        return result;
    }
}