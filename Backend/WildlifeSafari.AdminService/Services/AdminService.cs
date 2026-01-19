using Microsoft.EntityFrameworkCore;
using WildlifeSafari.Shared.Data;
using WildlifeSafari.Shared.DTOs;
using WildlifeSafari.Shared.Models;

namespace WildlifeSafari.AdminService.Services
{
    public class AdminService : IAdminService
    {
        private readonly WildlifeSafariDbContext _context;
        private readonly ILogger<AdminService> _logger;

        public AdminService(WildlifeSafariDbContext context, ILogger<AdminService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Wildlife Photos Management
        public async Task<List<WildlifePhotoDto>> GetAllPhotosAsync()
        {
            var photos = await _context.WildlifePhotos
                .Where(p => p.IsActive)
                .OrderBy(p => p.DisplayOrder)
                .Select(p => new WildlifePhotoDto
                {
                    PhotoId = p.PhotoId,
                    Title = p.Title,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                    FileName = p.FileName,
                    ImageContentType = p.ImageContentType,
                    HasImageData = p.ImageData != null,
                    Category = p.Category,
                    DisplayOrder = p.DisplayOrder,
                    IsActive = p.IsActive,
                    UploadedAt = p.UploadedAt
                })
                .ToListAsync();

            return photos;
        }

        public async Task<WildlifePhotoDto> CreatePhotoAsync(int adminId, CreateWildlifePhotoDto photoDto, byte[] imageData, string fileName, string contentType)
        {
            var photo = new WildlifePhoto
            {
                Title = photoDto.Title,
                Description = photoDto.Description,
                ImageData = imageData,
                FileName = fileName,
                ImageContentType = contentType,
                Category = photoDto.Category,
                DisplayOrder = photoDto.DisplayOrder,
                IsActive = true,
                UploadedAt = DateTime.UtcNow,
                UploadedBy = adminId
            };

            _context.WildlifePhotos.Add(photo);
            await _context.SaveChangesAsync();

            return new WildlifePhotoDto
            {
                PhotoId = photo.PhotoId,
                Title = photo.Title,
                Description = photo.Description,
                FileName = photo.FileName,
                ImageContentType = photo.ImageContentType,
                HasImageData = true,
                Category = photo.Category,
                DisplayOrder = photo.DisplayOrder,
                IsActive = photo.IsActive,
                UploadedAt = photo.UploadedAt
            };
        }

        public async Task<WildlifePhotoDto?> UpdatePhotoAsync(int photoId, CreateWildlifePhotoDto photoDto, byte[]? imageData, string? fileName, string? contentType)
        {
            var photo = await _context.WildlifePhotos.FindAsync(photoId);
            if (photo == null)
            {
                return null;
            }

            photo.Title = photoDto.Title;
            photo.Description = photoDto.Description;
            photo.Category = photoDto.Category;
            photo.DisplayOrder = photoDto.DisplayOrder;

            // Update image data if provided
            if (imageData != null && imageData.Length > 0)
            {
                photo.ImageData = imageData;
                photo.FileName = fileName;
                photo.ImageContentType = contentType;
            }

            await _context.SaveChangesAsync();

            return new WildlifePhotoDto
            {
                PhotoId = photo.PhotoId,
                Title = photo.Title,
                Description = photo.Description,
                FileName = photo.FileName,
                ImageContentType = photo.ImageContentType,
                HasImageData = photo.ImageData != null,
                Category = photo.Category,
                DisplayOrder = photo.DisplayOrder,
                IsActive = photo.IsActive,
                UploadedAt = photo.UploadedAt
            };
        }

        public async Task<(byte[] Data, string ContentType, string FileName)?> GetPhotoImageAsync(int photoId)
        {
            var photo = await _context.WildlifePhotos
                .Where(p => p.PhotoId == photoId && p.IsActive)
                .Select(p => new { p.ImageData, p.ImageContentType, p.FileName })
                .FirstOrDefaultAsync();

            if (photo == null || photo.ImageData == null)
            {
                return null;
            }

            return (photo.ImageData, photo.ImageContentType ?? "image/jpeg", photo.FileName ?? "photo.jpg");
        }

        public async Task<bool> DeletePhotoAsync(int photoId)
        {
            var photo = await _context.WildlifePhotos.FindAsync(photoId);
            if (photo == null)
            {
                return false;
            }

            photo.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        // Booking Rates Management
        public async Task<List<BookingRateDto>> GetAllRatesAsync()
        {
            var rates = await _context.BookingRates
                .Where(r => r.IsActive)
                .OrderBy(r => r.BasePrice)
                .Select(r => new BookingRateDto
                {
                    RateId = r.RateId,
                    RateName = r.RateName,
                    BasePrice = r.BasePrice,
                    Description = r.Description,
                    IsActive = r.IsActive
                })
                .ToListAsync();

            return rates;
        }

        public async Task<BookingRateDto> CreateRateAsync(int adminId, CreateBookingRateDto rateDto)
        {
            var rate = new BookingRate
            {
                RateName = rateDto.RateName,
                BasePrice = rateDto.BasePrice,
                Description = rateDto.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedBy = adminId
            };

            _context.BookingRates.Add(rate);
            await _context.SaveChangesAsync();

            return new BookingRateDto
            {
                RateId = rate.RateId,
                RateName = rate.RateName,
                BasePrice = rate.BasePrice,
                Description = rate.Description,
                IsActive = rate.IsActive
            };
        }

        public async Task<BookingRateDto?> UpdateRateAsync(int rateId, int adminId, CreateBookingRateDto rateDto)
        {
            var rate = await _context.BookingRates.FindAsync(rateId);
            if (rate == null)
            {
                return null;
            }

            rate.RateName = rateDto.RateName;
            rate.BasePrice = rateDto.BasePrice;
            rate.Description = rateDto.Description;
            rate.UpdatedAt = DateTime.UtcNow;
            rate.UpdatedBy = adminId;

            await _context.SaveChangesAsync();

            return new BookingRateDto
            {
                RateId = rate.RateId,
                RateName = rate.RateName,
                BasePrice = rate.BasePrice,
                Description = rate.Description,
                IsActive = rate.IsActive
            };
        }

        // Safari Slots Management
        public async Task<SafariSlotDto> CreateSlotAsync(CreateSafariSlotDto slotDto)
        {
            var slot = new SafariSlot
            {
                SlotName = slotDto.SlotName,
                SlotDate = slotDto.SlotDate,
                StartTime = slotDto.StartTime,
                EndTime = slotDto.EndTime,
                MaxCapacity = slotDto.MaxCapacity,
                BookedCapacity = 0,
                PricePerPerson = slotDto.PricePerPerson,
                Description = slotDto.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.SafariSlots.Add(slot);
            await _context.SaveChangesAsync();

            return new SafariSlotDto
            {
                SlotId = slot.SlotId,
                SlotName = slot.SlotName,
                SlotDate = slot.SlotDate,
                StartTime = slot.StartTime,
                EndTime = slot.EndTime,
                MaxCapacity = slot.MaxCapacity,
                BookedCapacity = slot.BookedCapacity,
                AvailableCapacity = slot.MaxCapacity - slot.BookedCapacity,
                PricePerPerson = slot.PricePerPerson,
                Description = slot.Description,
                IsActive = slot.IsActive
            };
        }

        public async Task<SafariSlotDto?> UpdateSlotAsync(int slotId, CreateSafariSlotDto slotDto)
        {
            var slot = await _context.SafariSlots.FindAsync(slotId);
            if (slot == null)
            {
                return null;
            }

            slot.SlotName = slotDto.SlotName;
            slot.SlotDate = slotDto.SlotDate;
            slot.StartTime = slotDto.StartTime;
            slot.EndTime = slotDto.EndTime;
            slot.MaxCapacity = slotDto.MaxCapacity;
            slot.PricePerPerson = slotDto.PricePerPerson;
            slot.Description = slotDto.Description;

            await _context.SaveChangesAsync();

            return new SafariSlotDto
            {
                SlotId = slot.SlotId,
                SlotName = slot.SlotName,
                SlotDate = slot.SlotDate,
                StartTime = slot.StartTime,
                EndTime = slot.EndTime,
                MaxCapacity = slot.MaxCapacity,
                BookedCapacity = slot.BookedCapacity,
                AvailableCapacity = slot.MaxCapacity - slot.BookedCapacity,
                PricePerPerson = slot.PricePerPerson,
                Description = slot.Description,
                IsActive = slot.IsActive
            };
        }

        public async Task<bool> DeleteSlotAsync(int slotId)
        {
            var slot = await _context.SafariSlots.FindAsync(slotId);
            if (slot == null)
            {
                return false;
            }

            // Only allow deletion if no bookings exist
            var hasBookings = await _context.Bookings.AnyAsync(b => b.SlotId == slotId);
            if (hasBookings)
            {
                throw new Exception("Cannot delete slot with existing bookings");
            }

            slot.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
