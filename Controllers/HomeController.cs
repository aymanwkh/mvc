using System.Data;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using netproject.Models;
using Dapper;
using System.Data.SQLite;
using Microsoft.AspNetCore.Authorization;

namespace netproject.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IConfiguration _configuration;
    public record Product (string Name, decimal Price);
    public record PagingModel (string page, string itemsPerPage);
    public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }
    [Authorize]
    public IActionResult Index()
    {
        SetData();
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }
    // [Authorize]
    [HttpGet]
    public IActionResult GetData([FromQuery] string pageNo)
    {
        var p = HttpContext.Request.QueryString;

        Console.WriteLine("paging p = ", p);
        // Console.WriteLine("itemsPerPage = ", ItemsPerPage);
        var dbPath = _configuration["DatabaseConfig:Path"];
        var connectionString = $"Data Source={dbPath}";
        using IDbConnection connection = new SQLiteConnection(connectionString);
        connection.Open();
        var selectSql = "SELECT * FROM Product";
        var result = connection.Query(selectSql).ToList();
        Console.WriteLine("result = " + result.Count());
        return Ok(result);
    }
    public void SetData() {
        var dbPath = _configuration["DatabaseConfig:Path"];
        var connectionString = $"Data Source={dbPath}";
        using (IDbConnection connection = new SQLiteConnection(connectionString))
        {
            connection.Open();
            var createTableSql = @"
                CREATE TABLE IF NOT EXISTS Product (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Name VARCHAR(100) NOT NULL,
                    Price DECIMAL(10, 2) NOT NULL
                );";
            connection.Execute(createTableSql);
            var insertSql = "INSERT INTO Product (Name, Price) VALUES (@Name, @Price)";
            var product= new Product("product1", 10);
            connection.Execute(insertSql, product);
            Console.WriteLine($"Inserted product: {product.Name}");
            product= new Product("product2", 20);
            connection.Execute(insertSql, product);
            product= new Product("product3", 30);
            connection.Execute(insertSql, product);
            var selectSql = "SELECT count(1) FROM Product";
            var productCount = connection.ExecuteScalar(selectSql);
            Console.WriteLine($"products count: {productCount}");
        }
    }
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
