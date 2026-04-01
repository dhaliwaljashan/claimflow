import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function CreateClaimPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    memberId: "",
    providerId: "",
    state: "",
    claimType: "",
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
    if(
      !formData.memberId ||
      !formData.providerId ||
      !formData.state ||
      !formData.claimType ||
      !formData.amount ||
      !formData.submissionDate
    )
    {
      setError("Please fill in all required fields.");
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
    <div 
    style={{
        maxWidth: "700px",
        margin: "30px auto",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
      >
       <h2 style={{ marginBottom: "20px" }}>Create Claim</h2>
      <form onSubmit={handleSubmit}>
        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label>Member ID</label>
            <input 
              type="text"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              style={inputStyle}
              />
          </div>

          <div style={fieldStyle}>
            <label>Provider ID</label>
            <input 
              type="text"
              name="providerId"
              value={formData.providerId}
              onChange={handleChange}
              style={inputStyle}
              />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label>State</label>
            <input 
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              style={inputStyle}
              />
          </div>

          <div style={fieldStyle}>
            <label>Claim Type</label>
            <input 
              type="text"
              name="claimType"
              value={formData.claimType}
              onChange={handleChange}
              style={inputStyle}
              />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label>Amount</label>
            <input 
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              style={inputStyle}
              />
          </div>

          <div style={fieldStyle}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldStyle}>
            <label>Submission Date</label>
            <input 
              type="datetime-local"
              name="submissionDate"
              value={formData.submissionDate}
              onChange={handleChange}
              style={inputStyle}
              />
          </div>

          <div style={fieldStyle}>
            <label>Created By User ID</label>
            <input
              type="number"
              name="createdByUserId"
              value={formData.createdByUserId}
              onChange={handleChange}
              style={inputStyle}
              />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
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

        {error && 
        <p style={{ color: "red", marginBottom: "20px" }}>
          {error}
          </p> }

          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              type="submit"
              disabled={loading}
              style={buttonStyle}>
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
  );
}

const rowStyle = {
  display: "flex",
  gap: "20px",
  marginBottom: "20px"
};

const fieldStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column"
};

const inputStyle = {
  marginTop: "6px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "10px 16px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const secondaryButtonStyle = {
  padding: "10px 16px",
  backgroundColor: "#e5e7eb",
  color: "#111827",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
export default CreateClaimPage;