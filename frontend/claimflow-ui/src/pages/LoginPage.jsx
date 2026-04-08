import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // used to redirect user to another page
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AlertMessage from "../components/lertMessage";

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
    <div style={pageStyle}>
      <div style={contentWrapperStyle}>
        <div style={brandPanelStyle}>
          <div style={brandBadgeStyle}>Claims Management Platform</div>
          <h1 style={brandTitleStyle}>ClaimFlow</h1>
          <p style={brandTextStyle}>
            Securely manage claims, track errors, add notes, review audit history,
            and monitor claim activity through dashboards.
          </p>

          <div style={featureListStyle}>
            <div style={featureItemStyle}>• Claims CRUD with secure access</div>
            <div style={featureItemStyle}>• Claim errors, notes, and audit history</div>
            <div style={featureItemStyle}>• Dashboard insights and filters</div>
          </div>
        </div>

        <div style={formCardStyle}>
          <h2 style={formTitleStyle}>Sign in</h2>
          <p style={formSubtitleStyle}>Login to continue to ClaimFlow</p>

          {/* show error if login fails */}
          <AlertMessage
            type="error"
            message={error}
            onClose={() => setError("")}
          />

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
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 20px",
  background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const contentWrapperStyle = {
  width: "100%",
  maxWidth: "1100px",
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: "28px",
  alignItems: "stretch"
};

const brandPanelStyle = {
  backgroundColor: "#1e3a8a",
  color: "white",
  borderRadius: "18px",
  padding: "40px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.12)"
};

const brandBadgeStyle = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.15)",
  fontSize: "13px",
  marginBottom: "18px"
};

const brandTitleStyle = {
  margin: 0,
  fontSize: "42px",
  lineHeight: 1.1,
  marginBottom: "16px"
};

const brandTextStyle = {
  margin: 0,
  fontSize: "16px",
  lineHeight: 1.7,
  color: "#dbeafe",
  maxWidth: "540px"
};

const featureListStyle = {
  marginTop: "28px",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const featureItemStyle = {
  color: "#e0f2fe",
  fontSize: "15px"
};

const formCardStyle = {
  backgroundColor: "white",
  borderRadius: "18px",
  padding: "36px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
};

const formTitleStyle = {
  margin: 0,
  marginBottom: "8px"
};

const formSubtitleStyle = {
  marginTop: 0,
  marginBottom: "22px",
  color: "#6b7280"
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "18px"
};

const labelStyle = {
  marginBottom: "8px",
  fontWeight: 500
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px"
};

const loginButtonStyle = {
  width: "100%",
  padding: "12px 16px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "8px"
};

export default LoginPage;