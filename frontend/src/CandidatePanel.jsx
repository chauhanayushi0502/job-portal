// import React, { useState, useEffect } from 'react';
// import ProfileCompletion from './ProfileCompletion';

// function CandidatePanel() {
//   const [candidate, setCandidate] = useState(null);
//   const [allJobs, setAllJobs] = useState([]);
//   const [displayedJobs, setDisplayedJobs] = useState([]);
//   const [myApplications, setMyApplications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [applyMessage, setApplyMessage] = useState('');
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [isProfileComplete, setIsProfileComplete] = useState(false);
//   const [missingFields, setMissingFields] = useState([]);

//   const [filters, setFilters] = useState({
//     category: '',
//     minSalary: '',
//     maxSalary: '',
//     location: '',
//   });
//   const [sortBy, setSortBy] = useState('newest');
//   const [viewMode, setViewMode] = useState('all');

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const view = params.get('view');
//     if (view === 'myapps') {
//       setViewMode('myapps');
//     }

//     fetchCandidateProfile();
//     fetchAllJobs();
//     fetchMyApplications();
//     checkProfileCompleteness();
//   }, []);

//   useEffect(() => {
//     let filtered = [...allJobs];

//     if (viewMode === 'myapps') {
//       const appliedJobIds = myApplications.map(app => app.jobId?._id);
//       filtered = filtered.filter(job => appliedJobIds.includes(job._id));
//     }

//     if (filters.category) {
//       filtered = filtered.filter(job => 
//         job.category?.toLowerCase().includes(filters.category.toLowerCase())
//       );
//     }

//     if (filters.location) {
//       filtered = filtered.filter(job => 
//         job.location?.toLowerCase().includes(filters.location.toLowerCase())
//       );
//     }
//     if (filters.minSalary) {
//       filtered = filtered.filter(job => 
//         (job.salary?.min || 0) >= parseInt(filters.minSalary)
//       );
//     }
//     if (filters.maxSalary) {
//       filtered = filtered.filter(job => 
//         (job.salary?.max || 0) <= parseInt(filters.maxSalary)
//       );
//     }

//     switch (sortBy) {
//       case 'newest':
//         filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//       case 'oldest':
//         filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         break;
//       case 'salaryHigh':
//         filtered.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
//         break;
//       case 'salaryLow':
//         filtered.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
//         break;
//       case 'titleAZ':
//         filtered.sort((a, b) => a.title.localeCompare(b.title));
//         break;
//       default:
//         break;
//     }

//     setDisplayedJobs(filtered);
//   }, [allJobs, filters, sortBy, viewMode, myApplications]);

//   const fetchCandidateProfile = async () => {
//     const token = localStorage.getItem('token');
//     const response = await fetch('http://localhost:8000/api/candidate/getcandidate', {
//       headers: { 'token': token }
//     });
//     const data = await response.json();
//     if (data.success) {
//       setCandidate(data.candidate);
//     }
//   };

//   const checkProfileCompleteness = async () => {
//     const token = localStorage.getItem('token');
//     const response = await fetch('http://localhost:8000/api/candidate/checkprofile', {
//       headers: { 'token': token }
//     });
//     const data = await response.json();
//     if (data.success) {
//       setIsProfileComplete(data.isComplete);
//       if (!data.isComplete && data.candidate) {
//         const missing = getMissingFields(data.candidate);
//         setMissingFields(missing);
//       } else {
//         setMissingFields([]);
//       }
//     }
//   };

//   const getMissingFields = (candidateData) => {
//     const missing = [];
//     if (!candidateData?.fullName) missing.push('Full Name');
//     if (!candidateData?.email) missing.push('Email');
//     if (!candidateData?.phone) missing.push('Phone');
//     if (!candidateData?.address) missing.push('Address');
//     if (!candidateData?.city) missing.push('City');
//     if (!candidateData?.state) missing.push('State');
//     if (!candidateData?.country) missing.push('Country');
//     if (!candidateData?.pincode) missing.push('Pincode');
//     if (!candidateData?.title) missing.push('Professional Title');
//     if (!candidateData?.skills || candidateData.skills.length === 0) missing.push('Skills');
//     if (!candidateData?.education || candidateData.education.length === 0) missing.push('Education');
//     if (!candidateData?.resume) missing.push('Resume');
//     return missing;
//   };

//   const fetchAllJobs = async () => {
//     const token = localStorage.getItem('token');
//     const response = await fetch('http://localhost:8000/api/job/getalljob', {
//       headers: { 'token': token }
//     });
//     const data = await response.json();
//     if (data.success) {
//       setAllJobs(data.jobs);
//     }
//   };

