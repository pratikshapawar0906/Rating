const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== role) return <Navigate to="/" />;
  } catch {
    return <Navigate to="/" />;
  }

  return children;
};
