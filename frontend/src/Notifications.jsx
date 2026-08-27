import React, { useState, useEffect } from 'react';
import { getFetchUrl } from './util';

function Notifications({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(getFetchUrl("api/notification/getnotifications"), {
      headers: { 'token': token }
    });
    const data = await response.json();
    if (data.success) {
      setNotifications(data.notifications || []);
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(getFetchUrl(`api/company/markread/${id}`), {
      method: 'PUT',
      headers: { 'token': token }
    });
    fetchNotifications();
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2>Notifications</h2>
          <button onClick={onClose} style={styles.closeBtn}>close</button>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p style={styles.emptyText}>No notifications yet.</p>
        ) : (
          <div style={styles.list}>
            {notifications.map((notif) => (
              <div key={notif._id} style={styles.item}>
                <div style={styles.itemContent}>
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <small>{new Date(notif.createdAt).toLocaleString()}</small>
                </div>
                {!notif.isRead && (
                  <button onClick={() => markAsRead(notif._id)} style={styles.readBtn}>
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeBtn: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    padding: '30px',
    color: '#888',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
  itemContent: {
    flex: 1,
  },
  readBtn: {
    padding: '4px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};

export default Notifications;