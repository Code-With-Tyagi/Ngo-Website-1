# Role-Based Navbar System - Complete Guide

## 🎯 CONCEPT: Different Roles = Different Navbars

Every user type should see ONLY the features they can access. This is:
- **Better UX**: Users aren't confused by irrelevant features
- **Better Security**: Hidden from view = harder to hack
- **Professional**: Enterprise platforms always do this

---

## 👥 DIFFERENT NAVBARS FOR DIFFERENT ROLES

### 1️⃣ **VISITOR / GUEST (Not Logged In)**

**Navbar Items:**
```
Home | Services | Find NGOs | Contact Us | [LOGIN Button]
```

**What They Can Do:**
- Browse home page
- View all service campaigns (read-only)
- Search NGOs (read-only)
- Read contact info
- Click "Donate Now" → Redirects to login
- Click "Volunteer" → Redirects to login

**Can NOT Do:**
- Donate (blocked)
- Apply as volunteer (blocked)
- Add NGO (blocked)
- View admin panel (blocked)

---

### 2️⃣ **REGULAR USER (Logged in, role: "user")**

**Navbar Items:**
```
Home | Services | Find NGOs | Contact Us | [Profile Dropdown ▼]
```

**Profile Dropdown:**
```
👤 My Profile
💰 My Donations (NEW)
💼 Volunteer Status (if applied)
⚙️ Settings
🔓 Logout
```

**What They Can Do:**
- Browse everything (same as visitor)
- **Donate to campaigns** ← NEW
- View donation history
- View tax certificates
- **Apply as volunteer** ← NEW
- Edit profile
- Download receipts

**Can NOT Do:**
- Add NGO
- Access admin panel
- Manage campaigns
- See volunteer tasks (until approved)

---

### 3️⃣ **VOLUNTEER (Logged in, approved volunteer)**

**Navbar Items:**
```
Home | Services | Find NGOs | Contact Us | [Volunteer Dropdown ▼]
```

**Volunteer Dropdown (instead of regular profile):**
```
🟡 Volunteer Dashboard
📋 My Tasks
⏱️ Hours Logged
🎖️ Certificates
💬 NGO Chat
⚙️ Settings
🔓 Logout
```

**What They Can Do:**
- All regular user functions
- **View assigned tasks** ← NEW
- **Log volunteer hours** ← NEW
- **Track impact** ← NEW
- **View certificates** ← NEW
- Chat with NGO coordinators

**Can NOT Do:**
- Manage campaigns
- Approve other volunteers
- Access admin features

---

### 4️⃣ **NGO ADMIN (Logged in, registered NGO)**

**Navbar Items:**
```
Home | [NGO Dropdown ▼] | [Admin Dropdown ▼]
```

**NGO Dropdown:**
```
🏢 NGO Dashboard
📊 Campaigns
👥 Volunteers
💰 Donors
📈 Analytics
📄 Reports
⚙️ NGO Settings
```

**Admin Dropdown (Personal):**
```
👤 My Profile
🔓 Logout
```

**What They Can Do:**
- **Create fundraising campaigns** ← NEW
- **Manage donors** ← NEW
- **Assign volunteer tasks** ← NEW
- **Track funds raised** ← NEW
- **View analytics** ← NEW
- Generate impact reports
- Edit NGO details
- Can also donate personally (as regular user)

**Can NOT Do:**
- Approve other NGOs
- View other NGO data
- Access platform admin features
- Manage volunteers globally

---

### 5️⃣ **PLATFORM ADMIN (role: "admin")**

**Navbar Items:**
```
Home | [Admin Dropdown ▼] | [Control Dropdown ▼]
```

**Admin Dropdown:**
```
🔵 Admin Dashboard
📋 NGO Applications
👥 Volunteers
📞 Contacts
👨‍👩‍👩‍👦 Users
💰 Payments
📊 Analytics
```

**Control Dropdown (System):**
```
⚙️ Settings
📝 Audit Logs
🔐 Security
```

**What They Can Do:**
- **Verify NGO applications** ← NEW
- **Approve/Reject volunteers** ← NEW
- **Monitor all donations** ← NEW
- **Handle fraud/disputes** ← NEW
- **View all user data** ← NEW
- Kill problematic accounts
- Download compliance reports
- Manage admins (if superadmin exists)

**Can NOT Do:**
- Edit user data (unless superadmin)
- Create admin accounts (unless superadmin)
- Configure system settings (unless superadmin)

---

### 6️⃣ **SUPERADMIN (role: "superadmin")**

**Navbar Items:**
```
[Super Dropdown ▼] | [Admin Dropdown ▼] | [Control Dropdown ▼]
```

