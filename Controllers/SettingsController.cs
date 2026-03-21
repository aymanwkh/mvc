using Microsoft.AspNetCore.Mvc;

namespace netproject.Controllers;

public class SettingsController : Controller
{
    private readonly ILogger<AccountController> _logger;
    public SettingsController(ILogger<AccountController> logger)
    {
        _logger = logger;
    }

    public IActionResult Branch()
    {
        return View();
    }
    public IActionResult Menu()
    {
        return View();
    }
}
