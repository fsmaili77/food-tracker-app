using Microsoft.EntityFrameworkCore;
using FoodTracker.Models;

namespace FoodTracker.Data
{
    public class FoodContext : DbContext
    {
        public FoodContext(DbContextOptions<FoodContext> options) : base(options) { }

        public DbSet<FoodItem> FoodItems { get; set; }
    }
}
