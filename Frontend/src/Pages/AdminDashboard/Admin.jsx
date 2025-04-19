import { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setStats(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Stores: {stats.totalStores}</p>
      <p>Total Ratings: {stats.totalRatings}</p>
    </div>
  );
};

export default Admin;
