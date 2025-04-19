import React from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/Pages/LoginPage/login";
import Signup from "../src/Pages/Signuppage/sign";
import AdminDashboard from "../src/Pages/AdminDashboard/Admin";
import UserDashboard from "../src/Pages/UserDashboard/User";
import StoreOwnerDashboard from "../src/Pages/storeOwnerDashborad/store";
import ProtectedRoute from "../src/Component/ProtectRoute/Protectedroute";

const AllRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/user"
          element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>}
        />
        <Route
          path="/store-owner"
          element={<ProtectedRoute role="store_owner"><StoreOwnerDashboard /></ProtectedRoute>}
        />
      </Routes>
    </Router>
  )
}

export default AllRouter
