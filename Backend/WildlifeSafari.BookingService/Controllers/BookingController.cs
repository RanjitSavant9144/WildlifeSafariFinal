using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WildlifeSafari.BookingService.Services;
using WildlifeSafari.Shared.DTOs;
using System.Security.Claims;

namespace WildlifeSafari.BookingService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ILogger<BookingController> _logger;

        public BookingController(IBookingService bookingService, ILogger<BookingController> logger)
        {
            _bookingService = bookingService;
            _logger = logger;
        }

        [HttpGet("slots")]
        public async Task<ActionResult<List<SafariSlotDto>>> GetAvailableSlots([FromQuery] DateTime? fromDate)
        {
            try
            {
                var slots = await _bookingService.GetAvailableSlotsAsync(fromDate);
                return Ok(slots);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching available slots");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("slots/{slotId}")]
        public async Task<ActionResult<SafariSlotDto>> GetSlotById(int slotId)
        {
            try
            {
                var slot = await _bookingService.GetSlotByIdAsync(slotId);
                if (slot == null)
                {
                    return NotFound(new { message = "Slot not found" });
                }
                return Ok(slot);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching slot");
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] CreateBookingDto bookingDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var booking = await _bookingService.CreateBookingAsync(userId, bookingDto);
                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking");
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("payment")]
        public async Task<ActionResult<BookingDto>> ProcessPayment([FromBody] ProcessPaymentDto paymentDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var booking = await _bookingService.ProcessPaymentAsync(userId, paymentDto);
                if (booking == null)
                {
                    return NotFound(new { message = "Booking not found" });
                }
                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment");
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("user/bookings")]
        public async Task<ActionResult<List<BookingDto>>> GetUserBookings()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var bookings = await _bookingService.GetUserBookingsAsync(userId);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user bookings");
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("bookings/{bookingId}")]
        public async Task<ActionResult<BookingDto>> GetBookingById(int bookingId)
        {
            try
            {
                var booking = await _bookingService.GetBookingByIdAsync(bookingId);
                if (booking == null)
                {
                    return NotFound(new { message = "Booking not found" });
                }
                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching booking");
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<List<BookingDto>>> GetAllBookings()
        {
            try
            {
                var bookings = await _bookingService.GetAllBookingsAsync();
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all bookings");
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("cancel/{bookingId}")]
        public async Task<ActionResult<BookingDto>> CancelBooking(int bookingId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var booking = await _bookingService.CancelBookingAsync(userId, bookingId);
                if (booking == null)
                {
                    return NotFound(new { message = "Booking not found" });
                }
                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling booking");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
