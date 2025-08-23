import React, { useEffect, useState } from "react";
import axios from "axios";

const Store = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token
        const res = await axios.get("http://localhost:8000/api/store/ratings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Ratings:", res.data);

        if (res.data && res.data.ratings) {
          setRatings(res.data.ratings);

          // Calculate average rating
          const avg =
            res.data.ratings.reduce((acc, r) => acc + r.value, 0) /
            res.data.ratings.length;
          setAverageRating(avg || 0);
        }
      } catch (error) {
        console.error("Error fetching ratings", error);
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="container mt-5">
      {/* Dashboard Card */}
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 text-primary">Store Owner Dashboard</h2>

          <div className="mb-4">
            <h4>
              Average Rating:{" "}
              <span className="badge bg-success">
                {averageRating.toFixed(1)}
              </span>
            </h4>
          </div>

          <h5 className="mb-3">User Ratings</h5>
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length > 0 ? (
                ratings.map((rating) => (
                  <tr key={rating._id}>
                    <td>{rating.user?.name || "Anonymous"}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {rating.value} ⭐
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    No ratings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Store;
