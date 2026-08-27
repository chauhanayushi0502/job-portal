import React, { useState, useEffect } from "react";
import { getFetchUrl } from "./util";

function CompanyPanel() {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  const [editingJob, setEditingJob] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    salary: {
      min: "",
      max: "",
    },
    vacancies: 1,
    deadline: "",
  });

  const [profileForm, setProfileForm] = useState({
    companyName: "",
    email: "",
    website: "",
    phone: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    fetchCompanyProfile();
    fetchCompanyJobs();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setMessageType("error");
        return;
      }

      const response = await fetch(getFetchUrl("api/company/getcompany"), {
        method: "GET",
        headers: {
          token: token,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCompany(data.company);
      } else {
        setMessage(data.message || "Failed to fetch company profile");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Profile error:", error);
      setMessage("Unable to fetch company profile");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setMessageType("error");
        return;
      }

      const response = await fetch(getFetchUrl("api/company/updatecompany"),
        {
          method: "PUT",
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileForm),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Profile updated successfully!");
        setMessageType("success");

        if (data.company) {
          setCompany(data.company);
        } else {
          await fetchCompanyProfile();
        }

        setShowEditProfileModal(false);
      } else {
        setMessage(data.message || "Failed to update profile");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setMessage("Something went wrong while updating profile");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setMessageType("error");
        return;
      }

      const response = await fetch(getFetchUrl("api/company/myjobs"), {
        method: "GET",
        headers: {
          token: token,
        },
      });

      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs || []);
      } else {
        setMessage(data.message || "Failed to fetch jobs");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Jobs error:", error);
      setMessage("Unable to fetch jobs");
      setMessageType("error");
    }
  };

  const addJob = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setMessageType("error");
        return;
      }

      const response = await fetch(getFetchUrl("api/company/addjob"), {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobForm),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Job added successfully!");
        setMessageType("success");

        setShowJobModal(false);
        resetJobForm();

        fetchCompanyJobs();
      } else {
        setMessage(data.message || "Failed to add job");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Add job error:", error);
      setMessage("Something went wrong while adding job");
      setMessageType("error");
    }
  };

  const updateJob = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setMessageType("error");
        return;
      }

      if (!editingJob?._id) {
        setMessage("Job ID not found");
        setMessageType("error");
        return;
      }

      const response = await fetch(getFetchUrl(`api/company/updatejob/${editingJob._id}`),
        {
          method: "PUT",
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobForm),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Job updated successfully!");
        setMessageType("success");

        setShowJobModal(false);
        setEditingJob(null);
        resetJobForm();

        fetchCompanyJobs();
      } else {
        setMessage(data.message || "Failed to update job");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Update job error:", error);
      setMessage("Something went wrong while updating job");
      setMessageType("error");
    }
  };

  const deleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job? This will also remove all applications.",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setMessageType("error");
        return;
      }

      const response = await fetch(getFetchUrl(`api/company/deletejob/${jobId}`),
        {
          method: "DELETE",
          headers: {
            token: token,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Job deleted successfully");
        setMessageType("success");

        fetchCompanyJobs();
      } else {
        setMessage(data.message || "Failed to delete job");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Delete job error:", error);
      setMessage("Something went wrong while deleting job");
      setMessageType("error");
    }
  };

  const resetJobForm = () => {
    setJobForm({
      title: "",
      description: "",
      location: "",
      category: "",
      salary: {
        min: "",
        max: "",
      },
      vacancies: 1,
      deadline: "",
    });
  };

  const openAddJobModal = () => {
    setEditingJob(null);
    resetJobForm();
    setShowJobModal(true);
  };

  const openEditJobModal = (job) => {
    setEditingJob(job);

    setJobForm({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      category: job.category || "",
      salary: {
        min: job.salary?.min ?? "",
        max: job.salary?.max ?? "",
      },
      vacancies: job.vacancies || 1,
      deadline: job.deadline ? job.deadline.split("T")[0] : "",
    });

    setShowJobModal(true);
  };

  const openEditProfile = () => {
    if (!company) {
      return;
    }

    setProfileForm({
      companyName: company.companyName || "",
      email: company.email || "",
      phone: company.phone || "",
      location: company.location || "",
      website: company.website || "",
      description: company.description || "",
    });

    setShowProfileModal(false);
    setShowEditProfileModal(true);
  };

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "min" || name === "max") {
      setJobForm((prev) => ({
        ...prev,
        salary: {
          ...prev.salary,
          [name]: value,
        },
      }));
    } else {
      setJobForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProfileUpdate = () => {
    fetchCompanyProfile();
    setShowProfileModal(true);
  };

  const viewApplications = (jobId) => {
    window.location.href = `/applications/${jobId}`;
  };

  const closeJobModal = () => {
    setShowJobModal(false);
    setEditingJob(null);
    resetJobForm();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Company Panel</h1>

        <div style={styles.headerButtons}>
          <button onClick={handleProfileUpdate} style={styles.profileButton}>
            Show Profile
          </button>

          <button onClick={openAddJobModal} style={styles.addButton}>
            + Add Job
          </button>
        </div>
      </div>

      {message && (
        <div
          style={
            messageType === "success" ? styles.successMsg : styles.errorMsg
          }
        >
          {message}
        </div>
      )}

      {company && (
        <div style={styles.companyInfo}>
          <h3>{company.companyName || "Company"}</h3>

          <p>
            <strong>Location:</strong> {company.location || "N/A"}
          </p>

          <p>
            <strong>Email:</strong> {company.email || "N/A"}
          </p>
        </div>
      )}

      {loading && <div style={styles.loading}>Loading...</div>}

      <div style={styles.jobsContainer}>
        <h3>Your Jobs</h3>

        {jobs.length === 0 ? (
          <p style={styles.emptyText}>
            No jobs added yet. Click "Add Job" to create one.
          </p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} style={styles.jobCard}>
              <div style={styles.jobInfo}>
                <h4>{job.title}</h4>

                <p style={styles.jobMeta}>
                  {job.location || "N/A"} • {job.status || "Active"} •{" "}
                  {job.vacancies || 0} position(s)
                </p>

                <p style={styles.category}>Category: {job.category || "N/A"}</p>

                {job.salary && (
                  <p style={styles.salary}>
                    Salary: {job.salary.min || 0} - {job.salary.max || 0}
                  </p>
                )}
              </div>

              <div style={styles.jobActions}>
                <button
                  onClick={() => openEditJobModal(job)}
                  style={styles.editBtn}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteJob(job._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>

                <button
                  onClick={() => viewApplications(job._id)}
                  style={styles.viewApplicationsBtn}
                >
                  View Applications
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showEditProfileModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Update Company Profile</h2>

              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile();
              }}
            >
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={profileForm.companyName}
                onChange={handleProfileFormChange}
                required
                style={styles.modalInput}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={profileForm.email}
                onChange={handleProfileFormChange}
                style={styles.modalInput}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={profileForm.phone}
                onChange={handleProfileFormChange}
                style={styles.modalInput}
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={profileForm.location}
                onChange={handleProfileFormChange}
                style={styles.modalInput}
              />

              <input
                type="text"
                name="website"
                placeholder="Website"
                value={profileForm.website}
                onChange={handleProfileFormChange}
                style={styles.modalInput}
              />

              <textarea
                name="description"
                placeholder="Company Description"
                value={profileForm.description}
                onChange={handleProfileFormChange}
                style={styles.modalTextarea}
              />

              <div style={styles.modalButtons}>
                <button
                  type="submit"
                  style={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && company && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Company Profile</h2>

              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div style={styles.profileDetails}>
              <div style={styles.profileRow}>
                <strong>Company Name</strong>
                <span>{company.companyName || "N/A"}</span>
              </div>

              <div style={styles.profileRow}>
                <strong>Email</strong>
                <span>{company.email || "N/A"}</span>
              </div>

              <div style={styles.profileRow}>
                <strong>Phone</strong>
                <span>{company.phone || "N/A"}</span>
              </div>

              <div style={styles.profileRow}>
                <strong>Location</strong>
                <span>{company.location || "N/A"}</span>
              </div>

              <div style={styles.profileRow}>
                <strong>Website</strong>
                <span>{company.website || "N/A"}</span>
              </div>

              <div style={styles.profileRow}>
                <strong>Description</strong>
                <span>{company.description || "N/A"}</span>
              </div>
            </div>

            <div style={styles.modalButtons}>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                style={styles.cancelBtn}
              >
                Close
              </button>

              <button
                type="button"
                onClick={openEditProfile}
                style={styles.submitBtn}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showJobModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>{editingJob ? "Edit Job" : "Add New Job"}</h2>

              <button
                onClick={closeJobModal}
                style={styles.closeButton}
                type="button"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (editingJob) {
                  updateJob();
                } else {
                  addJob();
                }
              }}
            >
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
                placeholder="Category"
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
                  style={styles.salaryInput}
                />

                <input
                  type="number"
                  name="max"
                  placeholder="Max Salary"
                  value={jobForm.salary.max}
                  onChange={handleJobFormChange}
                  style={styles.salaryInput}
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
                value={jobForm.deadline}
                onChange={handleJobFormChange}
                style={styles.modalInput}
              />

              <div style={styles.modalButtons}>
                <button type="submit" style={styles.submitBtn}>
                  {editingJob ? "Update Job" : "Add Job"}
                </button>

                <button
                  type="button"
                  onClick={closeJobModal}
                  style={styles.cancelBtn}
                >
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
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "15px 20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    flexWrap: "wrap",
    gap: "15px",
  },

  heading: {
    margin: 0,
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  profileButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  addButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  companyInfo: {
    backgroundColor: "white",
    padding: "15px 20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },

  loading: {
    textAlign: "center",
    padding: "15px",
  },

  jobsContainer: {
    backgroundColor: "white",
    padding: "15px 20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },

  jobCard: {
    padding: "15px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },

  jobInfo: {
    flex: 1,
    minWidth: "250px",
  },

  jobMeta: {
    color: "#666",
    fontSize: "14px",
    marginTop: "4px",
  },

  category: {
    color: "#555",
    fontSize: "14px",
  },

  salary: {
    color: "#333",
    fontSize: "14px",
  },

  jobActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  editBtn: {
    padding: "6px 12px",
    backgroundColor: "#ffc107",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  viewApplicationsBtn: {
    padding: "6px 12px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  emptyText: {
    color: "#888",
    textAlign: "center",
    padding: "20px 0",
  },

  successMsg: {
    padding: "12px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "6px",
    marginBottom: "15px",
    textAlign: "center",
  },

  errorMsg: {
    padding: "12px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "6px",
    marginBottom: "15px",
    textAlign: "center",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },

  modal: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  closeButton: {
    background: "none",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    color: "#555",
  },

  profileDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  profileRow: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
  },

  modalInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },

  modalTextarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    minHeight: "80px",
    resize: "vertical",
  },

  salaryRow: {
    display: "flex",
    gap: "10px",
  },

  salaryInput: {
    width: "50%",
    boxSizing: "border-box",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },

  modalButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  submitBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },

  cancelBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
};

export default CompanyPanel;
