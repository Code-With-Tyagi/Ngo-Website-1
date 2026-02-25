# How to Implement Role-Based Navbar - Step-by-Step Guide

## 📋 CURRENT STATE vs IMPROVED STATE

### CURRENT NAVBAR (Limited)
```
Shows only:
✓ Check if user is admin or not
✓ Two states: Visitor OR Regular User (with admin check)
✓ Doesn't differentiate between:
  ❌ Regular users
  ❌ Volunteers
  ❌ NGO admins
  ❌ Platform admins
  ❌ Superadmins
```

### IMPROVED NAVBAR (Professional)
```
Shows 6 different navbars based on user role:
✓ Visitor (not logged in)
✓ Regular User (donor)
✓ Volunteer (approved volunteer)
✓ NGO Admin (managing NGO)
✓ Platform Admin (SevaIndia staff)
✓ Superadmin (CEO level)

Each with custom:
- Menu items
- Profile dropdown options
- Color theme
- Mobile menu
- Notification badges
```

---

## 🔄 IMPLEMENTATION STEPS

### STEP 1: Add Role Detection Utility ✅ DONE
**File**: `Frontend/src/utils/roleDetection.js`

This file contains:
```javascript
- USER_TYPES constant (all role types)
- determineUserType() function
- getNavbarItems() function
- getProfileMenuItems() function
- getNavbarColor() function
- canAccessRoute() function (for route guards)
- getNavbarBadges() function (for notifications)
```

✅ This is READY to use. No changes needed in User model yet.

---

### STEP 2: Replace Current Navbar ⚠️ REQUIRES ACTION

**File**: `Frontend/src/components/common/navbar.jsx`

#### Option A: Use Improved Navbar Immediately
```bash
# Rename current navbar as backup
mv Frontend/src/components/common/navbar.jsx \
   Frontend/src/components/common/navbar_OLD.jsx

# Use improved navbar
mv Frontend/src/components/common/navbar_IMPROVED.jsx \
   Frontend/src/components/common/navbar.jsx
```

**Changes you'll see:**
- Different colors for different roles
- More menu items for volunteers & NGO admins
- Better mobile experience

**Currently supported without database changes:**
- ✅ Visitor (auto-detected, not logged in)
- ✅ Regular User (any logged-in user)
- ✅ Admin (role = "admin")
- ✅ Superadmin (role = "superadmin")

**Will need backend updates for:**
- ⚠️ Volunteer detection (needs User.volunteerApproved field)
- ⚠️ NGO Admin detection (needs User.ngoId field)

#### Option B: Gradually Migrate
Replace piece by piece in existing navbar.jsx:

```javascript
// Add this import
import {
  determineUserType,
  getNavbarItems,
  getProfileMenuItems,
  getNavbarColor,
  USER_TYPES,
} from "../../utils/roleDetection.js";

// Add this to useEffect
const currentUser = readUser();
const type = determineUserType(currentUser);
setUserType(type);

// Use in render
const items = getNavbarItems(userType);
const profileItems = getProfileMenuItems(userType);
```

---

### STEP 3: Update User Model ⚠️ DATABASE CHANGE

**File**: `Backend/models/user.model.js`

Add these fields to track volunteer and NGO status:

```javascript
// Add to user schema:

volunteerApproved: {
  type: Boolean,
  default: false
},

volunteerStatus: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: null
},

ngoId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "NGO",
  default: null
},

ngoRole: {
  type: String,
  enum: ["owner", "manager", "coordinator"],
  default: null  // Only set if ngoId is set
},

// Track audit
updatedAt: {
  type: Date,
  default: Date.now
}
```

---

### STEP 4: Update Backend API ⚠️ NEW ENDPOINT

**File**: `Backend/controllers/auth.controller.js` or `Backend/controllers/user.controller.js`

Add endpoint to get user type:

