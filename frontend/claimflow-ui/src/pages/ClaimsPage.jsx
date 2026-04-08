import {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import { STATE_OPTIONS, STATUS_OPTIONS } from "../utils/claimOptions";
import AlertMessage from "../components/lertMessage";
import api from "../api/axios";

const ITEMS_PER_PAGE = 5;

function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {user} = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  
  const [filters, setFilters] = useState({
    claimId: "",
    memberId: "",
    providerId: "",
    state: "",
    status: ""
  });
  
  const [currentPage, setCurrentPage] = useState(1);

  const fetchClaims = async (appliedFilters = filters) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

  try {
    const queryParams = new URLSearchParams(); // creates an object to build query string for API request
    
    if (appliedFilters.claimId) {
        queryParams.append("claimId", appliedFilters.claimId);
    }

      if (appliedFilters.memberId) {
        queryParams.append("memberId", appliedFilters.memberId);
      }

      if (appliedFilters.providerId) {
        queryParams.append("providerId", appliedFilters.providerId);
      }

      if (appliedFilters.state) {
        queryParams.append("state", appliedFilters.state);
      }

      if (appliedFilters.status) {
        queryParams.append("status", appliedFilters.status);
      }

    const url = queryParams.toString() ? `/claims?${queryParams.toString()}` : "/claims";
    
    const response = await api.get(url);  
    setClaims(response.data);
  } catch (error) {
    console.error("Error fetching claims:", error);
    setError("Failed to fetch claims.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchClaims();
}, []);

const handleFilterChange = (e) => {
  const { name, value } = e.target;

  setFilters((prev) => ({
    ...prev,
    [name]: value
  }));
}

const handleApplyFilters = () => {
  fetchClaims(filters);
}

const handleResetFilters = () => {
  const resetFilters = { state: "", status: "" };
  setFilters(resetFilters);
  fetchClaims(resetFilters);
}

const handleDeleteClaim  = async (claimId) => {
  const confirmed = window.confirm(
        "Are you sure you want to delete this claim? This action cannot be undone."
    );

  if(!confirmed) {
      return;
  }

  setError("");

  try{
    await api.delete(`/claims/${claimId}`);
    setSuccessMessage("Claim deleted successfully.");
    fetchClaims(filters);
  } catch(err) {
    setError(err.response?.data?.message || "Failed to delete claim.");
  }
};

const paginatedClaims = useMemo(() => {  // Recalculate only when claims or page changes”, useMemo = remember value
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  return claims.slice(startIndex, startIndex + ITEMS_PER_PAGE);
}, [claims, currentPage]);

const totalPages = Math.ceil(claims.length / ITEMS_PER_PAGE);

if (loading) {
     return <p style={{ padding: "20px" }}>Loading claims...</p>;
}

const getStatusStyle = (status) => {
  switch(status) {
    case "Pending":
      return { backgroundColor: "#facc15", color: "#000" }; // yellow
    case "Approved":
      return { backgroundColor: "#22c55e", color: "#fff" }; // green
    case "Rejected":
      return { backgroundColor: "#ef4444", color: "#fff" }; // red
    default:
      return {};
  }
}

  return (
    <div style={{ padding: "20px" }}>
      <h2>Claims</h2>

        {/* Filter Section */}
        <div style = {filterContainerStyle}>
          <div style={filterFieldStyle}>
            <label>Claim ID</label>
            <input
              type="number"
              name="claimId"
              value={filters.claimId}
              onChange={handleFilterChange}
              placeholder="Search by Claim ID"
              style={inputStyle}
            />
          </div>

          <div style={filterFieldStyle}>
          <label>Member ID</label>
          <input
            type="text"
            name="memberId"
            value={filters.memberId}
            onChange={handleFilterChange}
            placeholder="Search by member ID"
            style={inputStyle}
          />
        </div>

        <div style={filterFieldStyle}>
          <label>Provider ID</label>
          <input
            type="text"
            name="providerId"
            value={filters.providerId}
            onChange={handleFilterChange}
            placeholder="Search by provider ID"
            style={inputStyle}
          />
        </div>

        <div style={filterFieldStyle}>
          <label>State</label>
          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            placeholder="Enter state"
            style={inputStyle}
          >
            <option value="">All</option>
              {STATE_OPTIONS.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </select>
        </div>

        <div style={filterFieldStyle}>
          <label>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={inputStyle}
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}           
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "end", gap: "10px" }}>
          <button onClick={handleApplyFilters} style={buttonStyle}>
            Apply Filters
          </button>
          <button onClick={handleResetFilters} style={buttonStyle}>
            Reset Filters
          </button>
        </div>
      </div>

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

      {!loading && claims.length === 0 ? (
        <p style={{ padding: "20px" }}>No claims found.</p>
      ) : (
      <>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px"
        }}
        >
          <thead>
            <tr style={{ backgroundColor: "#e5e7eb" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Member</th>
            <th style={thStyle}>Provider</th>
            <th style={thStyle}>State</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Internal</th>
            <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClaims.map((claim) => (
              <tr key={claim.claimId} style={rowStyle}>
                <td style={tdStyle}>{claim.claimId}</td>
                <td style={tdStyle}>{claim.memberId}</td>
                <td style={tdStyle}>{claim.providerId}</td>
                <td style={tdStyle}>{claim.state}</td>
                <td style={tdStyle}>{claim.claimType}</td>
                <td style={tdStyle}>${Number(claim.amount).toLocaleString()}</td>
                <td style={tdStyle}>
                  <span style={{ ...statusBadgeStyle, ...getStatusStyle(claim.status) }}>
                    {claim.status}
                  </span>
                </td>
                <td style={tdStyle}>{claim.isInternal ? "Yes" : "No"}</td>   
                <td style={tdStyle}>
                  <div style={actionCellStyle}>
                    <Link to={`/claims/${claim.claimId}`} style={actionLinkStyle}> View Details </Link>
                    <Link to={`/claims/edit/${claim.claimId}`} style={actionLinkStyle}>Edit</Link>

                    {user?.role === "Admin" && (
                      <button
                          onClick={() => handleDeleteClaim(claim.claimId)}
                          style={tableDeleteButtonStyle}
                      >
                          Delete
                      </button>
                    )}
                  </div>
                </td>  
              </tr>
            ))}
          </tbody>
        </table>  
      
        {totalPages > 1 && (
          <div style={paginationRowStyle}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev-1, 1))}
              disabled={currentPage === 1}
              style={secondaryButtonStyle}
            >
              Previous
            </button>

            <span style={{alignSelf: "center"}}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage ===totalPages}
              style={secondaryButtonStyle}
            >
              Next
            </button>
          </div>
        )}
      </>
      )}
    </div>
  );
}

const filterContainerStyle = {
 display: "flex",
  gap: "20px",
  alignItems: "end",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  marginTop: "20px",
  flexWrap: "wrap"
};

const filterFieldStyle = {
  display: "flex",
  flexDirection: "column",
  minWidth: "200px",
  flex: "1 1 180px",
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

const thStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  textAlign: "left"
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ccc"
};

const actionCellStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  flexWrap: "wrap"
};

const tableDeleteButtonStyle = {
  padding: "6px 10px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px"
};

const statusBadgeStyle = {
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
  display: "inline-block"
};

const actionLinkStyle = {
  textDecoration: "none",
  color: "#2563eb",
  fontWeight: "500",
  fontSize: "14px"
};

const rowStyle = {
  transition: "background 0.2s",
  cursor: "pointer"
};

const paginationRowStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "16px"
};

export default ClaimsPage;