# Wildlife Safari Application - Quick Start Checklist

## Pre-Deployment Checklist

### Prerequisites Verification
- [ ] .NET 8.0 SDK installed
- [ ] Node.js 18+ and npm installed
- [ ] SQL Server Express installed and running
- [ ] Visual Studio Code or Visual Studio 2022 installed

## Deployment Steps

### Step 1: Database Setup (5 minutes)

1. Open SQL Server  Management Studio (SSMS) or Azure Data Studio
2. Connect to: `.\SQLEXPRESS`
3. Execute scripts in order:
   ```
   ✓ Database\Scripts\CreateDatabase.sql
   ✓ Database\Scripts\SeedData.sql
   ```
4. Verify database created:
   ```sql
   USE WildlifeSafariDB;
   SELECT COUNT(*) FROM Users; -- Should return 3
   ```

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

---

### Step 2: Backend Services Setup (10 minutes)

#### Terminal 1 - Authentication Service
```powershell
cd C:\Users\RanjitSambhajiSavant\source\repos\MyCodes\WildlifSafari\Backend\WildlifeSafari.AuthService
dotnet restore
dotnet build
dotnet run
```
Wait for: "Now listening on: http://localhost:5001"

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

#### Terminal 2 - Booking Service
```powershell
cd C:\Users\RanjitSambhajiSavant\source\repos\MyCodes\WildlifSafari\Backend\WildlifeSafari.BookingService
dotnet restore
dotnet build
dotnet run
```
Wait for: "Now listening on: http://localhost:5002"

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

#### Terminal 3 - Admin Service
```powershell
cd C:\Users\RanjitSambhajiSavant\source\repos\MyCodes\WildlifSafari\Backend\WildlifeSafari.AdminService
dotnet restore
dotnet build
dotnet run
```
Wait for: "Now listening on: http://localhost:5003"

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

**Alternative:** Use the batch script:
```powershell
C:\Users\RanjitSambhajiSavant\source\repos\MyCodes\WildlifSafari\StartBackendServices.bat
```

---

### Step 3: Frontend Setup (5 minutes)

#### Terminal 4 - React Application
```powershell
cd C:\Users\RanjitSambhajiSavant\source\repos\MyCodes\WildlifSafari\Frontend\wildlife-safari-app
npm install
npm start
```
Wait for browser to open at: http://localhost:3000

**Status:** ⬜ Not Started | ⏳ In Progress | ✅ Completed

**Alternative:** Use the batch script:
```powershell
C:\Users\RanjitSambhajiSavant\source\repos\MyCodes\WildlifSafari\StartFrontend.bat
```

---

## Verification Tests

### Test 1: API Services Running
Open browser and verify Swagger endpoints:
- [ ] Auth Service: http://localhost:5001/swagger
- [ ] Booking Service: http://localhost:5002/swagger
- [ ] Admin Service: http://localhost:5003/swagger

### Test 2: Frontend Application
- [ ] Homepage loads: http://localhost:3000
- [ ] Wildlife photos display
- [ ] Navigation menu works

### Test 3: User Registration
1. [ ] Go to http://localhost:3000/register
2. [ ] Fill form with test data
3. [ ] Submit and verify redirect
4. [ ] Check username appears in navbar

### Test 4: Admin Login
1. [ ] Go to http://localhost:3000/login
2. [ ] Login with: admin@wildlifesafari.com / Admin@123
3. [ ] Verify "Admin" link in navigation
4. [ ] Click Admin and verify dashboard loads

### Test 5: Safari Booking Flow
1. [ ] Login as regular user
2. [ ] Go to "Book Safari"
3. [ ] Select a slot
4. [ ] Complete booking
5. [ ] Process payment in "My Bookings"
6. [ ] Verify booking status is "Confirmed"

### Test 6: Admin Operations
1. [ ] Login as admin
2. [ ] Go to Admin Dashboard
3. [ ] Add a new wildlife photo
4. [ ] Create a new safari slot
5. [ ] View all bookings
6. [ ] Verify changes reflect on main site

