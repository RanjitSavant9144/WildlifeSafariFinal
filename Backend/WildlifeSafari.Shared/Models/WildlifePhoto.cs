using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WildlifeSafari.Shared.Models
{
    public class WildlifePhoto
    {
        [Key]
        public int PhotoId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        // Image stored as binary data
        public byte[]? ImageData { get; set; }

        [MaxLength(100)]
        public string? ImageContentType { get; set; } // e.g., image/jpeg, image/png

        [MaxLength(200)]
        public string? FileName { get; set; }

        // Keep ImageUrl for backward compatibility (optional)
        public string? ImageUrl { get; set; }

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty; // e.g., Tiger, Elephant, Birds

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        public int UploadedBy { get; set; } // Admin User ID
    }
}
