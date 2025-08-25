// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  const token = localStorage.getItem("token");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(data);
        setForm({ name: data.name, email: data.email, address: data.address || "" });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:8000/api/update-profile",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Update failed");

      const result = await res.json();
      alert("Profile updated successfully");
      setProfile(result); // update state with latest response
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;
  if (!profile) return <p className="text-center mt-5">No profile found</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Profile ({profile.role})</h2>

      {!editing ? (
        <div className="card p-4 shadow justify-content-center">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Address:</strong> {profile.address || "Not Provided"}</p>

          <button className="btn btn-primary mt-3 " style={{width:'200px'}} onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        </div>
      ) : (
        <form className="card p-4 shadow" onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled // email usually not editable
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

         <div className="d-flex gap-2 mt-3">
           <button 
             type="submit" 
             style={{ width: "200px" }} 
             className="btn btn-success"
           >
             Save
           </button>
         
           <button 
             type="button" 
             style={{ width: "200px" }} 
             className="btn btn-secondary"
             onClick={() => setEditing(false)}
           >
             Cancel
           </button>
        </div>

        </form>
      )}
    </div>
  );
};

export default Profile;