//   const fetchMyApplications = async () => {
//     const token = localStorage.getItem('token');
//     const response = await fetch('http://localhost:8000/api/application/applyhistory', {
//       headers: { 'token': token }
//     });
//     const data = await response.json();
//     if (data.success) {
//       setMyApplications(data.history);
//     }
//   };

//   const applyForJob = async () => {
//     if (!isProfileComplete) {
//       setMessage(`Please complete your profile first! Missing: ${missingFields.join(', ')}`);
//       return;
//     }

//     const token = localStorage.getItem('token');
//     const response = await fetch('http://localhost:8000/api/application/applyjob', {
//       method: 'POST',
//       headers: { 'token': token, 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         jobId: selectedJob._id,
//         message: applyMessage
//       })
//     });
//     const data = await response.json();
//     if (data.success) {
//       setMessage('Application submitted successfully!');
//       setShowApplyModal(false);
//       setApplyMessage('');
//       fetchMyApplications();
//       fetchAllJobs();
//     } else {
//       setMessage((data.message || 'Failed to apply'));
//     }
//   };

//   const openApplyModal = (job) => {
//     if (!isProfileComplete) {
//       setMessage(`Please complete your profile first! Missing: ${missingFields.join(', ')}`);
//       return;
//     }
//     setSelectedJob(job);
//     setApplyMessage('');
//     setShowApplyModal(true);
//   };

//   const getApplicationStatus = (jobId) => {
//     const app = myApplications.find(a => a.jobId?._id === jobId);
//     return app ? app.status : null;
//   };

//   const hasApplied = (jobId) => {
//     return myApplications.some(a => a.jobId?._id === jobId);
//   };

//   const handleProfileUpdate = () => {
//     fetchCandidateProfile();
//     checkProfileCompleteness();
//     setShowProfileModal(false);
//     setMessage('Profile updated successfully!');
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters({ ...filters, [name]: value });
//   };

//   const clearFilters = () => {
//     setFilters({ category: '', minSalary: '', maxSalary: '', location: '' });
//     setSortBy('newest');
//   };

//   return (
//     <div style={styles.container}>
//       {/* Message */}
//       {message && (
//         <div style={message.includes? styles.successMsg : styles.errorMsg}>
//           {message}
//         </div>
//       )}

//       {!isProfileComplete && missingFields.length > 0 && (
//         <div style={styles.warningMsg}>
//           Missing fields: <strong>{missingFields.join(', ')}</strong>
//           <br />
//           <small>Please click "Complete Profile" to fill all required fields.</small>
//         </div>
//       )}

//       {candidate && (
//         <div style={styles.candidateInfo}>
//           <h3>Welcome, {candidate.fullName || 'Candidate'}!</h3>
//           <p>Email: {candidate.email || 'Not provided'}</p>
//           <p>Phone: {candidate.phone || 'Not provided'}</p>
//         </div>
//       )}

//       <div style={styles.header}>
//         <button onClick={() => setShowProfileModal(true)} style={styles.profileBtn}>
//           {isProfileComplete ? 'Profile Complete' : 'Complete Profile'}
//         </button>
//       </div>

//       <div style={styles.filterContainer}>
//         <div style={styles.filterRow}>
//           <input
//             type="text"
//             name="category"
//             placeholder="Filter by Category"
//             value={filters.category}
//             onChange={handleFilterChange}
//             style={styles.filterInput}
//           />
//           <input
//             type="text"
//             name="location"
//             placeholder="Filter by Location"
//             value={filters.location}
//             onChange={handleFilterChange}
//             style={styles.filterInput}
//           />
//           <input
//             type="number"
//             name="minSalary"
//             placeholder="Min Salary"
//             value={filters.minSalary}
//             onChange={handleFilterChange}
//             style={styles.filterInput}
//           />
//           <input
//             type="number"
//             name="maxSalary"
//             placeholder="Max Salary"
//             value={filters.maxSalary}
//             onChange={handleFilterChange}
//             style={styles.filterInput}
//           />
//           <select
//             name="sortBy"
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             style={styles.filterInput}
//           >
//             <option value="newest">Newest First</option>
//             <option value="oldest">Oldest First</option>
//             <option value="salaryHigh">Salary: High to Low</option>
//             <option value="salaryLow">Salary: Low to High</option>
//             <option value="titleAZ">Title: A to Z</option>
//           </select>
//           <button onClick={clearFilters} style={styles.clearBtn}>Clear Filters</button>
//         </div>
//         <div style={styles.jobCount}>
//           {displayedJobs.length} job{displayedJobs.length !== 1 ? 's' : ''} found
//         </div>
//       </div>

