import { Navigate } from "react-router-dom";
import React from "react";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

function getRoleFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token); 
    return decoded.role;
  } catch {
    return null;
  }
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const role = getRoleFromToken();
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
