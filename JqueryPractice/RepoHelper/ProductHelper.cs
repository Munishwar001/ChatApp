using Dapper;
using JqueryPractice.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace JqueryPractice.RepoHelper
{
    public class ProductHelper
    {
        private readonly string _connectionString;

        public ProductHelper(IConfiguration configuration)
        {
            _connectionString =  configuration.GetConnectionString("DefaultConnection");
            SimpleCRUD.SetDialect(SimpleCRUD.Dialect.SQLServer);
        }

        public List<Products> GetProducts()
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                return db.GetList<Products>().ToList();
            }
        }

        public void InsertProducts(List<Products> products)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                db.Open();
                
                var existingProducts = GetProducts();

                foreach (var product in products)
                {
                    bool exists = existingProducts.Any(p =>
                        p.Name.Equals(product.Name, StringComparison.OrdinalIgnoreCase));

                    if (!exists)
                    {
                        db.Insert(product);
                        existingProducts.Add(product); 
                    }
                    else
                    {
                        System.Diagnostics.Debug.WriteLine($"Skipped duplicate product: {product.Name}");
                    }
                }
            }
        }

        public void InsertProduct(Products product)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                db.Open();
                db.Insert(product);
            }
        }

        public void UpdateProduct(Products product)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                db.Open();
                db.Update(product);
            }
        }

        public void DeleteProduct(int id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                db.Open();
                db.Delete<Products>(id);
            }
        }

        public Products GetProductById(int id)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                return db.Get<Products>(id);
            }
        }

        public bool UpdateProducts([FromBody] List<Products> products)
        {
            using (var db = new SqlConnection(_connectionString))
            {
                var existingIds = db.Query<int>("SELECT Id FROM Products").ToList();

                var receivedIds = products
                    .Where(p => p != null)
                    .Select(p => p.Id)
                    .ToList();

                if (receivedIds.Count > 0)
                {
                    var idsToDelete = existingIds.Except(receivedIds).ToList();
                    if (idsToDelete.Any())
                    {
                        db.Execute("DELETE FROM Products WHERE Id IN @Ids", new { Ids = idsToDelete });
                    }
                }

                foreach (var p in products)
                {
                    if (p == null || string.IsNullOrWhiteSpace(p.Name) || !System.Text.RegularExpressions.Regex.IsMatch(p.Name, @"^[A-Za-z\s]+$") ||  p.Price <= 0 || p.Quantity <= 0)         
                    {
                        continue;
                    }
                    db.Execute("UPDATE Products SET Name=@Name, Price=@Price, Quantity=@Quantity WHERE Id=@Id", p);
                }
            }
            return true;
        }
    }
}
