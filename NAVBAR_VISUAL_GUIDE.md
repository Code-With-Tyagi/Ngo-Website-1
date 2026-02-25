# Role-Based Navbar Visual Guide

## 🎨 NAVBAR APPEARANCE FOR EACH ROLE

### 1. VISITOR (Not Logged In)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ❤️  SevaIndia    Home │ Services │ Find NGOs │ Contact Us │  [LOGIN] │
└─────────────────────────────────────────────────────────────────────┘
     🟢 Green Border
```

**Features:**
- Simple navigation
- No user profile section
- Login button visible
- All links lead to read-only pages

**Dropdown Menu on Desktop:** N/A

---

### 2. REGULAR USER (Donor)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ❤️  SevaIndia   Home │ Services │ Find NGOs │ Contact Us │ 👤 J [▼] │
│                                                          🔵 Blue    │
│                         Dropdown Opens:                             │
│                         ┌─────────────────────┐                     │
│                         │ 👤 My Profile       │                     │
│                         │ 💰 My Donations     │                     │
│                         │ ⚙️  Settings        │                     │
│                         │ ─────────────────── │                     │
│                         │ 🔓 Logout           │                     │
│                         └─────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Standard member navigation
- Can donate to campaigns
- Can apply for volunteering
- Profile dropdown with 3 options
- Blue theme for donors

**Menu Items:**
- My Profile → /profile
- My Donations → /profile/donations
- Settings → /profile/settings
- Logout

---

### 3. VOLUNTEER (Approved)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ❤️  SevaIndia   Home │ Services │ Find NGOs │ Contact Us │ 🟡 J [▼] │
│                                                          🟠 Orange   │
│                         Dropdown Opens:                             │
│                         ┌─────────────────────────┐                 │
│                         │ 🟡 Volunteer Dashbrd    │                 │
│                         │ 📋 My Tasks             │                 │
│                         │ ⏱️  Hours Logged        │                 │
│                         │ 🎖️  Certificates       │                 │
│                         │ 💬 Messages             │                 │
│                         │ 👤 My Profile           │                 │
│                         │ ⚙️  Settings            │                 │
│                         │ ─────────────────────── │                 │
│                         │ 🔓 Logout               │                 │
│                         └─────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Volunteer-specific dashboard
- Task management
- Hours tracking
- Certificate viewing
- Direct messaging with NGO
- Orange theme for volunteers

**Menu Items:**
- Volunteer Dashboard → /volunteer
- My Tasks → /volunteer/tasks
- Hours Logged → /volunteer/hours
- Certificates → /volunteer/certificates
- Messages → /volunteer/messages
- My Profile → /profile
- Settings → /profile/settings
- Logout

---

### 4. NGO ADMIN (Managing NGO)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ❤️  SevaIndia   Home │ Services │ 🏢 NGO [▼] │    ⚙️  Settings [▼] │
│                                    🟣 Purple                         │
│
│  NGO Dropdown:              Settings Dropdown:
│  ┌────────────────────┐    ┌──────────────────┐
│  │ 🏢 NGO Dashbrd     │    │ 👤 J Profile [▼] │
│  │ 📊 Campaigns       │    │ ⚙️  NGO Settings  │
│  │ 👥 Volunteers      │    │ 🔓 Logout         │
│  │ 💰 Donors          │    └──────────────────┘
│  │ 📈 Analytics       │
│  │ 📄 Reports         │
│  │ ⚙️  NGO Settings    │
│  └────────────────────┘
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- NGO campaign management
- Volunteer oversight
- Donor relationship
- Advanced analytics
- Purple theme for NGO admins

**NGO Menu Items:**
- NGO Dashboard → /ngo/dashboard
- Campaigns → /ngo/campaigns
- Volunteers → /ngo/volunteers
- Donors → /ngo/donors
- Analytics → /ngo/analytics
- Reports → /ngo/reports
- NGO Settings → /ngo/settings

**Settings Menu Items:**
- My Profile → /profile
- NGO Settings → /ngo/settings
- Logout

---

### 5. PLATFORM ADMIN
```
┌─────────────────────────────────────────────────────────────────────┐
│ ❤️  SevaIndia   Home │ 🔵 Admin [▼] │    🛠️  Control [▼]            │
│                           🔷 Teal                                   │
│
│  Admin Dropdown:                  Control Dropdown:
│  ┌──────────────────────┐        ┌──────────────────────┐
│  │ 🔵 Admin Dashbrd     │        │ ⚙️  Settings         │
│  │ 📋 NGO Apps          │        │ 📝 Audit Logs        │
│  │ 👥 Volunteers        │        │ 🔐 Security          │
│  │ 📞 Contacts          │        │ 👨‍👩‍👩‍👦 Users         │
│  │ 👨‍👩‍👩‍👦 Users List      │        │ 💰 Payments          │
│  │ 💰 Payments          │        └──────────────────────┘
│  │ 📊 Analytics         │
│  │ ⚙️  Settings          │        Profile Area:
│  └──────────────────────┘        👤 A [▼]
│                                   • Profile
│                                   • 🔓 Logout
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Full platform oversight
- NGO verification
- Volunteer approval
- Payment monitoring
- User management
- Audit trails
- Teal theme for admins

