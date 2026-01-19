-- Wildlife Safari Database Creation Script
-- SQL Server Express Database

USE master;
GO

-- Drop database if exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'WildlifeSafariDB')
BEGIN
    ALTER DATABASE WildlifeSafariDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE WildlifeSafariDB;
END
GO

-- Create database
CREATE DATABASE WildlifeSafariDB;
GO

USE WildlifeSafariDB;
GO

-- Users Table
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'User',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    IsActive BIT NOT NULL DEFAULT 1
);
GO

-- Safari Slots Table
CREATE TABLE SafariSlots (
    SlotId INT PRIMARY KEY IDENTITY(1,1),
    SlotName NVARCHAR(200) NOT NULL,
    SlotDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    MaxCapacity INT NOT NULL,
    BookedCapacity INT NOT NULL DEFAULT 0,
    PricePerPerson DECIMAL(18,2) NOT NULL,
    Description NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- Create index on SlotDate and StartTime
CREATE INDEX IX_SafariSlots_SlotDate_StartTime ON SafariSlots(SlotDate, StartTime);
GO

-- Bookings Table
CREATE TABLE Bookings (
    BookingId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    SlotId INT NOT NULL,
    NumberOfPersons INT NOT NULL,
    TotalAmount DECIMAL(18,2) NOT NULL,
    BookingStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    PaymentStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    PaymentTransactionId NVARCHAR(100) NULL,
    BookingDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    PaymentDate DATETIME2 NULL,
    SpecialRequests NVARCHAR(500) NULL,
    CONSTRAINT FK_Bookings_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_Bookings_SafariSlots FOREIGN KEY (SlotId) REFERENCES SafariSlots(SlotId)
);
GO

-- Wildlife Photos Table
CREATE TABLE WildlifePhotos (
    PhotoId INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500) NULL,
    ImageUrl NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(100) NULL,
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UploadedBy INT NOT NULL
);
GO

CREATE INDEX IX_WildlifePhotos_DisplayOrder ON WildlifePhotos(DisplayOrder);
GO

-- Booking Rates Table
CREATE TABLE BookingRates (
    RateId INT PRIMARY KEY IDENTITY(1,1),
    RateName NVARCHAR(100) NOT NULL,
    BasePrice DECIMAL(18,2) NOT NULL,
    Description NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    UpdatedBy INT NOT NULL
);
GO

PRINT 'Database created successfully!';
GO
