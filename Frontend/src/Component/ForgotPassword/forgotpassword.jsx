import React, { useState } from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const forgotpassword = () => {
    const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/forgot-password", { email });
      toast.success("Password reset link sent to your email.");
      navigate("/login"); // redirect to login after sending
    } catch (err) {
      toast.error("Email not found or server error");
    }
  };
  return (
    <div>
      <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Forgot Password</h2>
        <form onSubmit={handleForgotPassword} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default forgotpassword
