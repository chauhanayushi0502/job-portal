import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFetchUrl } from "./util";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const userData = localStorage.getItem("user");
    if (!userData) return;

    const parsed = JSON.parse(userData);
    let url = "";

    if (parsed.role === "company") {
      url = "api/company/notifications";
    } else if (parsed.role === "candidate") {
      url = "api/candidate/getCandidateNotifications";

    } else {
      return;
    }

    try {
      const response = await fetch(getFetchUrl(url), {
        headers: { token: token },
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        const unread = data.notifications.filter((n) => n.isRead === false).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  async function markAsRead(notificationId) {
    const token = localStorage.getItem("token");
    try {
      await fetch(getFetchUrl(`api/notification/markread/${notificationId}`), {
        method: "PUT",
        headers: { token: token },
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  }

  async function markAllAsRead() {
    const token = localStorage.getItem("token");
    try {
      await fetch(getFetchUrl("api/notification/markallread"), {
        method: "PUT",
        headers: { token: token },
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  function getHomeLink() {
    if (!user) return "/";
    if (user.role === "company") return "/company";
    if (user.role === "candidate") return "/candidate";
    return "/";
  }

  function goToAllJobs() {
    if (user?.role === "candidate") {
      navigate("/candidate", { replace: true });
    }
  }

  function goToMyApplications() {
    if (user?.role === "candidate") {
      navigate("/candidate?view=myapps", { replace: true });
    }
  }

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <a href={getHomeLink()} style={styles.brand}>
            Job Portal
          </a>
          <span style={styles.roleBadge}>
            {user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
          </span>
        </div>

        <div style={styles.navRight}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={styles.notificationBtn}
          >
            🔔
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
                      backgroundColor: notif.isRead ? "#fff" : "#e3f2fd",
                    }}
                  >
                    <div style={styles.notifContent}>
                      <strong>{notif.title}</strong>
                      <p>{notif.message}</p>
                      <small>{new Date(notif.createdAt).toLocaleString()}</small>
                    </div>
                    {notif.isRead === false && (
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
    </>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#2c3e50",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  brand: {
    color: "white",
    textDecoration: "none",
    fontSize: "20px",
    fontWeight: "bold",
  },
  roleBadge: {
    padding: "4px 12px",
    backgroundColor: "#3498db",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "10px",
    marginLeft: "10px",
  },
  navLink: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  notificationBtn: {
    position: "relative",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "#e74c3c",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  notificationOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  notificationPanel: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  notificationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  notificationActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  markAllBtn: {
    padding: "4px 12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  closeBtn: {
    padding: "4px 8px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  emptyText: {
    textAlign: "center",
    padding: "30px 0",
    color: "#888",
  },
  notificationList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  notificationItem: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  notifContent: {
    flex: 1,
  },
  readBtn: {
    padding: "4px 10px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default Navbar;