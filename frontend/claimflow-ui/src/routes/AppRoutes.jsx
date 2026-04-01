import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardPage from "../pages/DashboardPage";
import ClaimsPage from "../pages/ClaimsPage";
import CreateClaimPage from "../pages/CreateClaimPage";
import LoginPage from "../pages/LoginPage";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { use } from "react";

function AppLayout() {
  const location = useLocation();
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }
  
  const hideNavbar = location.pathname === "/login"; // hide navbar on login page

  return (
  <>
    {!hideNavbar && <Navbar />}
    <Routes>
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}   // redirects based on auth status
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} // login redirects to dashboard if already logged in
        />
        <Route
          path="/dashboard" 
          element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
        />
        <Route 
          path="/claims" 
          element={
          <ProtectedRoute>
            <ClaimsPage />
          </ProtectedRoute>
        }
        />
        <Route 
          path="/claims/create" 
          element={
          <ProtectedRoute>
            <CreateClaimPage />
          </ProtectedRoute>
        } 
        />
    </Routes>
    </>
  );
}

function AppRoutes(){
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default AppRoutes
;