**Super Dropdown (CEO-level):**
```
🔴 Superadmin Dashboard
💳 Revenue Dashboard
👨‍💼 Admin Management
🗄️ Database Management
```

**Admin Dropdown:**
- Same as Platform Admin

**Control Dropdown:**
- Full system access

**What They Can Do:**
- **Everything** (Full platform control)
- Create/Delete admin accounts
- Modify system settings
- View financial reports
- Database backups
- Override any decision
- Configure payment gateway

---

## 📝 ROLE HIERARCHY

```
┌─────────────────────────────────────────────────────┐
│ SUPERADMIN (Platform Owner)                         │
│ - Can do EVERYTHING                                 │
│ - Full database & system access                     │
│ - Creates/Manages other admins                      │
└─────────────────┬───────────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
┌────────▼────────┐  ┌─────▼────────────┐
│ PLATFORM ADMIN  │  │ NGO ADMIN        │
│ - Verify NGOs   │  │ - Manage own NGO │
│ - Approve Vols  │  │ - Create campaigns
│ - Monitor Donos │  │ - Assign tasks   │
│ - Handle Fraud  │  │ - View analytics │
└────────┬────────┘  └─────┬────────────┘
         │                 │
         └────────┬────────┘
                  │
         ┌────────▼──────────┐
         │ REGULAR USER      │
         │ - Browse services │
         │ - Donate          │
         │ - Apply Volunteer │
         └────────┬──────────┘
                  │
         ┌────────▼────────────┐
         │ VOLUNTEER (Approved)│
         │ - Complete tasks    │
         │ - Log hours         │
         │ - Get certificates  │
         └─────────────────────┘

VISITOR (Not logged in)
- Browse only (no actions)
```

---

## 🛠️ IMPLEMENTATION GUIDE

### Step 1: Determine User Role

```javascript
// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

// Determine what they are
const userRole = user?.role; // "user", "admin", "superadmin"
const userType = determineUserType(user);
// Returns: "visitor", "regular", "volunteer", "ngoAdmin", "admin", "superadmin"
```

### Step 2: Create Role-Based Navbar Component

```javascript
function Navbar() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("visitor");

  useEffect(() => {
    determineUserTypeAndSetState();
  }, []);

  // Based on userType, render different navbars
  if (userType === "visitor") return <VisitorNavbar />;
  if (userType === "regular") return <RegularUserNavbar />;
  if (userType === "volunteer") return <VolunteerNavbar />;
  if (userType === "ngoAdmin") return <NgoAdminNavbar />;
  if (userType === "admin") return <AdminNavbar />;
  if (userType === "superadmin") return <SuperadminNavbar />;
}
```

### Step 3: Determine User Type Function

```javascript
function determineUserType(user) {
  if (!user) return "visitor";
  
  if (user.role === "superadmin") return "superadmin";
  if (user.role === "admin") return "admin";
  
  // Check if user has registered NGO (TBD - need database check)
  if (user.ngoId) return "ngoAdmin";
  
  // Check if user has approved volunteer application (TBD)
  if (user.volunteerApproved) return "volunteer";
  
  return "regular";
}
```

---

## 🔄 IMPLEMENTATION STEPS

### Phase 1: Understanding (NOW)
✅ Understand role-based UI rendering concept
✅ Learn how different users see different features

### Phase 2: Database Updates (Week 1)
□ Update User model to track:
  - ngoId (if they manage an NGO)
  - volunteerApproved (boolean)
  - volunteerStatus (pending/approved/rejected)

### Phase 3: Frontend Updates (Week 1-2)
□ Refactor navbar into modular components
□ Create separate navbar for each role
□ Implement user type detection
□ Update routes to redirect based on role

### Phase 4: Backend API Endpoints (Week 2)
□ GET /api/user/type (returns user type)
□ GET /api/user/profile (with all user data + ngoId)
□ PUT /api/user/preferences
□ GET /api/volunteer/status (check if approved)

---

## 📱 RESPONSIVE DESIGN

Each navbar also needs mobile version:

