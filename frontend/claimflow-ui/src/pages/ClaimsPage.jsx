import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import api from "../api/axios";

function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const fetchClaims = async () => {
  try {
    const response = await api.get("/claims");  
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

  if (loading) {
     return <p style={{ padding: "20px" }}>Loading claims...</p>;
  }

  if (error) {
    return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  }

  if(claims.length === 0) {
    return <p style={{ padding: "20px" }}>No claims found.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Claims</h2>
      <table 
        style={{
           width: "100%", borderCollapse: "collapse", marginTop: "20px" 
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
           <th style={thStyle}>Details</th>
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
    </div>
  );
}

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