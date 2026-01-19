# Wildlife Safari Booking Application - Setup Guide

## Prerequisites

Before setting up the application, ensure you have the following installed:

1. **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
2. **Node.js 18+** and **npm** - [Download](https://nodejs.org/)
3. **SQL Server Express** - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
4. **Visual Studio 2022** or **VS Code** - [Download VS Code](https://code.visualstudio.com/)

## Step-by-Step Setup Instructions

### 1. Database Setup

#### Option A: Using SQL Scripts (Recommended)

1. Open **SQL Server Management Studio (SSMS)** or **Azure Data Studio**
2. Connect to your SQL Server Express instance: `.\\SQLEXPRESS`
3. Open and execute: `Database\Scripts\CreateDatabase.sql`
4. Open and execute: `Database\Scripts\SeedData.sql`

#### Option B: Using Entity Framework Migrations

1. Open a terminal in the `Backend\WildlifeSafari.Shared` directory
2. Run the following commands:

```bash
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**Note:** The connection string is configured in `appsettings.json` of each service:
```
Server=.\\SQLEXPRESS;Database=WildlifeSafariDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true
```

### 2. Backend Services Setup

The application consists of 3 microservices that need to run simultaneously:

#### Service 1: Authentication Service (Port 5001)

```bash
cd Backend\WildlifeSafari.AuthService
dotnet restore
dotnet build
dotnet run
```

The service will be available at: `http://localhost:5001`
Swagger UI: `http://localhost:5001/swagger`

#### Service 2: Booking Service (Port 5002)

Open a **NEW terminal window**:

```bash
cd Backend\WildlifeSafari.BookingService
dotnet restore
dotnet build
dotnet run
```

The service will be available at: `http://localhost:5002`
Swagger UI: `http://localhost:5002/swagger`

#### Service 3: Admin Service (Port 5003)

Open another **NEW terminal window**:

```bash
cd Backend\WildlifeSafari.AdminService
dotnet restore
dotnet build
dotnet run
```

The service will be available at: `http://localhost:5003`
Swagger UI: `http://localhost:5003/swagger`

### 3. Frontend Setup

Open a **NEW terminal window**:

```bash
cd Frontend\wildlife-safari-app
npm install
npm start
```

The React application will open automatically at: `http://localhost:3000`

## Default Credentials

### Admin User
- **Email:** admin@wildlifesafari.com
- **Password:** Admin@123

### Test Users
- **Email:** john.doe@example.com
- **Password:** User@123

- **Email:** jane.smith@example.com
- **Password:** User@123

## Application Structure

### Backend Services

**WildlifeSafari.Shared** (Port: N/A)
- Contains shared models, DTOs, and DbContext
- Referenced by all microservices

**WildlifeSafari.AuthService** (Port: 5001)
- User registration and authentication
- JWT token generation
- User management

**WildlifeSafari.BookingService** (Port: 5002)
- Safari slot management
- Booking creation and management
- Payment processing
- User booking history

**WildlifeSafari.AdminService** (Port: 5003)
- Wildlife photo management
- Booking rate configuration
- Safari slot creation and management
- Admin-only operations

### Frontend Application

**React TypeScript SPA** (Port: 3000)
- User authentication (login/register)
- Homepage with wildlife photos
- Safari slot browsing and booking
- Payment processing interface
- User booking history
- Admin dashboard

## Testing the Application

### 1. Test User Registration
1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form
3. Click "Register"
4. You should be automatically logged in

### 2. Test Safari Booking
1. Login with test credentials
2. Click "Book Safari" in the navigation
3. Select an available slot
4. Enter number of persons
5. Click "Confirm Booking"
6. Complete payment in "My Bookings" section

### 3. Test Admin Features
1. Login with admin credentials
2. Click "Admin" in the navigation
3. Test the following:
   - View all bookings
   - Add/delete wildlife photos
   - Configure booking rates
   - Create new safari slots

## API Endpoints

### Authentication Service (Port 5001)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | User login | No |
| GET | /api/auth/users/{id} | Get user by ID | Yes |
| GET | /api/auth/users | Get all users | Yes |

### Booking Service (Port 5002)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/booking/slots | Get available slots | No |
| GET | /api/booking/slots/{id} | Get slot by ID | No |
| POST | /api/booking/create | Create booking | Yes (User) |
| POST | /api/booking/payment | Process payment | Yes (User) |
| GET | /api/booking/user/bookings | Get user bookings | Yes (User) |
| GET | /api/booking/bookings/{id} | Get booking by ID | Yes |
| GET | /api/booking/all | Get all bookings | Yes (Admin) |
| PUT | /api/booking/cancel/{id} | Cancel booking | Yes (User) |

### Admin Service (Port 5003)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/admin/photos | Get all photos | No |
| POST | /api/admin/photos | Create photo | Yes (Admin) |
| PUT | /api/admin/photos/{id} | Update photo | Yes (Admin) |
| DELETE | /api/admin/photos/{id} | Delete photo | Yes (Admin) |
| GET | /api/admin/rates | Get all rates | No |
| POST | /api/admin/rates | Create rate | Yes (Admin) |
| PUT | /api/admin/rates/{id} | Update rate | Yes (Admin) |
| POST | /api/admin/slots | Create slot | Yes (Admin) |
| PUT | /api/admin/slots/{id} | Update slot | Yes (Admin) |
| DELETE | /api/admin/slots/{id} | Delete slot | Yes (Admin) |

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify SQL Server Express is running:
   - Open Services (services.msc)
   - Look for "SQL Server (SQLEXPRESS)"
   - Ensure it's running

2. Check connection string in `appsettings.json` files
3. Update the connection string if your SQL Server instance name is different

### Port Already in Use

If ports 5001, 5002, 5003, or 3000 are already in use:

1. For backend services, update the `Urls` setting in `appsettings.json`
2. For frontend, set the PORT environment variable:
   ```bash
   $env:PORT=3001
   npm start
   ```
3. Update API URLs in `Frontend\wildlife-safari-app\src\services\api.ts`

### CORS Issues

If you encounter CORS errors:
- Ensure all backend services are running
- Check that CORS is enabled in each service's `Program.cs`
- Verify API URLs in the frontend match the running services

### Migration Issues

If Entity Framework migrations fail:

```bash
cd Backend\WildlifeSafari.Shared
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Project Features Checklist

✅ User account creation and authentication
✅ Admin module with role-based access control
✅ Admin can upload and manage wildlife photos
✅ Admin can configure booking rates
✅ Users can explore available safari slots
✅ Users can book safari slots
✅ Payment processing functionality
✅ Database migrations and seed data
✅ Responsive web design
✅ Clean code architecture with separate repositories
✅ DBContext for CRUD operations

## Technology Stack

- **Frontend:** React 18, TypeScript, React Router, Axios
- **Backend:** ASP.NET Core 8, C#
- **Database:** SQL Server Express, Entity Framework Core 8
- **Authentication:** JWT Bearer Tokens
- **Architecture:** Microservices

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation using Swagger UI
3. Check application logs in the terminal windows

## Next Steps

1. Customize wildlife photos with your own images
2. Configure email notifications for bookings
3. Integrate a real payment gateway
4. Add more safari packages and pricing tiers
5. Implement advanced search and filtering
6. Add reviews and ratings system
