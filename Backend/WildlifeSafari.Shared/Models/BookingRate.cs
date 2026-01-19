using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WildlifeSafari.Shared.Models
{
    public class BookingRate
    {
        [Key]
        public int RateId { get; set; }

        [Required]
        [MaxLength(100)]
        public string RateName { get; set; } = string.Empty; // e.g., "Standard Safari", "Premium Safari"

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal BasePrice { get; set; }

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public int UpdatedBy { get; set; } // Admin User ID
    }
}
