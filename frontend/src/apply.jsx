import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyHistory from "./applyhis"

function Applyjob() {
  const navigate = useNavigate();

  const jobId = localStorage.getItem("jobId");
  const jobTitle = localStorage.getItem("jobTitle");

  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const checkProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8000/api/candidate/checkprofile",
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
//       console.log(response.status);
// console.log(response.ok);
      const data = await response.json();

      if (response.ok) {
        setProfileComplete(data.profileComplete);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8000/api/application/applyjob",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            jobId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/jobs");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Checking Profile...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "600px",
        margin: "40px auto",
        textAlign: "center",
      }}
    >
      {profileComplete ? (
        <>
          <h2>{jobTitle}</h2>

          <h3>Are you sure you want to apply for this job?</h3>

          <br />

          <button onClick={applyJob}>
            Yes, Apply
          </button>
        </>
      ) : (
        <>
          <h2>Your Profile is Incomplete</h2>

          <p>
            Please complete your profile before applying for this job.
          </p>

          <button
            onClick={() => navigate("/Profile")}
          >
            Complete Profile
          </button>
        </>
      )}

      {message && (
        <>
          <br />
          <br />
          <p>{message}</p>
        </>
      )}
      <button onClick={()=>navigate("/ApplyHistory")}>
        0k
      </button>
    </div>
  );
}

export default Applyjob;