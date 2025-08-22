import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>Store Rating App</h2>
      <div>
        <Link to="/">Home</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
