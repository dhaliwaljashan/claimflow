import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import api from "../api/axios";

function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    state: "",
    status: ""
  });
  
  const fetchClaims = async (appliedFilters = filters) => {
    setLoading(true);
    setError("");

  try {
    const queryParams = new URLSearchParams(); // creates an object to build query string for API request
    
    if (appliedFilters.state) queryParams.append("state", appliedFilters.state);
    if (appliedFilters.status) queryParams.append("status", appliedFilters.status);

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

  if (loading) {
     return <p style={{ padding: "20px" }}>Loading claims...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Claims</h2>

        {/* Filter Section */}
        <div style = {filterContainerStyle}>
          <div style={filterFieldStyle}>
            <label>State</label>
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="Enter state"
              style={inputStyle}
            />
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
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

        {error && (
          <p style={{ color: "red", padding: "10px" }}>
            {error}
          </p>
        )}

        {!loading && claims.length === 0 ? (
          <p style={{ padding: "20px" }}>No claims found.</p>
        ) : (
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
          {claims.map((claim) => (
            <tr key={claim.claimId}>
              <td style={tdStyle}>{claim.claimId}</td>
              <td style={tdStyle}>{claim.memberId}</td>
              <td style={tdStyle}>{claim.providerId}</td>
              <td style={tdStyle}>{claim.state}</td>
              <td style={tdStyle}>{claim.claimType}</td>
              <td style={tdStyle}>${claim.amount.toFixed(2)}</td>
              <td style={tdStyle}>{claim.status}</td>
              <td style={tdStyle}>{claim.isInternal ? "Yes" : "No"}</td>   
              <td style={tdStyle}>
                <Link to={`/claims/${claim.claimId}`}> View Details </Link>
              </td>  
            </tr>
          ))}
        </tbody>
      </table>  
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
  minWidth: "200px"
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

export default ClaimsPage;