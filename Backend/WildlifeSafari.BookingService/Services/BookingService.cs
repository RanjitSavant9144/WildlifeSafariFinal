using Microsoft.EntityFrameworkCore;
using WildlifeSafari.Shared.Data;
using WildlifeSafari.Shared.DTOs;
using WildlifeSafari.Shared.Models;

namespace WildlifeSafari.BookingService.Services
{
    public class BookingService : IBookingService
    {
        private readonly WildlifeSafariDbContext _context;
        private readonly ILogger<BookingService> _logger;

        public BookingService(WildlifeSafariDbContext context, ILogger<BookingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<SafariSlotDto>> GetAvailableSlotsAsync(DateTime? fromDate)
        {
            var startDate = fromDate ?? DateTime.Today;
            
            var slots = await _context.SafariSlots
                .Where(s => s.IsActive && s.SlotDate >= startDate)
                .OrderBy(s => s.SlotDate)
                .ThenBy(s => s.StartTime)
                .Select(s => new SafariSlotDto
                {
                    SlotId = s.SlotId,
                    SlotName = s.SlotName,
                    SlotDate = s.SlotDate,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    MaxCapacity = s.MaxCapacity,
                    BookedCapacity = s.BookedCapacity,
                    AvailableCapacity = s.MaxCapacity - s.BookedCapacity,
                    PricePerPerson = s.PricePerPerson,
                    Description = s.Description,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            return slots;
        }

        public async Task<SafariSlotDto?> GetSlotByIdAsync(int slotId)
        {
            var slot = await _context.SafariSlots
                .Where(s => s.SlotId == slotId)
                .Select(s => new SafariSlotDto
                {
                    SlotId = s.SlotId,
                    SlotName = s.SlotName,
                    SlotDate = s.SlotDate,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    MaxCapacity = s.MaxCapacity,
                    BookedCapacity = s.BookedCapacity,
                    AvailableCapacity = s.MaxCapacity - s.BookedCapacity,
                    PricePerPerson = s.PricePerPerson,
                    Description = s.Description,
                    IsActive = s.IsActive
                })
                .FirstOrDefaultAsync();

            return slot;
        }

        public async Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto bookingDto)
        {
            // Get slot
            var slot = await _context.SafariSlots.FindAsync(bookingDto.SlotId);
            if (slot == null)
            {
                throw new Exception("Safari slot not found");
            }

            if (!slot.IsActive)
            {
                throw new Exception("Safari slot is not available");
            }

            // Check capacity
            if (slot.BookedCapacity + bookingDto.NumberOfPersons > slot.MaxCapacity)
            {
                throw new Exception("Not enough capacity available");
            }

            // Calculate total amount
            var totalAmount = slot.PricePerPerson * bookingDto.NumberOfPersons;

            // Create booking
            var booking = new Booking
            {
                UserId = userId,
                SlotId = bookingDto.SlotId,
                NumberOfPersons = bookingDto.NumberOfPersons,
                TotalAmount = totalAmount,
                BookingStatus = "Pending",
                PaymentStatus = "Pending",
                BookingDate = DateTime.UtcNow,
                SpecialRequests = bookingDto.SpecialRequests
            };

            _context.Bookings.Add(booking);

            // Update slot capacity
            slot.BookedCapacity += bookingDto.NumberOfPersons;

            await _context.SaveChangesAsync();

            return await GetBookingByIdAsync(booking.BookingId) 
                ?? throw new Exception("Error retrieving created booking");
        }

        public async Task<BookingDto?> ProcessPaymentAsync(int userId, ProcessPaymentDto paymentDto)
        {
            var booking = await _context.Bookings
                .Include(b => b.SafariSlot)
                .FirstOrDefaultAsync(b => b.BookingId == paymentDto.BookingId && b.UserId == userId);

            if (booking == null)
            {
                return null;
            }

            if (booking.PaymentStatus == "Completed")
            {
                throw new Exception("Payment already completed");
            }

            // Simulate payment processing
            // In real scenario, integrate with payment gateway
            var transactionId = $"TXN{DateTime.UtcNow.Ticks}";

            booking.PaymentStatus = "Completed";
            booking.BookingStatus = "Confirmed";
            booking.PaymentTransactionId = transactionId;
            booking.PaymentDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetBookingByIdAsync(booking.BookingId);
        }

        public async Task<List<BookingDto>> GetUserBookingsAsync(int userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.SafariSlot)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    UserName = b.User.FirstName + " " + b.User.LastName,
                    SlotId = b.SlotId,
                    SlotName = b.SafariSlot.SlotName,
                    SlotDate = b.SafariSlot.SlotDate,
                    StartTime = b.SafariSlot.StartTime,
                    EndTime = b.SafariSlot.EndTime,
                    NumberOfPersons = b.NumberOfPersons,
                    TotalAmount = b.TotalAmount,
                    BookingStatus = b.BookingStatus,
                    PaymentStatus = b.PaymentStatus,
                    PaymentTransactionId = b.PaymentTransactionId,
                    BookingDate = b.BookingDate,
                    PaymentDate = b.PaymentDate,
                    SpecialRequests = b.SpecialRequests
                })
                .ToListAsync();

