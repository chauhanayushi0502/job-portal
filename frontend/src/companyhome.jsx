import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const CompanyHome = () => {
  const location = useLocation();
  const editData = location.state?.job;
  const id = editData?._id;

  const [job, setJob] = useState({
    title: "",
    description: "",
    minsalary: "",
    maxsalary: "",
    city: "",
    state: "",
    country: "",
    category: "",
    vacancies: "",
    deadline: "",
  });

  useEffect(() => {
    if (editData) {
      setJob({
        title: editData.title || "",
        description: editData.description || "",
        minsalary: editData.salary?.min || "",
        maxsalary: editData.salary?.max || "",
        city: editData.location?.city || "",
        state: editData.location?.state || "",
        country: editData.location?.country || "",
        category: editData.category || "",
        vacancies: editData.vacancies || "",
        deadline: editData.deadline
          ? editData.deadline.split("T")[0]
          : "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addJob = async (e) => {
    e.preventDefault();

    const data = {
      title: job.title,
      description: job.description,
      salary: {
        min: Number(job.minsalary),
        max: Number(job.maxsalary),
      },
      location: {
        city: job.city,
        state: job.state,
        country: job.country,
      },
      category: job.category,
      vacancies: Number(job.vacancies),
      deadline: job.deadline,
    };
    try {
    // let url = "http://localhost:8000/api/job/addjob";
    // let method = "POST";

    // if (id) {
    //   url = `http://localhost:8000/api/job/updatejob?id=${id}`;
    //   method = "PUT";
    // }

    
      const response = await fetch("http://localhost:8000/api/job/addjob", {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);

        if (!id) {
          setJob({
            title: "",
            description: "",
            minsalary: "",
            maxsalary: "",
            city: "",
            state: "",
            country: "",
            category: "",
            vacancies: "",
            deadline: "",
          });
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <div>
      <h2>{id ? "Update Job" : "Add Job"}</h2>

      <form onSubmit={addJob}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="number"
          name="minsalary"
          placeholder="Minimum Salary"
          value={job.minsalary}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="number"
          name="maxsalary"
          placeholder="Maximum Salary"
          value={job.maxsalary}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={job.city}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={job.state}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={job.country}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={job.category}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="number"
          name="vacancies"
          placeholder="Vacancies"
          value={job.vacancies}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="date"
          name="deadline"
          value={job.deadline}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <button type="submit">
          {id ? "Update Job" : "Add Job"}
        </button>
      </form>
    </div>
  );
};

export default CompanyHome;