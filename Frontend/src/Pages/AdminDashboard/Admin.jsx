import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", address: "", role: "" });
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState(""); // Normal, Store, Admin
  const [storeFilters, setStoreFilters] = useState({ name: "", email: "", address: "" });
  const [userFilters, setUserFilters] = useState({ name: "", email: "", address: "", role: "" });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchStats = () => {
    axios.get("http://localhost:8000/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setStats(res.data));
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/stores", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: storeFilters, // sending filters as query params
      });
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: userFilters, // sending filters as query params
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleStoreFilterChange = (e) => {
    const { name, value } = e.target;
    setStoreFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleUserFilterChange = (e) => {
    const { name, value } = e.target;
    setUserFilters((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUserData = { ...formData };

    try {
      // Send POST request based on userType
      if (userType === "store") {
        // Add store-specific data
        await axios.post("http://localhost:8000/api/stores", newUserData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        alert("Store added successfully!");
      } else if (userType === "admin" || userType === "normal") {
        // Add normal or admin user data
        await axios.post("http://localhost:8000/api/users", newUserData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} added successfully!`);
      }
      setShowModal(false);
      setFormData({ name: "", email: "", address: "", role: "" });
      fetchStats();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Error adding user/store");
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus" title="Add user admin and store"></i> Add 
        </button>
      </div>

      {/* Stats */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-6">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Stores</h5>
              <p className="card-text display-6">{stats.totalStores}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Ratings</h5>
              <p className="card-text display-6">{stats.totalRatings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select User Type</label>
                    <select
                      className="form-select"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="normal">Normal User</option>
                      <option value="store">Store</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {userType === "store" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Store Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          name="address"
                          rows="3"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                    </>
                  )}

                  {(userType === "normal" || userType === "admin") && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      {userType === "admin" && (
                        <div className="mb-3">
                          <label className="form-label">Role</label>
                          <input
                            type="text"
                            className="form-control"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="container my-5">
        <h2>Stores List</h2>
        {/* Store Filters */}
        <div className="mb-3 row">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by Name"
              name="name"
              value={storeFilters.name}
              onChange={handleStoreFilterChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Filter by Email"
              name="email"
              value={storeFilters.email}
              onChange={handleStoreFilterChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Filter by Address"
              name="address"
              value={storeFilters.address}
              onChange={handleStoreFilterChange}
            />
          </div>
        </div>

      
        {/* Store Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store._id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.averageRating || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-5">Users List</h2>
        {/* User Filters */}
        <div className="mb-3 row">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by Name"
              name="name"
              value={userFilters.name}
              onChange={handleUserFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Filter by Email"
              name="email"
              value={userFilters.email}
              onChange={handleUserFilterChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Filter by Address"
              name="address"
              value={userFilters.address}
              onChange={handleUserFilterChange}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-control mt-2"
              name="role"
              value={userFilters.role}
              onChange={handleUserFilterChange}
            >
              <option value="">Filter by Role</option>
              <option value="admin">Admin</option>
              <option value="storeOwner">Store Owner</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      
        {/* User Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
              <th>Store Rating</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>{user.store ? user.store.averageRating : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Admin;
