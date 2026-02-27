import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Clock, CheckCircle, Check, X, Hand, Lightbulb, Mail, Phone, Calendar, AlertCircle, UserCheck, UserX } from 'lucide-react';
import { API_BASE_URL } from './NgoLayout';
import './ngo.css';

export default function NgoVolunteers() {
  const { ngoData } = useOutletContext();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/ngo-dashboard/volunteers`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setVolunteers(data.volunteers || []);
      }
    } catch (err) {
      console.error('Failed to fetch volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (volunteerId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/ngo-dashboard/volunteers/${volunteerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setVolunteers(prev => 
          prev.map(v => 
            v._id === volunteerId ? { ...v, status: newStatus } : v
          )
        );
        setMessage({ 
          type: 'success', 
          text: `Volunteer ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!` 
        });
        
        // Auto-hide message after 3s
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message || 'Failed to update status' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredVolunteers = volunteers.filter(v => {
    if (filter === 'all') return true;
    return v.status === filter;
  });

  const stats = {
    total: volunteers.length,
    pending: volunteers.filter(v => v.status === 'pending').length,
    approved: volunteers.filter(v => v.status === 'approved').length,
    rejected: volunteers.filter(v => v.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="ngo-loading-screen">
        <div className="ngo-loading-spinner"></div>
        <p>Loading volunteers...</p>
      </div>
    );
  }

  return (
    <div className="ngo-volunteers-page">
      {/* Page Header */}
      <div className="ngo-page-header">
        <div className="page-header-content">
          <h1>Volunteer Management</h1>
          <p>Review applications and manage your volunteer team</p>
        </div>
        {stats.pending > 0 && (
          <div className="header-badge attention">
            <Clock size={14} /> {stats.pending} pending review
          </div>
        )}
      </div>

      {/* Alert Message */}
      {message.text && (
        <div className={`ngo-alert ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="alert-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="volunteer-stats-row">
        <div className="volunteer-stat-card">
          <div className="stat-icon purple"><Users size={20} /></div>
          <div className="stat-content">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Applications</span>
          </div>
        </div>
        <div className="volunteer-stat-card">
          <div className="stat-icon orange"><Clock size={20} /></div>
          <div className="stat-content">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending Review</span>
          </div>
        </div>
        <div className="volunteer-stat-card highlight">
          <div className="stat-icon green"><UserCheck size={20} /></div>
          <div className="stat-content">
            <span className="stat-number">{stats.approved}</span>
            <span className="stat-label">Active Volunteers</span>
          </div>
        </div>
      </div>

      {/* Volunteers List */}
      <div className="ngo-section">
        <div className="ngo-section-header">
          <h2>Applications</h2>
          <div className="filter-tabs">
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'pending' && stats.pending > 0 && (
                  <span className="filter-badge">{stats.pending}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="ngo-section-body">
          {filteredVolunteers.length > 0 ? (
            <div className="volunteers-list">
              {filteredVolunteers.map((volunteer) => (
                <div key={volunteer._id} className="volunteer-card">
                  <div className="volunteer-avatar">
                    {getInitials(volunteer.name)}
                  </div>
                  <div className="volunteer-info">
                    <h4>{volunteer.name || 'Anonymous'}</h4>
                    <div className="volunteer-meta">
                      <span><Mail size={12} /> {volunteer.email}</span>
                      {volunteer.phone && <span><Phone size={12} /> {volunteer.phone}</span>}
                      <span><Calendar size={12} /> {formatDate(volunteer.createdAt)}</span>
                    </div>
                  </div>
                  <div className="volunteer-actions">
                    {volunteer.status === 'pending' ? (
                      <>
                        <button
                          className="action-btn approve"
                          onClick={() => handleStatusUpdate(volunteer._id, 'approved')}
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleStatusUpdate(volunteer._id, 'rejected')}
                        >
                          <X size={16} /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`status-pill ${volunteer.status}`}>
                        {volunteer.status === 'approved' ? <UserCheck size={14} /> : <UserX size={14} />}
                        {volunteer.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ngo-empty-state">
              <Users size={56} strokeWidth={1.5} />
              <h4>
                {filter === 'all' 
                  ? 'No volunteer applications yet' 
                  : `No ${filter} applications`}
              </h4>
              <p>
                {filter === 'all'
                  ? 'When people apply to volunteer with your organization, they will appear here.'
                  : `You don't have any ${filter} volunteer applications.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      {volunteers.length > 0 && (
        <div className="ngo-tips-card" style={{ marginTop: '24px' }}>
          <div className="tips-header">
            <Lightbulb size={18} />
            <h4>Tips for Managing Volunteers</h4>
          </div>
          <ul className="tips-list">
            <li>Review volunteer applications promptly to keep applicants engaged</li>
            <li>Approved volunteers will receive an email notification</li>
            <li>You can view volunteer contact details to reach out directly</li>
            <li>Consider skills and availability when matching volunteers to tasks</li>
          </ul>
        </div>
      )}
    </div>
  );
}
