# How to Use the Archery Database Management System
## Complete User and Developer Guide

This guide explains how to use the Archery Database Management System and perform CRUD (Create, Read, Update, Delete) operations with the MySQL database.

---

## 📋 Table of Contents

1. [For End Users](#for-end-users)
2. [For Developers](#for-developers)
3. [Database CRUD Operations](#database-crud-operations)
4. [Common Tasks](#common-tasks)
5. [Troubleshooting](#troubleshooting)

---

## For End Users

### Getting Started

1. **Open the Application**
   - Navigate to: `http://localhost:5173` (or your deployment URL)
   - You'll see the welcome screen with two role options

2. **Select Your Role**
   - Click **Archer** if you're submitting and tracking scores
   - Click **Recorder** if you're managing competitions and approving scores

3. **Login**
   - For testing, use these credentials:
     - **Archer:** username: `archer1`, password: `archer123`
     - **Recorder:** username: `recorder1`, password: `recorder123`
   - Click "Login" button

---

### As an Archer

#### View Your Scores
1. Click **"My Scores"** in the navigation
2. See all your submitted scores with approval status
3. Filter by status: All, Approved, Pending, Rejected

#### Submit a New Score
1. Click **"Score Entry"**
2. Select competition from dropdown
3. Enter your round type (e.g., "WA 720")
4. Enter total score, number of 10s, and number of Xs
5. Click **"Submit Score for Approval"**
6. Wait for recorder to approve

#### Check Personal Bests
1. Click **"Personal Bests"**
2. View your best scores for each round type
3. See when and where you achieved each record

#### View Competition Results
1. Click **"Competition Results"**
2. Select a competition from the dropdown
3. View leaderboard with rankings
4. See all participants' approved scores

---

### As a Recorder

#### Approve/Reject Scores
1. Click **"Score Approval"**
2. Review pending scores in the table
3. Click **"Approve"** to accept a score
4. Click **"Reject"** to deny (with optional notes)
5. Approved scores automatically update personal bests if applicable

#### Manage Archers
1. Click **"Archer Management"**
2. **Add New Archer:**
   - Click "Add New Archer"
   - Fill in all required fields
   - Click "Save Archer"
3. **Edit Archer:**
   - Click "Edit" button next to archer
   - Update fields as needed
   - Click "Save Changes"
4. **Delete Archer:**
   - Click "Delete" button
   - Confirm deletion

#### Manage Competitions
1. Click **"Competition Management"**
2. **Create Competition:**
   - Click "Add New Competition"
   - Enter name, date, location
   - Select round type
   - Set status (Upcoming/Active/Completed)
   - Click "Save Competition"
3. **Edit Competition:**
   - Click "Edit" button
   - Update details
   - Click "Save Changes"
4. **Delete Competition:**
   - Click "Delete" button
   - Confirm deletion

---

## For Developers

### System Architecture

```
┌──────────────┐     HTTP/HTTPS     ┌──────────────┐     SQL      ┌──────────┐
│   React      │ ──────────────────> │  ASP.NET     │ ───────────> │  MySQL   │
│   Frontend   │ <────────────────── │  Web API     │ <─────────── │ Database │
└──────────────┘     JSON/JWT        └──────────────┘    Records   └──────────┘
```

### Setting Up Development Environment

1. **Clone/Setup Project**
   ```bash
   git clone <repository>
   cd archery-database-management
   npm install
   ```

2. **Setup Database**
   - See [MYSQL-CRUD-GUIDE.md](MYSQL-CRUD-GUIDE.md) for complete schema
   - Run MySQL schema scripts
   - Insert sample data

3. **Configure Backend**
   - Follow [ASP.NET-Integration-Guide.md](ASP.NET-Integration-Guide.md)
   - Update connection string in `appsettings.json`
   - Run migrations

4. **Start Development Servers**
   ```bash
   # Terminal 1: React Frontend
   npm run dev

   # Terminal 2: ASP.NET Backend (in Visual Studio)
   Press F5 or dotnet run
   ```

5. **Access Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `https://localhost:7000`
   - Swagger UI: `https://localhost:7000/swagger`

---

## Database CRUD Operations

For complete details, see **[MYSQL-CRUD-GUIDE.md](MYSQL-CRUD-GUIDE.md)**

### Quick Reference

#### CREATE (Insert) Operations

**Add New Archer:**
```sql
INSERT INTO Archers (Username, Password, Name, Email, ArcherNumber, BowType, Category)
VALUES ('john.doe', 'hashed_password', 'John Doe', 'john@example.com', 'ARC006', 'Recurve', 'Senior Men');
```

**Add New Score:**
```sql
INSERT INTO Scores (ArcherId, CompetitionId, RoundType, TotalScore, Tens, Xs)
VALUES (1, 3, 'WA 720', 685, 47, 15);
```

**Create Competition:**
```sql
INSERT INTO Competitions (Name, Date, Location, RoundType, Status, MaxParticipants, CreatedBy)
VALUES ('Spring Championship', '2025-03-15', 'Central Range', 'WA 720', 'Upcoming', 50, 1);
```

---

#### READ (Select) Operations

**Get All Archers:**
```sql
SELECT * FROM Archers WHERE IsActive = TRUE;
```

**Get Pending Scores:**
```sql
SELECT s.*, a.Name AS ArcherName, c.Name AS CompetitionName
FROM Scores s
JOIN Archers a ON s.ArcherId = a.ArcherId
JOIN Competitions c ON s.CompetitionId = c.CompetitionId
WHERE s.ApprovalStatus = 'Pending';
```

**Get Competition Leaderboard:**
```sql
SELECT a.Name, s.TotalScore, s.Tens, s.Xs
FROM Scores s
JOIN Archers a ON s.ArcherId = a.ArcherId
WHERE s.CompetitionId = 1 AND s.ApprovalStatus = 'Approved'
ORDER BY s.TotalScore DESC;
```

**Get Personal Bests:**
```sql
SELECT RoundType, BestScore, AchievedDate
FROM PersonalBests
WHERE ArcherId = 1;
```

---

#### UPDATE (Modify) Operations

**Approve Score:**
```sql
UPDATE Scores
SET ApprovalStatus = 'Approved',
    ApprovedBy = 1,
    ApprovedDate = NOW()
WHERE ScoreId = 5;
```

**Update Archer Profile:**
```sql
UPDATE Archers
SET Email = 'newemail@example.com',
    Phone = '555-9999',
    BowType = 'Compound'
WHERE ArcherId = 1;
```

**Update Competition:**
```sql
UPDATE Competitions
SET Location = 'New Venue',
    Status = 'Active'
WHERE CompetitionId = 2;
```

---

#### DELETE (Remove) Operations

**Soft Delete Archer:**
```sql
UPDATE Archers
SET IsActive = FALSE
WHERE ArcherId = 5;
```

**Delete Score:**
```sql
DELETE FROM Scores
WHERE ScoreId = 10;
```

**Delete Competition:**
```sql
DELETE FROM Competitions
WHERE CompetitionId = 5;
```

---

## Common Tasks

### Task 1: Archer Submits and Gets Score Approved

**User Actions:**
1. Archer logs in
2. Goes to "Score Entry"
3. Selects competition
4. Enters score details
5. Clicks "Submit"

**Database Operations:**
```sql
-- 1. Create score record (Frontend → Backend → Database)
INSERT INTO Scores (ArcherId, CompetitionId, RoundType, TotalScore, Tens, Xs, ApprovalStatus)
VALUES (1, 2, 'WA 720', 685, 47, 15, 'Pending');

-- 2. Recorder approves (Recorder clicks "Approve")
UPDATE Scores
SET ApprovalStatus = 'Approved', ApprovedBy = 1, ApprovedDate = NOW()
WHERE ScoreId = (last inserted ID);

-- 3. System checks if it's a new personal best
INSERT INTO PersonalBests (ArcherId, RoundType, BestScore, AchievedDate, CompetitionId)
VALUES (1, 'WA 720', 685, CURDATE(), 2)
ON DUPLICATE KEY UPDATE
    BestScore = IF(685 > BestScore, 685, BestScore),
    AchievedDate = IF(685 > BestScore, CURDATE(), AchievedDate);
```

**Result:** Score appears in archer's history and may become a personal best

---

### Task 2: Recorder Creates Competition and Manages Participants

**User Actions:**
1. Recorder logs in
2. Goes to "Competition Management"
3. Clicks "Add New Competition"
4. Fills form and saves

**Database Operations:**
```sql
-- 1. Create competition
INSERT INTO Competitions (Name, Date, Location, RoundType, Status, MaxParticipants, CreatedBy)
VALUES ('Summer Cup 2025', '2025-06-15', 'Outdoor Range', 'WA 1440', 'Upcoming', 75, 1);

-- 2. Archers submit scores for this competition
-- (Multiple INSERT statements from archer submissions)

-- 3. View competition leaderboard
SELECT 
    a.Name,
    a.ArcherNumber,
    s.TotalScore,
    s.Tens,
    s.Xs,
    RANK() OVER (ORDER BY s.TotalScore DESC, s.Tens DESC, s.Xs DESC) AS Rank
FROM Scores s
JOIN Archers a ON s.ArcherId = a.ArcherId
WHERE s.CompetitionId = (last inserted ID)
  AND s.ApprovalStatus = 'Approved'
ORDER BY s.TotalScore DESC;
```

---

### Task 3: Archer Checks Personal Progress

**User Actions:**
1. Archer logs in
2. Views "Personal Bests"
3. Views "My Scores"

**Database Operations:**
```sql
-- 1. Get all personal bests
SELECT 
    RoundType,
    BestScore,
    AchievedDate,
    c.Name AS CompetitionName
FROM PersonalBests pb
LEFT JOIN Competitions c ON pb.CompetitionId = c.CompetitionId
WHERE pb.ArcherId = (logged in archer ID)
ORDER BY AchievedDate DESC;

-- 2. Get score history with trends
SELECT 
    s.TotalScore,
    s.RoundType,
    s.SubmittedDate,
    s.ApprovalStatus,
    c.Name AS CompetitionName,
    c.Date AS CompetitionDate
FROM Scores s
JOIN Competitions c ON s.CompetitionId = c.CompetitionId
WHERE s.ArcherId = (logged in archer ID)
ORDER BY s.SubmittedDate DESC;

-- 3. Calculate improvement trend
SELECT 
    RoundType,
    AVG(TotalScore) AS AverageScore,
    MAX(TotalScore) AS BestScore,
    MIN(TotalScore) AS LowestScore,
    COUNT(*) AS AttemptsCount
FROM Scores
WHERE ArcherId = (logged in archer ID)
  AND ApprovalStatus = 'Approved'
GROUP BY RoundType;
```

---

## Troubleshooting

### Frontend Issues

**Problem:** Login doesn't work
- **Check:** Are you using the correct test credentials?
- **Solution:** Use `archer1` / `archer123` or `recorder1` / `recorder123`

**Problem:** "Network error" when submitting data
- **Check:** Is the backend API running?
- **Solution:** Start ASP.NET backend with F5 in Visual Studio

**Problem:** Data doesn't update
- **Check:** Is the database connection working?
- **Solution:** Check connection string in `appsettings.json`

---

### Backend Issues

**Problem:** Cannot connect to MySQL
- **Check:** MySQL service running? `systemctl status mysql` (Linux) or Services app (Windows)
- **Check:** Connection string correct in `appsettings.json`?
- **Solution:** Verify username, password, host, and database name

**Problem:** Foreign key constraint violations
- **Check:** Are you trying to insert/update with non-existent foreign key values?
- **Solution:** Ensure referenced records exist (e.g., ArcherId exists before creating score)

**Problem:** Duplicate entry errors
- **Check:** Unique constraints (Username, Email, ArcherNumber)
- **Solution:** Use unique values or UPDATE instead of INSERT

---

### Database Issues

**Problem:** Slow queries
- **Solution:** Add indexes to frequently queried columns
- **Example:**
  ```sql
  CREATE INDEX idx_scores_archer ON Scores(ArcherId);
  CREATE INDEX idx_scores_competition ON Scores(CompetitionId);
  ```

**Problem:** Data inconsistency
- **Solution:** Use transactions for multi-step operations
- **Example:**
  ```sql
  START TRANSACTION;
  INSERT INTO Scores (...) VALUES (...);
  UPDATE PersonalBests SET ... WHERE ...;
  COMMIT;
  ```

---

## Best Practices

### For Users

1. **Always log out** when finished
2. **Double-check scores** before submitting
3. **Wait for approval** before scores become official
4. **Contact recorder** if scores are incorrectly rejected

### For Developers

1. **Always hash passwords** - Never store plain text
2. **Use transactions** - For multi-table operations
3. **Validate input** - Both frontend and backend
4. **Handle errors gracefully** - Show user-friendly messages
5. **Log all operations** - Track who did what and when
6. **Test thoroughly** - Unit, integration, and E2E tests
7. **Backup regularly** - Schedule automated database backups

### For Database Administrators

1. **Regular backups** - Daily at minimum
2. **Monitor performance** - Query execution times
3. **Optimize queries** - Use EXPLAIN to analyze
4. **Archive old data** - Keep database performant
5. **Update indexes** - As query patterns change

---

## Additional Resources

- **[MYSQL-CRUD-GUIDE.md](MYSQL-CRUD-GUIDE.md)** - Complete database operations guide
- **[ASP.NET-Integration-Guide.md](ASP.NET-Integration-Guide.md)** - Backend implementation
- **[TEST-ACCOUNTS-README.md](TEST-ACCOUNTS-README.md)** - Test login credentials
- **[QUICK-START.md](QUICK-START.md)** - Setup instructions

---

## Support

For questions or issues:
1. Check this documentation
2. Review the [INDEX.md](INDEX.md) for all available guides
3. Check error logs in browser console (F12) and server logs
4. Review MySQL error log: `/var/log/mysql/error.log`

---

**Last Updated:** November 9, 2025  
**Version:** 1.0  
**Maintained by:** TechNova Team  
**© 2025 TechNova. All rights reserved.**