```
VISITOR (Mobile):
☰ Menu
  Home
  Services
  Find NGOs
  Contact
  [LOGIN]

REGULAR USER (Mobile):
☰ Menu
  Home
  Services
  Find NGOs
  Contact
  👤 My Profile
  💰 My Donations
  🔓 Logout

VOLUNTEER (Mobile):
☰ Menu
  Home
  🟡 Volunteer Dashboard
  📋 My Tasks
  ⏱️ Hours Logged
  🎖️ Certificates
  💬 NGO Chat
  🔓 Logout

NGO ADMIN (Mobile):
☰ Menu
  🏢 NGO Dashboard
  📊 Campaigns
  👥 Volunteers
  💰 Donors
  📈 Analytics
  ⚙️ NGO Settings
  🔓 Logout

ADMIN (Mobile):
☰ Menu
  🔵 Admin Dashboard
  📋 NGO Applications
  👥 Volunteers
  💰 Payments
  📊 Analytics
  ⚙️ Settings
  🔓 Logout

SUPERADMIN (Mobile):
☰ Menu
  🔴 Superadmin Dashboard
  💳 Revenue
  👨‍💼 Admin Management
  🔵 Admin Features...
  🔓 Logout
```

---

## ✨ ADVANCED FEATURES

### Navbar Badges (Showing Important Counts)

```
For Admins:
- "NGO Applications (5)" ← Shows pending count
- "Volunteers (12)" ← Shows pending volunteers
- "New Contacts (3)" ← Shows unread messages

For NGO Admins:
- "New Donors (7)" ← This week
- "Tasks to Assign" ← Pending tasks
- "Funds Pending" ← Awaiting transfer

For Users:
- "Order Status" ← If donation pending
- "Volunteer Status" ← If application pending
```

### Quick Actions Menu

```
For Admins:
- Quick approve NGO
- Quick approve volunteer
- Quick view pending items

For NGO:
- Quick create campaign
- Quick message volunteers
- Quick send thank you email

For Users:
- Quick donate
- Quick check donation status
- Quick volunteer lookup
```

### Activity Indicators

```
Green dot = Online
Orange dot = Away
Red dot = Do not disturb

Shows when an NGO coordinator is available
Shows when admin is available
```

---

## 🎨 NAVBAR STYLING BY ROLE

```css
/* VISITOR - Green (Standard) */
.navbar-visitor { --color: #2e7d32; }

/* REGULAR USER - Blue */
.navbar-user { --color: #1976d2; }

/* VOLUNTEER - Orange */
.navbar-volunteer { --color: #f57c00; }

/* NGO ADMIN - Purple */
.navbar-ngo { --color: #7b1fa2; }

/* PLATFORM ADMIN - Teal */
.navbar-admin { --color: #00796b; }

/* SUPERADMIN - Red */
.navbar-superadmin { --color: #c62828; }
```

This helps users quickly identify their role visually!

---

## 🚀 IMPLEMENTATION CHECKLIST

- [ ] Update User model with ngoId, volunteerStatus
- [ ] Create UserType detection function
- [ ] Refactor navbar into 6 components
- [ ] Create shared navbar utilities
- [ ] Update mobile menu for each role
- [ ] Add badges for notification counts
- [ ] Update route guards based on role
- [ ] Test all role redirects
- [ ] Document role-based access rules
- [ ] Create admin documentation for role management

---

## 💡 SECURITY NOTES

1. **Server-side validation**: Don't trust client role
   ```javascript
   // Backend should ALWAYS verify role
   if (req.user.role !== "admin") {
     return res.status(403).json({ error: "Unauthorized" });
   }
   ```

2. **Hidden UI ≠ Secure**: UI hiding is for UX, not security
   ```javascript
   // Someone can always modify localStorage to fake their role
   // Backend must authorize every action
   ```

3. **Role-based API endpoints**:
   ```javascript
   // Each endpoint should verify role before returning data
   GET /api/admin/users → ⚠️ Verify role="admin"
   GET /api/user/profile → ✅ Anyone can access their own
   PUT /api/user/{id} → ⚠️ Verify ownership or admin
   ```

---

## 📊 QUICK REFERENCE TABLE

| Role | Home | Services | Find NGOs | Dashboard | My Profile | Add NGO | Admin Panel |
|------|------|----------|-----------|-----------|------------|---------|------------|
| **Visitor** | ✅ | ✅ RO | ✅ RO | ❌ | ❌ | ❌ | ❌ |
| **User** | ✅ | ✅ | ✅ | ✅ Profile | ✅ | ❌ | ❌ |
| **Volunteer** | ✅ | ✅ | ✅ | ✅ Volunteer | ✅ | ❌ | ❌ |
| **NGO Admin** | ✅ | ✅ | ✅ | ✅ NGO | ✅ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ⚠️ Limited | ✅ | ✅ | ✅ |
| **Superadmin** | ✅ | ✅ | ✅ | ✅ Full | ✅ | ✅ | ✅ |

RO = Read Only

---

## 🎯 NEXT STEPS

1. Design database schema updates for ngoId, volunteerStatus
2. Create role detection utility in Frontend
3. Refactor navbar into modular components
4. Update backend to provide role information
5. Test all role transitions
6. Document role permissions

