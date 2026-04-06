import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie
} from "recharts";

function DashboardPage() {
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard/summary");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
     return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
  }

 if (error) {
    return <p style={{ padding: "20px", color: "red" }}>{error} </p>
  }

  if (!data) {
    return <p style={{ padding: "20px" }}>No dashboard data available.</p>;
  }

 const pieData = [
  { name: "Internal", value: data.internalClaims, fill: "#2563eb" },
  { name: "External", value: data.externalClaims, fill: "#f59e0b" }
];

  return (
    <div style={pageStyle}>
      <div style={headerRowStyle}>
      <div>
        <h2 style={pageTitleStyle}>Dashboard</h2>
        <p style={subTextStyle}>Overview of claims activity and status</p>
      </div>
      </div>

      {/* KPI summary cards */}
      <div style={summaryGridStyle}>
        <DashboardStatCard
          title="Total Claims"
          value={data.totalClaims}
          onClick={() => navigate("/claims")}
        />
        <DashboardStatCard
          title="Pending"
          value={data.pendingClaims}
          onClick={() => navigate("/claims")}
        />
        <DashboardStatCard
          title="Approved"
          value={data.approvedClaims}
          onClick={() => navigate("/claims")}
        />
        <DashboardStatCard
          title="Rejected"
          value={data.rejectedClaims}
          onClick={() => navigate("/claims")}
        />
      </div>
      
      {/* Charts */}
      <div style={chartGridStyle}>
        {/* Bar Chart for Claims by State */}
        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <h3 style={chartTitleStyle}>Claims by State</h3>
            <button onClick={() => navigate("/claims")} style={chartLinkButtonStyle}>
                Open Claims
              </button>
          </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.claimsByState}>
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        {/* Pie Chart for Internal vs External Claims */}
        <div style={chartCardStyle}>
          <div style={chartHeaderStyle}>
            <h3 style={chartTitleStyle}>Internal vs External</h3>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Clickable dashboard KPI card
function DashboardStatCard({ title, value, onClick }) {
  return (
    <button onClick={onClick} style={statCardStyle}>
      <span style={statTitleStyle}>{title}</span>
      <span style={statValueStyle}>{value}</span>
    </button>
  );
}

const pageStyle = {
  padding: "24px"
};

const headerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap"
};

const chartGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "20px"
};

const statCardStyle = {
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "10px",
  cursor: "pointer"
};

const statTitleStyle = {
  fontSize: "14px",
  color: "#6b7280",
  fontWeight: 500
};

const statValueStyle = {
  fontSize: "30px",
  fontWeight: 700,
  color: "#111827"
};

const chartCardStyle = {
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const chartHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
  gap: "12px"
};

const chartTitleStyle = {
  margin: 0
};

const pageTitleStyle = {
  margin: 0,
  marginBottom: "6px"
};

const subTextStyle = {
  margin: 0,
  color: "#6b7280"
};

const summaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "16px",
  marginBottom: "20px"
};

const chartLinkButtonStyle = {
  padding: "8px 12px",
  backgroundColor: "#eff6ff",
  color: "#2563eb",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  cursor: "pointer"
};

export default DashboardPage;