-- Update Wildlife Photos table to support binary image storage
USE WildlifeSafariDB;
GO

-- Add new columns for binary storage
ALTER TABLE WildlifePhotos
ADD ImageData VARBINARY(MAX) NULL,
    ImageContentType NVARCHAR(100) NULL,
    FileName NVARCHAR(200) NULL;
GO

-- Make ImageUrl nullable since we'll use binary storage
ALTER TABLE WildlifePhotos
ALTER COLUMN ImageUrl NVARCHAR(MAX) NULL;
GO

-- Update existing records to maintain backward compatibility
UPDATE WildlifePhotos
SET ImageContentType = 'image/jpeg',
    FileName = 'placeholder.jpg'
WHERE ImageUrl IS NOT NULL AND ImageData IS NULL;
GO

PRINT 'Wildlife Photos table updated successfully for binary image storage!';
GO

-- Display updated schema
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'WildlifePhotos'
ORDER BY ORDINAL_POSITION;
GO
