import React, { useEffect, useState } from "react";

function Can_apply() {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [select, setselect] = useState([]);
  const [candidateid, setcandidateid] = useState("");

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/application/history",
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
  const select_can = async (candidateId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/application/select",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            candidateId: candidateId,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Candidate selected successfully");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Application History</h2>

      {message && <div className="alert alert-danger">{message}</div>}

      {history.length === 0 ? (
        <div className="alert alert-info">No candidate found</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>No.</th>
              <th>fullName</th>
              <th>email</th>
              <th>skills</th>
              <th>degree</th>
              <th>college</th>
              <th>passingYear</th>
              <th>company</th>
              <th>position</th>
              <th>phone</th>
              <th>title</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>

                <td>{item.candidateId?.fullName || "N/A"}</td>
                <td>{item.candidateId?.email || "N/A"}</td>
                <td>{item.candidateId?.skills || "N/A"}</td>
                <td>
                  {item.candidateId?.education.map((edu, index) => (
                    <div key={index}>
                      <p>{edu.degree}</p>
                    </div>
                  ))}
                </td>
                <td>
                  {item.candidateId?.education.map((edu, index) => (
                    <div key={index}>
                      <p>{edu.college}</p>
                    </div>
                  ))}
                </td>
                <td>
                  {item.candidateId?.education.map((edu, index) => (
                    <div key={index}>
                      <p>{edu.passingYear}</p>
                    </div>
                  ))}
                </td>
                <td>
                  {item.candidateId?.experience.map((edu, index) => (
                    <div key={index}>
                      <p>{edu.company}</p>
                    </div>
                  ))}
                </td>
                <td>
                  {item.candidateId?.experience.map((edu, index) => (
                    <div key={index}>
                      <p>{edu.position}</p>
                    </div>
                  ))}
                </td>
                <td>{item.candidateId?.phone || "N/A"}</td>
                <td>{item.jobId?.title || "N/A"}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => select_can(item.candidateId._id)}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Can_apply;
