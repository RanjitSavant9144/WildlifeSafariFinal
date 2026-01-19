# Wildlife Safari Booking Application

A comprehensive microservice-based web application for managing wildlife safari bookings.

## Architecture

This application follows a microservice architecture with:
- **Frontend**: React.js with TypeScript (Responsive UI)
- **Backend**: C# ASP.NET Core microservices
- **Database**: SQL Server Express with Entity Framework Core

## Project Structure

```
WildlifSafari/
├── Backend/
│   ├── WildlifeSafari.AuthService/        # Authentication & User Management
│   ├── WildlifeSafari.BookingService/     # Safari Slot Booking
│   ├── WildlifeSafari.AdminService/       # Admin Operations
│   ├── WildlifeSafari.Shared/             # Shared Models & Utilities
│   └── WildlifeSafari.Gateway/            # API Gateway (Optional)
├── Database/
│   ├── Migrations/                        # EF Core Migrations
│   ├── Scripts/                           # SQL Scripts
│   └── SeedData/                          # Test Data
└── Frontend/
    └── wildlife-safari-app/               # React TypeScript Application
```

## Features

### User Features
- User account creation and authentication
- Browse wildlife photos
- Explore available safari slots
- Book safari slots with advance payment
- View booking history

### Admin Features
- Secure admin-only access
- Upload and manage wildlife photos
- Configure booking rates
- Manage safari slots
- View all bookings

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm
- SQL Server Express
- Visual Studio 2022 or VS Code

### Backend Setup
```bash
cd Backend
dotnet restore
dotnet ef database update --project WildlifeSafari.Shared
dotnet run --project WildlifeSafari.AuthService
dotnet run --project WildlifeSafari.BookingService
dotnet run --project WildlifeSafari.AdminService
```

### Frontend Setup
```bash
cd Frontend/wildlife-safari-app
npm install
npm start
```

### Database Setup
```bash
cd Database/Scripts
# Run CreateDatabase.sql
# Run SeedData.sql
```

## Technology Stack

- **Frontend**: React 18, TypeScript, React Router, Axios, Material-UI
- **Backend**: ASP.NET Core 8, Entity Framework Core, JWT Authentication
- **Database**: SQL Server Express
- **Architecture**: Microservices, RESTful APIs

## Development Team

Built with clean code principles and best practices.

## License

Proprietary - Wildlife Safari Management System
