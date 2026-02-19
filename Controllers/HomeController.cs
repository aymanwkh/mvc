using System.Data;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using netproject.Models;
using Dapper;
using System.Data.SQLite;

namespace netproject.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    public record Product (int Id, string Name, decimal Price)
    {
        public Product() : this(default, string.Empty, default) { }
    };
    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        GetData();
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }
    public void GetData() {
        var connectionString = "Data Source=products.db";
        var product= new Product(1, "product1", 10);
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
            connection.Execute(insertSql, product);
            Console.WriteLine($"Inserted product: {product.Name}");
            var selectSql = "SELECT Id, Name, Price FROM Product";
            var product1 = connection.Query<Product>(selectSql).FirstOrDefault();
            Console.WriteLine($"product retreived: {product1?.Name}");

        }
    }
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
