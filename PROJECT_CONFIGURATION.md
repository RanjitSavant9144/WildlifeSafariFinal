# Wildlife Safari Project Configuration

## Project Overview

**Project Name:** Wildlife Safari Booking Application  
**Type:** Microservice-based Full-Stack Application  
**Created:** 2026  
**Architecture:** Frontend-Backend-Database (3-tier with microservices)

---

## Technology Stack

### Backend
- **Framework:** ASP.NET Core 8.0
- **Language:** C#
- **Architecture:** Microservices (3 independent services)
- **API Documentation:** Swagger/OpenAPI
- **Authentication:** JWT Bearer Tokens
- **ORM:** Entity Framework Core 8.0

### Frontend
- **Framework:** React 18.2.0
- **Language:** TypeScript 4.9.5
- **Build Tool:** React Scripts 5.0.1
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **UI:** CSS (Custom)

### Database
- **DBMS:** SQL Server Express
- **Connection String:** `Server=.\\SQLEXPRESS;Database=WildlifeSafariDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true`
- **Migration Tool:** Entity Framework  Core Migrations

### Development Environment
- **.NET SDK:** 8.0+
- **Node.js:** 18.0+
- **npm:** 9.0+
- **Editor:** Visual Studio Code or Visual Studio 2022

---

## Project Structure

```
WildlifeSafariFinal/
├── Backend/
│   ├── WildlifeSafari.sln                    # Solution file
│   ├── WildlifeSafari.AuthService/           # Port: 5001
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   ├── WildlifeSafari.BookingService/        # Port: 5002
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   ├── WildlifeSafari.AdminService/          # Port: 5003
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   └── WildlifeSafari.Shared/
│       ├── Models/
│       ├── DTOs/
│       ├── Data/
│       └── WildlifeSafari.Shared.csproj
├── Frontend/
│   └── wildlife-safari-app/
│       ├── public/
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── context/
│       │   ├── services/
│       │   ├── App.tsx
│       │   └── index.tsx
│       ├── package.json
│       └── tsconfig.json
├── Database/
│   ├── Scripts/
│   │   ├── CreateDatabase.sql
│   │   ├── SeedData.sql
│   │   └── UpdatePhotoSchema.sql
│   └── ...
├── README.md
├── SETUP_GUIDE.md
└── PROJECT_CONFIGURATION.md (this file)
```

---

## Microservices

| Service | Port | Purpose | Database |
|---------|------|---------|----------|
| AuthService | 5001 | Authentication & User Management | WildlifeSafariDB |
| BookingService | 5002 | Safari Booking Management | WildlifeSafariDB |
| AdminService | 5003 | Admin Operations & Photo Management | WildlifeSafariDB |
| Shared | N/A | Shared Models, DTOs, and Utilities | N/A |

---

## Database Configuration

### Database Name
- `WildlifeSafariDB`

### Key Tables
- Users (Authentication)
- Bookings (Safari Bookings)
- SafariSlots (Available Slots)
- Photos (Wildlife Photos)
- Payments (Booking Payments)

### Setup Methods
1. **SQL Scripts (Recommended):**
   - `Database/Scripts/CreateDatabase.sql` - Creates database and schema
   - `Database/Scripts/SeedData.sql` - Populates test data
   - `Database/Scripts/UpdatePhotoSchema.sql` - Photo-related updates

2. **Entity Framework Migrations:**
   ```bash
   dotnet ef migrations add [MigrationName]
   dotnet ef database update
   ```

### Default Test Credentials
- **Admin Email:** admin@wildlifesafari.com
- **Admin Password:** Admin@123

---

## Build & Dependencies

### Backend Packages (NuGet)
- Microsoft.AspNetCore.Authentication.JwtBearer (8.0.0)
- Microsoft.EntityFrameworkCore.Design (8.0.0)
- Swashbuckle.AspNetCore (6.5.0)
- Microsoft.EntityFrameworkCore.SqlServer (8.0.0)

