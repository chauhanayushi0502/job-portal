import React, { useState } from "react";
import { getFetchUrl } from "./util";

function ProfileCompletion({ candidate, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    fullName: candidate?.fullName || "",
    email: candidate?.email || "",
    phone: candidate?.phone || "",
    address: candidate?.address || "",
    city: candidate?.city || "",
    state: candidate?.state || "",
    country: candidate?.country || "",
    pincode: candidate?.pincode || "",
    title: candidate?.title || "",
    skills: Array.isArray(candidate?.skills)
      ? candidate.skills.join(", ")
      : candidate?.skills || "",
    education:
      Array.isArray(candidate?.education) && candidate.education.length > 0
        ? candidate.education
        : [{ degree: "", institution: "", year: "" }],
    resume: candidate?.resume || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedEducation = [...prev.education];

      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value,
      };

      return {
        ...prev,
        education: updatedEducation,
      };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          year: "",
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const country = formData.country.trim();
    const pincode = formData.pincode.trim();
    const title = formData.title.trim();
    const resume = formData.resume.trim();

    // if (!fullName) {
    //   setMessage("❌ Full name is required.");
    //   return;
    // }

    // if (!/^[A-Za-z\s]{2,50}$/.test(fullName)) {
    //   setMessage("❌ Please enter a valid full name.");
    //   return;
    // }

    if (!email) {
      setMessage("❌ Email is required.");
      return;
    }

    if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      setMessage("❌ Please enter a valid email address.");
      return;
    }

    if (!phone) {
      setMessage("❌ Phone number is required.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setMessage("❌ Phone number must contain exactly 10 digits.");
      return;
    }

    if (!address) {
      setMessage("❌ Address is required.");
      return;
    }

    if (address.length < 5) {
      setMessage("❌ Address must be at least 5 characters.");
      return;
    }

    if (!city) {
      setMessage("❌ City is required.");
      return;
    }

    if (!/^[A-Za-z\s.-]+$/.test(city)) {
      setMessage("❌ Please enter a valid city.");
      return;
    }

    if (!state) {
      setMessage("❌ State is required.");
      return;
    }

    if (!/^[A-Za-z\s.-]+$/.test(state)) {
      setMessage("❌ Please enter a valid state.");
      return;
    }

    if (!country) {
      setMessage("❌ Country is required.");
      return;
    }

    if (!/^[A-Za-z\s.-]+$/.test(country)) {
      setMessage("❌ Please enter a valid country.");
      return;
    }

    if (!pincode) {
      setMessage("❌ Pincode is required.");
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      setMessage("❌ Pincode must contain exactly 6 digits.");
      return;
    }

    if (!title) {
      setMessage("❌ Professional title is required.");
      return;
    }

    if (title.length < 2) {
      setMessage("❌ Professional title must be at least 2 characters.");
      return;
    }

    if (!formData.skills.trim()) {
      setMessage("❌ Please enter at least one skill.");
      return;
    }

    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    if (skills.length === 0) {
      setMessage("❌ Please enter at least one skill.");
      return;
    }

    if (skills.some((skill) => skill.length < 2)) {
      setMessage("❌ Each skill must contain at least 2 characters.");
      return;
    }

    if (!resume) {
      setMessage("❌ Resume is required.");
      return;
    }

    if (formData.education.length === 0) {
      setMessage("❌ Please add at least one education entry.");
      return;
    }

    for (let i = 0; i < formData.education.length; i++) {
      const edu = formData.education[i];

      const degree = (edu.degree || "").trim();
      const institution = (edu.institution || "").trim();
      const year = (edu.year || "").trim();

      if (!degree) {
        setMessage(`❌ Please enter degree for education ${i + 1}.`);
        return;
      }

      if (degree.length < 2) {
        setMessage(
          `❌ Degree for education ${i + 1} must be at least 2 characters.`
        );
        return;
      }

      if (!institution) {
        setMessage(
          `❌ Please enter institution for education ${i + 1}.`
        );
        return;
      }

      if (institution.length < 2) {
        setMessage(
          `❌ Institution for education ${i + 1} must be at least 2 characters.`
        );
        return;
      }

      if (!year) {
        setMessage(`❌ Please enter year for education ${i + 1}.`);
        return;
      }

      if (!/^\d{4}$/.test(year)) {
        setMessage(
          `❌ Education year ${i + 1} must contain exactly 4 digits.`
        );
        return;
      }

      const educationYear = Number(year);
      const currentYear = new Date().getFullYear();

      if (educationYear < 1950 || educationYear > currentYear + 5) {
        setMessage(
          `❌ Please enter a valid education year for entry ${i + 1}.`
        );
        return;
      }
    }

    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        getFetchUrl("api/candidate/updatecandidate"),
        {
          method: "PUT",
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName,
            email: email,
            phone: phone,
            address: address,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
            title: title,
            skills: skills,
            education: formData.education,
            resume: resume,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Profile updated successfully!");

        setTimeout(() => {
          onUpdate();
        }, 1500);
      } else {
        setMessage(
          "❌ " + (data.message || "Failed to update profile")
        );
      }
    } catch (error) {
      console.error("Update profile error:", error);

      setMessage(
        "❌ Unable to update profile. Please check your server or internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2>Complete Your Profile</h2>

          <button onClick={onClose} style={styles.closeBtn}>
            Close
          </button>
        </div>

        {message && (
          <div
            style={
              message.includes("✅")
                ? styles.successMsg
                : styles.errorMsg
            }
          >
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
            maxLength={10}
            inputMode="numeric"
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
            maxLength={6}
            inputMode="numeric"
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
            <label style={styles.sectionLabel}>
              Education
            </label>

            {formData.education.map((edu, index) => (
              <div key={index} style={styles.educationItem}>
                <input
                  type="text"
                  placeholder="Degree (e.g. B.Sc. CS)"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "degree",
                      e.target.value
                    )
                  }
                  required
                  style={styles.eduInput}
                />

                <input
                  type="text"
                  placeholder="Institution (e.g. MIT)"
                  value={edu.institution || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "institution",
                      e.target.value
                    )
                  }
                  required
                  style={styles.eduInput}
                />

                <input
                  type="text"
                  placeholder="Year (e.g. 2020)"
                  value={edu.year || ""}
                  onChange={(e) =>
                    handleEducationChange(
                      index,
                      "year",
                      e.target.value
                    )
                  }
                  maxLength={4}
                  inputMode="numeric"
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
            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
            >
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
  },

  modal: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "600px",
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

  closeBtn: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },

  educationSection: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "15px",
    marginTop: "5px",
  },

  sectionLabel: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "10px",
    color: "#333",
  },

  educationItem: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
  },

  eduInput: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "13px",
  },

  addBtn: {
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
    marginTop: "5px",
  },

  removeBtn: {
    padding: "4px 8px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },

  modalButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  submitBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#28a745",
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

  successMsg: {
    padding: "10px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "6px",
    marginBottom: "15px",
    textAlign: "center",
  },

  errorMsg: {
    padding: "10px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "6px",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default ProfileCompletion;
