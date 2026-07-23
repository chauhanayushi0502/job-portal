import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyHome from "./companyhome";
import Can_apply from "./whoapply"
function Showjob() {
  const [jobs, setJobs] = useState([]);
  const [message, setmessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
  GetJobs();
}, []);

  const GetJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/job/getjobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setJobs(data.jobs || []);
      } else {
        setMessage(data.message || data.error || "Failed to fetch jobs");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const deletejob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/job/deletejob?id=" + jobId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setmessage(data.message);
        GetJobs();
      } else {
        setmessage(data.message || data.error);
      }
    } catch (error) {
      setmessage("Server Error");
    }
  };
  const editjob = (job) => {
  navigate("/CompanyHome", {
    state: { job },
  });
};
  return (
    <div>
      <h3>Jobs</h3>

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
            <button onClick={() => editjob(j)}>Edit</button>
            <button onClick={() => deletejob(j._id)}>Delete</button>
          </div>
        ))
      )}
      <div style={{ marginTop: "50px" }}>
        <button onClick={() => navigate("/CompanyHome")}>Add Job</button>
      </div>
      <div>
        <button onClick={()=>navigate("/Can_apply")}>show applications</button>
      </div>
    </div>
  );
}
export default Showjob;
