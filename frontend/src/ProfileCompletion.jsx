import React, { useState } from 'react';

function ProfileCompletion({ candidate, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    fullName: candidate?.fullName || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    address: candidate?.address || '',
    city: candidate?.city || '',
    state: candidate?.state || '',
    country: candidate?.country || '',
    pincode: candidate?.pincode || '',
    title: candidate?.title || '',
    skills: candidate?.skills?.join(', ') || '',
    education: candidate?.education || [{ degree: '', institution: '', year: '' }],
    resume: candidate?.resume || '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData({ ...formData, education: updatedEducation });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', institution: '', year: '' }]
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: updatedEducation });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.education.length === 0) {
      setMessage('Please add at least one education entry.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/candidate/updatecandidate', {
      method: 'PUT',
      headers: { 'token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        title: formData.title,
        skills: formData.skills.split(',').map(s => s.trim()),
        education: formData.education,
        resume: formData.resume,
      })
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Profile updated successfully!');
      setTimeout(() => {
        onUpdate();
      }, 1500);
    } else {
      setMessage((data.message || 'Failed to update profile'));
    }
    setLoading(false);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2>Complete Your Profile</h2>
          <button onClick={onClose} style={styles.closeBtn}>Close</button>
        </div>

        {message && (
          <div style={message.includes? styles.successMsg : styles.errorMsg}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="title"
            placeholder="Professional Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="resume"
            placeholder="Resume URL or text"
            value={formData.resume}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <div style={styles.educationSection}>
            <label style={styles.sectionLabel}>Education</label>
            {formData.education.map((edu, index) => (
              <div key={index} style={styles.educationItem}>
                <input
                  type="text"
                  placeholder="Degree (e.g. B.Sc. CS)"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  required
                  style={styles.eduInput}
                />
                <input
                  type="text"
                  placeholder="Institution (e.g. MIT)"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  required
                  style={styles.eduInput}
                />
                <input
                  type="text"
                  placeholder="Year (e.g. 2020)"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                  required
                  style={styles.eduInput}
                />
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    style={styles.removeBtn}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              style={styles.addBtn}
            >
              + Add Education
            </button>
          </div>

          <div style={styles.modalButtons}>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
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
    maxWidth: '600px',
    maxHeight: '90vh',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  educationSection: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '15px',
    marginTop: '5px',
  },
  sectionLabel: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '10px',
    color: '#333',
  },
  educationItem: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    alignItems: 'center',
  },
  eduInput: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '13px',
  },
  addBtn: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
    marginTop: '5px',
  },
  removeBtn: {
    padding: '4px 8px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
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
  successMsg: {
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  errorMsg: {
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center',
  },
};

export default ProfileCompletion;