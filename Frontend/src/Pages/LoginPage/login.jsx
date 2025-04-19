import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"


const login = () => {

  const [loginData, setloginData] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setloginData({ ...loginData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginData;

    //  Corrected validation inside handleSubmit
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "store_owner") navigate("/store-owner");
      else navigate("/user");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };
   
  return (
    <>
    <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-login">
              Login
            </button>
          </form>
          <p className="login-footer">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  )
}

export default login
