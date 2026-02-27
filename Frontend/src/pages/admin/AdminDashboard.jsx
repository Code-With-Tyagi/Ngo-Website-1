import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Building2, Clock, CheckCircle, Handshake, Mail, Bell } from "lucide-react";
import { API_BASE_URL } from "./AdminLayout.jsx";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    })
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;
  if (!data) return <div className="admin-loading">Failed to load dashboard data.</div>;

  const { stats, recent } = data;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, bg: "#dbeafe", color: "#1e40af", link: "/admin/users" },
    { label: "Total NGOs", value: stats.totalNgos, icon: Building2, bg: "#f0fdf4", color: "#166534" },
    { label: "Pending NGOs", value: stats.pendingNgos, icon: Clock, bg: "#fef9c3", color: "#854d0e", link: "/admin/ngos?status=pending" },
    { label: "Verified NGOs", value: stats.verifiedNgos, icon: CheckCircle, bg: "#dcfce7", color: "#166534" },
    { label: "Total Volunteers", value: stats.totalVolunteers, icon: Handshake, bg: "#ede9fe", color: "#5b21b6" },
    { label: "Pending Volunteers", value: stats.pendingVolunteers, icon: Clock, bg: "#fef9c3", color: "#854d0e", link: "/admin/volunteers?status=Pending" },
    { label: "Total Contacts", value: stats.totalContacts, icon: Mail, bg: "#fce7f3", color: "#9d174d" },
    { label: "New Contacts", value: stats.newContacts, icon: Bell, bg: "#fee2e2", color: "#991b1b", link: "/admin/contacts?status=New" },
  ];

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="admin-stats-grid">
        {statCards.map((c, i) => (
          <div
            key={i}
            className="admin-stat-card"
            style={{ cursor: c.link ? "pointer" : "default" }}
            onClick={() => c.link && (window.location.hash = "", window.location.href = c.link)}
          >
            <div className="admin-stat-icon" style={{ background: c.bg, color: c.color }}><c.icon size={24} /></div>
            <div className="admin-stat-info">
              <h3>{c.value}</h3>
              <p>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-recent-grid">
        {/* Recent NGOs */}
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>Recent NGOs</h3>
            <Link to="/admin/ngos" style={{ fontSize: "0.82rem", color: "#2563eb", textDecoration: "none" }}>View All →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.ngos.length === 0 ? (
                <tr><td colSpan="3" className="admin-empty">No NGOs yet</td></tr>
              ) : recent.ngos.map((n) => (
                <tr key={n._id}>
                  <td>{n.ngoName}</td>
                  <td><span className={`admin-badge ${n.isVerified ? "green" : "yellow"}`}>{n.isVerified ? "Verified" : "Pending"}</span></td>
                  <td>{formatDate(n.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Volunteers */}
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>Recent Volunteers</h3>
            <Link to="/admin/volunteers" style={{ fontSize: "0.82rem", color: "#2563eb", textDecoration: "none" }}>View All →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.volunteers.length === 0 ? (
                <tr><td colSpan="3" className="admin-empty">No volunteers yet</td></tr>
              ) : recent.volunteers.map((v) => (
                <tr key={v._id}>
                  <td>{v.fullName}</td>
                  <td>
                    <span className={`admin-badge ${v.status === "Approved" ? "green" : v.status === "Rejected" ? "red" : "yellow"}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>{formatDate(v.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Contacts */}
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>Recent Contacts</h3>
            <Link to="/admin/contacts" style={{ fontSize: "0.82rem", color: "#2563eb", textDecoration: "none" }}>View All →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.contacts.length === 0 ? (
                <tr><td colSpan="3" className="admin-empty">No contacts yet</td></tr>
              ) : recent.contacts.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.subject}</td>
                  <td>
                    <span className={`admin-badge ${c.status === "Resolved" ? "green" : c.status === "Spam" ? "red" : c.status === "In Progress" ? "blue" : "yellow"}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Users */}
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>Recent Users</h3>
            <Link to="/admin/users" style={{ fontSize: "0.82rem", color: "#2563eb", textDecoration: "none" }}>View All →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recent.users.length === 0 ? (
                <tr><td colSpan="3" className="admin-empty">No users yet</td></tr>
              ) : recent.users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</td>
                  <td>{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
