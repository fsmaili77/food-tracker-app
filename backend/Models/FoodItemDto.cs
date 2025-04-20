using System;

namespace FoodTracker.Models
{
    public class FoodItemDto
    {
        public string? Name { get; set; }
        public DateTime ExpirationDate { get; set; }
    }
}
