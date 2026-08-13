import React, { useState, useEffect } from 'react';

function CompanyPanel() {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    salary: { min: '', max: '' },
    vacancies: 1,
    deadline: '',
  });

  useEffect(() => {
    fetchCompanyProfile();
    fetchCompanyJobs();
  }, []);

  const fetchCompanyProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/company/getcompany', {
      headers: { 'token': token }
    });
    const data = await response.json();
    if (data.success) {
      setCompany(data.company);
    }
  };

  const fetchCompanyJobs = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/company/myjobs', {
      headers: { 'token': token }
    });
    const data = await response.json();
    if (data.success) {
      setJobs(data.jobs);
    }
  };

  const addJob = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/company/addjob', {
      method: 'POST',
      headers: { 'token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(jobForm)
    });
    const data = await response.json();
    if (data.success) {
      setMessage('Job added successfully!');
      setShowJobModal(false);
      setJobForm({ title: '', description: '', location: '', category: '', salary: { min: '', max: '' }, vacancies: 1, deadline: '' });
      fetchCompanyJobs();
    } else {
      setMessage((data.message || 'Failed to add job'));
    }
  };

  const updateJob = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/company/updatejob/${editingJob._id}`, {
      method: 'PUT',
      headers: { 'token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(jobForm)
    });
    const data = await response.json();
    if (data.success) {
      setMessage('Job updated successfully!');
      setShowJobModal(false);
      setEditingJob(null);
      setJobForm({ title: '', description: '', location: '', category: '', salary: { min: '', max: '' }, vacancies: 1, deadline: '' });
      fetchCompanyJobs();
    } else {
      setMessage((data.message || 'Failed to update job'));
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job? This will also remove all applications.')) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/company/deletejob/${jobId}`, {
      method: 'DELETE',
      headers: { 'token': token }
    });
    const data = await response.json();
    if (data.success) {
      setMessage('Job deleted successfully');
      fetchCompanyJobs();
    } else {
      setMessage((data.message || 'Failed to delete job'));
    }
  };

  const openAddJobModal = () => {
    setEditingJob(null);
    setJobForm({ title: '', description: '', location: '', category: '', salary: { min: '', max: '' }, vacancies: 1, deadline: '' });
    setShowJobModal(true);
  };

  const openEditJobModal = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      description: job.description,
      location: job.location,
      category: job.category,
      salary: job.salary || { min: '', max: '' },
      vacancies: job.vacancies || 1,
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
    });
    setShowJobModal(true);
  };

  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'min' || name === 'max') {
      setJobForm({
        ...jobForm,
        salary: { ...jobForm.salary, [name]: value }
      });
    } else {
      setJobForm({ ...jobForm, [name]: value });
    }
  };

  const viewApplications = (jobId) => {
    window.location.href = `/applications/${jobId}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Company Panel</h1>
        <button onClick={openAddJobModal} style={styles.addButton}>+ Add Job</button>
      </div>

      {/* Company Info */}
      {company && (
        <div style={styles.companyInfo}>
          <h3>{company.companyName}</h3>
          <p>Industry: {company.industry || 'N/A'} | Location: {company.location || 'N/A'}</p>
        </div>
      )}

      {message && (
        <div style={message.includes? styles.successMsg : styles.errorMsg}>
          {message}
        </div>
      )}

      <div style={styles.jobsContainer}>
        <h3>Your Jobs</h3>
        {jobs.length === 0 ? (
          <p style={styles.emptyText}>No jobs added yet. Click "Add Job" to create one.</p>
        ) : (
          jobs.map(job => (
            <div key={job._id} style={styles.jobCard}>
              <div style={styles.jobInfo}>
                <h4>{job.title}</h4>
                <p style={styles.jobMeta}>
                  {job.location} • {job.status} • {job.vacancies} position(s)
                </p>
              </div>
              <div style={styles.jobActions}>
                <button onClick={() => openEditJobModal(job)} style={styles.editBtn}>Edit</button>
                <button onClick={() => deleteJob(job._id)} style={styles.deleteBtn}>delete</button>
                <button onClick={() => viewApplications(job._id)} style={styles.viewApplicationsBtn}>
                  View Applications
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showJobModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
            <form onSubmit={(e) => { e.preventDefault(); editingJob ? updateJob() : addJob(); }}>
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={jobForm.title}
                onChange={handleJobFormChange}
                required
                style={styles.modalInput}
              />
              <textarea
                name="description"
                placeholder="Job Description"
                value={jobForm.description}
                onChange={handleJobFormChange}
                required
                style={styles.modalTextarea}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={jobForm.location}
                onChange={handleJobFormChange}
                required
                style={styles.modalInput}
              />
              <input
                type="text"
                name="category"
                placeholder="Category (e.g. IT, Sales, Marketing)"
                value={jobForm.category}
                onChange={handleJobFormChange}
                required
                style={styles.modalInput}
              />
              <div style={styles.salaryRow}>
                <input
                  type="number"
                  name="min"
                  placeholder="Min Salary"
                  value={jobForm.salary.min}
                  onChange={handleJobFormChange}
                  style={styles.modalInput}
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max Salary"
                  value={jobForm.salary.max}
                  onChange={handleJobFormChange}
                  style={styles.modalInput}
                />
              </div>
              <input
                type="number"
                name="vacancies"
                placeholder="Vacancies"
                value={jobForm.vacancies}
                onChange={handleJobFormChange}
                required
                min="1"
                style={styles.modalInput}
              />
              <input
                type="date"
                name="deadline"
                placeholder="Deadline"
                value={jobForm.deadline}
                onChange={handleJobFormChange}
                style={styles.modalInput}
              />
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.submitBtn}>
                  {editingJob ? 'Update Job' : 'Add Job'}
                </button>
                <button onClick={() => setShowJobModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </form>
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
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '10px 20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  companyInfo: {
    backgroundColor: 'white',
    padding: '15px 20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  jobsContainer: {
    backgroundColor: 'white',
    padding: '15px 20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  jobCard: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  jobInfo: {
    flex: 1,
  },
  jobMeta: {
    color: '#666',
    fontSize: '14px',
    marginTop: '4px',
  },
  jobActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  viewApplicationsBtn: {
    padding: '6px 12px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    padding: '20px 0',
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  modalInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  modalTextarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    minHeight: '80px',
  },
  salaryRow: {
    display: 'flex',
    gap: '10px',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  submitBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};

export default CompanyPanel;