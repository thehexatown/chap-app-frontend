import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoute = () => {
  const isLoggedIn = useSelector((state) => state.auth.user);

  return isLoggedIn ? <Outlet /> : <Navigate replace to="/" />;
};
export default ProtectedRoute;
