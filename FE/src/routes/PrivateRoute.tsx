import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children || <Outlet />}</> : <Navigate to="/login" />;
};

export default PrivateRoute;