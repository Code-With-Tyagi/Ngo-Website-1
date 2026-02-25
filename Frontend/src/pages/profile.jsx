import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaMapMarkerAlt,
  FaCamera,
  FaHeart,
  FaHandHoldingHeart,
  FaSignOutAlt,
  FaDownload,
  FaSpinner
} from 'react-icons/fa';
import './profile.css';

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const readStoredUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if (parsed.data && typeof parsed.data === 'object') return parsed.data;
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const persistUserToStorage = (profile) => {
  if (!profile) return;

  try {
    localStorage.setItem('user', JSON.stringify(profile));
    return;
  } catch {
    const fallbackProfile = { ...profile };

    if (typeof fallbackProfile.avatar === 'string' && fallbackProfile.avatar.startsWith('data:')) {
      fallbackProfile.avatar = null;
    }

    try {
      localStorage.setItem('user', JSON.stringify(fallbackProfile));
    } catch {
      // Keep UI functional even if storage quota is exceeded.
    }
  }
};

const toPersonalFormState = (profile) => ({
  name: profile?.name || '',
  phone: profile?.phone || '',
  address: profile?.address || '',
  city: profile?.city || '',
  state: profile?.state || '',
});

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState(toPersonalFormState(null));
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveNotice, setSaveNotice] = useState({ type: '', message: '' });
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changePasswordNotice, setChangePasswordNotice] = useState({ type: '', message: '' });
  const [changingPassword, setChangingPassword] = useState(false);



  // Placeholder history sections (replace with backend data when APIs are ready).
  const donationHistory = [
    { id: 1, date: '12 Jan 2026', program: 'Clean Water Project', amount: 5000, status: 'Successful' },
    { id: 2, date: '20 Dec 2025', program: 'Rural Education Fund', amount: 2500, status: 'Successful' },
  ];

  const volunteerActivity = [
    { id: 1, ngo: 'EcoGuardians India', role: 'Event Coordinator', status: 'Approved', date: 'June 2025' },
    { id: 2, ngo: 'Youth for Future', role: 'Mentor', status: 'Pending', date: 'July 2025' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    const cachedUser = readStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
      setProfileForm(toPersonalFormState(cachedUser));
      setAvatarPreview(cachedUser.avatar || '');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.success || !data?.data) {
          throw new Error(data?.message || 'Unable to fetch profile');
        }

        if (!isMounted) return;
        setUser(data.data);
        setProfileForm(toPersonalFormState(data.data));
        setAvatarPreview(data.data.avatar || '');
        setSelectedAvatarFile(null);
        persistUserToStorage(data.data);
        window.dispatchEvent(new Event('authChanged'));
      } catch (error) {
        if (!cachedUser) {
          console.error('Profile fetch failed:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileInputChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveNotice({ type: 'error', message: 'Please select a valid image file.' });
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveNotice({ type: 'error', message: 'Image size should be up to 5MB only.' });
      event.target.value = '';
      return;
    }

    setSelectedAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || '');
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleCancelPersonalInfo = () => {
    setProfileForm(toPersonalFormState(user));
    setAvatarPreview(user?.avatar || '');
    setSelectedAvatarFile(null);
    setSaveNotice({ type: '', message: '' });
  };

  const handleSavePersonalInfo = async (event) => {
    event.preventDefault();
    setSaveNotice({ type: '', message: '' });

    const token = localStorage.getItem('token');
    if (!token) {
      setSaveNotice({ type: 'error', message: 'Please log in again to update profile.' });
      return;
    }

    const cleanName = profileForm.name.trim();
    if (!cleanName) {
      setSaveNotice({ type: 'error', message: 'Full name is required.' });
      return;
    }

    setSavingProfile(true);

    try {
      const formData = new FormData();
      formData.append('name', cleanName);
      formData.append('phone', profileForm.phone.trim());
      formData.append('address', profileForm.address.trim());
      formData.append('city', profileForm.city.trim());
      formData.append('state', profileForm.state.trim());

      if (selectedAvatarFile) {
        formData.append('avatar', selectedAvatarFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success || !data?.data) {
        throw new Error(data?.message || 'Failed to save profile changes');
      }

      setUser(data.data);
      setProfileForm(toPersonalFormState(data.data));
      setAvatarPreview(data.data.avatar || '');
      setSelectedAvatarFile(null);
      persistUserToStorage(data.data);
      window.dispatchEvent(new Event('authChanged'));
      setSaveNotice({ type: 'success', message: 'Changes saved successfully.' });
    } catch (error) {
      setSaveNotice({ type: 'error', message: error.message || 'Unable to save profile changes.' });
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    if (!saveNotice.message) return undefined;

    const timer = setTimeout(() => {
      setSaveNotice({ type: '', message: '' });
    }, 2500);

    return () => clearTimeout(timer);
  }, [saveNotice.message]);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const openChangePasswordModal = () => {
    setChangePasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setChangePasswordNotice({ type: '', message: '' });
    setShowChangePasswordModal(true);
  };

  const closeChangePasswordModal = () => {
    if (changingPassword) return;
    setShowChangePasswordModal(false);
    setChangePasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setChangePasswordNotice({ type: '', message: '' });
  };

  const handleChangePasswordInput = (field, value) => {
    setChangePasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();
    setChangePasswordNotice({ type: '', message: '' });

    const token = localStorage.getItem('token');
    if (!token) {
      setChangePasswordNotice({ type: 'error', message: 'Please log in again to change password.' });
      return;
    }

    const currentPassword = changePasswordForm.currentPassword;
    const newPassword = changePasswordForm.newPassword;
    const confirmPassword = changePasswordForm.confirmPassword;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordNotice({ type: 'error', message: 'All password fields are required.' });
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordNotice({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordNotice({ type: 'error', message: 'New password and confirm password must match.' });
      return;
    }

    if (currentPassword === newPassword) {
      setChangePasswordNotice({ type: 'error', message: 'New password must be different from current password.' });
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Unable to change password');
      }

      closeChangePasswordModal();
      setSaveNotice({ type: 'success', message: data.message || 'Password changed successfully.' });
    } catch (error) {
      setChangePasswordNotice({ type: 'error', message: error.message || 'Unable to change password.' });
    } finally {
      setChangingPassword(false);
    }
  };

  const persistVerifiedUser = (profile) => {
    setUser(profile);
    persistUserToStorage(profile);
    window.dispatchEvent(new Event('authChanged'));
  };

  if (loading) {
    return (
      <div className="profile-loading profile-loading-animated">
        <div className="profile-loader-ring">
          <FaSpinner className="spinner-icon" />
        </div>
        <p>Loading profile...</p>
        <span>Setting up your dashboard</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-loading">
        <p>Please log in to view your profile.</p>
        <Link to="/login" className="btn-donate-now">Go to Login</Link>
      </div>
    );
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userState = user.state || 'Not Provided';
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Recently Joined';
  const visibleAvatar = avatarPreview || user.avatar || '';

  // --- RENDER FUNCTIONS ---

  const renderSidebar = () => (
    <aside className="profile-sidebar">
      <div className="user-short-profile">
        <div className="sidebar-avatar">
          {visibleAvatar ? <img src={visibleAvatar} alt="Profile" /> : userInitial}
        </div>
        <h3>{user.name || 'User'}</h3>
        <p className="user-email-mini">{user.email || 'Not Available'}</p>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaUser className="nav-icon" /> Overview
        </button>
        <button
          className={`nav-item ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <FaUser className="nav-icon" /> Personal Info
        </button>
        <button
          className={`nav-item ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          <FaHeart className="nav-icon" /> Donation History
        </button>
        <button
          className={`nav-item ${activeTab === 'volunteer' ? 'active' : ''}`}
          onClick={() => setActiveTab('volunteer')}
        >
          <FaHandHoldingHeart className="nav-icon" /> Volunteer Activity
        </button>
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" /> Logout
        </button>
      </nav>
    </aside>
  );

  const renderOverview = () => (
    <div className="tab-content fade-in">
      <h2>Profile Overview</h2>

      <div className="overview-card">
        <div className="overview-top">
          <div className="overview-avatar-large">
            {visibleAvatar ? <img src={visibleAvatar} alt="Profile" /> : userInitial}
          </div>
          <div className="overview-details">
            <div className="name-header">
              <h3>{user.name || 'User'}</h3>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Email</label>
                <span>{user.email || 'Not Available'}</span>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <span>{user.phone || 'Not Provided'}</span>
              </div>
              <div className="detail-item">
                <label>Member Since</label>
                <span>{memberSince}</span>
              </div>
              <div className="detail-item">
                <label>State</label>
                <span>{userState}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="tab-content fade-in">
      <h2>Personal Information</h2>
      <p className="sub-text">Update your photo and personal details here.</p>

      <form className="personal-form" onSubmit={handleSavePersonalInfo}>

        {/* Profile Picture Upload Section */}
        <div className="avatar-upload-section">
          <div className="avatar-preview">
            {visibleAvatar ? <img src={visibleAvatar} alt="Preview" /> : userInitial}
          </div>
          <div className="avatar-actions">
            <h4>Profile Picture</h4>
            <p>PNG, JPG up to 5MB</p>
            <label htmlFor="file-upload" className="btn-upload">
              <FaCamera /> Upload New Picture
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarFileChange}
              hidden
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => handleProfileInputChange('name', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={profileForm.phone}
              onChange={(e) => handleProfileInputChange('phone', e.target.value)}
            />
          </div>
          <div className="form-group full-width">
            <label>Address</label>
            <div className="input-icon-wrapper">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => handleProfileInputChange('address', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={profileForm.city}
              onChange={(e) => handleProfileInputChange('city', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={profileForm.state}
              onChange={(e) => handleProfileInputChange('state', e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-cancel" type="button" onClick={handleCancelPersonalInfo} disabled={savingProfile}>
            Cancel
          </button>
          <button className="btn-save" type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderDonations = () => (
    <div className="tab-content fade-in">
      <h2>Donation History</h2>

      {donationHistory.length > 0 ? (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Program</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td><strong>{item.program}</strong></td>
                  <td>₹{item.amount.toLocaleString('en-IN')}</td>
                  <td><span className="status-pill success">{item.status}</span></td>
                  <td>
                    <button className="btn-download-receipt">
                      <FaDownload /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon"><FaHeart /></div>
          <h3>Ready to make a difference?</h3>
          <p>You haven't made any donations yet. Your support can change lives.</p>
          <Link to="/donate" className="btn-donate-now">Donate Now</Link>
        </div>
      )}
    </div>
  );

  const renderVolunteer = () => (
    <div className="tab-content fade-in">
      <h2>Volunteer Activity</h2>
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>NGO Name</th>
              <th>Role</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {volunteerActivity.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.ngo}</strong></td>
                <td>{item.role}</td>
                <td>{item.date}</td>
                <td>
                  <span className={`status-pill ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="profile-layout">
      {saveNotice.message && (
        <div className={`save-toast ${saveNotice.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {saveNotice.message}
        </div>
      )}

      {showChangePasswordModal && (
        <div className="password-modal-overlay" onClick={closeChangePasswordModal}>
          <div className="password-modal-card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="password-close-btn"
              onClick={closeChangePasswordModal}
              disabled={changingPassword}
              aria-label="Close"
            >
              x
            </button>

            <h3 className="password-modal-title">Change Password</h3>
            <p className="password-modal-subtitle">
              Enter your current password and choose a new secure password.
            </p>

            {changePasswordNotice.message && (
              <div
                className={`password-notice ${changePasswordNotice.type === 'success' ? 'password-notice-success' : 'password-notice-error'}`}
              >
                {changePasswordNotice.message}
              </div>
            )}

            <form className="password-form" onSubmit={handleChangePasswordSubmit}>
              <input
                className="password-input"
                type="password"
                placeholder="Current password"
                value={changePasswordForm.currentPassword}
                onChange={(event) => handleChangePasswordInput('currentPassword', event.target.value)}
                disabled={changingPassword}
                required
              />

              <input
                className="password-input"
                type="password"
                placeholder="New password (min 6 chars)"
                value={changePasswordForm.newPassword}
                onChange={(event) => handleChangePasswordInput('newPassword', event.target.value)}
                disabled={changingPassword}
                required
              />

              <input
                className="password-input"
                type="password"
                placeholder="Confirm new password"
                value={changePasswordForm.confirmPassword}
                onChange={(event) => handleChangePasswordInput('confirmPassword', event.target.value)}
                disabled={changingPassword}
                required
              />

              <button className="password-submit-btn" type="submit" disabled={changingPassword}>
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="profile-container">
        {renderSidebar()}
        <main className="profile-main">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'donations' && renderDonations()}
          {activeTab === 'volunteer' && renderVolunteer()}
        </main>
      </div>
    </div>
  );
};

export default Profile;
