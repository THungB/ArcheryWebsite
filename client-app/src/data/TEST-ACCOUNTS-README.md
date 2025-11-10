# Test User Accounts

## ⚠️ Important Notice
**These are test accounts for development and testing purposes ONLY.**  
Never use these credentials in a production environment!

---

## Quick Login Credentials

### 🎯 Archer Accounts

| Username | Password | Name | Archer Number | Category |
|----------|----------|------|---------------|----------|
| archer1 | archer123 | John Smith | ARC001 | Recurve - Senior Men |
| archer2 | archer123 | Sarah Johnson | ARC002 | Recurve - Senior Women |
| archer3 | archer123 | Michael Chen | ARC003 | Compound - Senior Men |
| emma.davis | archer123 | Emma Davis | ARC004 | Recurve - Senior Women |
| james.wilson | archer123 | James Wilson | ARC005 | Compound - Senior Men |

**Recommended for Testing:** `archer1` / `archer123`

---

### 📋 Recorder Accounts

| Username | Password | Name | Role |
|----------|----------|------|------|
| recorder1 | recorder123 | David Martinez | Head Recorder |
| recorder2 | recorder123 | Lisa Anderson | Assistant Recorder |
| Admin | TechNova | System Administrator | Administrator |

**Recommended for Testing:** `recorder1` / `recorder123`

**Admin Account:** Use `Admin` / `TechNova` for full administrator privileges including:
- System logs viewer
- Database management
- System settings
- All recorder features

---

## How to Use

### Step 1: Start the Application
The app will show the role selection screen.

### Step 2: Select a Role
- Click on **Archer** to test archer features
- Click on **Recorder** to test recorder features

### Step 3: Login
Enter the test credentials shown above. The login screen will display the credentials for convenience.

### Step 4: Test Features
Once logged in, you can test all the features for that role.

---

## Login Flow

```
1. Select Role (Archer or Recorder)
   ↓
2. Enter Username and Password
   ↓
3. Click Login
   ↓
4. Access Dashboard with Full Features
```

---

## What Gets Validated

The login system checks:
- ✅ Username matches exactly (case-sensitive)
- ✅ Password matches exactly
- ✅ User exists in the correct role category
- ✅ User status is "active"

---

## Features by Role

### Archer Dashboard
- View and submit scores
- Track personal bests
- View competition results and leaderboards
- Check competition schedules
- Receive notifications about score approvals and new records

### Recorder Dashboard
- Approve/reject pending scores
- Manage archer profiles (create, edit, delete)
- Create and manage competitions
- View statistics and overview
- Receive notifications about pending approvals

### Administrator Dashboard (Admin account only)
- All recorder features
- **System logs viewer** with filtering and search
- **Database management** and monitoring
- **System settings** configuration
- User activity tracking
- Security and maintenance controls

---

## For Production Use

When moving to production, you must:

1. **Remove this file** and `test-users.json`
2. **Implement proper authentication** with your ASP.NET backend
3. **Hash passwords** using BCrypt or similar
4. **Use JWT tokens** for session management
5. **Store credentials** securely in MySQL database
6. **Enable HTTPS** for all communications
7. **Add rate limiting** to prevent brute force attacks
8. **Implement password reset** functionality

---

## Common Issues

### "Invalid username or password"
- Check for typos (usernames and passwords are case-sensitive)
- Ensure you're using credentials from the correct role
- Try the recommended test accounts first

### Can't find the login screen
- The app loads the role selection screen first
- Click on either Archer or Recorder card to proceed to login

### Want to switch roles
- Click "Logout" in the top right corner
- You'll return to the role selection screen

---

## File Location

The test user data is stored in:
```
/data/test-users.ts
```

You can add more test users by editing this TypeScript file. Follow the existing format and type definitions.

---

**Last Updated:** November 9, 2025  
**For:** Development and Testing Only

---

## 🔔 Notifications Feature

The notification system is now available for all users! Each role receives relevant notifications:

### Archers Receive:
- ✅ New personal best alerts
- ✅ Score approval/rejection notifications
- ✅ New competition announcements
- ✅ Achievement milestones
- ✅ System updates

### Recorders Receive:
- ✅ Pending score approval alerts
- ✅ New archer registration notifications
- ✅ Competition deadline reminders
- ✅ Monthly reports

### Administrators Receive:
- ✅ All recorder notifications
- ✅ System error alerts
- ✅ Security event notifications
- ✅ Database status updates
- ✅ User activity logs

**Note:** The current UI uses mock data. See `/NOTIFICATIONS-IMPLEMENTATION-GUIDE.md` for full backend integration instructions.
