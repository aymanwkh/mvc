using System.Data;
using System.Data.SQLite;
using System.Security.Claims;
using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace netproject.Controllers;

public class NavigationViewComponent : ViewComponent
{
    public record Item(int Id, String Name, String ActionName, String ControllerName);
    private readonly IConfiguration _configuration;
    public NavigationViewComponent(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var dbPath = _configuration["DatabaseConfig:Path"];
        var connectionString = $"Data Source={dbPath}";
        using IDbConnection connection = new SQLiteConnection(connectionString);
        connection.Open();
        var createTableSql = @"
            CREATE TABLE IF NOT EXISTS School (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name VARCHAR(100) NOT NULL
            );";
        connection.Execute(createTableSql);
        var sql = "SELECT count(1) FROM School";
        var total = connection.ExecuteScalar<int>(sql);
        if (total == 0)
        {
            var insertSql = "INSERT INTO School (Name) VALUES (@Name)";
            connection.Execute(insertSql, new {Name = "School Name"});
        }
        var selectSql = "SELECT Name FROM School";
        var result = connection.QueryFirstOrDefault<String>(selectSql);

        // In a real application, you would fetch this data from a database.
        // This is sample data.
        var userName = this.UserClaimsPrincipal.FindFirstValue(ClaimTypes.Name);

        var menuItems = new List<Item>
        {
            new(1, result ?? "Unknonw", "Index", "Home"),
            new(2, userName ?? "Unknown", "Index", "User"),
            // Add dynamic items based on user roles or database content
        };

        return View(menuItems);
    }
}