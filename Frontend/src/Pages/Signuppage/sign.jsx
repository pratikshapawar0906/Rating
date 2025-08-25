import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./sign.css";
import { ToastContainer } from "react-toastify";

const SignUp = () => {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "", //  role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          await axios.post("http://localhost:8000/api/register", signUpData);
          alert("Signup successful!");
          navigate("/");
      } catch (error) {
          console.error("Signup error:", error.response?.data); // Log error details
  
          // Check if user already exists
          if (error.response?.status === 400 && error.response?.data?.msg === "User already exists") {
              alert("User already exists! Please log in.");
          } else {
              alert(error.response?.data?.errors?.map(err => err.msg).join("\n") || "Signup failed");
          }
      }
  };



  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={signUpData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signUpData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Enter your address"
              value={signUpData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={signUpData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select name="role" value={signUpData.role} onChange={handleChange}>
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-signup">Sign Up</button>
        </form>
        <p className="signup-footer">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default SignUp;
