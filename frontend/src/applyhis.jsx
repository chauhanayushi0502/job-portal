import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
function ApplyHistory() {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/application/applyhistory",
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setHistory(data.history);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Application History</h2>

      {message && <div className="alert alert-danger">{message}</div>}

      {history.length === 0 ? (
        <div className="alert alert-info">No applications found.</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>No.</th>
              <th>Company</th>
              <th>Job Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Status</th>
              {/* <th>Applied Date</th> */}
            </tr>
          </thead>

          <tbody>
            {history.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>

                <td>{item.jobId?.companyName || "-"}</td>

                <td>{item.jobId?.title || "-"}</td>

                <td>{item.jobId?.category || "-"}</td>

                <td>
                  {item.jobId?.location
                    ? `${item.jobId.location.city || ""}, ${
                        item.jobId.location.state || ""
                      }, ${item.jobId.location.country || ""}`
                    : "-"}
                </td>
                <td>
                  {item.jobId?.salary ? (
                    <div>
                      <p> {item.jobId.salary.min}</p>
                      {/* <p>Max: {item.jobId.salary.max}</p> */}
                    </div>
                  ) : (
                    "No Salary"
                  )}
                </td>

                <td>
                  <span
                    className={
                      item.status === "Selected"
                        ? "badge bg-success"
                        : item.status === "Rejected"
                          ? "badge bg-danger"
                          : item.status === "Interview"
                            ? "badge bg-warning text-dark"
                            : item.status === "Shortlisted"
                              ? "badge bg-primary"
                              : "badge bg-secondary"
                    }
                  >
                    {item.status || "Applied"}
                  </span>
                </td>

                {/* <td>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : item.appliedDate
                      ? new Date(item.appliedDate).toLocaleDateString()
                      : "-"}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ApplyHistory;
