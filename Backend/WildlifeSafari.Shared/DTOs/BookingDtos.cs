namespace WildlifeSafari.Shared.DTOs
{
    public class SafariSlotDto
    {
        public int SlotId { get; set; }
        public string SlotName { get; set; } = string.Empty;
        public DateTime SlotDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int MaxCapacity { get; set; }
        public int BookedCapacity { get; set; }
        public int AvailableCapacity { get; set; }
        public decimal PricePerPerson { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class CreateBookingDto
    {
        public int SlotId { get; set; }
        public int NumberOfPersons { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;
    }

    public class BookingDto
    {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int SlotId { get; set; }
        public string SlotName { get; set; } = string.Empty;
        public DateTime SlotDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int NumberOfPersons { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string PaymentTransactionId { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;
    }

    public class ProcessPaymentDto
    {
        public int BookingId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public string CardHolderName { get; set; } = string.Empty;
    }
}
