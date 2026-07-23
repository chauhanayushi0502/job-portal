import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import CompanyHome from "./companyhome";
import Job from "./candidatehome";
import Showjob from "./companyjob"
const LoginForm = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || `Error: ${response.statusText}`);
      }

      setData({ username: "", password: "" });
      localStorage.setItem("token", resData.token);

      alert("Login Successful!");
      if (resData.user && resData.user.role === "company") {
        navigate("/Showjob");
      }
      if (resData.user && resData.user.role === "candidate") {
        navigate("/Job");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      alert(`Login Error: ${error.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "300px", margin: "0 auto" }}
    >
      <div style={{ marginBottom: "15px" }}>
        <input
          onChange={handleInputChange}
          name="username"
          type="text"
          placeholder="Username"
          value={data.username}
          required
          style={{ padding: "8px", width: "250px" }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <input
          onChange={handleInputChange}
          name="password"
          type="password"
          placeholder="Password"
          value={data.password}
          required
          style={{ padding: "8px", width: "250px" }}
        />
      </div>
      <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
