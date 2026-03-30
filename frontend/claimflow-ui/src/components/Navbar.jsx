import {Link} from "react-router-dom";

function Navbar() {
    return (
        <nav 
        style={{
            padding: "15px 20px",
            backgroundColor: "#1f2937",
            display: "flex",
            gap: "20px",
        }}
        >   
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
        Dashboard
        </Link>
        <Link to="/claims" style={{ color: "white", textDecoration: "none" }}>
        Claims
        </Link>
        <Link to="/claims/create" style={{ color: "white", textDecoration: "none" }}>
        Create Claim
        </Link>
        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
        Login
        </Link>
        </nav>
    );
 }

export default Navbar;