**Admin Menu Items:**
- Admin Dashboard → /admin
- NGO Applications → /admin/ngos
- Volunteers → /admin/volunteers
- Contacts → /admin/contacts
- Users → /admin/users
- Payments → /admin/payments
- Analytics → /admin/analytics
- Settings → /admin/settings

**Control Menu Items:**
- Settings → /admin/settings
- Audit Logs → /admin/audit-logs
- Security → /admin/security

---

### 6. SUPERADMIN (CEO/Founder)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ❤️  SevaIndia  🔴 Super [▼] │ 🔵 Admin [▼] │ 🛠️  Control [▼]        │
│                 🔴 Red                                              │
│
│  Super Dropdown:              Rest same as Admin
│  ┌──────────────────────┐     (but with more access)
│  │ 🔴 Superadmin Db     │
│  │ 💳 Revenue Dashbrd   │
│  │ 👨‍💼 Admin Mgmt        │
│  │ 🗄️  Database Mgmt     │
│  │ ─────────────────── │
│  │ All Admin Features...│
│  └──────────────────────┘

  Profile Area:
  👤 A [▼]
  • Profile
  • 🔓 Logout
```

**Features:**
- Everything Regular Admin has
- Revenue dashboards
- Admin account management
- Database management
- Full system control
- Red theme for superadmin

**Super Menu Items:**
- Superadmin Dashboard → /superadmin
- Revenue Dashboard → /superadmin/revenue
- Admin Management → /superadmin/admins
- Database → /superadmin/database
- (Plus all admin features below)

---

## 📱 MOBILE VIEW COMPARISON

### Mobile Visitor
```
┌──────────────────────────┐
│ ❤️ SevaIndia        ☰    │
└──────────────────────────┘
         ▼ MENU OPEN ▼
┌──────────────────────────┐
│ Menu                 ✕  │
├──────────────────────────┤
│ 🌐 English / हिंदी      │
├──────────────────────────┤
│ Home                      │
│ Services                  │
│ Find NGOs                 │
│ Contact Us                │
│ [LOGIN]                   │
└──────────────────────────┘
```

### Mobile Regular User
```
┌──────────────────────────┐
│ ❤️ SevaIndia        ☰    │
└──────────────────────────┘
         ▼ MENU OPEN ▼
┌──────────────────────────┐
│ Menu                 ✕  │
├──────────────────────────┤
│ 🌐 English / हिंदी      │
├──────────────────────────┤
│ Home                      │
│ Services                  │
│ Find NGOs                 │
│ Contact Us                │
├──────────────────────────┤
│ 👤 John (regular)        │
├──────────────────────────┤
│ 👤 My Profile            │
│ 💰 My Donations          │
│ ⚙️  Settings             │
│ [🔓 LOGOUT]               │
└──────────────────────────┘
```

### Mobile Volunteer
```
┌──────────────────────────┐
│ ❤️ SevaIndia        ☰    │
└──────────────────────────┘
         ▼ MENU OPEN ▼
