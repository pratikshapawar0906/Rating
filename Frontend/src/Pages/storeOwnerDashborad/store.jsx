import React, { useEffect, useState } from 'react'
import axios from "axios";

const store = () => {
    const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        const res = await axios.get("http://localhost:8000/api/store/ratings", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request
          },
        });
        console.log("Ratings:", res.data);
      } catch (error) {
        console.error("Error fetching ratings", error);
      }
    };
    
    fetchRatings();
  }, []);
  return (
    <>
      <div className="container mt-5">
      <h2>Store Owner Dashboard</h2>
      <h4>Average Rating: {averageRating.toFixed(1)}</h4>
      <h5>User Ratings</h5>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating) => (
            <tr key={rating._id}>
              <td>{rating.user.name}</td>
              <td>{rating.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default store