### Frontend Packages (npm)
- react (18.2.0)
- react-dom (18.2.0)
- typescript (4.9.5)
- axios (1.6.2)
- react-router-dom (6.20.1)

---

## Application Endpoints

### Backend Service URLs
- **AuthService:** `http://localhost:5001`
  - Swagger: `http://localhost:5001/swagger`
- **BookingService:** `http://localhost:5002`
  - Swagger: `http://localhost:5002/swagger`
- **AdminService:** `http://localhost:5003`
  - Swagger: `http://localhost:5003/swagger`

### Frontend
- **React App:** `http://localhost:3000`

---

## Build Commands

### Backend
```bash
# Restore dependencies
dotnet restore Backend/

# Build solution
dotnet build Backend/WildlifeSafari.sln

# Build individual service
dotnet build Backend/WildlifeSafari.AuthService/WildlifeSafari.AuthService.csproj

# Run individual service
dotnet run --project Backend/WildlifeSafari.AuthService/WildlifeSafari.AuthService.csproj
```

### Frontend
```bash
# Install dependencies
npm install --prefix Frontend/wildlife-safari-app

# Build for production
npm run build --prefix Frontend/wildlife-safari-app

# Start development server
npm start --prefix Frontend/wildlife-safari-app

# Run tests
npm test --prefix Frontend/wildlife-safari-app
```

### Database
```bash
# Create database
sqlcmd -S .\SQLEXPRESS -i Database\Scripts\CreateDatabase.sql

# Seed data
sqlcmd -S .\SQLEXPRESS -i Database\Scripts\SeedData.sql
```

---

## Features

### User Features
- ✅ User Registration & Authentication
- ✅ Browse Wildlife Photos
- ✅ View Available Safari Slots
- ✅ Book Safari Slots with Payment
- ✅ View Booking History
- ✅ Manage User Profile

### Admin Features
- ✅ Secure Admin-only Access
- ✅ Upload & Manage Wildlife Photos
- ✅ Configure Booking Rates
- ✅ Manage Safari Slots
- ✅ View All Bookings
- ✅ User Management

---

## Development Workflow

### Local Setup
1. Clone repository
2. Setup database (run SQL scripts)
3. Open Backend solution in Visual Studio
4. Restore NuGet packages
5. Open Frontend folder in VS Code
6. Run `npm install`
7. Start backend services (3 terminal windows)
8. Start frontend (`npm start`)

### Running the Application
1. **Terminal 1 - AuthService:**
   ```bash
   cd Backend/WildlifeSafari.AuthService
   dotnet run
   ```

2. **Terminal 2 - BookingService:**
   ```bash
   cd Backend/WildlifeSafari.BookingService
   dotnet run
   ```

3. **Terminal 3 - AdminService:**
   ```bash
   cd Backend/WildlifeSafari.AdminService
   dotnet run
   ```

4. **Terminal 4 - Frontend:**
   ```bash
   cd Frontend/wildlife-safari-app
   npm start
   ```

---

## Deployment Checklist

See `DEPLOYMENT_CHECKLIST.md` for detailed deployment instructions.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `SETUP_GUIDE.md` | Detailed local development setup |
| `DEPLOYMENT_CHECKLIST.md` | Production deployment steps |
| `README.md` | Project overview and features |
| `API_COLLECTION.http` | API endpoints for testing |
| `StartBackendServices.bat` | Batch script to start all backends |
| `StartFrontend.bat` | Batch script to start frontend |

---

## Performance Considerations

- **Database:** Indexed queries for optimal performance
- **Frontend:** React component lazy loading
- **Backend:** Microservices for independent scaling
- **Caching:** JWT token-based caching

---

## Security Features

- JWT Bearer token authentication
- Role-based access control (User/Admin)
- Secure password hashing
- HTTPS-ready configuration
- SQL Server trusted connections

---

## Documentation

- API Swagger/OpenAPI documentation available on each service
- Setup guide: `SETUP_GUIDE.md`
- Deployment guide: `DEPLOYMENT_CHECKLIST.md`
- Testing guide: `TESTING_ANALYSIS.md`