//       <div style={styles.row}>
//         <div style={styles.jobsSection}>
//           <h3>
//             {viewMode === 'myapps' ? 'My Applications' : 'Available Jobs'}
//           </h3>
//           {displayedJobs.length === 0 ? (
//             <p style={styles.emptyText}>
//               {viewMode === 'myapps' 
//                 ? "You haven't applied to any jobs yet." 
//                 : "No jobs match your filters."}
//             </p>
//           ) : (
//             displayedJobs.map(job => (
//               <div key={job._id} style={styles.jobCard}>
//                 <div style={styles.jobHeader}>
//                   <h4>{job.title}</h4>
//                   <span style={styles.companyName}>{job.companyName}</span>
//                 </div>
//                 <p style={styles.jobDescription}>jobDescription:   {job.description}</p>
//                 <div style={styles.jobMeta}>
//                   <span>location:   {job.location}</span>
//                   <span>category:   {job.category}</span>
//                   <span>salary:   {job.salary?.min || 0} - {job.salary?.max || 0}</span>
//                 </div>
//                 <div style={styles.jobActions}>
//                   {hasApplied(job._id) ? (
//                     <span style={styles.appliedBadge}>
//                       Applied - {getApplicationStatus(job._id)}
//                     </span>
//                   ) : (
//                     <button onClick={() => openApplyModal(job)} style={styles.applyBtn}>
//                       Apply Now
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>


//       {showApplyModal && selectedJob && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modal}>
//             <h2>Apply for {selectedJob.title}</h2>
//             <p style={styles.modalCompany}>at {selectedJob.companyName}</p>
//             <div style={styles.modalBody}>
//               <label style={styles.modalLabel}>Message to Company (optional):</label>
//               <textarea
//                 value={applyMessage}
//                 onChange={(e) => setApplyMessage(e.target.value)}
//                 placeholder="Write a message to the company..."
//                 style={styles.modalTextarea}
//                 rows={4}
//               />
//             </div>
//             <div style={styles.modalButtons}>
//               <button onClick={applyForJob} style={styles.submitBtn}>Submit Application</button>
//               <button onClick={() => setShowApplyModal(false)} style={styles.cancelBtn}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showProfileModal && (
//         <ProfileCompletion 
//           candidate={candidate} 
//           onClose={() => setShowProfileModal(false)}
//           onUpdate={handleProfileUpdate}
//         />
//       )}
//     </div>
//   );
// }

// const getStatusColor = (status) => {
//   switch (status) {
//     case 'Selected': return '#28a745';
//     case 'Rejected': return '#dc3545';
//     case 'Interview': return '#ffc107';
//     case 'Shortlisted': return '#17a2b8';
//     case 'Reviewed': return '#6c757d';
//     default: return '#007bff';
//   }
// };

