using WildlifeSafari.Shared.DTOs;

namespace WildlifeSafari.BookingService.Services
{
    public interface IBookingService
    {
        Task<List<SafariSlotDto>> GetAvailableSlotsAsync(DateTime? fromDate);
        Task<SafariSlotDto?> GetSlotByIdAsync(int slotId);
        Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto bookingDto);
        Task<BookingDto?> ProcessPaymentAsync(int userId, ProcessPaymentDto paymentDto);
        Task<List<BookingDto>> GetUserBookingsAsync(int userId);
        Task<BookingDto?> GetBookingByIdAsync(int bookingId);
        Task<List<BookingDto>> GetAllBookingsAsync();
        Task<BookingDto?> CancelBookingAsync(int userId, int bookingId);
    }
}
