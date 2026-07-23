import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Applyjob from "./apply.jsx";
import ApplyHistory from "./applyhis.jsx";
// import Profile from "./profile.jsx";

function Job() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const showJobs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/job/getalljob", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setJobs(data.jobs || []);
      } else {
        setMessage(data.message || data.error || "Failed to fetch jobs");
      }
    } catch (error) {
      // console.log(error);
      setMessage("An error occurred while fetching jobs.");
    }
  };
  //   try {
  //     const token = localStorage.getItem("token");

  //     const response = await fetch("http://localhost:8000/api/application/applyjob", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //     } else {
  //       setMessage(data.message || data.error);
  //     }
  //   } catch (error) {}
  // };
  const applyjob = (jobId, jobTitle) => {
    localStorage.setItem("jobId", jobId);
    localStorage.setItem("jobTitle", jobTitle);

    navigate("/Applyjob");
  };
  useEffect(() => {
    showJobs();
  }, []);
  return (
    <>
      <h2>Jobs List</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((j) => (
          <div
            key={j._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h4>{j.title}</h4>
            <button onClick={() => applyjob(j._id, j.title)}>Apply</button>
          </div>
        ))
      )}
      <div>
        <button onClick={()=>navigate("/ApplyHistory")}>show History</button>
      </div>
    </>
  );
}

export default Job;
