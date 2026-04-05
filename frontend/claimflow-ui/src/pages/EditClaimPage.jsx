import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function EditClaimPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();

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
                state: claim.state || "",
                claimType: claim.claimType || "",
                amount: claim.amount || "",
                status: claim.status || "Pending",
                submissionDate: claim.submissionDate ? new Date(claim.submissionDate).toISOString().slice(0, 16) : "",  // Convert backend date into input-friendly format
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

        // Basic client-side validation
        if(
            !formData.memberId ||
            !formData.providerId ||
            !formData.state ||
            !formData.claimType ||
            !formData.amount ||
            !formData.submissionDate
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        setSaving(true);

        try {
            await api.put(`/claims/${id}`, {
                ...formData,
                amount: Number(formData.amount),
            });
            navigate(`/claims/${id}`); // Redirect to claim details page after saving
        } catch (err) {
            console.error("Error updating claim:", err);
            setError(err.response?.data?.message || "Failed to update claim. Please try again.");
        } finally {
            setSaving(false);
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
        <h2 style={{ marginBottom: "20px" }}>Edit Claim</h2>

        <form onSubmit={handleSubmit}>
            <div style = {rowStyle}>
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
                        type="text"
                        name="createdByUserId"
                        value={formData.createdByUserId}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>
            </div>

            <div style={{marginBottom: "20px"}}>
                <label>
                <input
                    type="checkbox" 
                    name="isInternal"
                    checked={formData.isInternal}
                    onChange={handleChange}
                    style={{ marginRight: "8px"  }}
                /> 
                Internal Claim
                </label>
            </div>

            {error && (
                <p style={{ marginBottom: "15px", color: "red" }}>
                    {error}
                </p>
            )}            

            <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" disabled={saving} style={buttonStyle}>
                    {saving ? "Updating..." : "Update Claim"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate(`/claims/${id}`)}   
                    style={{secondaryButtonStyle}}
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

export default EditClaimPage;