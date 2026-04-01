import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const {user, authLoading} = useAuth();

    if (authLoading) {
        return <p style={{ padding: "20px" }}>Checking authentication...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;