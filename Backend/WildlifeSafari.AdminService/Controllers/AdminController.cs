using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WildlifeSafari.AdminService.Services;
using WildlifeSafari.Shared.DTOs;
using System.Security.Claims;

namespace WildlifeSafari.AdminService.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        // Wildlife Photos Management
        [HttpGet("photos")]
        [AllowAnonymous]
        public async Task<ActionResult<List<WildlifePhotoDto>>> GetAllPhotos()
        {
            try
            {
                var photos = await _adminService.GetAllPhotosAsync();
                return Ok(photos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching photos");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("photos/{photoId}/image")]
        [AllowAnonymous]
        public async Task<ActionResult> GetPhotoImage(int photoId)
        {
            try
            {
                var result = await _adminService.GetPhotoImageAsync(photoId);
                if (result == null)
                {
                    return NotFound(new { message = "Photo not found" });
                }

                return File(result.Value.Data, result.Value.ContentType, result.Value.FileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching photo image");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("photos")]
        public async Task<ActionResult<WildlifePhotoDto>> CreatePhoto([FromForm] CreateWildlifePhotoDto photoDto, [FromForm] IFormFile imageFile)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int adminId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                if (imageFile == null || imageFile.Length == 0)
                {
                    return BadRequest(new { message = "Image file is required" });
                }

                // Validate file type
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif" };
                if (!allowedTypes.Contains(imageFile.ContentType.ToLower()))
                {
                    return BadRequest(new { message = "Only JPEG, PNG, and GIF images are allowed" });
                }

                // Validate file size (max 5MB)
                if (imageFile.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "Image file size must not exceed 5MB" });
                }

                // Read image data
                byte[] imageData;
                using (var memoryStream = new MemoryStream())
                {
                    await imageFile.CopyToAsync(memoryStream);
                    imageData = memoryStream.ToArray();
                }

                var photo = await _adminService.CreatePhotoAsync(adminId, photoDto, imageData, imageFile.FileName, imageFile.ContentType);
                return Ok(photo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating photo");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("photos/{photoId}")]
        public async Task<ActionResult<WildlifePhotoDto>> UpdatePhoto(int photoId, [FromForm] CreateWildlifePhotoDto photoDto, [FromForm] IFormFile? imageFile)
        {
            try
            {
                byte[]? imageData = null;
                string? fileName = null;
                string? contentType = null;

                if (imageFile != null && imageFile.Length > 0)
                {
                    // Validate file type
                    var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif" };
                    if (!allowedTypes.Contains(imageFile.ContentType.ToLower()))
                    {
                        return BadRequest(new { message = "Only JPEG, PNG, and GIF images are allowed" });
                    }

                    // Validate file size (max 5MB)
                    if (imageFile.Length > 5 * 1024 * 1024)
                    {
                        return BadRequest(new { message = "Image file size must not exceed 5MB" });
                    }

                    using (var memoryStream = new MemoryStream())
                    {
                        await imageFile.CopyToAsync(memoryStream);
                        imageData = memoryStream.ToArray();
                    }
                    fileName = imageFile.FileName;
                    contentType = imageFile.ContentType;
                }

                var photo = await _adminService.UpdatePhotoAsync(photoId, photoDto, imageData, fileName, contentType);
                if (photo == null)
                {
                    return NotFound(new { message = "Photo not found" });
                }
                return Ok(photo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating photo");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("photos/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            try
            {
                var success = await _adminService.DeletePhotoAsync(photoId);
                if (!success)
                {
                    return NotFound(new { message = "Photo not found" });
                }
                return Ok(new { message = "Photo deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting photo");
                return BadRequest(new { message = ex.Message });
            }
        }

        // Booking Rates Management
        [HttpGet("rates")]
        [AllowAnonymous]
        public async Task<ActionResult<List<BookingRateDto>>> GetAllRates()
        {
            try
            {
                var rates = await _adminService.GetAllRatesAsync();
                return Ok(rates);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching rates");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("rates")]
        public async Task<ActionResult<BookingRateDto>> CreateRate([FromBody] CreateBookingRateDto rateDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int adminId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var rate = await _adminService.CreateRateAsync(adminId, rateDto);
                return Ok(rate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating rate");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("rates/{rateId}")]
        public async Task<ActionResult<BookingRateDto>> UpdateRate(int rateId, [FromBody] CreateBookingRateDto rateDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int adminId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var rate = await _adminService.UpdateRateAsync(rateId, adminId, rateDto);
                if (rate == null)
                {
                    return NotFound(new { message = "Rate not found" });
                }
                return Ok(rate);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating rate");
                return BadRequest(new { message = ex.Message });
            }
        }

        // Safari Slots Management
        [HttpPost("slots")]
        public async Task<ActionResult<SafariSlotDto>> CreateSlot([FromBody] CreateSafariSlotDto slotDto)
        {
            try
            {
                var slot = await _adminService.CreateSlotAsync(slotDto);
                return Ok(slot);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating slot");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("slots/{slotId}")]
        public async Task<ActionResult<SafariSlotDto>> UpdateSlot(int slotId, [FromBody] CreateSafariSlotDto slotDto)
        {
            try
            {
                var slot = await _adminService.UpdateSlotAsync(slotId, slotDto);
                if (slot == null)
                {
                    return NotFound(new { message = "Slot not found" });
                }
                return Ok(slot);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating slot");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("slots/{slotId}")]
        public async Task<ActionResult> DeleteSlot(int slotId)
        {
            try
            {
                var success = await _adminService.DeleteSlotAsync(slotId);
                if (!success)
                {
                    return NotFound(new { message = "Slot not found" });
                }
                return Ok(new { message = "Slot deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting slot");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
