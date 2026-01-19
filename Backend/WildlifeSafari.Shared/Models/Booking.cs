using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WildlifeSafari.Shared.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int SlotId { get; set; }

        [Required]
        public int NumberOfPersons { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(50)]
        public string BookingStatus { get; set; } = "Pending"; // Pending, Confirmed, Cancelled

        [Required]
        [MaxLength(50)]
        public string PaymentStatus { get; set; } = "Pending"; // Pending, Completed, Refunded

        [MaxLength(100)]
        public string PaymentTransactionId { get; set; } = string.Empty;

        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        public DateTime? PaymentDate { get; set; }

        [MaxLength(500)]
        public string SpecialRequests { get; set; } = string.Empty;

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("SlotId")]
        public virtual SafariSlot SafariSlot { get; set; } = null!;
    }
}
