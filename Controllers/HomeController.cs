using System.Data;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using netproject.Models;
using Dapper;
using System.Data.SQLite;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace netproject.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IConfiguration _configuration;
    public record PagingModel (string page, string itemsPerPage);
    public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }
    [Authorize]
    public IActionResult Index()
    {
        return View();
    }
    [Authorize]
    public IActionResult Product()
    {
        return View();
    }
    [Authorize]
    public IActionResult Details(int id)
    {
        return View();
    }
    [Authorize]
    [HttpGet]
    public IActionResult getData(int page, int itemsPerPage)
    {
        var dbPath = _configuration["DatabaseConfig:Path"];
        var connectionString = $"Data Source={dbPath}";
        using IDbConnection connection = new SQLiteConnection(connectionString);
        connection.Open();
        var createTableSql = @"
            CREATE TABLE IF NOT EXISTS Product (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name VARCHAR(100) NOT NULL,
                Price DECIMAL(10, 2) NOT NULL
            );";
        connection.Execute(createTableSql);
        var sql = "SELECT count(1) FROM Product";
        var total = connection.ExecuteScalar<int>(sql);
        if (total == 0)
        {
            var insertSql = "INSERT INTO Product (Name, Price) VALUES (@Name, @Price)";
            connection.Execute(insertSql, new {Name = "Product1", Price = 10});
            connection.Execute(insertSql, new {Name = "Product2", Price = 20});
            connection.Execute(insertSql, new {Name = "Product3", Price = 30});
        }
        var skippedRows = (page - 1) * itemsPerPage;
        var selectSql = "SELECT * FROM Product limit @itemsPerPage offset @skippedRows";
        var result = connection.Query(selectSql, new {itemsPerPage, skippedRows}).ToList();
        return Ok(new {result, total});
    }
    [Authorize]
    [HttpGet]
    public IActionResult getPages()
    {
        var currentUser = this.User;
        var userName = currentUser.FindFirstValue(ClaimTypes.Name);
        var dbPath = _configuration["DatabaseConfig:Path"];
        var connectionString = $"Data Source={dbPath}";
        using IDbConnection connection = new SQLiteConnection(connectionString);
        connection.Open();
        var sql = @"
            CREATE TABLE IF NOT EXISTS Page (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name VARCHAR(100) NOT NULL,
                Path VARCHAR(200),
                Parent_id INTEGER
            );";
        connection.Execute(sql);
        sql = @"delete from page;";
        connection.Execute(sql);
        sql = @"insert into page (name, path, parent_id) values (@Name, @Path, @Parent) RETURNING id;";
        int? parent_id = null;
        parent_id = connection.ExecuteScalar<int>(sql, new {Name = "page1", Path = String.Empty, Parent = parent_id});
        parent_id = connection.ExecuteScalar<int>(sql, new {Name = "page11", Path = String.Empty, Parent = parent_id});
        connection.Execute(sql, new {Name = "page111", Path = "/home/product", Parent = parent_id});
        connection.Execute(sql, new {Name = "page112", Path = String.Empty, Parent = parent_id});
        connection.Execute(sql, new {Name = "page113", Path = String.Empty, Parent = parent_id});
        sql = @"
            CREATE TABLE IF NOT EXISTS User_Page (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Page_id INTEGER NOT NULL,
                User_id VARCHAR(100) NOT NULL
            );";
        connection.Execute(sql);
        // sql = "SELECT a.* FROM Page a join User_Page b on b.Page_id = a.id where b.User_id = @User_id";
        sql = "SELECT * FROM Page";
        // var result = connection.Query(sql, new {User_id = userName}).ToList();
        var result = connection.Query(sql).ToList();
        return Ok(result);
    }
    [Authorize]
    [HttpGet]
    public IActionResult getDetails(int id)
    {
        var dbPath = _configuration["DatabaseConfig:Path"];
        var connectionString = $"Data Source={dbPath}";
        using IDbConnection connection = new SQLiteConnection(connectionString);
        connection.Open();
        var sql = "SELECT * FROM Product where id = @id";
        var result = connection.Query(sql, new {id}).FirstOrDefault();
        return Ok(result);
    }
    [Authorize]
    [HttpGet]
    public IActionResult getTree()
    {
        var dbPath = _configuration["DatabaseConfig:Path"];
        var connectionString = $"Data Source={dbPath}";
        using IDbConnection connection = new SQLiteConnection(connectionString);
        connection.Open();
        var sql = "select * from page;";
        var result = connection.Query(sql).ToList();
        return Ok(result);
    }
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
