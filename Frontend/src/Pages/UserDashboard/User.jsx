import React, { useEffect, useState } from 'react'
import axios from "axios";

const User = () => {
    const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    const fetchStores = async () => {
      const res = await axios.get("http://localhost:8000/api/stores");
      setStores(res.data);
    };

    const fetchUserRatings = async () => {
      const res = await axios.get("http://localhost:8000/api/stores/:id/rate", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setUserRatings(res.data);
    };

    fetchStores();
    fetchUserRatings();
  }, []);

  const handleRating = async (storeId, ratingValue) => {
    await axios.post(
      "http://localhost:8000/api/ratings",
      { storeId, rating: ratingValue },
      { headers: { Authorization: localStorage.getItem("token") } }
    );

    setUserRatings({ ...userRatings, [storeId]: ratingValue });
  };

  return (
    <>
      <div className="container mt-5">
      <h2 className='text-center text-warning  '>Store Listings</h2>
      {stores.map((store) => (
        <div key={store._id} className="card mt-3 p-3">
          <h5>{store.name}</h5>
          <p>{store.address}</p>
          <p>Average Rating: {store.averageRating.toFixed(1)}</p>
          <p>Your Rating: {userRatings[store._id] || "Not rated"}</p>
          <select onChange={(e) => handleRating(store._id, Number(e.target.value))}>
            <option value="">Rate this store</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
    </>
  )
}

export default User
