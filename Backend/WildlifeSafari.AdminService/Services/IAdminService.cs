using WildlifeSafari.Shared.DTOs;

namespace WildlifeSafari.AdminService.Services
{
    public interface IAdminService
    {
        // Wildlife Photos
        Task<List<WildlifePhotoDto>> GetAllPhotosAsync();
        Task<WildlifePhotoDto> CreatePhotoAsync(int adminId, CreateWildlifePhotoDto photoDto, byte[] imageData, string fileName, string contentType);
        Task<WildlifePhotoDto?> UpdatePhotoAsync(int photoId, CreateWildlifePhotoDto photoDto, byte[]? imageData, string? fileName, string? contentType);
        Task<bool> DeletePhotoAsync(int photoId);
        Task<(byte[] Data, string ContentType, string FileName)?> GetPhotoImageAsync(int photoId);

        // Booking Rates
        Task<List<BookingRateDto>> GetAllRatesAsync();
        Task<BookingRateDto> CreateRateAsync(int adminId, CreateBookingRateDto rateDto);
        Task<BookingRateDto?> UpdateRateAsync(int rateId, int adminId, CreateBookingRateDto rateDto);

        // Safari Slots
        Task<SafariSlotDto> CreateSlotAsync(CreateSafariSlotDto slotDto);
        Task<SafariSlotDto?> UpdateSlotAsync(int slotId, CreateSafariSlotDto slotDto);
        Task<bool> DeleteSlotAsync(int slotId);
    }
}
