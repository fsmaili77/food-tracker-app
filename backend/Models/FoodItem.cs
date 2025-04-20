using System;
using System.ComponentModel.DataAnnotations;

namespace FoodTracker.Models
{
    public class FoodItem
    {
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public DateTime ExpirationDate { get; set; }
    }
}
