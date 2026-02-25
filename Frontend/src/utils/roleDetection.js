/**
 * Role Detection Utility
 * Determines what type of user is accessing the platform
 */

export const USER_TYPES = {
  VISITOR: "visitor",
  REGULAR: "regular",
  VOLUNTEER: "volunteer",
  NGO_ADMIN: "ngoAdmin",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
};

/**
 * Determine user type based on user object and localStorage
 * @param {Object} user - User object from localStorage
 * @returns {string} - User type from USER_TYPES
 */
export const determineUserType = (user) => {
  if (!user) return USER_TYPES.VISITOR;

  // Check database role field (requires backend update)
  if (user.role === "superadmin") return USER_TYPES.SUPERADMIN;
  if (user.role === "admin") return USER_TYPES.ADMIN;

  // Check if user has approved volunteer application
  // This assumes the User model tracks volunteer status
  if (user.volunteerApproved === true) return USER_TYPES.VOLUNTEER;

  // Check if user manages an NGO
  // This assumes the User model tracks ngoId
  if (user.ngoId) return USER_TYPES.NGO_ADMIN;

  // Default: regular user
  return USER_TYPES.REGULAR;
};

/**
 * Get navbar items based on user type
 * @param {string} userType - User type from USER_TYPES
 * @returns {Array} - Array of navbar items to display
 */
export const getNavbarItems = (userType) => {
  const commonItems = [
    { label: "Home", path: "/", public: true },
    { label: "Services", path: "/services", public: true },
    { label: "Find NGOs", path: "/find-ngos", public: true },
    { label: "Contact Us", path: "/contact", public: true },
  ];

  const itemsByType = {
    [USER_TYPES.VISITOR]: commonItems,

    [USER_TYPES.REGULAR]: [
      ...commonItems,
      { label: "Donate", path: "/donate", badge: "red" },
    ],

    [USER_TYPES.VOLUNTEER]: [
      ...commonItems,
      { label: "My Tasks", path: "/volunteer/tasks", badge: "orange" },
    ],

    [USER_TYPES.NGO_ADMIN]: [
      { label: "Home", path: "/" },
      { label: "Services", path: "/services" },
    ],

    [USER_TYPES.ADMIN]: [
      { label: "Home", path: "/" },
      { label: "Admin Dashboard", path: "/admin" },
    ],

    [USER_TYPES.SUPERADMIN]: [
      { label: "Home", path: "/" },
      { label: "Superadmin", path: "/superadmin" },
      { label: "Admin", path: "/admin" },
    ],
  };

  return itemsByType[userType] || commonItems;
};

/**
 * Get profile menu items based on user type
 * @param {string} userType - User type
 * @returns {Array} - Profile dropdown menu items
 */
export const getProfileMenuItems = (userType) => {
  const menusByType = {
    [USER_TYPES.VISITOR]: [],

    [USER_TYPES.REGULAR]: [
      { label: "👤 My Profile", path: "/profile" },
      { label: "💰 My Donations", path: "/profile/donations" },
      { label: "⚙️ Settings", path: "/profile/settings" },
    ],

    [USER_TYPES.VOLUNTEER]: [
      { label: "🟡 Volunteer Dashboard", path: "/volunteer" },
      { label: "📋 My Tasks", path: "/volunteer/tasks" },
      { label: "⏱️ Hours Logged", path: "/volunteer/hours" },
      { label: "🎖️ Certificates", path: "/volunteer/certificates" },
      { label: "💬 Messages", path: "/volunteer/messages" },
      { label: "👤 My Profile", path: "/profile" },
      { label: "⚙️ Settings", path: "/profile/settings" },
    ],

    [USER_TYPES.NGO_ADMIN]: [
      { label: "🏢 NGO Dashboard", path: "/ngo/dashboard" },
      { label: "📊 Campaigns", path: "/ngo/campaigns" },
      { label: "👥 Volunteers", path: "/ngo/volunteers" },
      { label: "💰 Donors", path: "/ngo/donors" },
      { label: "📈 Analytics", path: "/ngo/analytics" },
      { label: "📄 Reports", path: "/ngo/reports" },
      { label: "⚙️ NGO Settings", path: "/ngo/settings" },
      { label: "👤 My Profile", path: "/profile" },
    ],

    [USER_TYPES.ADMIN]: [
      { label: "🔵 Admin Dashboard", path: "/admin" },
      { label: "📋 NGO Applications", path: "/admin/ngos" },
      { label: "👥 Volunteers", path: "/admin/volunteers" },
      { label: "📞 Contacts", path: "/admin/contacts" },
      { label: "👨‍👩‍👩‍👦 Users", path: "/admin/users" },
      { label: "💰 Payments", path: "/admin/payments" },
      { label: "📊 Analytics", path: "/admin/analytics" },
      { label: "⚙️ Settings", path: "/admin/settings" },
    ],

    [USER_TYPES.SUPERADMIN]: [
      { label: "🔴 Superadmin Dashboard", path: "/superadmin" },
      { label: "💳 Revenue Dashboard", path: "/superadmin/revenue" },
      { label: "👨‍💼 Admin Management", path: "/superadmin/admins" },
      { label: "🗄️ Database", path: "/superadmin/database" },
      { label: "---", divider: true }, // Divider
      { label: "🔵 Admin Features", path: "/admin" },
      { label: "⚙️ System Settings", path: "/admin/settings" },
    ],
  };

  return menusByType[userType] || [];
};

