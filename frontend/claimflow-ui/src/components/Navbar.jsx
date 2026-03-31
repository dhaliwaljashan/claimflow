import { useAuth } from "../context/AuthContext";
import {Link, useNavigate} from "react-router-dom";

function Navbar() {
    const { user, logout } = useAuth(); // access auth state and logout function
    const navigate = useNavigate(); // for redirecting after logout

    const handleLogout = () => {
        logout(); // clear auth state
        navigate("/login"); // redirect to login page
    };

    return (
        <nav 
            style={{
                padding: "15px 20px",
                backgroundColor: "#1f2937",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >   
            {/* Left side navigation links */}
            <div style={{ display: "flex", gap: "20px" }}>
                <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
                Dashboard
                </Link>
                <Link to="/claims" style={{ color: "white", textDecoration: "none" }}>
                Claims
                </Link>
                <Link to="/claims/create" style={{ color: "white", textDecoration: "none" }}>
                Create Claim
                </Link>
            </div>
            
             {/* Right side: user info or login */}
            <div style={{ display: "flex", gap: "15px", alignItems: "center", color: "white" }}>
                {user ? (
                    <>
                        <span>Welcome, {user.fullName} ({user.role})</span>
                        <button 
                            onClick={handleLogout}
                            style={{
                                padding: "8px 12px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}
                        >
                            Logout
                        </button>
                    </>
                    ): (
                        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
                        Login
                        </Link>
                    )}
            </div>
        </nav>
    );
 }

export default Navbar;