import React, { useEffect, useState } from "react";
import axios from "axios";

const User = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    const fetchStores = async () => {
      const res = await axios.get("http://localhost:8000/api/stores/allstores");
      setStores(res.data);
    };

    const fetchUserRatings = async () => {
      const res = await axios.get("http://localhost:8000/api/user/ratings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserRatings(res.data);
    };

    fetchStores();
    fetchUserRatings();
  }, []);

  const handleRating = async (storeId, ratingValue) => {
    await axios.post(
      "http://localhost:8000/api/rate",
      { storeId, rating: ratingValue },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setUserRatings({ ...userRatings, [storeId]: ratingValue });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-warning fw-bold mb-4">
        ⭐ Store Listings ⭐
      </h2>
      <div className="row">
        {stores.map((store) => (
          <div key={store._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-lg border-0 h-100">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">{store.name}</h5>
                <p className="card-text">
                  <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                  {store.address}
                </p>
                <p>
                  <span className="fw-semibold">Average Rating:</span>{" "}
                  <span className="badge bg-success">
                    {store.averageRating.toFixed(1)}
                  </span>
                </p>
                <p>
                  <span className="fw-semibold">Your Rating:</span>{" "}
                  {userRatings[store._id] ? (
                    <span className="badge bg-info text-dark">
                      {userRatings[store._id]}
                    </span>
                  ) : (
                    "Not rated"
                  )}
                </p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    handleRating(store._id, Number(e.target.value))
                  }
                >
                  <option value="">Rate this store</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
