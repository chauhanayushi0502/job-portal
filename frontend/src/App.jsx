import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./Login";
function App() {
  const [data, setdata] = useState({
    username: "",
    email: "",
    password: "",
    role: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setdata({
      ...data,
      [name]: value,
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/user/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Registration failed");
      }

      alert("Registration Successful!");
      setdata({
        username: "",
        email: "",
        password: "",
        role: ""
      });
      navigate("/login");
    } catch (error) {
      console.log("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Register</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={data.username}
            onChange={handleInputChange}
            required
            style={{
              width: "95%",
              padding: "10px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={handleInputChange}
            required
            style={{
              width: "95%",
              padding: "10px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={data.password}
            onChange={handleInputChange}
            required
            style={{
              width: "95%",
              padding: "10px",
            }}
          />
        </div>
        <div>
          <p>Role</p>
          <label>candidate:</label>
          <input type="radio" name="role" value="candidate" checked={data.role === "candidate"} onChange={handleInputChange} />
          <label>company:</label>
          <input type="radio" name="role" value="company" checked={data.role === "company"} onChange={handleInputChange} />
        </div>
        <button
          type="submit"
          style={{
            width: "102%",
            padding: "10px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default App;