---

## Troubleshooting

### Issue: Backend services fail to start
**Solution:**
- Check if ports 5001, 5002, 5003 are available
- Verify .NET 8.0 SDK is installed: `dotnet --version`
- Check database connection string in appsettings.json

### Issue: Database connection error
**Solution:**
- Verify SQL Server Express is running (Services -> SQL Server (SQLEXPRESS))
- Check connection string: `Server=.\\SQLEXPRESS;Database=WildlifeSafariDB;...`
- Test connection in SSMS

### Issue: Frontend fails to start
**Solution:**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Check if port 3000 is available
- Verify Node.js version: `node --version` (should be 18+)

### Issue: API calls fail from frontend
**Solution:**
- Verify all backend services are running
- Check browser console for CORS errors
- Confirm API URLs in `src/services/api.ts` match running services

### Issue: Admin routes return 403 Forbidden
**Solution:**
- Verify logging in with admin@wildlifesafari.com
- Check JWT token contains role claim
- Clear browser localStorage and login again

---

## Performance Checklist

### Development Environment
- [ ] All 4 terminals/processes running
- [ ] No console errors in browser
- [ ] API response times < 1 second
- [ ] Page load times < 3 seconds

### Database Performance
- [ ] All indexes created
- [ ] Seed data loaded correctly
- [ ] Query execution plans optimized

---

## Security Checklist

### Authentication
- [ ] JWT tokens expire after 24 hours
- [ ] Passwords are hashed (BCrypt)
- [ ] Invalid credentials return proper errors
- [ ] Token required for protected routes

### Authorization
- [ ] Admin routes require Admin role
- [ ] Users can only access their own data
- [ ] 401/403 responses work correctly

### Input Validation
- [ ] Email format validated
- [ ] Password strength enforced
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (React escaping)

---

## Final Verification

### Functionality Checklist
✅ **User Features:**
- [ ] User registration works
- [ ] User login works
- [ ] Browse wildlife photos
- [ ] View available safari slots
- [ ] Create booking
- [ ] Process payment
- [ ] View booking history
- [ ] Cancel booking

✅ **Admin Features:**
- [ ] Admin login works
- [ ] Access admin dashboard
- [ ] Upload wildlife photos
- [ ] Delete wildlife photos
- [ ] Configure booking rates
- [ ] Create safari slots
- [ ] View all bookings

✅ **Technical Features:**
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Clean code structure
- [ ] Separate repositories (frontend/backend)
- [ ] DBContext manages CRUD operations
- [ ] Database migrations work
- [ ] Seed data loads correctly
- [ ] All APIs documented in Swagger

---

## Application URLs

### Frontend
- **Main App:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register
- **Book Safari:** http://localhost:3000/slots
- **My Bookings:** http://localhost:3000/my-bookings
- **Admin:** http://localhost:3000/admin

### Backend APIs
- **Auth API Docs:** http://localhost:5001/swagger
- **Booking API Docs:** http://localhost:5002/swagger
- **Admin API Docs:** http://localhost:5003/swagger

### Test Credentials
**Admin:**
- Email: admin@wildlifesafari.com
- Password: Admin@123

**Test User:**
- Email: john.doe@example.com
- Password: User@123

---

## Next Steps After Deployment

1. **Testing:** Complete all tests in TESTING_ANALYSIS.md
2. **Documentation:** Review SETUP_GUIDE.md for detailed instructions
3. **Production:** Follow recommendations in TESTING_ANALYSIS.md for production deployment
4. **Monitoring:** Set up logging and error tracking
5. **Enhancement:** Consider implementing suggested improvements

---

## Support & Documentation

- **Setup Guide:** SETUP_GUIDE.md
- **Testing Guide:** TESTING_ANALYSIS.md
- **Architecture:** See README.md
- **API Docs:** Access Swagger at each service URL

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Status:** ⬜ Failed | ⏳ In Progress | ✅ Success

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
