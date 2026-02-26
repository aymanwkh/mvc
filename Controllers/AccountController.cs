using System.Data;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using netproject.Models;
using Dapper;
using System.Data.SQLite;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;

namespace netproject.Controllers;

public class AccountController : Controller
{
    private readonly ILogger<AccountController> _logger;
    public record LoginModel(string username, string password);
    public AccountController(ILogger<AccountController> logger)
    {
        _logger = logger;
    }

    public IActionResult Login()
    {
        return View();
    }
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        Console.WriteLine("username = " + model.username);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, model.username),
            new Claim(ClaimTypes.Role, "Admin"), // Example role claim
        };
        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties
        {
            // Configure persistent cookies, expiration, etc.
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            authProperties);

// Redirect to a protected page
        return RedirectToAction("Index", "Home");
    }
}
