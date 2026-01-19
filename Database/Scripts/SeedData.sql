-- Seed Data Script for Wildlife Safari Application
USE WildlifeSafariDB;
GO

-- Insert Admin User
-- Password: Admin@123 (hashed with BCrypt)
INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, PasswordHash, Role, IsActive, CreatedAt)
VALUES 
('Admin', 'User', 'admin@wildlifesafari.com', '1234567890', 
 '$2a$11$vZ3K5aQxJqJx5VqJxZqJxOqJxZqJxZqJxZqJxZqJxZqJxZqJxZqJx', 
 'Admin', 1, GETUTCDATE());
GO

-- Insert Test Users
-- Password: User@123 (you'll need to hash this properly)
INSERT INTO Users (FirstName, LastName, Email, PhoneNumber, PasswordHash, Role, IsActive, CreatedAt)
VALUES 
('John', 'Doe', 'john.doe@example.com', '9876543210', 
 '$2a$11$vZ3K5aQxJqJx5VqJxZqJxOqJxZqJxZqJxZqJxZqJxZqJxZqJxZqJx', 
 'User', 1, GETUTCDATE()),
('Jane', 'Smith', 'jane.smith@example.com', '9876543211', 
 '$2a$11$vZ3K5aQxJqJx5VqJxZqJxOqJxZqJxZqJxZqJxZqJxZqJxZqJxZqJx', 
 'User', 1, GETUTCDATE());
GO

-- Insert Booking Rates
INSERT INTO BookingRates (RateName, BasePrice, Description, IsActive, CreatedAt, UpdatedBy)
VALUES 
('Standard Safari', 50.00, 'Standard wildlife safari experience', 1, GETUTCDATE(), 1),
('Premium Safari', 100.00, 'Premium safari with expert guide', 1, GETUTCDATE(), 1),
('Family Package', 150.00, 'Special family package for 4 persons', 1, GETUTCDATE(), 1);
GO

-- Insert Safari Slots for next 7 days
DECLARE @i INT = 1;
DECLARE @SlotDate DATE;

WHILE @i <= 7
BEGIN
    SET @SlotDate = DATEADD(DAY, @i, CAST(GETDATE() AS DATE));
    
    -- Morning Slot
    INSERT INTO SafariSlots (SlotName, SlotDate, StartTime, EndTime, MaxCapacity, BookedCapacity, PricePerPerson, Description, IsActive, CreatedAt)
    VALUES 
    ('Morning Safari - ' + FORMAT(@SlotDate, 'MMM dd'), @SlotDate, '06:00:00', '09:00:00', 20, 0, 50.00, 
     'Early morning safari to spot wildlife', 1, GETUTCDATE());
    
    -- Evening Slot
    INSERT INTO SafariSlots (SlotName, SlotDate, StartTime, EndTime, MaxCapacity, BookedCapacity, PricePerPerson, Description, IsActive, CreatedAt)
    VALUES 
    ('Evening Safari - ' + FORMAT(@SlotDate, 'MMM dd'), @SlotDate, '16:00:00', '19:00:00', 20, 0, 50.00, 
     'Evening safari with sunset views', 1, GETUTCDATE());
    
    SET @i = @i + 1;
END
GO

-- Insert Wildlife Photos
INSERT INTO WildlifePhotos (Title, Description, ImageUrl, Category, DisplayOrder, IsActive, UploadedAt, UploadedBy)
VALUES 
('Bengal Tiger', 'Majestic Bengal Tiger in its natural habitat', 
 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800', 'Tiger', 1, 1, GETUTCDATE(), 1),
 
('Asian Elephant', 'Asian Elephant herd at the waterhole', 
 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800', 'Elephant', 2, 1, GETUTCDATE(), 1),
 
('Peacock Display', 'Beautiful peacock displaying its feathers', 
 'https://images.unsplash.com/photo-1598024055266-e772a5f8c128?w=800', 'Birds', 3, 1, GETUTCDATE(), 1),
 
('Leopard Resting', 'Leopard resting on a tree branch', 
 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800', 'Leopard', 4, 1, GETUTCDATE(), 1),
 
('Wild Deer', 'Spotted deer grazing in the forest', 
 'https://images.unsplash.com/photo-1551592485-f794217c3f82?w=800', 'Deer', 5, 1, GETUTCDATE(), 1),
 
('Indian Bison', 'Magnificent Indian Bison (Gaur)', 
 'https://images.unsplash.com/photo-1516642898521-7487451e13f4?w=800', 'Bison', 6, 1, GETUTCDATE(), 1);
GO

-- Insert Sample Bookings
INSERT INTO Bookings (UserId, SlotId, NumberOfPersons, TotalAmount, BookingStatus, PaymentStatus, PaymentTransactionId, BookingDate, PaymentDate)
VALUES 
(2, 1, 2, 100.00, 'Confirmed', 'Completed', 'TXN123456789', GETUTCDATE(), GETUTCDATE()),
(3, 2, 3, 150.00, 'Pending', 'Pending', NULL, GETUTCDATE(), NULL);
GO

-- Update booked capacity for slots with bookings
UPDATE SafariSlots 
SET BookedCapacity = 2
WHERE SlotId = 1;

UPDATE SafariSlots 
SET BookedCapacity = 3
WHERE SlotId = 2;
GO

PRINT 'Seed data inserted successfully!';
GO

-- Display summary
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL
SELECT 'SafariSlots', COUNT(*) FROM SafariSlots
UNION ALL
SELECT 'Bookings', COUNT(*) FROM Bookings
UNION ALL
SELECT 'WildlifePhotos', COUNT(*) FROM WildlifePhotos
UNION ALL
SELECT 'BookingRates', COUNT(*) FROM BookingRates;
GO