            return bookings;
        }

        public async Task<BookingDto?> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.SafariSlot)
                .Where(b => b.BookingId == bookingId)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    UserName = b.User.FirstName + " " + b.User.LastName,
                    SlotId = b.SlotId,
                    SlotName = b.SafariSlot.SlotName,
                    SlotDate = b.SafariSlot.SlotDate,
                    StartTime = b.SafariSlot.StartTime,
                    EndTime = b.SafariSlot.EndTime,
                    NumberOfPersons = b.NumberOfPersons,
                    TotalAmount = b.TotalAmount,
                    BookingStatus = b.BookingStatus,
                    PaymentStatus = b.PaymentStatus,
                    PaymentTransactionId = b.PaymentTransactionId,
                    BookingDate = b.BookingDate,
                    PaymentDate = b.PaymentDate,
                    SpecialRequests = b.SpecialRequests
                })
                .FirstOrDefaultAsync();

            return booking;
        }

        public async Task<List<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.SafariSlot)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    UserName = b.User != null ? b.User.FirstName + " " + b.User.LastName : "Unknown User",
                    SlotId = b.SlotId,
                    SlotName = b.SafariSlot != null ? b.SafariSlot.SlotName : "Unknown Slot",
                    SlotDate = b.SafariSlot != null ? b.SafariSlot.SlotDate : DateTime.MinValue,
                    StartTime = b.SafariSlot != null ? b.SafariSlot.StartTime : TimeSpan.Zero,
                    EndTime = b.SafariSlot != null ? b.SafariSlot.EndTime : TimeSpan.Zero,
                    NumberOfPersons = b.NumberOfPersons,
                    TotalAmount = b.TotalAmount,
                    BookingStatus = b.BookingStatus ?? "Unknown",
                    PaymentStatus = b.PaymentStatus ?? "Unknown",
                    PaymentTransactionId = b.PaymentTransactionId ?? string.Empty,
                    BookingDate = b.BookingDate,
                    PaymentDate = b.PaymentDate,
                    SpecialRequests = b.SpecialRequests ?? string.Empty
                })
                .ToListAsync();

            return bookings;
        }

        public async Task<BookingDto?> CancelBookingAsync(int userId, int bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.SafariSlot)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId && b.UserId == userId);

            if (booking == null)
            {
                return null;
            }

            if (booking.BookingStatus == "Cancelled")
            {
                throw new Exception("Booking is already cancelled");
            }

            // Update booking status
            booking.BookingStatus = "Cancelled";

            // Release slot capacity
            booking.SafariSlot.BookedCapacity -= booking.NumberOfPersons;

            // Process refund if payment was completed
            if (booking.PaymentStatus == "Completed")
            {
                booking.PaymentStatus = "Refunded";
            }

            await _context.SaveChangesAsync();

            return await GetBookingByIdAsync(bookingId);
        }
    }
}
