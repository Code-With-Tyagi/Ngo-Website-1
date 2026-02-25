import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "./AdminLayout.jsx";

const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

function AdminVolunteers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [actionLoading, setActionLoading] = useState(null);

  const token = localStorage.getItem("token");

  const fetchVolunteers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", page);
    params.set("limit", 10);

    fetch(`${API_BASE_URL}/api/admin/volunteers?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setVolunteers(d.data);
          setPagination(d.pagination);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, statusFilter, page, token]);

  useEffect(() => { fetchVolunteers(); }, [fetchVolunteers]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [search, statusFilter, page, setSearchParams]);

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/volunteers/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ status })
      });
      const d = await res.json();
      if (d.success) fetchVolunteers();
      else alert(d.message || "Failed to update status");
    } catch { alert("Network error"); }
    finally { setActionLoading(null); }
  };

  const deleteVolunteer = async (id, name) => {
    if (!confirm(`Delete volunteer "${name}"? This cannot be undone.`)) return;
    setActionLoading(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/volunteers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      });
      const d = await res.json();
      if (d.success) fetchVolunteers();
      else alert(d.message || "Failed to delete");
    } catch { alert("Network error"); }
    finally { setActionLoading(null); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div>
      <h1 className="admin-page-title">Manage Volunteers</h1>

      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search by name, email, city..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="admin-search-input"
        />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="admin-filter-select">
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="admin-table-wrapper">
        {loading ? (
          <div className="admin-loading">Loading volunteers...</div>
        ) : volunteers.length === 0 ? (
          <div className="admin-empty-state">No volunteers found.</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email / Phone</th>
                  <th>City</th>
                  <th>ID Type</th>
                  <th>ID Verified</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(v => (
                  <tr key={v._id}>
                    <td><strong>{v.fullName}</strong></td>
                    <td>
                      {v.email}
                      <br /><small style={{ color: "#6b7280" }}>{v.phone}</small>
                    </td>
                    <td>{v.city}</td>
                    <td>{v.idType || "—"}</td>
                    <td>
                      <span className={`admin-badge ${v.idVerified ? "green" : "gray"}`}>
                        {v.idVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${v.status === "Approved" ? "green" : v.status === "Rejected" ? "red" : "yellow"}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>{formatDate(v.createdAt)}</td>
                    <td>
                      <div className="admin-action-group">
                        {v.status !== "Approved" && (
                          <button
                            className="admin-action-btn approve"
                            disabled={actionLoading === v._id}
                            onClick={() => updateStatus(v._id, "Approved")}
                          >
                            ✓ Approve
                          </button>
                        )}
                        {v.status !== "Rejected" && (
                          <button
                            className="admin-action-btn reject"
                            disabled={actionLoading === v._id}
                            onClick={() => updateStatus(v._id, "Rejected")}
                          >
                            ✗ Reject
                          </button>
                        )}
                        <button
                          className="admin-action-btn delete"
                          disabled={actionLoading === v._id}
                          onClick={() => deleteVolunteer(v._id, v.fullName)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.pages > 1 && (
              <div className="admin-pagination">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span>Page {page} of {pagination.pages} ({pagination.total} total)</span>
                <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminVolunteers;
