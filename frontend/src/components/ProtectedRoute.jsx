import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, checkingAuth } = useAuth();
    if (checkingAuth) {
    return <h1>Loading...</h1>;
}
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}