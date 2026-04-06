import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  CLAIM_TYPE_OPTIONS,
  STATE_OPTIONS,
  STATUS_OPTIONS
} from "../utils/claimOptions";

function CreateClaimPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    memberId: "",
    providerId: "",
    state: "Arizona",
    claimType: "FFS",
    amount: "",
    status: "Pending",
    submissionDate: "",
    isInternal: true,
    createdByUserId: user?.userId
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
       ...prev,
         [name]: type === "checkbox" ? checked : value
        }));
      };

  const handleSubmit = async (e) => {
    e.preventDefault();  // prevents the browser from reloading the page on form submission
    setError("");

    // Basic client-side validation to ensure required fields are filled
    if(!formData.memberId.trim()) {
        setError("Member ID is required");
        return;
      }

    if (!formData.providerId.trim()) {
      setError("Provider ID is required.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (!formData.submissionDate) {
      setError("Submission date is required.");
      return;
    }            
    
    setLoading(true); 

    try {
      await api.post("/claims", {
        ...formData,
      amount: Number(formData.amount),
      });

      navigate("/claims");
    } catch (err) {
      console.error("Error creating claim:", err);
      setError(err.response?.data?.message || "Failed to create claim. Please try again.");
    }
      finally {
        setLoading(false);
      }
  };

  return (
    <div style={pageOuterStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>Create Claim</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Member ID</label>
              <input 
                type="text"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                placeholder="Enter member ID"
                style={inputStyle}
                />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Provider ID</label>
              <input 
                type="text"
                name="providerId"
                value={formData.providerId}
                onChange={handleChange}
                placeholder="Enter provider ID"
                style={inputStyle}
                />
            </div>
          
          <div style={fieldStyle}>
            <label style={labelStyle}>State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              style={inputStyle}
              >
                {STATE_OPTIONS.map((state) => (
                  <option key = {state} value={state}>
                    {state}
                  </option>
                ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Claim Type</label>
            <select
              name="claimType"
              value={formData.claimType}
              onChange={handleChange}
              style={inputStyle}
            >
              {CLAIM_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Amount</label>
            <input 
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              style={inputStyle}
              />
          </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Submission Date</label>
              <input 
                type="datetime-local"
                name="submissionDate"
                value={formData.submissionDate}
                onChange={handleChange}
                style={inputStyle}
                />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Created By User ID</label>
              <input
                type="number"
                name="createdByUserId"
                value={formData.createdByUserId}
                readOnly
                style={readOnlyInputStyle}
                />
            </div>
          </div>

          <div style={checkboxRowStyle}>
            <label style={checkboxLabelStyle}>
              <input 
                type="checkbox"
                name="isInternal"
                checked={formData.isInternal}
                onChange={handleChange}
                style={{marginRight: "8px"}}
                />
              Internal Claim
            </label>
          </div>

          {error && <p style={errorStyle}>{error}</p>}
          
          <div style={buttonRowStyle}>
              <button type="submit" disabled={loading} style={primaryButtonStyle}>
                {loading ? "Saving..." : "Create Claim"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/claims")}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}

const pageOuterStyle = {
  padding: "32px 20px 48px",
  display: "flex",
  justifyContent: "center"
};

const formCardStyle = {
  width: "100%",
  maxWidth: "960px",
  backgroundColor: "white",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
};

const titleStyle = {
  marginTop: 0,
  marginBottom: "24px"
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "20px"
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column"
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

const checkboxRowStyle = {
  marginTop: "20px",
  marginBottom: "20px"
};

const checkboxLabelStyle = {
  display: "inline-flex",
  alignItems: "center",
  fontWeight: 500
};

const errorStyle = {
  color: "#dc2626",
  marginBottom: "16px"
};

const buttonRowStyle = {
  display: "flex",
  gap: "12px"
};

const primaryButtonStyle = {
  padding: "10px 18px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const secondaryButtonStyle = {
  padding: "10px 18px",
  backgroundColor: "#e5e7eb",
  color: "#111827",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const readOnlyInputStyle = {
  ...inputStyle,
  backgroundColor: "#f3f4f6",
  cursor: "not-allowed"
};

export default CreateClaimPage;