┌──────────────────────────┐
│ Menu                 ✕  │
├──────────────────────────┤
│ 🌐 English / हिंदी      │
├──────────────────────────┤
│ Home                      │
│ Services                  │
│ Find NGOs                 │
│ Contact Us                │
├──────────────────────────┤
│ 🟡 John (volunteer)      │
├──────────────────────────┤
│ 🟡 Vol Dashboard         │
│ 📋 My Tasks              │
│ ⏱️  Hours Logged         │
│ 🎖️  Certificates         │
│ 💬 Messages              │
│ 👤 My Profile            │
│ ⚙️  Settings             │
│ [🔓 LOGOUT]               │
└──────────────────────────┘
```

### Mobile Admin
```
┌──────────────────────────┐
│ ❤️ SevaIndia        ☰    │
└──────────────────────────┘
         ▼ MENU OPEN ▼
┌──────────────────────────┐
│ Menu                 ✕  │
├──────────────────────────┤
│ 🌐 English / हिंदी      │
├──────────────────────────┤
│ Home                      │
│ Admin Dashboard (5)       │ ← Badge count
├──────────────────────────┤
│ 📋 NGOs (2)              │
│ 👥 Volunteers (3)        │
│ 📞 Contacts (1)          │
│ 👨‍👩‍👩‍👦 Users              │
│ 💰 Payments              │
│ 📊 Analytics             │
├──────────────────────────┤
│ 🔷 Admin (admin)         │
├──────────────────────────┤
│ ⚙️  Settings              │
│ 📝 Audit Logs            │
│ 🔐 Security              │
│ [🔓 LOGOUT]               │
└──────────────────────────┘
```

---

## 🎯 QUICK IDENTIFICATION GUIDE

### How to Know Your Role

**Navbar Color:**
- 🟢 Green = Visitor (not logged in)
- 🔵 Blue = Regular User
- 🟠 Orange = Volunteer
- 🟣 Purple = NGO Admin
- 🔷 Teal = Platform Admin
- 🔴 Red = Superadmin

**Number of Menu Items:**
- Visitor: 4 items (Home, Services, Find NGOs, Contact)
- User: 5 items (above + Donate)
- Volunteer: 7+ items (above + Tasks, Hours, Certificates)
- NGO Admin: 10+ items (NGO Dashboard, Campaigns, Donors, etc)
- Admin: 12+ items (Admin features + Control features)
- Superadmin: 15+ items (everything above + CEO features)

---

## 💡 USABILITY TIPS

### For Users
"If your navbar is Blue, you can donate. If it's Orange, you have volunteer tasks."

### For Admins
"Red navbar? You're viewing as Superadmin. Teal? You're viewing as Admin. Different colors = different access levels."

### For NGO Managers
"Purple navbar means you have access to your NGO dashboard and can manage campaigns."

---

## ✅ VISUAL VERIFICATION CHECKLIST

When implementing, verify each navbar has:

**Visitor Navbar:**
- [ ] 🟢 Green color
- [ ] Login button (not profile icon)
- [ ] 4 menu items
- [ ] No dropdown
- [ ] Mobile menu closes after navigation

**Regular User Navbar:**
- [ ] 🔵 Blue color
- [ ] Profile icon (not button)
- [ ] Profile dropdown with 3 items
- [ ] Donate link visible
- [ ] Correct name in hover

**Volunteer Navbar:**
- [ ] 🟠 Orange color
- [ ] Profile icon in different color
- [ ] Volunteer dashboard link
- [ ] Tasks, Hours, Certificates visible
- [ ] 7+ dropdown items

**NGO Admin Navbar:**
- [ ] 🟣 Purple color
- [ ] NGO menu instead of regular profile
- [ ] Campaigns, Donors, Analytics visible
- [ ] Can manage own NGO only

**Admin Navbar:**
- [ ] 🔷 Teal color (darker blue-green)
- [ ] Admin dropdown menu
- [ ] Control dropdown menu
- [ ] NGO Apps, Volunteers, Users, Payments visible

**Superadmin Navbar:**
- [ ] 🔴 Red color
- [ ] Super dropdown menu visible
- [ ] Revenue Dashboard visible
- [ ] Admin Management visible
- [ ] All other features below