/**
 * Get navbar color based on user type
 * @param {string} userType - User type
 * @returns {string} - Color hex code
 */
export const getNavbarColor = (userType) => {
  const colorsByType = {
    [USER_TYPES.VISITOR]: "#2e7d32", // Green
    [USER_TYPES.REGULAR]: "#1976d2", // Blue
    [USER_TYPES.VOLUNTEER]: "#f57c00", // Orange
    [USER_TYPES.NGO_ADMIN]: "#7b1fa2", // Purple
    [USER_TYPES.ADMIN]: "#00796b", // Teal
    [USER_TYPES.SUPERADMIN]: "#c62828", // Red
  };

  return colorsByType[userType] || "#2e7d32";
};

/**
 * Check if user has access to a route
 * @param {string} userType - User type
 * @param {string} routePath - Path to check
 * @returns {boolean} - Whether user can access this route
 */
export const canAccessRoute = (userType, routePath) => {
  // Public routes accessible to all
  const publicRoutes = ["/", "/services", "/find-ngos", "/contact", "/login"];
  if (publicRoutes.includes(routePath)) return true;

  // Route access by user type
  const accessMatrix = {
    [USER_TYPES.VISITOR]: publicRoutes,
    [USER_TYPES.REGULAR]: [...publicRoutes, "/donate", "/volunteer", "/profile"],
    [USER_TYPES.VOLUNTEER]: [...publicRoutes, "/donate", "/volunteer", "/profile"],
    [USER_TYPES.NGO_ADMIN]: [...publicRoutes, "/ngo/*", "/donate", "/volunteer", "/profile"],
    [USER_TYPES.ADMIN]: [...publicRoutes, "/admin/*"],
    [USER_TYPES.SUPERADMIN]: [...publicRoutes, "/admin/*", "/superadmin/*"],
  };

  return accessMatrix[userType]?.some((route) => {
    if (route.includes("*")) {
      const baseRoute = route.replace("*", "");
      return routePath.startsWith(baseRoute);
    }
    return routePath === route;
  }) || false;
};

/**
 * Get notification count badges
 * @param {string} userType - User type
 * @param {Object} counts - Count object with pending items
 * @returns {Object} - Badge information
 */
export const getNavbarBadges = (userType, counts = {}) => {
  const badgesByType = {
    [USER_TYPES.ADMIN]: {
      ngos: counts.pendingNgos || 0,
      volunteers: counts.pendingVolunteers || 0,
      contacts: counts.newContacts || 0,
      payments: counts.pendingPayments || 0,
    },

    [USER_TYPES.NGO_ADMIN]: {
      donors: counts.newDonors || 0,
      tasks: counts.tasksToAssign || 0,
      pending: counts.pendingFunds || 0,
    },

    [USER_TYPES.VOLUNTEER]: {
      tasks: counts.newTasks || 0,
      messages: counts.unreadMessages || 0,
    },
  };

  return badgesByType[userType] || {};
};