// const styles = {
//   container: {
//     padding: '20px',
//     fontFamily: 'Arial, sans-serif',
//     maxWidth: '1200px',
//     margin: '0 auto',
//     backgroundColor: '#f8f9fa',
//     minHeight: '100vh',
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     marginBottom: '20px',
//   },
//   profileBtn: {
//     padding: '10px 20px',
//     backgroundColor: '#ffc107',
//     color: '#333',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//   },
//   candidateInfo: {
//     backgroundColor: 'white',
//     padding: '15px 20px',
//     borderRadius: '10px',
//     marginBottom: '20px',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//   },
//   warningMsg: {
//     padding: '12px',
//     backgroundColor: '#fff3cd',
//     color: '#856404',
//     borderRadius: '6px',
//     marginBottom: '15px',
//     textAlign: 'center',
//     border: '1px solid #ffeeba',
//   },
//   filterContainer: {
//     backgroundColor: 'white',
//     padding: '15px',
//     borderRadius: '10px',
//     marginBottom: '20px',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//   },
//   filterRow: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '10px',
//     alignItems: 'center',
//   },
//   filterInput: {
//     padding: '8px 12px',
//     borderRadius: '6px',
//     border: '1px solid #ddd',
//     fontSize: '14px',
//     minWidth: '120px',
//     flex: 1,
//   },
//   clearBtn: {
//     padding: '8px 16px',
//     backgroundColor: '#6c757d',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontSize: '14px',
//   },
//   jobCount: {
//     marginTop: '10px',
//     fontSize: '14px',
//     color: '#666',
//   },
//   row: {
//     display: 'flex',
//     gap: '20px',
//     flexWrap: 'wrap',
//   },
//   jobsSection: {
//     flex: 2,
//     minWidth: '400px',
//     backgroundColor: 'white',
//     padding: '15px',
//     borderRadius: '10px',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//   },
//   jobCard: {
//     padding: '15px',
//     borderBottom: '1px solid #eee',
//     marginBottom: '15px',
//   },
//   jobHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '10px',
//   },
//   companyName: {
//     fontSize: '14px',
//     color: '#666',
//     fontWeight: 'bold',
//   },
//   jobDescription: {
//     color: '#555',
//     marginBottom: '10px',
//   },
//   jobMeta: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '15px',
//     fontSize: '14px',
//     color: '#666',
//     marginBottom: '15px',
//   },
//   jobActions: {
//     display: 'flex',
//     justifyContent: 'flex-end',
//   },
//   applyBtn: {
//     padding: '8px 20px',
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//   },
//   appliedBadge: {
//     padding: '6px 16px',
//     backgroundColor: '#e9ecef',
//     color: '#495057',
//     borderRadius: '20px',
//     fontSize: '14px',
//     fontWeight: 'bold',
//   },
//   emptyText: {
//     color: '#888',
//     textAlign: 'center',
//     padding: '30px 0',
//   },
//   successMsg: {
//     padding: '12px',
//     backgroundColor: '#d4edda',
//     color: '#155724',
//     borderRadius: '6px',
//     marginBottom: '15px',
//     textAlign: 'center',
//   },
//   errorMsg: {
//     padding: '12px',
//     backgroundColor: '#f8d7da',
//     color: '#721c24',
//     borderRadius: '6px',
//     marginBottom: '15px',
//     textAlign: 'center',
//   },
//   modalOverlay: {
//     position: 'fixed',
//     top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   modal: {
//     backgroundColor: 'white',
//     padding: '30px',
//     borderRadius: '12px',
//     width: '100%',
//     maxWidth: '500px',
//     boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
//   },
//   modalCompany: {
//     color: '#666',
//     marginBottom: '20px',
//   },
//   modalBody: {
//     marginBottom: '20px',
//   },
//   modalLabel: {
//     display: 'block',
//     marginBottom: '8px',
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   modalTextarea: {
//     width: '100%',
//     padding: '10px',
//     borderRadius: '6px',
//     border: '1px solid #ddd',
//     fontSize: '14px',
//     fontFamily: 'Arial, sans-serif',
//   },
//   modalButtons: {
//     display: 'flex',
//     gap: '10px',
//   },
//   submitBtn: {
//     flex: 1,
//     padding: '12px',
//     backgroundColor: '#28a745',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//     fontSize: '16px',
//   },
//   cancelBtn: {
//     flex: 1,
//     padding: '12px',
//     backgroundColor: '#6c757d',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//     fontSize: '16px',
//   },
// };

// export default CandidatePanel;









import React, { useState, useEffect } from 'react';
import ProfileCompletion from './ProfileCompletion';

function CandidatePanel() {
  const [candidate, setCandidate] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const [filters, setFilters] = useState({
    category: '',
    minSalary: '',
    maxSalary: '',
    location: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    if (view === "myapps") {
      setViewMode("myapps");
    } else {
      setViewMode("all");
    }

    fetchCandidateProfile();
    fetchAllJobs();
    fetchMyApplications();
    checkProfileCompleteness();
  }, [window.location.search]);

  useEffect(() => {
    let filtered = [...allJobs];

    if (viewMode === 'myapps') {
      const appliedJobIds = myApplications.map(app => app.jobId?._id);
      filtered = filtered.filter(job => appliedJobIds.includes(job._id));
    }

    if (filters.category) {
      filtered = filtered.filter(job => 
        job.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.minSalary) {
      filtered = filtered.filter(job => 
        (job.salary?.min || 0) >= parseInt(filters.minSalary)
      );
    }
    if (filters.maxSalary) {
      filtered = filtered.filter(job => 
        (job.salary?.max || 0) <= parseInt(filters.maxSalary)
      );
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'salaryHigh':
        filtered.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
        break;
      case 'salaryLow':
        filtered.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
        break;
      case 'titleAZ':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setDisplayedJobs(filtered);
  }, [allJobs, filters, sortBy, viewMode, myApplications]);

  const fetchCandidateProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/candidate/getcandidate', {
      headers: { 'token': token }
    });
    const data = await response.json();
    if (data.success) {
      setCandidate(data.candidate);
    }
  };

  const checkProfileCompleteness = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/candidate/checkprofile', {
      headers: { 'token': token }
    });
    const data = await response.json();
    if (data.success) {
      setIsProfileComplete(data.isComplete);
      if (!data.isComplete && data.candidate) {
        const missing = getMissingFields(data.candidate);
        setMissingFields(missing);
      } else {
        setMissingFields([]);
      }
    }
  };

  const getMissingFields = (candidateData) => {
    const missing = [];
    if (!candidateData?.fullName) missing.push('Full Name');
    if (!candidateData?.email) missing.push('Email');
    if (!candidateData?.phone) missing.push('Phone');
    if (!candidateData?.address) missing.push('Address');
    if (!candidateData?.city) missing.push('City');
    if (!candidateData?.state) missing.push('State');
    if (!candidateData?.country) missing.push('Country');
    if (!candidateData?.pincode) missing.push('Pincode');
    if (!candidateData?.title) missing.push('Professional Title');
    if (!candidateData?.skills || candidateData.skills.length === 0) missing.push('Skills');
    if (!candidateData?.education || candidateData.education.length === 0) missing.push('Education');
    if (!candidateData?.resume) missing.push('Resume');
    return missing;
  };

  const fetchAllJobs = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/job/getalljob', {
      headers: { 'token': token }
    });
    const data = await response.json();
    if (data.success) {
      setAllJobs(data.jobs);
    }
  };

  const fetchMyApplications = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/application/applyhistory', {
      headers: { 'token': token }
    });
    const data = await response.json();
    if (data.success) {
      setMyApplications(data.history);
    }
  };

  const applyForJob = async () => {
    if (!isProfileComplete) {
      setMessage(`Please complete your profile first! Missing: ${missingFields.join(', ')}`);
      return;
    }

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/application/applyjob', {
      method: 'POST',
      headers: { 'token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: selectedJob._id,
        message: applyMessage
      })
    });
    const data = await response.json();
    if (data.success) {
      setMessage('Application submitted successfully!');
      setShowApplyModal(false);
      setApplyMessage('');
      fetchMyApplications();
      fetchAllJobs();
    } else {
      setMessage((data.message || 'Failed to apply'));
    }
  };

  const openApplyModal = (job) => {
    if (!isProfileComplete) {
      setMessage(`Please complete your profile first! Missing: ${missingFields.join(', ')}`);
      return;
    }
    setSelectedJob(job);
    setApplyMessage('');
    setShowApplyModal(true);
  };

  const getApplicationStatus = (jobId) => {
    const app = myApplications.find(a => a.jobId?._id === jobId);
    return app ? app.status : null;
  };

  const hasApplied = (jobId) => {
    return myApplications.some(a => a.jobId?._id === jobId);
  };

  const handleProfileUpdate = () => {
    fetchCandidateProfile();
    checkProfileCompleteness();
    setShowProfileModal(false);
    setMessage('Profile updated successfully!');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ category: '', minSalary: '', maxSalary: '', location: '' });
    setSortBy('newest');
  };

  const toggleMyApplications = () => {
    if (viewMode === 'myapps') {
      setViewMode('all');
      window.history.replaceState(null, '', '/candidate');
    } else {
      setViewMode('myapps');
      window.history.replaceState(null, '', '/candidate?view=myapps');
    }
  };

  return (
    <div style={styles.container}>
      {message && (
        <div style={message.includes? styles.successMsg : styles.errorMsg}>
          {message}
        </div>
      )}

      {!isProfileComplete && missingFields.length > 0 && (
        <div style={styles.warningMsg}>
          Missing fields: <strong>{missingFields.join(', ')}</strong>
          <br />
          <small>Please click "Complete Profile" to fill all required fields.</small>
        </div>
      )}

      {candidate && (
        <div style={styles.candidateInfo}>
          <h3>Welcome, {candidate.fullName || 'Candidate'}!</h3>
          <p>Email: {candidate.email || 'Not provided'}</p>
          <p>Phone: {candidate.phone || 'Not provided'}</p>
        </div>
      )}

      <div style={styles.header}>
        <button onClick={() => setShowProfileModal(true)} style={styles.profileBtn}>
          {isProfileComplete ? 'Profile Complete' : 'Complete Profile'}
        </button>
      </div>

      <div style={styles.toggleContainer}>
        <button onClick={toggleMyApplications} style={styles.toggleBtn}>
          {viewMode === 'myapps' ? ' Show All Jobs' : ' Show My Applications'}
        </button>
        <span style={styles.viewStatus}>
          Currently viewing: <strong>{viewMode === 'myapps' ? 'My Applications' : 'All Jobs'}</strong>
        </span>
      </div>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <div style={styles.filterRow}>
          <input
            type="text"
            name="category"
            placeholder="Filter by Category"
            value={filters.category}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <input
            type="text"
            name="location"
            placeholder="Filter by Location"
            value={filters.location}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <input
            type="number"
            name="minSalary"
            placeholder="Min Salary"
            value={filters.minSalary}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <input
            type="number"
            name="maxSalary"
            placeholder="Max Salary"
            value={filters.maxSalary}
            onChange={handleFilterChange}
            style={styles.filterInput}
          />
          <select
            name="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.filterInput}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="salaryHigh">Salary: High to Low</option>
            <option value="salaryLow">Salary: Low to High</option>
            <option value="titleAZ">Title: A to Z</option>
          </select>
          <button onClick={clearFilters} style={styles.clearBtn}>Clear Filters</button>
        </div>
        <div style={styles.jobCount}>
          {displayedJobs.length} job{displayedJobs.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* ====== JOBS / APPLICATIONS SECTION ====== */}
      <div style={styles.row}>
        <div style={styles.jobsSection}>
          <h3>
            {viewMode === 'myapps' ? 'My Applications' : 'Available Jobs'}
          </h3>

          {displayedJobs.length === 0 ? (
            <p style={styles.emptyText}>
              {viewMode === 'myapps' 
                ? "You haven't applied to any jobs yet." 
                : "No jobs match your filters."}
            </p>
          ) : (
            displayedJobs.map(job => (
              <div key={job._id} style={styles.jobCard}>
                <div style={styles.jobHeader}>
                  <h4>{job.title}</h4>
                  <span style={styles.companyName}>{job.companyName}</span>
                </div>
                <p style={styles.jobDescription}>jobDescription: {job.description}</p>
                <div style={styles.jobMeta}>
                  <span>location: {job.location}</span>
                  <span>category: {job.category}</span>
                  <span>salary: {job.salary?.min || 0} - {job.salary?.max || 0}</span>
                </div>
                <div style={styles.jobActions}>
                  {hasApplied(job._id) ? (
                    <span style={styles.appliedBadge}>
                      ✅ Applied - {getApplicationStatus(job._id)}
                    </span>
                  ) : (
                    <button onClick={() => openApplyModal(job)} style={styles.applyBtn}>
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showApplyModal && selectedJob && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Apply for {selectedJob.title}</h2>
            <p style={styles.modalCompany}>at {selectedJob.companyName}</p>
            <div style={styles.modalBody}>
              <label style={styles.modalLabel}>Message to Company (optional):</label>
              <textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="Write a message to the company..."
                style={styles.modalTextarea}
                rows={4}
              />
            </div>
            <div style={styles.modalButtons}>
              <button onClick={applyForJob} style={styles.submitBtn}>Submit Application</button>
              <button onClick={() => setShowApplyModal(false)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ====== PROFILE COMPLETION MODAL ====== */}
      {showProfileModal && (
        <ProfileCompletion 
          candidate={candidate} 
          onClose={() => setShowProfileModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}

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
    justifyContent: 'flex-end',
    marginBottom: '20px',
  },
  profileBtn: {
    padding: '10px 20px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  toggleBtn: {
    padding: '10px 20px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  viewStatus: {
    fontSize: '14px',
    color: '#666',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
  },
  filterInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    minWidth: '120px',
    flex: 1,
  },
  clearBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  jobCount: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#666',
  },
  row: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  jobsSection: {
    flex: 2,
    minWidth: '400px',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  jobCard: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    marginBottom: '15px',
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  companyName: {
    fontSize: '14px',
    color: '#666',
    fontWeight: 'bold',
  },
  jobDescription: {
    color: '#555',
    marginBottom: '10px',
  },
  jobMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
  },
  jobActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  applyBtn: {
    padding: '8px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  appliedBadge: {
    padding: '6px 16px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    padding: '30px 0',
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
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  modalCompany: {
    color: '#666',
    marginBottom: '20px',
  },
  modalBody: {
    marginBottom: '20px',
  },
  modalLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  modalTextarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
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

export default CandidatePanel;