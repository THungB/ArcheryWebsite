# Archery Database Management System - Frontend

A comprehensive archery database management system with role-based dashboards for Archers and Recorders.

## Current Status

✅ **Frontend Complete** - All UI components are built and functional with mock data  
⏳ **Backend Integration Ready** - API service layer is configured, waiting for ASP.NET backend

## Features

### For Archers
- 📊 View and track submitted scores
- 🏆 Personal best tracking across different rounds
- 📅 View upcoming competitions and leaderboards
- ➕ Submit new scores for approval
- 📈 View statistics and performance trends

### For Recorders
- ✅ Approve or reject submitted scores
- 👥 Manage archer profiles
- 🎯 Create and manage competitions
- 📋 View pending approvals and flagged scores
- 📊 Dashboard with overview statistics

## Running the Application

The application is currently running with **mock data** for demonstration purposes. All features work without a backend.

### Using Mock Data (Current Mode)
- Simply use the application as-is
- No backend required
- All data is hardcoded for demo purposes

### Connecting to ASP.NET Backend
To connect to your ASP.NET backend:

1. **Set up your backend** following the guide in `/Document/ASP.NET-Integration-Guide.md`
2. **Update the API URL** in `/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://localhost:7001/api'; // Your ASP.NET API URL
   ```
3. **Login to get a token** - After implementing authentication, the app will store a token in localStorage
4. **Components will automatically switch** from mock data to real API calls when a token is present

## File Structure

```
├── App.tsx                          # Main app component with role routing
├── components/
│   ├── ArcherDashboard.tsx         # Main dashboard for archers
│   ├── RecorderDashboard.tsx       # Main dashboard for recorders
│   ├── MyScores.tsx                # Score history (API-ready)
│   ├── PersonalBests.tsx           # Personal best tracking
│   ├── CompetitionResults.tsx      # Competition leaderboards
│   ├── ScoreEntry.tsx              # Score submission form
│   ├── ScoreApproval.tsx           # Score approval workflow
│   ├── ArcherManagement.tsx        # Archer CRUD operations
│   ├── CompetitionManagement.tsx   # Competition CRUD operations
│   ├── RoleSelection.tsx           # Initial role selection screen
│   └── Footer.tsx                  # Application footer
├── services/
│   └── api.ts                      # Complete API service layer
└── Document/                        # All documentation files
    ├── README.md                   # This file
    ├── ASP.NET-Integration-Guide.md
    ├── MYSQL-CRUD-GUIDE.md
    ├── QUICK-START.md
    ├── VISUAL-STUDIO-SETUP-GUIDE.md
    ├── VS2022-SETUP-GUIDE.md
    ├── REGISTRATION-FEATURE.md
    ├── TEST-ACCOUNTS-README.md
    └── FILE-MAPPING.md
```

## How API Integration Works

The app uses a **graceful fallback** system:

1. **No Token** → Uses mock data automatically (current state)
2. **Token Present** → Tries to connect to backend
3. **Backend Offline** → Falls back to mock data with a silent error

This means the app will work seamlessly whether the backend is running or not.

## Next Steps

### To Complete Backend Integration:

1. ✅ Frontend ready (current)
2. ⏳ Create ASP.NET Web API project in Visual Studio
3. ⏳ Set up MySQL database using provided schema
4. ⏳ Implement controllers using example code
5. ⏳ Add authentication and generate JWT tokens
6. ⏳ Test endpoints with Swagger
7. ⏳ Connect frontend by logging in and getting token

Full instructions are in `/Document/ASP.NET-Integration-Guide.md`

## Technologies Used

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons

### Backend (To Be Implemented)
- **ASP.NET Core Web API**
- **Entity Framework Core**
- **MySQL** database
- **JWT** authentication

## Authentication Flow

When backend is connected:

```
1. User selects role (Archer/Recorder)
2. Login → POST /api/auth/login
3. Receive JWT token
4. Store token in localStorage
5. All API calls include: Authorization: Bearer {token}
6. Components automatically fetch real data
```

## Development Notes

- All components are designed to work with or without backend
- Mock data is comprehensive and matches API response format
- Error handling is built in with graceful degradation
- Console errors from fetch are suppressed when backend is not running
- Components will automatically refresh when backend becomes available

## Support

For backend integration help, refer to:
- `/Document/ASP.NET-Integration-Guide.md` - Complete setup guide
- `/Document/MYSQL-CRUD-GUIDE.md` - Database CRUD operations guide
- `/services/api.ts` - API endpoint documentation
- MySQL schema in integration guide - Database structure

---

**Current Mode:** 🎨 Frontend Demo with Mock Data  
**Ready For:** 🔌 ASP.NET Backend Integration

**Developed by:** TechNova Team  
**© 2025 TechNova. All rights reserved.**
