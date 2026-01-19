using Microsoft.EntityFrameworkCore;
using WildlifeSafari.Shared.Models;

namespace WildlifeSafari.Shared.Data
{
    public class WildlifeSafariDbContext : DbContext
    {
        public WildlifeSafariDbContext(DbContextOptions<WildlifeSafariDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<SafariSlot> SafariSlots { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<WildlifePhoto> WildlifePhotos { get; set; }
        public DbSet<BookingRate> BookingRates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Role).HasDefaultValue("User");
            });

            // SafariSlot Configuration
            modelBuilder.Entity<SafariSlot>(entity =>
            {
                entity.HasIndex(e => new { e.SlotDate, e.StartTime });
                entity.Property(e => e.PricePerPerson).HasPrecision(18, 2);
            });

            // Booking Configuration
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasOne(b => b.User)
                      .WithMany(u => u.Bookings)
                      .HasForeignKey(b => b.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(b => b.SafariSlot)
                      .WithMany(s => s.Bookings)
                      .HasForeignKey(b => b.SlotId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            });

            // WildlifePhoto Configuration
            modelBuilder.Entity<WildlifePhoto>(entity =>
            {
                entity.HasIndex(e => e.DisplayOrder);
            });

            // BookingRate Configuration
            modelBuilder.Entity<BookingRate>(entity =>
            {
                entity.Property(e => e.BasePrice).HasPrecision(18, 2);
            });

            // Seed Data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Admin User
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = 1,
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@wildlifesafari.com",
                    PhoneNumber = "1234567890",
                    PasswordHash = "$2a$11$vZ3K5aQxJqJx5VqJxZqJxOqJxZqJxZqJxZqJxZqJxZqJxZqJxZqJx", // Password: Admin@123
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed Booking Rates
            modelBuilder.Entity<BookingRate>().HasData(
                new BookingRate
                {
                    RateId = 1,
                    RateName = "Standard Safari",
                    BasePrice = 50.00m,
                    Description = "Standard wildlife safari experience",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedBy = 1
                },
                new BookingRate
                {
                    RateId = 2,
                    RateName = "Premium Safari",
                    BasePrice = 100.00m,
                    Description = "Premium safari with expert guide",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedBy = 1
                }
            );

            // Seed Safari Slots (Next 7 days)
            var slots = new List<SafariSlot>();
            for (int i = 0; i < 7; i++)
            {
                var date = DateTime.Today.AddDays(i + 1);
                
                // Morning Slot
                slots.Add(new SafariSlot
                {
                    SlotId = (i * 2) + 1,
                    SlotName = $"Morning Safari - {date:MMM dd}",
                    SlotDate = date,
                    StartTime = new TimeSpan(6, 0, 0),
                    EndTime = new TimeSpan(9, 0, 0),
                    MaxCapacity = 20,
                    BookedCapacity = 0,
                    PricePerPerson = 50.00m,
                    Description = "Early morning safari to spot wildlife",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                });

                // Evening Slot
                slots.Add(new SafariSlot
                {
                    SlotId = (i * 2) + 2,
                    SlotName = $"Evening Safari - {date:MMM dd}",
                    SlotDate = date,
                    StartTime = new TimeSpan(16, 0, 0),
                    EndTime = new TimeSpan(19, 0, 0),
                    MaxCapacity = 20,
                    BookedCapacity = 0,
                    PricePerPerson = 50.00m,
                    Description = "Evening safari with sunset views",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                });
            }

            modelBuilder.Entity<SafariSlot>().HasData(slots);

            // Seed Wildlife Photos
            modelBuilder.Entity<WildlifePhoto>().HasData(
                new WildlifePhoto
                {
                    PhotoId = 1,
                    Title = "Bengal Tiger",
                    Description = "Majestic Bengal Tiger in its natural habitat",
                    ImageUrl = "/images/tiger.jpg",
                    Category = "Tiger",
                    DisplayOrder = 1,
                    IsActive = true,
                    UploadedAt = DateTime.UtcNow,
                    UploadedBy = 1
                },
                new WildlifePhoto
                {
                    PhotoId = 2,
                    Title = "Asian Elephant",
                    Description = "Asian Elephant herd at the waterhole",
                    ImageUrl = "/images/elephant.jpg",
                    Category = "Elephant",
                    DisplayOrder = 2,
                    IsActive = true,
                    UploadedAt = DateTime.UtcNow,
                    UploadedBy = 1
                },
                new WildlifePhoto
                {
                    PhotoId = 3,
                    Title = "Peacock Display",
                    Description = "Beautiful peacock displaying its feathers",
                    ImageUrl = "/images/peacock.jpg",
                    Category = "Birds",
                    DisplayOrder = 3,
                    IsActive = true,
                    UploadedAt = DateTime.UtcNow,
                    UploadedBy = 1
                }
            );
        }
    }
}
