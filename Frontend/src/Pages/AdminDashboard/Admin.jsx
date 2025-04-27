import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Admin = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", address: "" });
  const [stores, setStores] = useState([]);
  const [User, setUsers]=useState([]);

  useEffect(() => {
    fetchStats();
  }, []);
  
  useEffect(()=>{
     fetchStores();
  },[])
  
  useEffect(()=>{
    fetchUsers();
  },[])

  const fetchStats = () => {
    axios.get("http://localhost:8000/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setStats(res.data));
  };

  const fetchStores=()=>{
    axios.get("http://localhost:8000/api/allstores",{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }).then(res => setStores(res.data));
    
  }

  const fetchUsers=()=>{
    axios.get("http://localhost:8000/api/admin/users",{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }).then(res => setUsers(res.data));
    
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch userId from localStorage
    const ownerId = localStorage.getItem("userId");

    // Add ownerId to the form data
    const newStoreData = { ...formData, owner: ownerId };

    try {
      // Send the POST request with the new data (including ownerId)
      await axios.post("http://localhost:8000/api/stores", newStoreData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Store added successfully!");
      setShowModal(false);
      setFormData({ name: "", email: "", address: "" });
      fetchStats(); // Refresh stats after adding
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Error adding store");
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Add Store
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
                <h5 className="modal-title">Add New Store</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
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
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Store
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
