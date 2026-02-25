import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import "./admin.css";

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { path: "/admin/ngos", label: "NGOs", icon: "🏢" },
  { path: "/admin/volunteers", label: "Volunteers", icon: "🤝" },
  { path: "/admin/contacts", label: "Contacts", icon: "✉️" },
  { path: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { path: "/admin/users", label: "Users", icon: "👥" },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCounts, setPendingCounts] = useState({ ngos: 0, volunteers: 0, contacts: 0 });

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      sessionStorage.setItem("flash_message", JSON.stringify({ type: "error", message: "Admin access required." }));
      navigate("/login", { replace: true });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setPendingCounts({
            ngos: d.data.stats.pendingNgos || 0,
            volunteers: d.data.stats.pendingVolunteers || 0,
            contacts: d.data.stats.newContacts || 0
          });
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const getBadge = (label) => {
    if (label === "NGOs" && pendingCounts.ngos > 0) return pendingCounts.ngos;
    if (label === "Volunteers" && pendingCounts.volunteers > 0) return pendingCounts.volunteers;
    if (label === "Contacts" && pendingCounts.contacts > 0) return pendingCounts.contacts;
    return null;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>{user?.name || "Administrator"}</p>
        </div>
        <ul className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={isActive(item) ? "active" : ""}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                {getBadge(item.label) && (
                  <span className="nav-badge">{getBadge(item.label)}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
export { API_BASE_URL };
