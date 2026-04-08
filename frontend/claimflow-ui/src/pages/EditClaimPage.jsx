import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AlertMessage from "../components/lertMessage";
import {
  CLAIM_TYPE_OPTIONS,
  STATE_OPTIONS,
  STATUS_OPTIONS
} from "../utils/claimOptions";

function EditClaimPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();

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

    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchClaim();
    }, [id]);

    const fetchClaim = async () => {
        try {
            const response = await api.get(`/claims/${id}`);
            const claim = response.data;

            setFormData({
                memberId: claim.memberId || "",
                providerId: claim.providerId || "",
                state: claim.state || "Arizona",
                claimType: claim.claimType || "FFS",
                amount: claim.amount || "",
                status: claim.status || "Pending",
                // Convert API date for datetime-local input
                submissionDate: claim.submissionDate
                ? new Date(claim.submissionDate).toISOString().slice(0, 16)
                : "",
                isInternal: claim.isInternal ?? true,
                createdByUserId: claim.createdByUserId || user?.userId
            });
        } catch (err) {
            console.error("Error fetching claim:", err);
            setError("Failed to load claim details.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // stops page reload on submitting the form
        setError("");
        setSuccessMessage("");

        // Basic client-side validation
        if (!formData.memberId.trim()) {
            setError("Member ID is required.");
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

        setSaving(true);

        try {
            await api.put(`/claims/${id}`, {
                ...formData,
                amount: Number(formData.amount),
            });
            setSuccessMessage("Claim updated successfully.");

            setTimeout(() => {
              navigate(`/claims/${id}`);
            }, 1000); // Redirect to claim details page after saving
        } catch (err) {
            console.error("Error updating claim:", err);
            setError(err.response?.data?.message || "Failed to update claim. Please try again.");
        } finally {
            setSaving(false);
        }      
    };

    if (loading) {
        return <p style={{ padding: "20px" }}>Loading claim for editing...</p>;
    }

    return (
    <div style={pageOuterStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>Edit Claim</h2>

        <AlertMessage
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />

        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError("")}
        />
        
        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Member ID</label>
              <input
                type="text"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
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
                  <option key={state} value={state}>
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
                style={{ marginRight: "8px" }}
              />
              Internal Claim
            </label>
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" disabled={saving} style={primaryButtonStyle}>
              {saving ? "Updating..." : "Update Claim"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/claims/${id}`)}
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

export default EditClaimPage;