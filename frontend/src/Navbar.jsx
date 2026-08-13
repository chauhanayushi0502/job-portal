// frontend/src/Navbar.jsx (Updated with Profile option)
import React, { useState, useEffect } from 'react';

function Navbar() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    companyName: '',
    industry: '',
    website: '',
    phone: '',
    description: '',
    location: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchNotifications();
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.role === 'company') {
        fetchCompanyProfile();
      }
    }
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/notification/getnotifications', {
        headers: { 'token': token }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchCompanyProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/api/company/getcompany', {
        headers: { 'token': token }
      });
      const data = await response.json();
      if (data.success && data.company) {
        setCompanyProfile(data.company);
        setProfileForm({
          companyName: data.company.companyName || '',
          industry: data.company.industry || '',
          website: data.company.website || '',
          phone: data.company.phone || '',
          description: data.company.description || '',
          location: data.company.location || '',
        });
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:8000/api/notification/markread/${notificationId}`, {
        method: 'PUT',
        headers: { 'token': token }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:8000/api/notification/markallread', {
        method: 'PUT',
        headers: { 'token': token }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (user.role === 'company') return '/company';
    if (user.role === 'candidate') return '/candidate';
    return '/';
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage('');

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/api/company/updatecompany', {
        method: 'PUT',
        headers: { 'token': token, 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await response.json();
      if (data.success) {
        setProfileMessage('Profile updated successfully!');
        fetchCompanyProfile();
      } else {
        setProfileMessage((data.message || 'Failed to update profile'));
      }
    } catch (error) {
      setProfileMessage(' Network error. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const goToMyApplications = () => {
    if (user?.role === 'candidate') {
      window.location.href = '/candidate?view=myapps';
    }
  };

  const goToAllJobs = () => {
    if (user?.role === 'candidate') {
      window.location.href = '/candidate';
    }
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <a href={getHomeLink()} style={styles.brand}>
            Job Portal
          </a>
          <span style={styles.roleBadge}>
            {user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
          </span>

          {user?.role === 'candidate' && (
            <div style={styles.navLinks}>
              <button onClick={goToAllJobs} style={styles.navLink}>All Jobs</button>
              <button onClick={goToMyApplications} style={styles.navLink}>My Applications</button>
            </div>
          )}

          {user?.role === 'company' && (
            <div style={styles.navLinks}>
              <button onClick={() => setShowProfileModal(true)} style={styles.navLink}>
                Profile
              </button>
            </div>
          )}
        </div>

        <div style={styles.navRight}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={styles.notificationBtn}
          >
            {unreadCount > 0 && (
              <span style={styles.badge}>{unreadCount}</span>
            )}
          </button>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>
      {showNotifications && (
        <div style={styles.notificationOverlay} onClick={() => setShowNotifications(false)}>
          <div style={styles.notificationPanel} onClick={(e) => e.stopPropagation()}>
            <div style={styles.notificationHeader}>
              <h3>Notifications</h3>
              <div style={styles.notificationActions}>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} style={styles.markAllBtn}>
                    Mark all as read
                  </button>
                )}
                <button onClick={() => setShowNotifications(false)} style={styles.closeBtn}>✕</button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <p style={styles.emptyText}>No notifications yet.</p>
            ) : (
              <div style={styles.notificationList}>
                {notifications.map((notif) => (
                  <div 
                    key={notif._id} 
                    style={{
                      ...styles.notificationItem,
                      backgroundColor: notif.isRead ? '#fff' : '#e3f2fd'
                    }}
                  >
                    <div style={styles.notifContent}>
                      <strong>{notif.title}</strong>
                      <p>{notif.message}</p>
                      <small>{new Date(notif.createdAt).toLocaleString()}</small>
                    </div>
                    {!notif.isRead && (
                      <button 
                        onClick={() => markAsRead(notif._id)}
                        style={styles.readBtn}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showProfileModal && user?.role === 'company' && (
        <div style={styles.modalOverlay} onClick={() => setShowProfileModal(false)}>
          <div style={styles.profileModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>Company Profile</h2>
              <button onClick={() => setShowProfileModal(false)} style={styles.closeBtn}>close</button>
            </div>

            {profileMessage && (
              <div style={profileMessage.includes ? styles.successMsg : styles.errorMsg}>
                {profileMessage}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} style={styles.profileForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={profileForm.companyName}
                  onChange={handleProfileChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={profileForm.industry}
                  onChange={handleProfileChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Website</label>
                <input
                  type="url"
                  name="website"
                  value={profileForm.website}
                  onChange={handleProfileChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={profileForm.description}
                  onChange={handleProfileChange}
                  rows={3}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileForm.location}
                  onChange={handleProfileChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.modalButtons}>
                <button type="submit" disabled={profileLoading} style={styles.submitBtn}>
                  {profileLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#2c3e50',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  roleBadge: {
    padding: '4px 12px',
    backgroundColor: '#3498db',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '10px',
    marginLeft: '10px',
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  notificationBtn: {
    position: 'relative',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  notificationOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  notificationPanel: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  notificationActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  markAllBtn: {
    padding: '4px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  closeBtn: {
    padding: '4px 8px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  emptyText: {
    textAlign: 'center',
    padding: '30px 0',
    color: '#888',
  },
  notificationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  notificationItem: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  notifContent: {
    flex: 1,
  },
  readBtn: {
    padding: '4px 10px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  // Profile Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  profileModal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #eee',
    paddingBottom: '15px',
  },
  closeBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  profileForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  submitBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  successMsg: {
    padding: '12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  errorMsg: {
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
  },
};

export default Navbar;