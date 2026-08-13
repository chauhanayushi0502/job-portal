import React, { useState, useEffect } from 'react';

function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);

  const path = window.location.pathname;
  const jobId = path.split('/applications/')[1];

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const fetchApplications = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/company/applications/${jobId}`, {
        headers: { 'token': token }
      });
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
        if (data.applications.length > 0 && data.applications[0].jobId) {
          setJob(data.applications[0].jobId);
        }
      } else {
        setMessage('Failed to load applications.');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/company/application/${appId}`, {
      method: 'PUT',
      headers: { 'token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (data.success) {
      setMessage('Status updated successfully!');
      fetchApplications(); // Refresh list
    } else {
      setMessage(' Failed to update status');
    }
  };

  const viewCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateModal(true);
  };

  const goBack = () => {
    window.location.href = '/company';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected': return '#28a745';
      case 'Rejected': return '#dc3545';
      case 'Interview': return '#ffc107';
      case 'Shortlisted': return '#17a2b8';
      case 'Reviewed': return '#6c757d';
      default: return '#007bff';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={goBack} style={styles.backBtn}>← Back to Dashboard</button>
        <h1 style={styles.title}>Applications</h1>
      </div>

      {job && (
        <div style={styles.jobBanner}>
          <h2>{job.title}</h2>
          <p><strong>Job ID:</strong> {jobId}</p>
        </div>
      )}

      {message && (
        <div style={message.includes ? styles.successMsg : styles.errorMsg}>
          {message}
        </div>
      )}

      {loading ? (
        <p style={styles.loadingText}>Loading applications...</p>
      ) : applications.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No applications yet</h3>
          <p>Wait for candidates to apply to this job.</p>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Candidate</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>Skills</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app._id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{app.candidateId?.fullName || 'Unknown'}</strong>
                    <button 
                      onClick={() => viewCandidateDetails(app.candidateId)}
                      style={styles.viewBtn}
                    >
                      viewCandidateDetails
                    </button>
                  </td>
                  <td>{app.candidateId?.email || 'N/A'}</td>
                  <td>{app.candidateId?.phone || 'N/A'}</td>
                  <td>
                    {app.candidateId?.city || 'N/A'}, {app.candidateId?.state || ''}
                  </td>
                  <td>
                    {app.candidateId?.education?.length > 0 
                      ? app.candidateId.education[0]?.degree || 'N/A'
                      : 'N/A'
                    }
                  </td>
                  <td>
                    {app.candidateId?.experience?.length > 0 
                      ? `${app.candidateId.experience.length} years`
                      : '0 years'
                    }
                  </td>
                  <td>
                    <div style={styles.skillsContainer}>
                      {app.candidateId?.skills?.slice(0, 3).map((skill, i) => (
                        <span key={i} style={styles.skillBadge}>{skill}</span>
                      ))}
                      {app.candidateId?.skills?.length > 3 && (
                        <span style={styles.moreSkills}>+{app.candidateId.skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      ...styles.statusBadge, 
                      backgroundColor: getStatusColor(app.status) 
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div style={styles.actionButtons}>
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        style={styles.statusSelect}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button onClick={() => alert('Navigate to Interview Modal')} style={styles.inviteBtn}>
                        Invite
                      </button>
                      <button onClick={() => alert('Select Candidate Logic')} style={styles.selectBtn}>
                        Select
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCandidateModal && selectedCandidate && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>Candidate Profile</h2>
              <button onClick={() => setShowCandidateModal(false)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.candidateDetails}>
              <p><strong>Name:</strong> {selectedCandidate.fullName}</p>
              <p><strong>Email:</strong> {selectedCandidate.email}</p>
              <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
              <p><strong>Skills:</strong> {selectedCandidate.skills?.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
    padding: '10px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#333',
  },
  jobBanner: {
    backgroundColor: 'white',
    padding: '15px 20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    borderLeft: '5px solid #007bff',
  },
  tableWrapper: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  viewBtn: {
    padding: '2px 6px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '8px',
    fontSize: '12px',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  skillBadge: {
    padding: '2px 8px',
    backgroundColor: '#e9ecef',
    borderRadius: '12px',
    fontSize: '11px',
  },
  moreSkills: {
    fontSize: '11px',
    color: '#666',
    padding: '2px 4px',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statusSelect: {
    padding: '4px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '12px',
  },
  inviteBtn: {
    padding: '4px 8px',
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  selectBtn: {
    padding: '4px 8px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
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
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeBtn: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  candidateDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
};

export default JobApplications;