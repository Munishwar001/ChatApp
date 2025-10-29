using JqueryPractice.Models;
using JqueryPractice.RepoHelper;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace JqueryPractice.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ProductHelper _productHelper;

        public HomeController(ILogger<HomeController> logger, ProductHelper productHelper)
        {
            _logger = logger;
            _productHelper = productHelper;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult GetProductTable()
        {
            List<Products> products = _productHelper.GetProducts();
            return PartialView(products);
        }


        [HttpPost]
        public IActionResult SaveProducts([FromBody] List<Products> products)
        {
            if (products == null || products.Count == 0)
                return BadRequest("No products received.");

            _productHelper.InsertProducts(products);

            return Ok(new { message = "Products saved successfully!" });
        }

        [HttpPost]
        public IActionResult UpdateProducts([FromBody] List<Products> products)
        {
            if (products == null || products.Count == 0)
                return BadRequest("No data received.");

            _productHelper.UpdateProducts(products);

            return Ok(new { message = "Products updated successfully!" });
        }

        [HttpDelete("Home/DeleteProduct/{id}")]
        public IActionResult DeleteProduct(int id)
        {
            _productHelper.DeleteProduct(id);
            return Ok(new { message = "Products updated successfully!" });
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