```javascript
export const getUserType = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "role volunteerApproved ngoId"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Determine type
    let userType = "regular";
    if (user.role === "superadmin") userType = "superadmin";
    else if (user.role === "admin") userType = "admin";
    else if (user.ngoId) userType = "ngoAdmin";
    else if (user.volunteerApproved) userType = "volunteer";

    res.json({
      success: true,
      userType,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

Add route:
```javascript
// Backend/routes/auth.routes.js
router.get("/user-type", verifyToken, getUserType);
```

---

### STEP 5: Update Navbar to Fetch User Type ⚠️ FRONTEND FETCH

**Update navbar useEffect**:

```javascript
useEffect(() => {
  const syncAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserType(USER_TYPES.VISITOR);
      return;
    }

    try {
      // Fetch user type from backend (more accurate)
      const response = await fetch("http://localhost:5000/api/user-type", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserType(data.userType);
        setUser(data.user);
      }
    } catch (error) {
      // Fallback to local determination
      const currentUser = readUser();
      setUserType(determineUserType(currentUser));
    }
  };

  syncAuth();
}, []);
```

---

### STEP 6: Update Admin Approval Flow ⚠️ CRUD OPERATION

When admin approves a volunteer application:

```javascript
// Backend/controllers/admin.controller.js
export const updateVolunteerStatus = async (req, res) => {
  try {
    const { volunteerId, status } = req.body; // status: "approved" or "rejected"
    
    const volunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { status },
      { new: true }
    );

    if (status === "approved") {
      // Update User model to mark as approved
      await User.findByIdAndUpdate(
        volunteer.user,
        {
          volunteerApproved: true,
          volunteerStatus: "approved"
        }
      );

      // Send email notification
      await sendEmail(volunteer.email, 
        "Volunteer Application Approved", 
        "You've been approved as a volunteer!");
    }

    res.json({ success: true, volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

### STEP 7: Update NGO Registration Flow ⚠️ CRUD OPERATION

When user adds an NGO and admin approves:

```javascript
// Backend/controllers/admin.controller.js
export const approveNgoRegistration = async (req, res) => {
  try {
    const { ngoId, userId } = req.body;
    
    const ngo = await NGO.findByIdAndUpdate(
      ngoId,
      { status: "approved" },
      { new: true }
    );

    // Link user to NGO
    await User.findByIdAndUpdate(
      userId,
      {
        ngoId: ngoId,
        ngoRole: "owner" // They are the owner/founder
      }
    );

    res.json({ success: true, ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## 🚀 QUICK IMPLEMENTATION CHECKLIST

### Fast Track (Get Working Today)
- [x] Add roleDetection.js utility
- [ ] Backup current navbar as navbar_OLD.jsx
- [ ] Replace navbar.jsx with navbar_IMPROVED.jsx
- [ ] Test with different user roles (manual localStorage editing)
- **Time: 30 minutes**

### Complete Implementation (Full Features)
- [ ] Add fields to User model (volunteerApproved, ngoId)
- [ ] Create /api/user-type endpoint
- [ ] Update volunteer approval to set User.volunteerApproved
- [ ] Update NGO approval to set User.ngoId
- [ ] Update navbar to fetch from /api/user-type
- [ ] Create NGO admin dashboard routes
- [ ] Create volunteer dashboard routes
- [ ] Test full flow
- **Time: 8-10 hours**

---

## 🧪 TESTING THE NAVBAR

### Manual Testing (Without Backend Changes)
1. Login as regular user
   ```javascript
   localStorage.setItem("user", JSON.stringify({name: "John", role: "user"}));
   localStorage.setItem("token", "test-token");
   ```
   → Should see BLUE navbar with "My Profile, My Donations, Settings"

2. Login as admin
   ```javascript
   localStorage.setItem("user", JSON.stringify({name: "Admin", role: "admin"}));
   localStorage.setItem("token", "test-token");
   ```
   → Should see TEAL navbar with admin menu items

3. Login as superadmin
   ```javascript
   localStorage.setItem("user", JSON.stringify({name: "CEO", role: "superadmin"}));
   localStorage.setItem("token", "test-token");
   ```
   → Should see RED navbar with superadmin menu items

4. Not logged in
   → Should see GREEN navbar with LOGIN button

### Automated Testing (With Backend)
```javascript
// tests/navbar.test.js
import { determineUserType, USER_TYPES } from '../utils/roleDetection';

describe('Role Detection', () => {
  test('Visitor detected correctly', () => {
    expect(determineUserType(null)).toBe(USER_TYPES.VISITOR);
  });

  test('Regular user detected', () => {
    const user = { role: "user" };
    expect(determineUserType(user)).toBe(USER_TYPES.REGULAR);
  });

  test('Admin detected', () => {
    const user = { role: "admin" };
    expect(determineUserType(user)).toBe(USER_TYPES.ADMIN);
  });

  test('Volunteer detected', () => {
    const user = { role: "user", volunteerApproved: true };
    expect(determineUserType(user)).toBe(USER_TYPES.VOLUNTEER);
  });

  test('NGO Admin detected', () => {
    const user = { role: "user", ngoId: "123" };
    expect(determineUserType(user)).toBe(USER_TYPES.NGO_ADMIN);
  });
});
```

---

## 📊 NAVBAR MENU DIFFERENCES

| Feature | Visitor | Regular | Volunteer | NGO Admin | Admin | Superadmin |
|---------|---------|---------|-----------|-----------|-------|-----------|
| Home | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Services | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Find NGOs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Donate | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Volunteer | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profile | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tasks | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| NGO Dashboard | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Admin Panel | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Superadmin | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎨 NAVBAR COLORS

```
Visitor:    🟢 Green (#2e7d32)
Regular:    🔵 Blue (#1976d2)
Volunteer:  🟠 Orange (#f57c00)
NGO Admin:  🟣 Purple (#7b1fa2)
Admin:      🔷 Teal (#00796b)
Superadmin: 🔴 Red (#c62828)
```

This helps users visually understand their role!

---

## ⚠️ IMPORTANT NOTES

1. **Client-side role ≠ Server-side security**
   - User can edit localStorage to fake their role
   - Backend MUST verify role before returning sensitive data
   - This navbar system is for UX only

2. **Backend must always check permissions**
   ```javascript
   // ALWAYS verify on backend
   if (req.user.role !== "admin") {
     return res.status(403).json({ error: "Unauthorized" });
   }
   ```

3. **Update cascading**
   - When admin approves volunteer → Set User.volunteerApproved
   - When NGO approved → Set User.ngoId
   - Navbar automatically detects these changes

4. **Testing in development**
   - Edit localStorage to test different roles
   - Press F12 → Console → run the testing commands above
   - Refresh page to see navbar change

---

## 🎯 NEXT STEPS

**This Week:**
1. Add roleDetection.js ✅ DONE
2. Test improved navbar with manual localStorage editing
3. Swap navbar.jsx files

**Next Week:**
1. Update User model with new fields
2. Create /api/user-type endpoint
3. Update volunteer approval flow
4. Update NGO approval flow
5. Test full integration

**After That:**
1. Create NGO Admin Dashboard
2. Create Volunteer Dashboard
3. Create Superadmin Dashboard

---

## 💡 BENEFITS OF THIS APPROACH

✅ **Better UX**: Users only see relevant features
✅ **Better Security**: Reduced attack surface (fewer visible endpoints)
✅ **Professional**: Enterprise-grade role system
✅ **Scalable**: Easy to add new roles
✅ **Maintainable**: Centralized role logic
✅ **Testable**: Can test each role independently
✅ **Consistent**: Same role detection logic everywhere

