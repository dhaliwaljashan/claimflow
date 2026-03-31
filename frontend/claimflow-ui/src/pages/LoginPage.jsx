import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // used to redirect user to another page
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();  // used for redirect after login
  const {user, login} = useAuth(); // access login function from context

  // form input state
  const[formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");       // store error message
  const [loading, setLoading] = useState(false);  // loading state for button

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  // update form values when user types
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    setError("");

    try {
      // call backend login API
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;

      login(token, user); //// save token + user in context/localStorage
      navigate("/dashboard"); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "60px auto",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Login</h2>
        
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px"
            }}
          />
        </div>
            
        <div style={{ marginBottom: "15px" }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px"
            }}
          />
          </div>

          {/* show error if login fails */}
          {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;