using Biblioteca.Api.Dtos;
using Biblioteca.Api.Models;
using Biblioteca.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Biblioteca.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _users;
    private readonly TokenService _tokens;

    public AuthController(UserManager<ApplicationUser> users, TokenService tokens)
    {
        _users = users;
        _tokens = tokens;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await _users.FindByEmailAsync(request.Email);

        if (user is null || !await _users.CheckPasswordAsync(user, request.Password))
        {
            return Unauthorized(new { message = "Email sau parolă greșită." });
        }

        var roles = await _users.GetRolesAsync(user);
        var token = _tokens.CreateToken(user, roles);

        return new LoginResponse(token, user.Email!, user.FullName, roles.FirstOrDefault() ?? "User");
    }
}