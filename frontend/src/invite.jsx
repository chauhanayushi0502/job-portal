import { useState, useEffect } from "react";
import { getFetchUrl } from "./util";

const InviteForm = () => {
  const [applicationId, setapplicationId] = useState("");

  useEffect(() => {
    const appId = localStorage.getItem("applicationId");
    if (appId) {
      setapplicationId(appId);
    }
    console.log(appId);
  }, []);


  const [interview, setInterview] = useState({
    interviewType: "Online",
    interviewDate: "",
    interviewTime: "",
    duration: "",
    location: "",
    meetingLink: "",
    interviewerName: "",
    interviewerEmail: "",
    instructions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInterview((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "interviewType") {
        if (value === "Online") updated.location = "";
        if (value === "Offline") updated.meetingLink = "";
      }

      return updated;
    });
  };

  const saveForm = async (e) => {
    e.preventDefault();

    const body = {
      applicationId: localStorage.getItem("applicationId"),
      interviewType: interview.interviewType,
      interviewDate: interview.interviewDate,
      interviewTime: interview.interviewTime,
      duration: interview.duration,
      location: interview.interviewType === "Offline" ? interview.location : "",
      meetingLink: interview.interviewType === "Online" ? interview.meetingLink : "",
      interviewerName: interview.interviewerName,
      interviewerEmail: interview.interviewerEmail,
      instructions: interview.instructions,
    };

    try {
      const response = await fetch(
        getFetchUrl("api/company/invite"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);

        setInterview({
          interviewType: "Online",
          interviewDate: "",
          interviewTime: "",
          duration: "",
          location: "",
          meetingLink: "",
          interviewerName: "",
          interviewerEmail: "",
          instructions: "",
        });

        // navigate(-1);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Invite For Interview</h2>

      <form onSubmit={saveForm}>
    
        <div className="mb-3">
          <label className="d-block fw-bold">Interview Type</label>
            <input
              type="radio"
              name="interviewType"
              value="Online"
              checked={interview.interviewType === "Online"}
              onChange={handleChange}
            />
            <span> Online</span>

            <input
              className="ms-3"
              type="radio"
              name="interviewType"
              value="Offline"
              checked={interview.interviewType === "Offline"}
              onChange={handleChange}
            />
            <span> Offline</span>
         
        </div><br/>

        <div className="mb-3">
          <label>Interview Date</label>
          <input
            className="form-control"
            type="date"
            name="interviewDate"
            value={interview.interviewDate}
            onChange={handleChange}
          />
        </div><br/>

        <div className="mb-3">
          <label>Interview Time</label>
          <input
            className="form-control"
            type="time"
            name="interviewTime"
            value={interview.interviewTime}
            onChange={handleChange}
          />
        </div><br/>

        <div className="mb-3">
          <label>Duration</label>
          <input
            className="form-control"
            type="number"
            name="duration"
            value={interview.duration}
            onChange={handleChange}
          />
        </div><br/>

        {/* Dynamic Input: Show Meeting Link ONLY if Online */}
        {interview.interviewType === "Online" && (
          <div className="mb-3">
            <label>Meeting Link</label>
            <input
              className="form-control"
              type="url"
              name="meetingLink"
              placeholder="https://..."
              value={interview.meetingLink}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Dynamic Input: Show Location ONLY if Offline */}
        {interview.interviewType === "Offline" && (
          <div className="mb-3">
            <label>Location / Address</label>
            <input
              className="form-control"
              type="text"
              name="location"
              placeholder="Office address"
              value={interview.location}
              onChange={handleChange}
              required
            />
          </div>
        )}<br/>

        <div className="mb-3">
          <label>Interviewer Name</label>
          <input
            className="form-control"
            type="text"
            name="interviewerName"
            value={interview.interviewerName}
            onChange={handleChange}
          />
        </div><br/>

        <div className="mb-3">
          <label>Interviewer Email</label>
          <input
            className="form-control"
            type="email"
            name="interviewerEmail"
            value={interview.interviewerEmail}
            onChange={handleChange}
          />
        </div><br/>

        <div className="mb-3">
          <label>Instructions</label>
          <textarea
            className="form-control"
            name="instructions"
            value={interview.instructions}
            onChange={handleChange}
          />
        </div><br/>

        <button type="submit" className="btn btn-primary">
          Send Invitation
        </button>
      </form>
    </div>
  );
};

export default InviteForm;