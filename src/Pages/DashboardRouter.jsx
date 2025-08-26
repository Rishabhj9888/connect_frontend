import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ FIXED import
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

const DashboardRouter = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role || null);
    } catch (err) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  if (!role) return <p>Loading dashboard...</p>;

  return role === "ADMIN" ? <AdminDashboard /> : <StudentDashboard />;
};

export default DashboardRouter;
