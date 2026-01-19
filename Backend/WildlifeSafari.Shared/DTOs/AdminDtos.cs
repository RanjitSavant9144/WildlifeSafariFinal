namespace WildlifeSafari.Shared.DTOs
{
    public class WildlifePhotoDto
    {
        public int PhotoId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? FileName { get; set; }
        public string? ImageContentType { get; set; }
        public bool HasImageData { get; set; }
        public string Category { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class CreateWildlifePhotoDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }

    public class BookingRateDto
    {
        public int RateId { get; set; }
        public string RateName { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateBookingRateDto
    {
        public string RateName { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class CreateSafariSlotDto
    {
        public string SlotName { get; set; } = string.Empty;
        public DateTime SlotDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int MaxCapacity { get; set; }
        public decimal PricePerPerson { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
