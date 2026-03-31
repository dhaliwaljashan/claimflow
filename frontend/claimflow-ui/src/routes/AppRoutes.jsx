import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardPage from "../pages/DashboardPage";
import ClaimsPage from "../pages/ClaimsPage";
import CreateClaimPage from "../pages/CreateClaimPage";
import LoginPage from "../pages/LoginPage";
import { use } from "react";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login"; // hide navbar on login page

  return (
  <>
    {!hideNavbar && <Navbar />}
    <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="/claims/create" element={<CreateClaimPage />} />
        <Route path="/login" element={<LoginPage />} />
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