import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function DashboardPage() {
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
    {name: "Internal", value: data.internalClaims},
    {name: "External", value: data.externalClaims}
  ];

  const COLORS = ["#2563eb", "#f59e0b"];  // COLORS is in capital bcz it is a constant and should not be changed

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {/* KPI Cards */}
      <div style={cardContainer}>
        <Card title="Total Claims" value={data.totalClaims} />
        <Card title="Approved Claims" value={data.approvedClaims} />
        <Card title="Rejected Claims" value={data.rejectedClaims} />
        <Card title="Pending Claims" value={data.pendingClaims} />
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: "30px", marginTop: "30px"}}>
        {/* Bar Chart for Claims by State */}
        < div style = {chartBox}> 
          <h3>Claims by State</h3>
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
        <div style={chartBox}>
          <h3>Internal vs External Claims</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={cardStyle}>
      <h4>{title}</h4>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

const cardContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
};

const cardStyle = {
  flex: 1,
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const chartBox = {
  flex: 1,
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

export default DashboardPage;